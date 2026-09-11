// authentication routes for register and login
import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import verifyToken from '../middleware/auth.js';
import passport from '../config/passport.js';
import logger from '../logger.js';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── ONE-TIME OAUTH CODE STORE ───
// Google OAuth cannot hand the JWT directly to the frontend without exposing it
// in the redirect URL (browser history, referrers, server access logs).
// Instead we redirect with a short-lived random code, and the frontend
// exchanges it for the real JWT via POST /api/auth/google/exchange.
const oauthCodes = new Map(); // code -> { token, user, expiresAt }
const OAUTH_CODE_TTL_MS = 60 * 1000; // 1 minute

const cleanupExpiredCodes = () => {
  const now = Date.now();
  for (const [code, entry] of oauthCodes) {
    if (entry.expiresAt < now) oauthCodes.delete(code);
  }
};

// ─── REGISTER ROUTE ───
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, contactNumber } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, contactNumber });
    await newUser.save();
    logger.info(`New user registered: ${email}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ─── LOGIN ROUTE ───
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    logger.info(`User logged in: ${email}`);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ─── UPDATE PROFILE ───
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, contactNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, contactNumber },
      { new: true }
    ).select('-password');
    logger.info(`Profile updated for user: ${req.user.id}`);
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    logger.error(`Profile update error: ${err.message}`);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ─── GOOGLE OAUTH ROUTES ───

// Step 1 - Redirect to Google login page
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Step 2 - Google redirects back here after login
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${FRONTEND_URL}/?error=google_failed`
  }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email, name: req.user.name, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Issue a short-lived one-time code instead of putting the JWT in the URL
      cleanupExpiredCodes();
      const code = crypto.randomBytes(32).toString('hex');
      oauthCodes.set(code, {
        token,
        user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
        expiresAt: Date.now() + OAUTH_CODE_TTL_MS
      });

      logger.info(`Google OAuth login: ${req.user.email}`);
      res.redirect(`${FRONTEND_URL}/auth/google/success?code=${code}`);
    } catch (err) {
      logger.error(`Google callback error: ${err.message}`);
      res.redirect(`${FRONTEND_URL}/?error=server_error`);
    }
  }
);

// ─── EXCHANGE ONE-TIME OAUTH CODE FOR JWT ───
// Frontend calls this immediately after being redirected to /auth/google/success?code=...
router.post('/google/exchange', (req, res) => {
  const { code } = req.body;
  cleanupExpiredCodes();

  const entry = code && oauthCodes.get(code);
  if (!entry) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  // Codes are single-use
  oauthCodes.delete(code);
  res.json({ token: entry.token, user: entry.user });
});

export default router;