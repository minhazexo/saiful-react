const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');
const { getSecret, COOKIE_NAME, cookieOptions } = auth;
const { getCsrfTokenForClient, CSRF_COOKIE, CSRF_HEADER } = require('../middleware/csrf');
const { auditLog } = require('../middleware/audit');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFRESH_WINDOW_MS = 24 * 60 * 60 * 1000; // last 24h of an expiring token still refreshable

function signToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    getSecret(),
    { expiresIn: '7d' }
  );
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

function publicAdmin(admin) {
  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}

// Returns the CSRF token + tells the client which header to send it in.
router.get('/csrf', (req, res) => {
  const token = getCsrfTokenForClient(req, res);
  res.json({ csrfToken: token, headerName: CSRF_HEADER, cookieName: CSRF_COOKIE });
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (password.length < 1 || password.length > 200) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const admin = await db.Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await admin.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let token;
    try {
      token = signToken(admin);
    } catch (e) {
      return next(e);
    }

    setAuthCookie(res, token);

    // Log the login
    req.adminId = admin.id;
    req.adminEmail = admin.email;
    await auditLog(req, 'login', 'admin', admin.id);

    res.json({
      message: 'Logged in successfully',
      admin: publicAdmin(admin),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res) => {
  // Attempt to log the logout before clearing the cookie
  if (req.adminId) {
    await auditLog(req, 'logout', 'admin', req.adminId).catch(() => {});
  } else {
    // Decode token from cookie if available
    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (token) {
      try {
        const payload = jwt.decode(token);
        if (payload && payload.id) {
          req.adminId = payload.id;
          req.adminEmail = payload.email;
          await auditLog(req, 'logout', 'admin', payload.id).catch(() => {});
        }
      } catch { /* ignore decode errors */ }
    }
  }
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ message: 'Logged out' });
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const admin = await db.Admin.findByPk(req.adminId, {
      attributes: { exclude: ['password'] },
    });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ admin });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    // Accept token from cookie or body (for cookie-based clients, the cookie is the source of truth)
    const token = (req.cookies && req.cookies[COOKIE_NAME]) || (req.body && req.body.token);
    if (typeof token !== 'string' || !token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    let payload;
    try {
      payload = jwt.verify(token, getSecret(), { ignoreExpiration: false });
    } catch (err) {
      if (err && err.name === 'TokenExpiredError') {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
          return res.status(401).json({ error: 'Invalid token' });
        }
        const expiredAt = decoded.exp * 1000;
        if (Date.now() - expiredAt > REFRESH_WINDOW_MS) {
          return res.status(401).json({ error: 'Token too old to refresh' });
        }
        payload = decoded;
      } else {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
    if (!payload || !payload.id) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
    const admin = await db.Admin.findByPk(payload.id);
    if (!admin) return res.status(401).json({ error: 'Admin no longer exists' });
    const fresh = signToken(admin);
    setAuthCookie(res, fresh);
    res.json({ admin: publicAdmin(admin) });
  } catch (err) {
    next(err);
  }
});

function validatePassword(pw) {
  if (typeof pw !== 'string') return 'Password is required';
  if (pw.length < 12) return 'Password must be at least 12 characters';
  if (pw.length > 200) return 'Password is too long';
  if (/\s/.test(pw)) return 'Password may not contain whitespace';
  return null;
}

router.put('/password', auth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== 'string' || !currentPassword) {
      return res.status(400).json({ error: 'Current password is required' });
    }
    const pwError = validatePassword(newPassword);
    if (pwError) return res.status(400).json({ error: pwError });
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different' });
    }

    const admin = await db.Admin.findByPk(req.adminId);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const ok = await admin.comparePassword(currentPassword);
    if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });

    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
