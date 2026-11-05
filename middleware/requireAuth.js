const { verifyToken } = require('../utils/auth');

// Blocks the request unless a valid "Authorization: Bearer <token>" header is sent
module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const payload = header.startsWith('Bearer ') ? verifyToken(header.slice(7)) : null;
  if (!payload) return res.status(401).json({ error: 'Please log in to continue' });
  req.userId = payload.id;
  next();
};
