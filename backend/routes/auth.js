import express from 'express';
import pool from '../config/database.js';
import { verifyPassword, createLoginSession, incrementFailedAttempts, resetFailedAttempts } from '../helpers/auth.js';
import { generateToken, validateToken } from '../helpers/csrf.js';
import { logAction } from '../helpers/admin.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, remember, csrf_token } = req.body;

    if (!validateToken(req, csrf_token)) {
      return res.status(400).json({ error: 'Invalid CSRF token. Please refresh the page and try again.' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'Completați ambele câmpuri' });
    }

    // Get user
    const [users] = await pool.execute(
      `SELECT id, username, password_hash, full_name, failed_login_attempts, 
       lockout_until, is_active 
       FROM users WHERE username = ? LIMIT 1`,
      [username]
    );

    if (users.length === 0) {
      await logAction(null, 'login_failed_unknown', 'users', null, { username }, req);
      return res.status(401).json({ error: 'Nume utilizator sau parolă incorectă' });
    }

    const user = users[0];

    // Check if account is active
    if (!user.is_active) {
      await logAction(null, 'login_blocked_inactive', 'users', user.id, { username }, req);
      return res.status(403).json({ error: 'Acest cont a fost dezactivat' });
    }

    // Check lockout
    if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.lockout_until) - new Date()) / 60000);
      await logAction(null, 'login_blocked_lockout', 'users', user.id, { username }, req);
      return res.status(403).json({ 
        error: `Cont blocat temporar. Încercați din nou în ${minutesLeft} minute` 
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      const attempts = await incrementFailedAttempts(user.id);
      await logAction(null, 'login_failed', 'users', user.id, { username, attempts }, req);
      
      if (attempts >= 5) {
        return res.status(403).json({ 
          error: 'Prea multe încercări eșuate. Contul a fost blocat pentru 15 minute' 
        });
      }
      
      return res.status(401).json({ 
        error: `Nume utilizator sau parolă incorectă. Mai aveți ${5 - attempts} încercări` 
      });
    }

    // Success - reset failed attempts
    await resetFailedAttempts(user.id);
    await createLoginSession(req, user, remember);
    await logAction(user.id, 'login_success', 'users', user.id, null, req);

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Eroare de server' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  if (req.session && req.session.user_id) {
    await logAction(req.session.user_id, 'logout', 'users', req.session.user_id, null, req);
  }
  
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Eroare la deconectare' });
    }
    res.json({ success: true });
  });
});

// Get CSRF token
router.get('/csrf', (req, res) => {
  const token = generateToken(req);
  res.json({ csrf_token: token });
});

// Check auth status
router.get('/status', async (req, res) => {
  if (req.session && req.session.user_id && req.session.logged_in) {
    const [users] = await pool.execute(
      'SELECT id, username, full_name FROM users WHERE id = ? AND is_active = 1',
      [req.session.user_id]
    );
    
    if (users.length > 0) {
      return res.json({ 
        authenticated: true, 
        user: users[0] 
      });
    }
  }
  
  res.json({ authenticated: false });
});

export default router;

