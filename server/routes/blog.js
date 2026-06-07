const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const db = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = auth;

const BLOG_PUBLIC_FIELDS = [
  'title', 'slug', 'excerpt', 'content', 'category',
  'author', 'image', 'readTime', 'featured', 'published',
];

const BLOG_SORTABLE = new Set(['createdAt', 'updatedAt', 'title', 'category', 'author', 'readTime', 'published']);

function pickBlogFields(body) {
  const out = {};
  for (const key of BLOG_PUBLIC_FIELDS) {
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
    const where = includeAll ? {} : { published: true };
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { slug: { [Op.like]: `%${q}%` } },
        { category: { [Op.like]: `%${q}%` } },
        { author: { [Op.like]: `%${q}%` } },
      ];
    }
    const sortCol = BLOG_SORTABLE.has(sortField) ? sortField : 'createdAt';
    const opts = { where, order: [[sortCol, orderDir]] };
    if (limit !== null) {
      opts.limit = limit;
      opts.offset = offset;
      const { rows, count } = await db.Blog.findAndCountAll(opts);
      return res.json({ rows, total: count, limit, offset });
    }
    const posts = await db.Blog.findAll(opts);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const post = await db.Blog.findOne({ where: { slug: req.params.slug } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.increment('views');
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const data = pickBlogFields(body);
    if (!data.title || !data.slug || !data.excerpt || !data.content || !data.category) {
      return res.status(400).json({ error: 'title, slug, excerpt, content, category are required' });
    }
    data.title = sanitizeString(data.title, 255);
    data.slug = sanitizeString(data.slug, 255);
    data.excerpt = sanitizeString(data.excerpt, 1000);
    data.content = sanitizeString(data.content, 100000);
    data.category = sanitizeString(data.category, 100);
    if (data.author) data.author = sanitizeString(data.author, 100);
    if (data.image) data.image = sanitizeString(data.image, 500);
    if (data.readTime !== undefined) {
      const n = Number(data.readTime);
      data.readTime = Number.isFinite(n) && n >= 0 ? Math.min(n, 9999) : 5;
    } else {
      data.readTime = 5;
    }
    data.featured = Boolean(data.featured);
    data.published = data.published !== undefined ? Boolean(data.published) : true;

    const post = await db.Blog.create(data);
    res.status(201).json({ message: 'Blog post created', post });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const post = await db.Blog.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const data = pickBlogFields(req.body);
    if (data.title !== undefined) data.title = sanitizeString(data.title, 255);
    if (data.slug !== undefined) data.slug = sanitizeString(data.slug, 255);
    if (data.excerpt !== undefined) data.excerpt = sanitizeString(data.excerpt, 1000);
    if (data.content !== undefined) data.content = sanitizeString(data.content, 100000);
    if (data.category !== undefined) data.category = sanitizeString(data.category, 100);
    if (data.author !== undefined) data.author = sanitizeString(data.author, 100);
    if (data.image !== undefined) data.image = sanitizeString(data.image, 500);
    if (data.readTime !== undefined) {
      const n = Number(data.readTime);
      data.readTime = Number.isFinite(n) && n >= 0 ? Math.min(n, 9999) : post.readTime;
    }
    if (data.featured !== undefined) data.featured = Boolean(data.featured);
    if (data.published !== undefined) data.published = Boolean(data.published);

    await post.update(data);
    res.json({ message: 'Blog post updated', post });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const post = await db.Blog.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.destroy();
    res.json({ message: 'Blog post deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
