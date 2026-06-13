const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');
const { requireRole } = auth;
const { auditLog } = require('../middleware/audit');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeString(value, max) {
  if (value === undefined || value === null) return value;
  if (typeof value !== 'string') value = String(value);
  return value.replace(/<[^>]*>/g, '').trim().slice(0, max);
}

// List all admins
router.get('/', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const admins = await db.Admin.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(admins);
  } catch (err) {
    next(err);
  }
});

// Get single admin
router.get('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const admin = await db.Admin.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    next(err);
  }
});

// Create admin
router.post('/', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body || {};

    if (typeof email !== 'string' || !email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (typeof password !== 'string' || password.length < 12) {
      return res.status(400).json({ error: 'Password must be at least 12 characters' });
    }
    if (password.length > 200) {
      return res.status(400).json({ error: 'Password is too long' });
    }

    const existing = await db.Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An admin with this email already exists' });
    }

    const admin = await db.Admin.create({
      email: sanitizeString(email, 255),
      password,
      name: sanitizeString(name, 255) || null,
      role: role === 'admin' ? 'admin' : 'editor',
    });

    await auditLog(req, 'create', 'admin', admin.id, { email: admin.email, role: admin.role });

    const { password: _, ...safe } = admin.toJSON();
    res.status(201).json({ message: 'Admin created', admin: safe });
  } catch (err) {
    next(err);
  }
});

// Update admin
router.put('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const admin = await db.Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Cannot modify yourself (to prevent role demotion lockout — use password change instead)
    if (Number(req.params.id) === req.adminId) {
      return res.status(400).json({ error: 'Use the profile settings to update your own account' });
    }

    const { email, name, role, password } = req.body || {};
    const updates = {};

    if (email !== undefined) {
      if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      const existing = await db.Admin.findOne({ where: { email, id: { [Op.ne]: req.params.id } } });
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updates.email = sanitizeString(email, 255);
    }
    if (name !== undefined) {
      updates.name = sanitizeString(name, 255);
    }
    if (role !== undefined) {
      if (!['admin', 'editor'].includes(role)) {
        return res.status(400).json({ error: 'Role must be admin or editor' });
      }
      updates.role = role;
    }
    if (password !== undefined) {
      if (password.length < 12) {
        return res.status(400).json({ error: 'Password must be at least 12 characters' });
      }
      if (password.length > 200) {
        return res.status(400).json({ error: 'Password is too long' });
      }
      updates.password = password;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    await admin.update(updates);
    await auditLog(req, 'update', 'admin', admin.id, { updated: Object.keys(updates) });

    const { password: _, ...safe } = admin.toJSON();
    res.json({ message: 'Admin updated', admin: safe });
  } catch (err) {
    next(err);
  }
});

// Delete admin
router.delete('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const adminId = Number(req.params.id);

    // Cannot delete yourself
    if (adminId === req.adminId) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const admin = await db.Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Prevent deleting the last admin
    const count = await db.Admin.count();
    if (count <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin account' });
    }

    await admin.destroy();
    await auditLog(req, 'delete', 'admin', adminId, { email: admin.email });

    res.json({ message: 'Admin deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
