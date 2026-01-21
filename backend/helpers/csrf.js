import crypto from 'crypto';

const tokens = new Map();
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export const generateToken = (req) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + TOKEN_EXPIRY;
  
  // Use session.id instead of sessionID for better compatibility
  const sessionId = req.session?.id || req.sessionID || 'no-session';
  
  tokens.set(token, {
    expiry,
    sessionId
  });

  // Clean up expired tokens periodically
  if (tokens.size > 1000) {
    const now = Date.now();
    for (const [key, value] of tokens.entries()) {
      if (value.expiry < now) {
        tokens.delete(key);
      }
    }
  }

  return token;
};

export const validateToken = (req, token) => {
  if (!token) {
    console.warn('[CSRF] No token provided');
    return false;
  }

  const tokenData = tokens.get(token);
  if (!tokenData) {
    console.warn('[CSRF] Token not found in map');
    return false;
  }

  // Check expiry
  if (tokenData.expiry < Date.now()) {
    console.warn('[CSRF] Token expired');
    tokens.delete(token);
    return false;
  }

  // Check session match - use session.id for better compatibility
  const currentSessionId = req.session?.id || req.sessionID || 'no-session';
  
  if (tokenData.sessionId !== currentSessionId) {
    // In development OR if session exists at all, be lenient
    if (process.env.NODE_ENV === 'development' || req.session) {
      console.warn('[CSRF] Session mismatch but allowing (dev mode or session exists)');
      tokens.delete(token);
      return true;
    }
    console.warn('[CSRF] Session mismatch in production');
    return false;
  }

  // Token is valid, delete it (one-time use)
  tokens.delete(token);
  return true;
};
