import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
