const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./models');
const requestId = require('./middleware/requestId');
const { requireCsrf, ensureSessionCookie } = require('./middleware/csrf');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DEFAULT_JWT_SECRET = 'your-secret-key-change-in-production';

function failOnMissingEnv() {
  const issues = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEFAULT_JWT_SECRET) {
    issues.push('JWT_SECRET is missing or still set to the default placeholder. Set a strong random value (>= 32 chars).');
  }
  if (issues.length) {
    console.error('\n[STARTUP] Refusing to start with insecure configuration:');
    issues.forEach((m) => console.error('  - ' + m));
    console.error('  Generate a secret with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"\n');
    process.exit(1);
  }
}

failOnMissingEnv();

const app = express();

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(requestId);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Set a stable session cookie on first visit so CSRF tokens stay bound.
app.use('/api', ensureSessionCookie);

// CSRF protection on all state-changing /api/* requests.
// Exempt: /api/auth/login (no prior cookie), /api/contact POST (has captcha).
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  // req.originalUrl is the full path including the mount; req.path is relative to the current router.
  const url = req.originalUrl.split('?')[0];
  if (url === '/api/auth/login' || url === '/api/auth/csrf') return next();
  if (url === '/api/contact/captcha' || url === '/api/contact/stats') return next();
  if (url === '/api/contact' && req.method === 'POST') return next(); // public, captcha-protected
  return requireCsrf(req, res, next);
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please try again later.' },
});
app.use('/api/auth/login', authLimiter);

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});
app.use('/api/contact', contactLimiter);

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});

db.sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected');
    if (process.env.DB_SYNC === 'true') {
      console.warn('[startup] DB_SYNC=true — using sequelize.sync({ alter: true }). DO NOT use in production. Run migrations instead: npx sequelize-cli db:migrate');
      return db.sequelize.sync({ alter: true });
    }
    return null;
  })
  .then(() => console.log('Database ready'))
  .catch((err) => {
    console.error('Database error:', err.message);
    process.exit(1);
  });

global.db = db;

app.use('/api/auth', require('./routes/auth'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/contact', require('./routes/contact'));

const uploadRouter = require('./routes/upload');
app.use('/api/upload', uploadRouter);
app.use('/uploads', express.static(uploadRouter.UPLOAD_DIR, {
  maxAge: '30d',
  immutable: true,
  fallthrough: false,
}));

app.get('/api', (req, res) => {
  res.json({ message: 'Saiful Studios API' });
});

app.get('/api/health', async (req, res) => {
  const result = { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
  try {
    await db.sequelize.authenticate({ logging: false });
    result.database = 'up';
  } catch (err) {
    result.status = 'degraded';
    result.database = 'down';
    return res.status(503).json(result);
  }
  res.json(result);
});

const distDir = path.join(__dirname, '..', 'dist');
app.use(express.static(distDir));

const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://saifulstudios.com').replace(/\/+$/, '');

app.get('/sitemap.xml', async (req, res) => {
  res.type('application/xml');
  const staticPaths = [
    '/',
    '/about',
    '/academy',
    '/setup',
    '/growth',
    '/ai',
    '/case-studies',
    '/blog',
    '/contact',
  ];
  const urls = staticPaths.map(
    (p) => `  <url><loc>${SITE_URL}${p}</loc><changefreq>weekly</changefreq><priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`
  );
  try {
    const blogs = await db.Blog.findAll({
      where: { published: true },
      attributes: ['slug', 'updatedAt'],
      raw: true,
    });
    for (const b of blogs) {
      const lastmod = b.updatedAt ? new Date(b.updatedAt).toISOString() : '';
      urls.push(`  <url><loc>${SITE_URL}/blog/${b.slug}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>monthly</changefreq><priority>0.6</priority></url>`);
    }
  } catch (err) {
    console.warn('[sitemap] could not load blog posts:', err.message);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  res.send(xml);
});

app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) next();
  });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error('[error]', req.id, err);
  }
  if (res.headersSent) return next(err);
  res.status(status).json({
    error: status >= 500 ? 'Server error' : err.message,
    requestId: req.id,
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`\n[${signal}] Shutting down gracefully…`);
  server.close(() => {
    db.sequelize.close().then(() => process.exit(0)).catch(() => process.exit(1));
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
