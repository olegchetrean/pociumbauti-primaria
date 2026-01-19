import bcrypt from 'bcrypt';
import pool from '../config/database.js';

const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const getCurrentUser = async (req) => {
  if (!req.session || !req.session.user_id) {
    return null;
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, username, full_name, last_login FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
      [req.session.user_id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const checkAuthenticated = (req, res, next) => {
  if (req.session && req.session.user_id && req.session.logged_in) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

export const createLoginSession = async (req, user, remember = false) => {
  req.session.user_id = user.id;
  req.session.username = user.username;
  req.session.full_name = user.full_name;
  req.session.logged_in = true;

  if (remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  // Update last login
  await pool.execute(
    'UPDATE users SET last_login = NOW() WHERE id = ?',
    [user.id]
  );
};

export const incrementFailedAttempts = async (userId) => {
  const [result] = await pool.execute(
    'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?',
    [userId]
  );

  const [user] = await pool.execute(
    'SELECT failed_login_attempts FROM users WHERE id = ?',
    [userId]
  );

  const attempts = user[0].failed_login_attempts;

  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    const lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION);
    await pool.execute(
      'UPDATE users SET lockout_until = ? WHERE id = ?',
      [lockoutUntil, userId]
    );
  }

  return attempts;
};

export const resetFailedAttempts = async (userId) => {
  await pool.execute(
    'UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE id = ?',
    [userId]
  );
};

