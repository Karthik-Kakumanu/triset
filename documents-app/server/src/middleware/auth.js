import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.triset_session || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ ok: false, error: 'Authentication required' });
  try { req.user = jwt.verify(token, config.jwtSecret); return next(); } catch { return res.status(401).json({ ok: false, error: 'Session expired' }); }
}
export const allowRoles = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ ok: false, error: 'Insufficient permissions' });
