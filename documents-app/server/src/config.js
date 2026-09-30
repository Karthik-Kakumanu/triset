import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const config = {
  port: Number(process.env.PORT || 4174),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5174',
  publicOrigin: process.env.PUBLIC_ORIGIN || process.env.CLIENT_ORIGIN || 'http://localhost:5174',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
  pdfStoragePath: path.resolve(root, process.env.PDF_STORAGE_PATH || './storage/pdfs'),
  database: process.env.DB_HOST ? {
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME, waitForConnections: true, connectionLimit: 10
  } : null
};
