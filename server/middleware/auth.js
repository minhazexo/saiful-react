const jwt = require('jsonwebtoken');

const DEFAULT_JWT_SECRET = 'your-secret-key-change-in-production';
const COOKIE_NAME = 'admin_token';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === DEFAULT_JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Refusing to authenticate.');
  }
  return secret;
}

function extractToken(req) {
  if (req.cookies && typeof req.cookies[COOKIE_NAME] === 'string' && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }
  const header = req.header('Authorization') || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

function auth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, getSecret());
    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    req.adminRole = decoded.role;
    req.tokenSource = req.cookies && req.cookies[COOKIE_NAME] ? 'cookie' : 'header';
    next();
  } catch (err) {
    if (req.cookies && req.cookies[COOKIE_NAME]) {
      res.clearCookie(COOKIE_NAME, { path: '/' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.adminRole || !roles.includes(req.adminRole)) {
      return res.status(403).json({ error: 'Forbidden — insufficient privileges' });
    }
    next();
  };
}

module.exports = auth;
module.exports.requireRole = requireRole;
module.exports.getSecret = getSecret;
module.exports.COOKIE_NAME = COOKIE_NAME;
module.exports.cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
