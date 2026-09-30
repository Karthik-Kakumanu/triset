import mysql from 'mysql2/promise';
import { config } from './config.js';

export const pool = config.database ? mysql.createPool(config.database) : null;
export async function query(sql, params = []) {
  if (!pool) throw new Error('MySQL is not configured. Set DB_HOST and related environment variables.');
  const [rows] = await pool.execute(sql, params);
  return rows;
}
