// server.js - Main Backend Server
// This is the entry point of our backend application
// It sets up Express, connects to MongoDB, and defines all API routes

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file first

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pkg from 'mongoose';
const mongoose = pkg;
import webpush from 'web-push';
import Notification from './models/Notifications.js';
import PushSubscription from './models/PushSubscription.js';
import logger from './logger.js'; // Winston logger for proper logging

// Import all route files - each file handles a different part of the API
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applications.js';
import opportunityRoutes from './routes/opportunities.js';
import verifyToken from './middleware/auth.js'; // JWT authentication middleware
import passport from './config/passport.js';

// Create the Express application
const app = express();

// Frontend origin - used for CORS and OAuth redirects (set in .env for deployment)
// Strip any trailing slash - browsers send Origin without one, and CORS requires an exact match.
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');

// Render (and most PaaS hosts) sit behind a reverse proxy - without this,
// express-rate-limit sees the proxy's IP for every request instead of the client's.
app.set('trust proxy', 1);

// ─── GLOBAL MIDDLEWARE ───
// These run on EVERY request before anything else
app.use(helmet()); // Sets safe HTTP headers (CSP, no-sniff, etc.)
app.use(cors({ origin: FRONTEND_URL })); // Only allow the configured frontend origin
app.use(express.json()); // Allow server to read JSON data from request body
app.use(passport.initialize()); // Initialize Google OAuth

// Basic rate limiting - protects auth routes from brute-force / credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// General API rate limit as a broader safety net
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);


// ─── DEFAULT ROUTE ───
app.get('/', (req, res) => {
  res.json({ message: 'CareerMap API is running' });
});

// ─── HEALTH CHECK ───
// Used by Render's health checks / uptime pings to keep the free-tier instance
// warm. Reports DB connection state too. Not logged - health checks hit this
// frequently and would otherwise flood the logs.
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'ok' : 'degraded',
    db: ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown'
  });
});

// ─── MOUNT API ROUTES ───
// Any request to /api/auth goes to authRoutes.js
// Any request to /api/applications goes to applications.js
// Any request to /api/opportunities goes to opportunities.js
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/opportunities', opportunityRoutes);

// ─── MONGODB CONNECTION ───
// Connect to MongoDB Atlas cloud database using URL from .env file
// This is the Singleton pattern - one connection shared across all routes
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('Connected to MongoDB Atlas successfully'))
  .catch((error) => logger.error(`MongoDB connection error: ${error.message}`));

// ─── VAPID KEYS FOR PUSH NOTIFICATIONS ───
// VAPID keys prove to the browser that our server is trusted to send notifications
// Keys are stored in .env file for security - never hardcoded in code
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(
      process.env.VAPID_EMAIL,
      process.env.VAPID_PUBLIC_KEY.trim(),
      process.env.VAPID_PRIVATE_KEY.trim()
    );
    logger.info('VAPID keys configured for push notifications');
  } catch (err) {
    // A malformed VAPID key would otherwise crash the whole server on boot.
    // Push notifications are a non-critical feature - log and keep running.
    logger.error(`Invalid VAPID keys, push notifications disabled: ${err.message}`);
  }
} else {
  logger.warn('VAPID keys not set - push notifications disabled');
}

// ─── PUSH SUBSCRIPTIONS ───
// Stored in MongoDB (PushSubscription model) so they survive server restarts.
// This is the Observer pattern - students subscribe, advisor notifies all

// Student calls this when they click "Enable alerts"
// Saves their browser subscription details so we can send them notifications later
// Save push subscription with studentId
app.post('/api/subscribe', verifyToken, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    // Upsert: one subscription per student, updated on re-subscribe
    await PushSubscription.findOneAndUpdate(
      { studentId: req.user.id },
      { studentId: req.user.id, endpoint, keys },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    logger.info(`Push subscription saved for student: ${req.user.id}`);
    res.status(201).json({ message: 'Subscription saved successfully' });
  } catch (err) {
    logger.error(`Subscribe error: ${err.message}`);
    res.status(500).json({ message: 'Failed to save subscription' });
  }
});

// ─── SEND PUSH NOTIFICATION ───
// Advisor calls this when they click "Notify" on a student
// Does two things: saves notification to MongoDB AND sends browser push
app.post('/api/notify', async (req, res) => {
  const { title, body, studentId } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    // Save to database
    if (studentId) {
      await Notification.create({ studentId, title, body });
      logger.info(`Notification saved for student: ${studentId}`);
    }

    // Send push only to the specific student's subscription
    if (studentId) {
      const studentSub = await PushSubscription.findOne({ studentId });
      if (studentSub) {
        await webpush.sendNotification(
          { endpoint: studentSub.endpoint, keys: studentSub.keys },
          payload
        );
        logger.info(`Push sent to student: ${studentId}`);
      } else {
        logger.warn(`No push subscription found for student: ${studentId}`);
      }
    } else {
      // Send to all subscribers
      const allSubs = await PushSubscription.find();
      await Promise.all(
        allSubs.map(sub =>
          webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload)
        )
      );
    }

    res.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    logger.error(`Push notification error: ${error.message}`);
    res.status(500).json({ message: 'Error sending notifications' });
  }
});

// ─── NOTIFICATION ROUTES ───

// Student fetches their notifications to display in the Notifications page
// verifyToken middleware checks JWT before allowing access
app.get('/api/notifications', verifyToken, async (req, res) => {
  try {
    // req.user.id comes from the JWT token - only get THIS student's notifications
    const notifications = await Notification.find({ studentId: req.user.id })
      .sort({ createdAt: -1 }); // Most recent first
    logger.info(`Fetched ${notifications.length} notifications for user: ${req.user.id}`);
    res.json(notifications);
  } catch (err) {
    logger.error(`Notifications fetch error: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Student marks a notification as read when they click on it
app.put('/api/notifications/:id/read', verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    logger.info(`Notification ${req.params.id} marked as read`);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    logger.error(`Mark as read error: ${err.message}`);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
});

// ─── 404 HANDLER ───
// This runs when someone hits a route that doesn't exist
// Must be AFTER all other routes
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// ─── GLOBAL ERROR HANDLER ───
// This catches any unexpected errors that crash the server
// Must be LAST and must have 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  logger.error(`Global error: ${err.message}`);
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: err.message
  });
});

// ─── START SERVER ───
// Listen for requests on port 5000 (or whatever is in .env)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`CareerMap server running on port ${PORT}`);
});