const crypto = require('crypto');

module.exports = function requestId(req, res, next) {
  const incoming = req.get('x-request-id');
  const id = incoming && /^[\w.-]{6,128}$/.test(incoming) ? incoming : crypto.randomBytes(8).toString('hex');
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
};
