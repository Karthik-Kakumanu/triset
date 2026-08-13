const { pool } = require('../config/db');
const { sendJson, readJson } = require('../utils/http');
const { sendJobPostedEmail } = require('../services/emailService');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'trisetsolutions.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'passtriset';
const ADMIN_TOKEN = 'triset-admin-token';

function getAuthToken(request) {
  const authHeader = request.headers.authorization || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) return null;
  return authHeader.slice(7).trim();
}

function isAdminAuthorized(request) {
  return getAuthToken(request) === ADMIN_TOKEN;
}

async function listJobs(_request, response) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM job_posts WHERE is_active = TRUE ORDER BY is_featured DESC, created_at DESC`
    );
    sendJson(response, 200, { ok: true, jobs: rows });
  } catch (error) {
    console.error('[jobs:list:error]', error);
    sendJson(response, 500, { ok: false, error: 'Unable to load jobs' });
  }
}

async function getJob(_request, response, jobId) {
  try {
    if (!jobId || Number.isNaN(Number(jobId))) {
      sendJson(response, 400, { ok: false, error: 'Invalid job id' });
      return;
    }

    const { rows } = await pool.query('SELECT * FROM job_posts WHERE id = $1', [Number(jobId)]);
    if (!rows[0]) {
      sendJson(response, 404, { ok: false, error: 'Job not found' });
      return;
    }

    sendJson(response, 200, { ok: true, job: rows[0] });
  } catch (error) {
    console.error('[jobs:get:error]', error);
    sendJson(response, 500, { ok: false, error: 'Unable to fetch job' });
  }
}

async function createJob(request, response) {
  if (!isAdminAuthorized(request)) {
    sendJson(response, 401, { ok: false, error: 'Unauthorized' });
    return;
  }

  try {
    const payload = await readJson(request, 128 * 1024);
    const title = String(payload.title || '').trim();
    const location = String(payload.location || '').trim();
    const description = String(payload.description || '').trim();
    const imageUrl = String(payload.image_url || '').trim();
    const isFeatured = payload.is_featured === true || payload.featured === true;

    if (!title || !location || !description) {
      sendJson(response, 400, { ok: false, error: 'Title, location and description are required.' });
      return;
    }

    const { rows } = await pool.query(
      `
        INSERT INTO job_posts (
          title,
          location,
          department,
          employment_type,
          experience,
          description,
          requirements,
          apply_email,
          apply_url,
          image_url,
          is_featured,
          is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `,
      [
        title,
        location,
        payload.department || 'General',
        payload.employment_type || 'Full-time',
        payload.experience || '2+ years',
        description,
        payload.requirements || '',
        payload.apply_email || 'info@trisetsolutions.com',
        payload.apply_url || '',
        imageUrl,
        isFeatured,
        payload.is_active !== false,
      ]
    );

    try {
      await sendJobPostedEmail(rows[0]);
    } catch (emailError) {
      console.warn('[jobs:create:email:warn]', emailError.message || emailError);
    }

    sendJson(response, 201, { ok: true, job: rows[0] });
  } catch (error) {
    console.error('[jobs:create:error]', error);
    sendJson(response, error.statusCode || 500, {
      ok: false,
      error: error.message || 'Unable to create job',
    });
  }
}

async function updateJob(request, response, jobId) {
  if (!isAdminAuthorized(request)) {
    sendJson(response, 401, { ok: false, error: 'Unauthorized' });
    return;
  }

  try {
    const payload = await readJson(request, 128 * 1024);
    if (!jobId || Number.isNaN(Number(jobId))) {
      sendJson(response, 400, { ok: false, error: 'Invalid job id' });
      return;
    }

    const imageUrl = payload.image_url !== undefined ? String(payload.image_url || '').trim() : null;
    const isFeatured = payload.is_featured !== undefined ? Boolean(payload.is_featured || payload.featured) : null;

    const { rows } = await pool.query(
      `
        UPDATE job_posts
        SET
          title = COALESCE($1, title),
          location = COALESCE($2, location),
          department = COALESCE($3, department),
          employment_type = COALESCE($4, employment_type),
          experience = COALESCE($5, experience),
          description = COALESCE($6, description),
          requirements = COALESCE($7, requirements),
          apply_email = COALESCE($8, apply_email),
          apply_url = COALESCE($9, apply_url),
          image_url = COALESCE($10, image_url),
          is_featured = COALESCE($11, is_featured),
          is_active = COALESCE($12, is_active),
          updated_at = NOW()
        WHERE id = $13
        RETURNING *;
      `,
      [
        payload.title || null,
        payload.location || null,
        payload.department || null,
        payload.employment_type || null,
        payload.experience || null,
        payload.description || null,
        payload.requirements || null,
        payload.apply_email || null,
        payload.apply_url || null,
        imageUrl,
        isFeatured,
        payload.is_active !== undefined ? payload.is_active : null,
        Number(jobId),
      ]
    );

    if (!rows[0]) {
      sendJson(response, 404, { ok: false, error: 'Job not found' });
      return;
    }

    sendJson(response, 200, { ok: true, job: rows[0] });
  } catch (error) {
    console.error('[jobs:update:error]', error);
    sendJson(response, error.statusCode || 500, {
      ok: false,
      error: error.message || 'Unable to update job',
    });
  }
}

async function deleteJob(request, response, jobId) {
  if (!isAdminAuthorized(request)) {
    sendJson(response, 401, { ok: false, error: 'Unauthorized' });
    return;
  }

  try {
    if (!jobId || Number.isNaN(Number(jobId))) {
      sendJson(response, 400, { ok: false, error: 'Invalid job id' });
      return;
    }

    const { rowCount } = await pool.query('DELETE FROM job_posts WHERE id = $1', [Number(jobId)]);
    if (rowCount === 0) {
      sendJson(response, 404, { ok: false, error: 'Job not found' });
      return;
    }

    sendJson(response, 200, { ok: true, deleted: true });
  } catch (error) {
    console.error('[jobs:delete:error]', error);
    sendJson(response, 500, { ok: false, error: 'Unable to delete job' });
  }
}

async function adminLogin(request, response) {
  try {
    const payload = await readJson(request, 64 * 1024);
    const username = String(payload.username || '').trim();
    const password = String(payload.password || '').trim();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sendJson(response, 200, { ok: true, token: ADMIN_TOKEN });
      return;
    }

    sendJson(response, 401, { ok: false, error: 'Invalid username or password' });
  } catch (error) {
    console.error('[admin:login:error]', error);
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to login' });
  }
}

module.exports = {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  adminLogin,
};
