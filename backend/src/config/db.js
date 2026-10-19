const { Pool } = require('pg');
const { careerJobs } = require('../data/careerJobs');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:IIsuMqrQeUZsboSZaDtSBVykyrGFQACd@zephyr.proxy.rlwy.net:10356/railway';

const pool = new Pool({
  connectionString,
  ssl: connectionString.startsWith('postgres') ? { rejectUnauthorized: false } : false,
});

async function initializeDatabase() {
  try {
    // Test connection with 5 second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    await Promise.race([
      pool.query('SELECT 1'),
      timeoutPromise
    ]);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        department TEXT,
        employment_type TEXT,
        experience TEXT,
        description TEXT NOT NULL,
        responsibilities TEXT,
        requirements TEXT,
        apply_email TEXT,
        apply_url TEXT,
        image_url TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      ALTER TABLE job_posts
        ADD COLUMN IF NOT EXISTS image_url TEXT,
        ADD COLUMN IF NOT EXISTS responsibilities TEXT,
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_job_posts_active_created
      ON job_posts (is_active, created_at DESC);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_job_posts_featured_active_created
      ON job_posts (is_featured DESC, is_active, created_at DESC);
    `);

    for (const job of careerJobs) {
      await pool.query(
        `INSERT INTO job_posts (title, location, department, employment_type, experience, description, responsibilities, requirements, apply_email, is_active)
         SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE
         WHERE NOT EXISTS (
           SELECT 1 FROM job_posts WHERE title = $1 AND employment_type = $4 AND is_active = TRUE
         )`,
        [job.title, job.location, job.department, job.employment_type, job.experience, job.description, job.responsibilities.join('\n'), job.requirements.join('\n'), 'info@trisetsolutions.com']
      );
    }
  } catch (error) {
    console.warn('[db:warning] Database initialization failed (will continue with limited features):', error.message);
  }
}

module.exports = { pool, initializeDatabase };
