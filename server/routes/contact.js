const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const db = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = auth;
const mailer = require('../mailer');
const captcha = require('../captcha');
const { audit, auditBulk } = require('../middleware/audit');

const CONTACT_PUBLIC_FIELDS = ['name', 'email', 'whatsapp', 'service', 'message', 'source'];
const CONTACT_ADMIN_FIELDS = ['status'];
const ALLOWED_STATUSES = ['new', 'contacted', 'interested', 'closed'];
const CONTACT_SORTABLE = new Set(['createdAt', 'updatedAt', 'name', 'email', 'status', 'service']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+0-9 ()\-]{6,20}$/;

function sanitizeString(value, max) {
  if (value === undefined || value === null) return value;
  if (typeof value !== 'string') value = String(value);
  const stripped = value.replace(/<[^>]*>/g, '').trim();
  return stripped.slice(0, max);
}

function parseListOptions(query, defaults = {}) {
  const limitRaw = Number(query.limit);
  const offsetRaw = Number(query.offset);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 100) : null;
  const offset = Number.isFinite(offsetRaw) && offsetRaw >= 0 ? Math.floor(offsetRaw) : 0;
  const sortField = typeof query.sort === 'string' ? query.sort : defaults.sort || 'createdAt';
  const orderDir = String(query.order || defaults.order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : '';
  return { limit, offset, sortField, orderDir, q };
}

router.get('/', auth, async (req, res, next) => {
  try {
    const { limit, offset, sortField, orderDir, q } = parseListOptions(req.query);
    const where = {};
    if (req.query.status && ALLOWED_STATUSES.includes(req.query.status)) {
      where.status = req.query.status;
    }
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { whatsapp: { [Op.like]: `%${q}%` } },
        { service: { [Op.like]: `%${q}%` } },
      ];
    }
    const sortCol = CONTACT_SORTABLE.has(sortField) ? sortField : 'createdAt';
    const opts = { where, order: [[sortCol, orderDir]] };
    if (limit !== null) {
      opts.limit = limit;
      opts.offset = offset;
      const { rows, count } = await db.Contact.findAndCountAll(opts);
      return res.json({ rows, total: count, limit, offset });
    }
    const contacts = await db.Contact.findAll(opts);
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get('/stats', auth, async (req, res, next) => {
  try {
    const rows = await db.Contact.findAll({
      attributes: ['status', [db.sequelize.fn('COUNT', db.sequelize.col('status')), 'count']],
      group: ['status'],
      raw: true,
    });
    const counts = { new: 0, contacted: 0, interested: 0, closed: 0 };
    for (const r of rows) {
      if (counts[r.status] !== undefined) counts[r.status] = Number(r.count) || 0;
    }
    res.json(counts);
  } catch (err) {
    next(err);
  }
});

router.get('/captcha', (req, res) => {
  const challenge = captcha.issue();
  res.json(challenge);
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const captchaId = typeof body.captchaId === 'string' ? body.captchaId : '';
    const captchaAnswer = body.captchaAnswer;
    if (!captchaId || captchaAnswer === undefined || captchaAnswer === null) {
      return res.status(400).json({ error: 'Captcha is required' });
    }
    const result = captcha.verify(captchaId, captchaAnswer);
    if (!result.ok) {
      return res.status(400).json({ error: 'Captcha answer is incorrect or expired. Please try again.' });
    }

    const data = {};
    for (const key of CONTACT_PUBLIC_FIELDS) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    if (!data.name || !data.email || !data.whatsapp) {
      return res.status(400).json({ error: 'Name, email, and whatsapp are required' });
    }
    if (!EMAIL_RE.test(data.email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (!PHONE_RE.test(data.whatsapp)) {
      return res.status(400).json({ error: 'Invalid whatsapp number' });
    }
    data.name = sanitizeString(data.name, 255);
    data.email = sanitizeString(data.email, 255);
    data.whatsapp = sanitizeString(data.whatsapp, 20);
    if (data.service) data.service = sanitizeString(data.service, 100);
    if (data.message) data.message = sanitizeString(data.message, 5000);
    if (data.source) data.source = sanitizeString(data.source, 100);
    if (!data.source) data.source = 'website';
    data.status = 'new';

    const contact = await db.Contact.create(data);
    res.status(201).json({ message: 'Contact form submitted', contact });

    // Fire-and-forget email notifications. We don't await them so the
    // user gets a fast response; failures are logged inside the mailer.
    setImmediate(() => {
      mailer.notifyNewContact(contact).catch((err) => {
        console.error('[CONTACT] notify failed:', err.message);
      });
      mailer.sendContactConfirmation(contact).catch((err) => {
        console.error('[CONTACT] confirmation failed:', err.message);
      });
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const contact = await db.Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, audit('update', 'contact'), async (req, res, next) => {
  try {
    const contact = await db.Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    const data = {};
    for (const key of CONTACT_ADMIN_FIELDS) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    if (data.status && !ALLOWED_STATUSES.includes(data.status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    if (data.status) data.status = String(data.status);
    await contact.update(data);
    res.json({ message: 'Contact updated', contact });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, requireRole('admin'), audit('delete', 'contact'), async (req, res, next) => {
  try {
    const contact = await db.Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    await contact.destroy();
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
});

// ── Bulk Actions ──

router.post('/bulk', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { action, ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids array is required' });
    }
    if (!['delete'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const count = await db.Contact.destroy({ where: { id: ids } });
    await auditBulk(req, 'bulk_delete', 'contact', ids, { count });
    res.json({ message: `${count} contacts deleted`, count });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
