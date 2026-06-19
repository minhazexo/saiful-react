import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-for-csrf-suite-must-be-long';

const { requireCsrf, ensureSessionCookie, getCsrfTokenForClient, CSRF_HEADER, CSRF_COOKIE } =
  await import('./middleware/csrf.js');

let app;
beforeAll(() => {
  app = express();
  app.use(cookieParser());
  app.use(ensureSessionCookie);
  app.get('/csrf', (req, res) => {
    const token = getCsrfTokenForClient(req, res);
    res.json({ csrfToken: token });
  });
  app.post('/mutate', requireCsrf, (req, res) => res.json({ ok: true }));
  app.post('/public-write', (req, res) => res.json({ ok: true })); // exempt path
  // Simulate the global CSRF gate from server.js
  app.use((req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
    if (req.path === '/public-write') return next();
    return requireCsrf(req, res, next);
  });
});

describe('CSRF protection', () => {
  it('GET /csrf returns a token and sets a non-httpOnly cookie readable by JS', async () => {
    const res = await request(app).get('/csrf').expect(200);
    expect(res.body.csrfToken).toBeTypeOf('string');
    expect(res.body.csrfToken.length).toBeGreaterThan(20);
    const setCookie = res.headers['set-cookie'].find((c) => c.startsWith(`${CSRF_COOKIE}=`));
    expect(setCookie).toBeDefined();
    expect(setCookie).toMatch(/SameSite=Lax/i);
    // NOT HttpOnly so the SPA can read it
    expect(setCookie).not.toMatch(/HttpOnly/i);
  });

  it('rejects POST without a CSRF header', async () => {
    const res = await request(app).post('/mutate').send({});
    expect(res.status).toBe(403);
  });

  it('rejects POST with the cookie value but no header (no double-submit)', async () => {
    const csrf = await request(app).get('/csrf').expect(200);
    const cookie = csrf.headers['set-cookie'].find((c) => c.startsWith(`${CSRF_COOKIE}=`)).split(';')[0];
    const res = await request(app).post('/mutate').set('Cookie', cookie).send({});
    expect(res.status).toBe(403);
  });

  it('accepts POST with both cookie and matching header', async () => {
    const csrf = await request(app).get('/csrf').expect(200);
    // Forward ALL set-cookies (session + CSRF)
    const allCookies = csrf.headers['set-cookie']
      .map((c) => c.split(';')[0])
      .join('; ');
    const res = await request(app)
      .post('/mutate')
      .set('Cookie', allCookies)
      .set(CSRF_HEADER, csrf.body.csrfToken)
      .send({});
    expect(res.status).toBe(200);
  });

  it('skips CSRF for safe methods (GET)', async () => {
    const res = await request(app).get('/csrf');
    expect(res.status).toBe(200);
  });

  it('skips CSRF for explicitly-exempted POST endpoints', async () => {
    const res = await request(app).post('/public-write').send({});
    expect(res.status).toBe(200);
  });
});
