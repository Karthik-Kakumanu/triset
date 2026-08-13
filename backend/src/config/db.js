const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:IIsuMqrQeUZsboSZaDtSBVykyrGFQACd@zephyr.proxy.rlwy.net:10356/railway';

const pool = new Pool({
  connectionString,
  ssl: connectionString.startsWith('postgres') ? { rejectUnauthorized: false } : false,
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS job_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      department TEXT,
      employment_type TEXT,
      experience TEXT,
      description TEXT NOT NULL,
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
}

module.exports = { pool, initializeDatabase };
