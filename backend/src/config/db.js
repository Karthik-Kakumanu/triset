const mysql = require('mysql2/promise');
const { Pool: PostgresPool } = require('pg');
const { careerJobs } = require('../data/careerJobs');

const databaseType = process.env.DATABASE_URL ? 'postgres' : 'mysql';
const pool = databaseType === 'postgres'
  ? new PostgresPool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.startsWith('postgres') ? { rejectUnauthorized: false } : false,
  })
  : mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

async function query(statement, params = []) {
  if (databaseType === 'postgres') {
    let parameterIndex = 0;
    const postgresStatement = statement.replace(/\?/g, () => `$${++parameterIndex}`);
    return pool.query(postgresStatement, params);
  }

  const [rows] = await pool.query(statement, params);
  return {
    rows: Array.isArray(rows) ? rows : [],
    rowCount: Array.isArray(rows) ? rows.length : rows.affectedRows,
    insertId: Array.isArray(rows) ? undefined : rows.insertId,
  };
}

async function initializeDatabase() {
  try {
    await query('SELECT 1');
    if (databaseType === 'postgres') {
      await query(`
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
      await query(`
        ALTER TABLE job_posts
          ADD COLUMN IF NOT EXISTS image_url TEXT,
          ADD COLUMN IF NOT EXISTS responsibilities TEXT,
          ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
      `);
      await query(`
        CREATE INDEX IF NOT EXISTS idx_job_posts_active_created
        ON job_posts (is_active, created_at DESC);
      `);
      await query(`
        CREATE INDEX IF NOT EXISTS idx_job_posts_featured_active_created
        ON job_posts (is_featured DESC, is_active, created_at DESC);
      `);
    } else {
      await query(`
        CREATE TABLE IF NOT EXISTS job_posts (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
          is_featured BOOLEAN NOT NULL DEFAULT FALSE,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_job_posts_active_created (is_active, created_at),
          INDEX idx_job_posts_featured_active_created (is_featured, is_active, created_at)
        );
      `);
    }

    for (const job of careerJobs) {
      await query(
        `INSERT INTO job_posts (title, location, department, employment_type, experience, description, responsibilities, requirements, apply_email, is_active)
         SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE
         WHERE NOT EXISTS (
           SELECT 1 FROM job_posts WHERE title = ? AND employment_type = ? AND is_active = TRUE
         )`,
        [
          job.title,
          job.location,
          job.department,
          job.employment_type,
          job.experience,
          job.description,
          job.responsibilities.join('\n'),
          job.requirements.join('\n'),
          'info@trisetsolutions.com',
          job.title,
          job.employment_type,
        ]
      );
    }

    await query(`
      UPDATE job_posts
      SET department = 'Web Development', updated_at = NOW()
      WHERE department = 'Software Engineering'
        AND title IN ('Web Developer Intern', 'Web Developer')
    `);
  } catch (error) {
    console.warn('[db:warning] Database initialization failed (will continue with limited features):', error.message);
  }
}

module.exports = { databaseType, pool, query, initializeDatabase };
