const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const db = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = auth;

const SORTABLE = new Set(['createdAt', 'action', 'resource', 'adminEmail']);

function parseListOptions(query) {
  const limitRaw = Number(query.limit);
  const offsetRaw = Number(query.offset);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 100) : 20;
  const offset = Number.isFinite(offsetRaw) && offsetRaw >= 0 ? Math.floor(offsetRaw) : 0;
  const sortField = typeof query.sort === 'string' ? query.sort : 'createdAt';
  const orderDir = String(query.order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  return { limit, offset, sortField, orderDir };
}

router.get('/', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { limit, offset, sortField, orderDir } = parseListOptions(req.query);
    const where = {};

    // Filter by admin email
    if (req.query.admin) {
      where.adminEmail = { [Op.like]: `%${req.query.admin}%` };
    }

    // Filter by resource type
    if (req.query.resource) {
      where.resource = req.query.resource;
    }

    // Filter by action type
    if (req.query.action) {
      where.action = req.query.action;
    }

    // Date range filter
    if (req.query.from) {
      where.createdAt = { ...where.createdAt, [Op.gte]: new Date(req.query.from) };
    }
    if (req.query.to) {
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(req.query.to) };
    }

    const sortCol = SORTABLE.has(sortField) ? sortField : 'createdAt';
    const opts = { where, order: [[sortCol, orderDir]], limit, offset };
    const { rows, count } = await db.AuditLog.findAndCountAll(opts);
    res.json({ rows, total: count, limit, offset });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
