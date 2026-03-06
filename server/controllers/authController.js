import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

// ─── Helper: Generate JWT ──────────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── Helper: Send Token Response ──────────────────────────────────────────────
const sendTokenResponse = (res, statusCode, user, token) => {
  res.status(statusCode).json({
    message: statusCode === 201 ? 'User registered successfully' : 'Login successful',
    token,
    user: user.toPublicJSON(),
  });
};

// ─── @route  POST /api/auth/signup ────────────────────────────────────────────
export const signupUser = async (req, res) => {
  // Handle validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Password is hashed automatically via the pre-save hook in the model
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    sendTokenResponse(res, 201, user, token);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @route  POST /api/auth/login ─────────────────────────────────────────────
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Explicitly select password since it's excluded by default (select: false)
    const user = await User.findOne({ email }).select('+password');

    // Use a generic message to avoid user enumeration attacks
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    sendTokenResponse(res, 200, user, token);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
