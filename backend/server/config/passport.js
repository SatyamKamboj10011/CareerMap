// passport.js - Google OAuth configuration
import dotenv from 'dotenv';
dotenv.config(); // Load .env before reading GOOGLE_CLIENT_ID

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import logger from '../logger.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      // User exists — log them in
      logger.info(`Existing Google user logged in: ${user.email}`);
      return done(null, user);
    }

    // User doesn't exist — create new account
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      role: 'student', // Default role
      password: 'google-oauth-user', // Placeholder
      contactNumber: 'N/A' // Default empty contact number
    });

    logger.info(`New Google user created: ${user.email}`);
    return done(null, user);
  } catch (err) {
    logger.error(`Google OAuth error: ${err.message}`);
    return done(err, null);
  }
}));

export default passport;