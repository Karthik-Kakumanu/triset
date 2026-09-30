import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { query } from './db.js';
import { requireAuth, allowRoles } from './middleware/auth.js';
import { createBusinessPdf } from './services/pdfService.js';

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }));

const demo = { clients: [], employees: [], services: [], documents: [] };
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'triset-documents', database: Boolean(config.database) }));
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, error: 'Email and password are required' });
  if (!config.database) return res.status(503).json({ ok: false, error: 'Authentication is unavailable until MySQL is configured' });
  try {
    const rows = await query('SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ ok: false, error: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '8h' });
    res.cookie('triset_session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 });
    return res.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) { return res.status(503).json({ ok: false, error: 'Database unavailable' }); }
});
app.post('/api/auth/logout', (_req, res) => { res.clearCookie('triset_session'); res.json({ ok: true }); });
app.get('/api/auth/me', requireAuth, (req, res) => res.json({ ok: true, user: req.user }));

for (const resource of ['clients', 'employees', 'services', 'documents']) {
  app.get(`/api/${resource}`, requireAuth, (_req, res) => res.json({ ok: true, data: demo[resource] }));
  app.post(`/api/${resource}`, requireAuth, allowRoles('Admin', 'Accounts', 'HR'), (req, res) => { const record = { id: `${resource}-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() }; demo[resource].push(record); res.status(201).json({ ok: true, data: record }); });
}
app.post('/api/documents/:type/pdf', requireAuth, allowRoles('Admin', 'Accounts', 'HR'), async (req, res, next) => { try { const pdf = await createBusinessPdf({ ...req.body, type: req.params.type }); res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`); res.send(Buffer.from(pdf.bytes)); } catch (error) { next(error); } });
app.post('/api/documents/:type/share', requireAuth, allowRoles('Admin', 'Accounts', 'HR'), (req, res) => {
  const token = jwt.sign({ type: req.params.type, document: req.body }, config.jwtSecret, { expiresIn: '7d' });
  const origin = config.publicOrigin || config.clientOrigin;
  res.status(201).json({ ok: true, expiresIn: '7d', url: `${origin}/api/share/${encodeURIComponent(token)}/pdf` });
});
app.get('/api/share/:token/pdf', async (req, res, next) => {
  try {
    const payload = jwt.verify(req.params.token, config.jwtSecret);
    const pdf = await createBusinessPdf({ ...(payload.document || {}), type: payload.type });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdf.filename}"`);
    res.send(Buffer.from(pdf.bytes));
  } catch (error) { error.status = 404; next(error); }
});

if (process.env.NODE_ENV === 'production') { const dist = path.resolve(process.cwd(), 'dist'); app.use(express.static(dist)); app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html'))); }
app.use((error, _req, res, _next) => { console.error('[documents:error]', error); res.status(500).json({ ok: false, error: 'Internal server error' }); });
app.listen(config.port, () => console.log(`TRISET Documents running at http://127.0.0.1:${config.port}`));
