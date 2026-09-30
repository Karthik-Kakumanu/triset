# Hostinger deployment plan

The target architecture is one Hostinger Node.js Web App:

`documents.trisetsolutions.com -> Hostinger Node.js app -> Hostinger MySQL`

Render and Railway are not needed after migration. Do not delete the Render or Railway projects until the Hostinger health check, login, database migration, PDF download, and share-link tests pass.

## 1. Create the Hostinger database

In hPanel open `Websites -> Dashboard -> Databases -> Management`, create a MySQL database, user, and password. Hostinger documents the normal database host as `localhost` and port `3306`. Import `migrations/001_initial.sql` in phpMyAdmin. The migration creates all document tables and indexes.

## 2. Upload the app

Deploy `documents-app` as a Node.js Web App from GitHub or upload the folder. The important project root is `documents-app`, not the existing public website root.

Use these settings:

- Node version: 20 or newer
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Application port: use the port Hostinger provides through `PORT`
- Domain: `documents.trisetsolutions.com`

## 3. Add environment variables

```text
NODE_ENV=production
CLIENT_ORIGIN=https://documents.trisetsolutions.com
PUBLIC_ORIGIN=https://documents.trisetsolutions.com
JWT_SECRET=<long-random-secret>
DB_HOST=localhost
DB_PORT=3306
DB_USER=<Hostinger database user>
DB_PASSWORD=<Hostinger database password>
DB_NAME=<Hostinger database name>
PDF_STORAGE_PATH=./storage/pdfs
```

Never paste these values into GitHub or source files. Restart/redeploy after saving environment variables.

## 4. Verify in this order

1. Open `https://documents.trisetsolutions.com/api/health` and confirm `ok:true` and `database:true`.
2. Seed the first admin user through a controlled bootstrap process, then verify login.
3. Create a client and confirm it appears in phpMyAdmin.
4. Generate a PDF and verify the browser downloads/opens it.
5. Create a share link and open it in a private browser window.
6. Only after all six checks pass, switch off Render/Railway.

Hostinger provides the hosting environment, but it cannot migrate the existing Render/Railway data automatically. Export any existing production data first, map it into the MySQL schema, then import it into Hostinger.

To create the first admin from SSH after setting the database environment variables, run:

```bash
ADMIN_EMAIL=admin@trisetsolutions.com ADMIN_PASSWORD='use-a-new-12-character-password' npm run seed:admin
```
