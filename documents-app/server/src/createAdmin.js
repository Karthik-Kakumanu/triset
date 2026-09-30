import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.');
const passwordHash = await bcrypt.hash(password, 12);
await query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, \'Admin\') ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = \'Admin\'', [email, passwordHash]);
console.log(`Admin user ready: ${email}`);
