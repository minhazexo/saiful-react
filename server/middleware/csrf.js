const crypto = require('crypto');
const { doubleCsrf } = require('csrf-csrf');

const CSRF_COOKIE = 'psifi.x-csrf-token';
const CSRF_HEADER = 'x-csrf-token';
const SESSION_COOKIE = 'psifi_sid';
const AUTH_COOKIE = 'admin_token';
const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000;

function getCsrfSecret() {
  const base = process.env.JWT_SECRET;
  if (!base || base === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET is not configured. Refusing to enable CSRF.');
  }
  return crypto.createHash('sha256').update(`csrf:${base}`).digest('hex');
}

const isProd = process.env.NODE_ENV === 'production';

const {
  generateCsrfToken, // (req, res) => token string
  validateRequest, // throws if token missing/invalid
  invalidCsrfTokenError,
  doubleCsrfProtection, // convenience middleware
} = doubleCsrf({
  getSecret: getCsrfSecret,
  cookieName: CSRF_COOKIE,
  cookieOptions: {
    sameSite: 'lax',
    secure: isProd,
    httpOnly: false, // must be readable by the JS frontend
    path: '/',
  },
  size: 64,
  getSessionIdentifier: (req) => {
    // Bind the CSRF token to a stable identifier across requests from the same
    // browser. Prefer the auth cookie (changes on login/logout). Otherwise, a
    // long-lived random session cookie set by `ensureSessionCookie`.
    const auth = req.cookies && req.cookies[AUTH_COOKIE];
    if (auth) return `auth:${auth}`;
    const sid = req.cookies && req.cookies[SESSION_COOKIE];
    if (sid) return `sid:${sid}`;
    return `ip:${req.ip || 'unknown'}`;
  },
  getTokenFromRequest: (req) => {
    const header = req.header(CSRF_HEADER) || req.header('x-xsrf-token');
    if (typeof header === 'string' && header) return header;
    if (req.body && typeof req.body._csrf === 'string') return req.body._csrf;
    return null;
  },
});

function requireCsrf(req, res, next) {
  // Skip safe methods
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }
  try {
    const ok = validateRequest(req);
    if (!ok) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureSessionCookie(req, res, next) {
  // Set a long-lived random session identifier on first contact so the CSRF
  // token is bound to something stable for anonymous visitors.
  if (!req.cookies || !req.cookies[SESSION_COOKIE]) {
    const sid = crypto.randomBytes(24).toString('hex');
    res.cookie(SESSION_COOKIE, sid, {
      sameSite: 'lax',
      secure: isProd,
      httpOnly: true,
      path: '/',
      maxAge: SESSION_TTL_MS,
    });
    req.cookies[SESSION_COOKIE] = sid;
  }
  next();
}

function getCsrfTokenForClient(req, res) {
  // Returns the token that the frontend must send in the CSRF header.
  return generateCsrfToken(req, res);
}

module.exports = {
  requireCsrf,
  ensureSessionCookie,
  getCsrfTokenForClient,
  CSRF_COOKIE,
  CSRF_HEADER,
};
