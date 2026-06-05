// server.js - Main Backend Server
// This is the entry point of our backend application
// It sets up Express, connects to MongoDB, and defines all API routes

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file first

import express from 'express';
import cors from 'cors';
import pkg from 'mongoose';
const mongoose = pkg;
import webpush from 'web-push';
import Notification from './models/Notifications.js';
import logger from './logger.js'; // Winston logger for proper logging

// Import all route files - each file handles a different part of the API
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applications.js';
import opportunityRoutes from './routes/opportunities.js';
import verifyToken from './middleware/auth.js'; // JWT authentication middleware
import passport from './config/passport.js';

// Create the Express application
const app = express();

// ─── GLOBAL MIDDLEWARE ───
// These run on EVERY request before anything else
app.use(cors()); // Allow React frontend (port 5173) to talk to backend (port 5000)
app.use(express.json()); // Allow server to read JSON data from request body
app.use(passport.initialize()); // Initialize Google OAuth


// ─── DEFAULT ROUTE ───
// Health check - visit http://localhost:5000 to confirm server is running
app.get('/', (req, res) => {
  logger.info('Health check route accessed');
  res.json({ message: 'CareerMap API is running' });
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
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  logger.info('VAPID keys configured for push notifications');
}

// ─── PUSH SUBSCRIPTIONS ───
// Array to store all student push subscriptions
// This is the Observer pattern - students subscribe, advisor notifies all
let pushSubscriptions = [];

// Student calls this when they click "Enable alerts"
// Saves their browser subscription details so we can send them notifications later
// Save push subscription with studentId
app.post('/api/subscribe', verifyToken, async (req, res) => {
  try {
    const subscription = req.body;
    // Save subscription with studentId from JWT token
    const existingIndex = pushSubscriptions.findIndex(
      sub => sub.studentId === req.user.id
    );
    
    if (existingIndex > -1) {
      // Update existing subscription
      pushSubscriptions[existingIndex] = { ...subscription, studentId: req.user.id };
    } else {
      // Add new subscription
      pushSubscriptions.push({ ...subscription, studentId: req.user.id });
    }
    
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
      const studentSub = pushSubscriptions.find(
        sub => sub.studentId === studentId
      );
      if (studentSub) {
        const { studentId: sid, ...pushSub } = studentSub;
        await webpush.sendNotification(pushSub, payload);
        logger.info(`Push sent to student: ${studentId}`);
      } else {
        logger.warn(`No push subscription found for student: ${studentId}`);
      }
    } else {
      // Send to all subscribers
      await Promise.all(
        pushSubscriptions.map(sub => {
          const { studentId: sid, ...pushSub } = sub;
          return webpush.sendNotification(pushSub, payload);
        })
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