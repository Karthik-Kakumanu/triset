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

app.get('/api/health', async (_req, res) => {
  let database = false;
  if (config.database) {
    try { await query('SELECT 1'); database = true; } catch { database = false; }
  }
  res.json({ ok: true, service: 'triset-documents', database });
});
app.get('/api/dashboard', requireAuth, async (_req, res, next) => {
  try {
    const [clients, employees, quotations, invoices, purchaseOrders, payslips, recent] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM clients'),
      query('SELECT COUNT(*) AS total FROM employees'),
      query('SELECT COUNT(*) AS total FROM quotations'),
      query('SELECT COUNT(*) AS total FROM invoices'),
      query('SELECT COUNT(*) AS total FROM purchase_orders'),
      query('SELECT COUNT(*) AS total FROM payslips'),
      query('SELECT id, document_type AS type, document_number AS number, category, amount, status, created_at AS createdAt FROM documents ORDER BY created_at DESC LIMIT 8')
    ]);
    res.json({ ok: true, stats: { clients: clients[0].total, employees: employees[0].total, quotations: quotations[0].total, invoices: invoices[0].total, purchaseOrders: purchaseOrders[0].total, payslips: payslips[0].total }, recent: recent });
  } catch (error) { next(error); }
});
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
  app.get(`/api/${resource}`, requireAuth, async (_req, res, next) => {
    if (!config.database) return res.status(503).json({ ok: false, error: 'Database is not configured' });
    const sql = {
      clients: 'SELECT id, name, contact_person AS contact, city, state, email, phone, gstin FROM clients ORDER BY name',
      employees: 'SELECT id, employee_id AS employeeId, name, designation, department, date_of_joining AS joining, location, band_grade AS grade FROM employees ORDER BY name',
      services: 'SELECT sc.name AS category, s.name FROM services s JOIN service_categories sc ON sc.id = s.category_id WHERE s.active = 1 ORDER BY sc.name, s.name',
      documents: 'SELECT id, document_type AS type, document_number AS number, category, amount, status, created_at AS createdAt FROM documents ORDER BY created_at DESC'
    }[resource];
    try { const rows = await query(sql); return res.json({ ok: true, data: rows }); } catch (error) { return next(error); }
  });
  app.post(`/api/${resource}`, requireAuth, allowRoles('Admin', 'Accounts', 'HR'), async (req, res, next) => {
    if (!config.database) return res.status(503).json({ ok: false, error: 'Database is not configured' });
    try {
      let result;
      if (resource === 'clients') result = await query('INSERT INTO clients (name, contact_person, city, state, email, phone) VALUES (?, ?, ?, ?, ?, ?)', [req.body.name, req.body.contact, req.body.city, req.body.state, req.body.email, req.body.phone]);
      else if (resource === 'employees') result = await query('INSERT INTO employees (employee_id, name, designation, department, date_of_joining, location, band_grade) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.id || req.body.employeeId, req.body.name, req.body.designation, req.body.department, req.body.joining || null, req.body.location, req.body.grade]);
      else return res.status(400).json({ ok: false, error: `Creation for ${resource} is not implemented yet` });
      return res.status(201).json({ ok: true, data: { id: result.insertId, ...req.body, createdAt: new Date().toISOString() } });
    } catch (error) { return next(error); }
  });
}
app.post('/api/documents/:type/pdf', requireAuth, allowRoles('Admin', 'Accounts', 'HR'), async (req, res, next) => { try { const pdf = await createBusinessPdf({ ...req.body, type: req.params.type }); if (config.database) await query('INSERT INTO documents (document_type, document_number, category, amount, status, created_by, pdf_reference) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.params.type, req.body.number || 'DRAFT', req.body.category || null, Number(req.body.amount || 0), 'Generated', req.user.id, pdf.filename]); res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`); res.send(Buffer.from(pdf.bytes)); } catch (error) { next(error); } });
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
