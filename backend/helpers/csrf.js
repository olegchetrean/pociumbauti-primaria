import crypto from 'crypto';

const tokens = new Map();
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export const generateToken = (req) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + TOKEN_EXPIRY;
  
  tokens.set(token, {
    expiry,
    sessionId: req.sessionID
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
    return false;
  }

  const tokenData = tokens.get(token);
  if (!tokenData) {
    return false;
  }

  // Check expiry
  if (tokenData.expiry < Date.now()) {
    tokens.delete(token);
    return false;
  }

  // Check session match
  const currentSessionId = req.sessionID || (req.session && req.session.id);
  if (tokenData.sessionId !== currentSessionId) {
    // In development, be more lenient - check if session exists at all
    if (process.env.NODE_ENV === 'development' && req.session) {
      tokens.delete(token);
      return true;
    }
    return false;
  }

  // Token is valid, delete it (one-time use)
  tokens.delete(token);
  return true;
};

