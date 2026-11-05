const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');
const { hashPassword, verifyPassword, signToken } = require('../utils/auth');
const router = express.Router();

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    // Conditions
    if (name.length < 2) return res.status(400).json({ error: 'Name must be at least 2 characters' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
      return res.status(400).json({ error: 'Password must contain at least one letter and one number' });
    if (await User.findOne({ email })) return res.status(409).json({ error: 'This email is already registered' });

    const user = await User.create({ name, email, passwordHash: hashPassword(password) });
    res.status(201).json({ token: signToken({ id: user._id }), user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    // Same message for unknown email and wrong password (does not reveal which emails exist)
    const invalid = () => res.status(401).json({ error: 'Invalid email or password' });
    if (!user) return invalid();

    if (user.lockUntil && user.lockUntil > new Date()) {
      const mins = Math.ceil((user.lockUntil - new Date()) / 60000);
      return res.status(423).json({ error: `Too many failed attempts. Try again in ${mins} minute(s).` });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      user.failedAttempts += 1;
      if (user.failedAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
        user.failedAttempts = 0;
      }
      await user.save();
      return invalid();
    }

    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();
    res.json({ token: signToken({ id: user._id }), user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me  (used by frontend to check a saved token)
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: 'Please log in to continue' });
  res.json({ user: publicUser(user) });
});

module.exports = router;
