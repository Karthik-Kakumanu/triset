const { readJson, sendJson } = require('../utils/http');
const { validateContact } = require('../validators/contactValidator');
const { saveContactSubmission, readContactSubmissions } = require('../services/contactStore');
const { sendContactEmail } = require('../services/emailService');
const { rateLimit } = require('../middleware/rateLimit');
const { query } = require('../config/db');

async function createContact(request, response) {
  const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress || 'unknown';
  const limited = rateLimit({ key: `contact:${ip}` });
  if (!limited.allowed) {
    sendJson(response, 429, { ok: false, error: 'Too many submissions. Please try again later.' }, { 'Retry-After': String(limited.retryAfter) });
    return;
  }

  const payload = await readJson(request);
  const result = validateContact(payload);
  if (!result.valid) {
    sendJson(response, 422, { ok: false, errors: result.errors });
    return;
  }

  const submission = {
    ...result.data,
    id: `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    userAgent: request.headers['user-agent'] || '',
    ip: String(ip).split(',')[0].trim(),
  };

  const storage = saveContactSubmission(submission);
  const email = await sendContactEmail(submission);

  sendJson(response, 201, {
    ok: true,
    message: 'Inquiry received. TRISET will respond using the contact details provided.',
    id: submission.id,
    stored: storage.stored,
    email,
  });
}

async function listContactSubmissions(_request, response) {
  try {
    const inquiries = readContactSubmissions().slice(0, 50);
    sendJson(response, 200, { ok: true, inquiries });
  } catch (error) {
    console.error('[inquiries:list:error]', error);
    sendJson(response, 500, { ok: false, error: 'Unable to load inquiries' });
  }
}

async function getAdminOverview(_request, response) {
  try {
    const { rows: jobs } = await query(`
      SELECT
        COUNT(*) AS total_jobs,
        COALESCE(SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END), 0) AS active_jobs,
        COALESCE(SUM(CASE WHEN is_featured = TRUE THEN 1 ELSE 0 END), 0) AS featured_jobs
      FROM job_posts;
    `);

    const inquiries = readContactSubmissions().slice(0, 12);
    const summary = jobs[0] || { total_jobs: 0, active_jobs: 0, featured_jobs: 0 };

    sendJson(response, 200, {
      ok: true,
      summary: {
        totalJobs: Number(summary.total_jobs || 0),
        activeJobs: Number(summary.active_jobs || 0),
        featuredJobs: Number(summary.featured_jobs || 0),
        inquiriesCount: inquiries.length,
      },
      inquiries,
    });
  } catch (error) {
    console.error('[admin:overview:error]', error);
    sendJson(response, 500, { ok: false, error: 'Unable to load admin overview' });
  }
}

module.exports = { createContact, listContactSubmissions, getAdminOverview };
