const { verifyAccessToken } = require('../utils/jwt');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };