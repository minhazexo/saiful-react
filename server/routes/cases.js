const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const db = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = auth;

const CASE_FIELDS = [
  'title', 'slug', 'category', 'icon', 'challenge', 'solution',
  'result', 'resultHighlight', 'headerGradient', 'metrics',
  'images', 'featured', 'client', 'description',
];

const CASE_SORTABLE = new Set(['createdAt', 'updatedAt', 'title', 'category', 'featured']);

function pickCaseFields(body) {
  const out = {};
  for (const key of CASE_FIELDS) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

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

router.get('/', async (req, res, next) => {
  try {
    const includeAll = req.query.status === 'all';
    const { limit, offset, sortField, orderDir, q } = parseListOptions(req.query);
    const where = includeAll ? {} : { featured: true };
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { slug: { [Op.like]: `%${q}%` } },
        { category: { [Op.like]: `%${q}%` } },
      ];
    }
    const sortCol = CASE_SORTABLE.has(sortField) ? sortField : 'createdAt';
    const opts = { where, order: [[sortCol, orderDir]] };
    if (limit !== null) {
      opts.limit = limit;
      opts.offset = offset;
      const { rows, count } = await db.CaseStudy.findAndCountAll(opts);
      return res.json({ rows, total: count, limit, offset });
    }
    const cases = await db.CaseStudy.findAll(opts);
    res.json(cases);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const caseStudy = await db.CaseStudy.findOne({ where: { slug: req.params.slug } });
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    res.json(caseStudy);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const data = pickCaseFields(req.body);
    if (!data.title || !data.slug || !data.category || !data.icon || !data.challenge || !data.solution || !data.result) {
      return res.status(400).json({ error: 'title, slug, category, icon, challenge, solution, result are required' });
    }
    data.title = sanitizeString(data.title, 255);
    data.slug = sanitizeString(data.slug, 255);
    data.category = sanitizeString(data.category, 100);
    data.icon = sanitizeString(data.icon, 10);
    data.challenge = sanitizeString(data.challenge, 5000);
    data.solution = sanitizeString(data.solution, 5000);
    data.result = sanitizeString(data.result, 5000);
    if (data.resultHighlight) data.resultHighlight = sanitizeString(data.resultHighlight, 255);
    if (data.headerGradient) data.headerGradient = sanitizeString(data.headerGradient, 255);
    if (!data.headerGradient) data.headerGradient = 'linear-gradient(135deg,#FFE7CC,#fff)';
    if (Array.isArray(data.metrics)) {
      data.metrics = data.metrics.slice(0, 20).map((m) => ({
        label: sanitizeString(m?.label || '', 100),
        value: sanitizeString(m?.value || '', 100),
      }));
    } else {
      data.metrics = [];
    }
    if (Array.isArray(data.images)) {
      data.images = data.images.slice(0, 20).map((u) => sanitizeString(u, 500));
    } else {
      data.images = [];
    }
    data.featured = data.featured !== undefined ? Boolean(data.featured) : true;

    const caseStudy = await db.CaseStudy.create(data);
    res.status(201).json({ message: 'Case study created', caseStudy });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const caseStudy = await db.CaseStudy.findByPk(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    const data = pickCaseFields(req.body);
    if (data.title !== undefined) data.title = sanitizeString(data.title, 255);
    if (data.slug !== undefined) data.slug = sanitizeString(data.slug, 255);
    if (data.category !== undefined) data.category = sanitizeString(data.category, 100);
    if (data.icon !== undefined) data.icon = sanitizeString(data.icon, 10);
    if (data.challenge !== undefined) data.challenge = sanitizeString(data.challenge, 5000);
    if (data.solution !== undefined) data.solution = sanitizeString(data.solution, 5000);
    if (data.result !== undefined) data.result = sanitizeString(data.result, 5000);
    if (data.resultHighlight !== undefined) data.resultHighlight = sanitizeString(data.resultHighlight, 255);
    if (data.headerGradient !== undefined) data.headerGradient = sanitizeString(data.headerGradient, 255);
    if (Array.isArray(data.metrics)) {
      data.metrics = data.metrics.slice(0, 20).map((m) => ({
        label: sanitizeString(m?.label || '', 100),
        value: sanitizeString(m?.value || '', 100),
      }));
    }
    if (Array.isArray(data.images)) {
      data.images = data.images.slice(0, 20).map((u) => sanitizeString(u, 500));
    }
    if (data.featured !== undefined) data.featured = Boolean(data.featured);

    await caseStudy.update(data);
    res.json({ message: 'Case study updated', caseStudy });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const caseStudy = await db.CaseStudy.findByPk(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    await caseStudy.destroy();
    res.json({ message: 'Case study deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
