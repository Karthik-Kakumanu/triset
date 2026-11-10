# Hostinger deployment and cutover

This repository contains two independent Node.js applications:

- Main website: repository root; public domain `trisetsolutions.com` (and `www`).
- Documents app: `documents-app`; subdomain `documents.trisetsolutions.com`.

The main website supports its existing PostgreSQL database during the transition and uses MySQL on Hostinger when `DATABASE_URL` is unset. The documents app already uses MySQL. Do not remove the Render/Railway services, databases, or backups until both Hostinger apps pass the checks below and all data/files have been copied.

## Before starting

In hPanel, confirm that the Business plan exposes **Node.js Web Apps** and supports two separately configured apps with custom domains. If it does not, stop before changing DNS; these Node servers need a Node.js host or VPS, not static-only hosting.

Confirm domain ownership and DNS management. Hostinger's app setup will show the actual record values to use. Do not guess A/CNAME values or change nameservers as part of this deployment.

## 1. Back up existing production data

Keep the current apps online while preparing Hostinger. Make separate backups of:

- The main site's PostgreSQL `job_posts` rows. Export columns in this order: `id, title, location, department, employment_type, experience, description, responsibilities, requirements, apply_email, apply_url, image_url, is_featured, is_active, created_at, updated_at`. Convert `is_featured` and `is_active` to `0`/`1` for MySQL import. This is the only PostgreSQL table used by the main site's backend.
- The documents app's MySQL database, using a complete SQL export.
- Main website files in `storage/`, including contact submissions and admin content.
- Documents app PDFs in `documents-app/storage/pdfs/`.

Store backups privately, not in Git or chat. Record row counts and retain the original backups unchanged.

## 2. Create Hostinger databases

Create one MySQL database and user in hPanel. The two apps can share it: the website uses `job_posts`, while the documents app uses its own tables (`users`, `clients`, `documents`, and others). Use the exact database host, username, database name, and port shown by hPanel.

Import `backend/migrations/001_job_posts.mysql.sql` into the shared database, then import the PostgreSQL jobs CSV and verify its row count. Import the documents app's schema and data into that same database without `CREATE DATABASE` or `USE` statements, so the import cannot switch to or overwrite a different database. Keep the original backups unchanged.

With one shared database, both apps use the same database credentials and can access each other's tables. If hPanel supports separate users with table-level grants, you can restrict each app to its own tables; otherwise treat the shared credentials as secrets for both apps.

## 3. Deploy the main website

Create a Node.js Web App using the repository root as the project root:

- Build command: `npm install && npm run build && npm install --prefix backend`
- Start command: `node backend/server.js`
- Node version: 18 or newer
- Domain: attach `trisetsolutions.com` and `www.trisetsolutions.com` using the domain options provided by hPanel.

Set these app environment variables in hPanel. Do not commit their values. Do not set `DATABASE_URL` on Hostinger; any non-empty value selects PostgreSQL instead of the Hostinger MySQL `DB_*` settings. Keep the existing `DATABASE_URL` on Render during the rollback period.

```text
NODE_ENV=production
HOST=0.0.0.0
DB_HOST=<database host from hPanel>
DB_PORT=3306
DB_USER=<shared Hostinger database user>
DB_PASSWORD=<shared Hostinger database password>
DB_NAME=<shared Hostinger database name>
ADMIN_USERNAME=<new unique admin username>
ADMIN_PASSWORD=<new strong password>
ADMIN_TOKEN=<new long random token>
CONTACT_RECEIVER=info@trisetsolutions.com
```

Add the `EMAIL_*` variables from `.env.example` if the site must send contact/job emails. `PORT` is supplied by the hosting platform; do not hard-code it.

Copy backed-up main-site files into the app's persistent `storage/` directory after deployment. Confirm that deployments/restarts do not erase this directory.

## 4. Deploy the documents app

Create a second Node.js Web App with project root `documents-app`:

- Build command: `npm install --include=dev && npm run build`
- Start command: `npm start`
- Node version: 22
- Domain: `documents.trisetsolutions.com`

Set these environment variables in hPanel:

```text
NODE_ENV=production
CLIENT_ORIGIN=https://documents.trisetsolutions.com
PUBLIC_ORIGIN=https://documents.trisetsolutions.com
JWT_SECRET=<new long random secret>
DB_HOST=<database host from hPanel>
DB_PORT=3306
DB_USER=<shared Hostinger database user>
DB_PASSWORD=<shared Hostinger database password>
DB_NAME=<shared Hostinger database name>
PDF_STORAGE_PATH=./storage/pdfs
```

Copy backed-up PDFs into the configured persistent storage path. Seed the initial admin using Hostinger's app terminal/SSH after the database and environment variables are ready:

```text
ADMIN_EMAIL=<admin email> ADMIN_PASSWORD=<new strong password> npm run seed:admin
```

Do not reuse the example credentials in the existing deployment notes. Do not run the seed command repeatedly unless you intend to change/create that account.

## 5. Verify before changing DNS

Test the Hostinger-assigned preview URLs first:

1. Main site `/api/health` returns `ok: true` and `database: true`.
2. Main site pages and static assets load; contact submission is stored; admin login, job list, create/update/delete, and overview work.
3. Documents app `/api/health` returns `ok: true` and `database: true`.
4. Documents admin login works; existing clients/documents appear; create and download a test PDF; verify a share link.
5. Restart/redeploy both apps and confirm database rows, website storage, and PDFs remain.
6. Compare source and destination row counts and inspect the migrated data.

If any check fails, keep DNS and the Render/Railway services unchanged and fix the Hostinger deployment first.

## 6. DNS cutover and rollback

After all checks pass, attach the domains in hPanel and update only the DNS records Hostinger specifies for the main domain, `www`, and `documents`. DNS may be managed outside Hostinger; use the authoritative DNS provider shown for the domain. Do not change nameservers unless you intentionally want to move all DNS/email services.

Keep Render/Railway apps and original databases available during DNS propagation. If the Hostinger sites fail, restore the previous DNS records and continue serving from the existing deployments. Decommission old services only after the new domains, data, and persistent files are stable.

## What cannot be completed from this repository

This code change prepares the apps for Hostinger MySQL while keeping PostgreSQL support for a Render rollback, but it cannot create Hostinger resources, export private production data, or update DNS. Those actions require your hPanel/DNS access and the current database/file backups. Never share passwords or database URLs in chat or commit them to the repository.
