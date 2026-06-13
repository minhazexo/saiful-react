const db = require('../models');

/**
 * Log an admin action to the audit log.
 * Can be used as middleware or called directly.
 *
 * Usage as middleware:
 *   router.post('/resource', auth, audit('create', 'blog'), handler);
 *
 * Usage direct:
 *   const { auditLog } = require('../middleware/audit');
 *   await auditLog(req, 'create', 'blog', resourceId, details);
 */
function audit(action, resource) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      // Only log successful operations (2xx status)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.adminId) {
        const resourceId = req.params.id
          ? Number(req.params.id)
          : (body && body.id) || null;

        const details = {};
        if (req.body && ['post', 'put'].includes(req.method.toLowerCase())) {
          const loggable = { ...req.body };
          // Never log passwords
          delete loggable.password;
          delete loggable.currentPassword;
          delete loggable.newPassword;
          delete loggable.confirmPassword;
          if (Object.keys(loggable).length > 0) {
            details.body = loggable;
          }
        }

        db.AuditLog.create({
          adminId: req.adminId,
          adminEmail: req.adminEmail,
          action,
          resource,
          resourceId,
          details: Object.keys(details).length > 0 ? details : null,
          ip: req.ip || req.connection?.remoteAddress || null,
        }).catch((err) => {
          console.error('[AUDIT] Failed to log:', err.message);
        });
      }
      return originalJson(body);
    };
    next();
  };
}

/**
 * Direct audit log function — use when middleware pattern doesn't fit
 * (e.g., in login/logout handlers).
 */
async function auditLog(req, action, resource, resourceId = null, details = null) {
  if (!req.adminId) return;
  try {
    await db.AuditLog.create({
      adminId: req.adminId,
      adminEmail: req.adminEmail,
      action,
      resource,
      resourceId,
      details,
      ip: req.ip || req.connection?.remoteAddress || null,
    });
  } catch (err) {
    console.error('[AUDIT] Failed to log:', err.message);
  }
}

/**
 * Log bulk operations.
 */
async function auditBulk(req, action, resource, ids, summary = {}) {
  if (!req.adminId) return;
  try {
    await db.AuditLog.create({
      adminId: req.adminId,
      adminEmail: req.adminEmail,
      action,
      resource,
      details: { ids, ...summary },
      ip: req.ip || req.connection?.remoteAddress || null,
    });
  } catch (err) {
    console.error('[AUDIT] Failed to log bulk:', err.message);
  }
}

module.exports = { audit, auditLog, auditBulk };
