# Hostinger deployment and cutover

This repository contains two Node.js applications:

- Main website and attendance app: repository root; public domain `trisetsolutions.com` (attendance at `/attendance`).
- Documents app: `documents-app`; subdomain `documents.trisetsolutions.com`.

The main website supports its existing PostgreSQL database during the transition and uses MySQL on Hostinger when `DATABASE_URL` is unset. The documents app already uses MySQL. Attendance is mounted inside the main website's Node process and uses the same MySQL database, with its employee table named `attendance_employees` to avoid the documents app's `employees` table. Do not remove the Render services, databases, or backups until both Hostinger apps pass the checks below and all data/files have been copied.

## Before starting

In hPanel, confirm that the Business plan exposes **Node.js Web Apps** and supports two separately configured apps with custom domains. If it does not, stop before changing DNS; these Node servers need a Node.js host or VPS, not static-only hosting.

Confirm domain ownership and DNS management. Hostinger's app setup will show the actual record values to use. Do not guess A/CNAME values or change nameservers as part of this deployment. The earlier hPanel inspection showed no deployed Web Apps and the existing sites listed as PHP/HTML; stage the Node app on its Hostinger preview URL first, without replacing the live site.

## 1. Back up existing production data

Keep the current apps online while preparing Hostinger. Make separate backups of:

- The main site's PostgreSQL `job_posts` rows. Export columns in this order: `id, title, location, department, employment_type, experience, description, responsibilities, requirements, apply_email, apply_url, image_url, is_featured, is_active, created_at, updated_at`. Convert `is_featured` and `is_active` to `0`/`1` for MySQL import. This is the only PostgreSQL table used by the main site's backend.
- The documents app's MySQL database, using a complete SQL export.
- Main website files in `storage/`, including contact submissions and admin content.
- Documents app PDFs in `documents-app/storage/pdfs/`.

Store backups privately, not in Git or chat. Record row counts and retain the original backups unchanged.

## 2. Create Hostinger database and prepare attendance data

Create one MySQL database and user in hPanel. The website and attendance module share it with the documents app: the website uses `job_posts`; documents uses tables including `users`, `employees`, and `documents`; attendance uses `admins`, `attendance_employees`, `attendance_sessions`, `breaks`, `audit_logs`, and `user_sessions`. Use the exact database host, username, database name, and port shown by hPanel.

Import `backend/migrations/001_job_posts.mysql.sql` into the shared database, then import the PostgreSQL jobs CSV and verify its row count. Import the documents app's schema and data into that same database without `CREATE DATABASE` or `USE` statements, so the import cannot switch to or overwrite a different database.

If attendance records already exist, do not start the new app against the destination database until the attendance data has been migrated. First make and verify a full backup of the current attendance database. On an isolated copy of that backup (never the live source or shared destination), run `attendance/database/migrations/001_rename_employees.sql`; it renames the attendance `employees` table to `attendance_employees` and keeps its records and foreign key. Export only the attendance tables listed above from that copy, import them into the shared database, and compare each table's row count with the backup. Keep the original backup unchanged. Do not run that rename script in the shared destination: its `employees` table belongs to the documents app. If you cannot confidently identify the source database and verify the backup/counts, stop and get database support before proceeding.

With one shared database, both apps use the same database credentials and can access each other's tables. If hPanel supports separate users with table-level grants, you can restrict each app to its own tables; otherwise treat the shared credentials as secrets for both apps.

## 3. Deploy the main website

Create a Node.js Web App using the repository root as the project root:

- Build command: `npm install && npm run build && npm install --prefix backend && npm install --prefix attendance`
- Start command: `node backend/server.js`
- Node version: 22
- Domain: use the Hostinger preview URL for staging. Attach `trisetsolutions.com` and `www.trisetsolutions.com` only after the staging checks pass.

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
ATTENDANCE_ENABLED=true
ATTENDANCE_JWT_SECRET=<a different long random secret>
ATTENDANCE_COOKIE_NAME=attendance_session
ATTENDANCE_ADMIN_NAME=<initial attendance admin name>
ATTENDANCE_ADMIN_EMAIL=<initial attendance admin email>
ATTENDANCE_ADMIN_PASSWORD=<new strong attendance admin password>
```

Add the `EMAIL_*` variables from `.env.example` if the site must send contact/job emails. `PORT` is supplied by the hosting platform; do not hard-code it. Attendance uses the same `DB_*` values as the main website but its own JWT secret and admin credentials. The attendance admin is created only if the `admins` table is empty; importing the existing attendance tables first preserves the current accounts and records.

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
3. Attendance `/attendance/` loads with its CSS and logo; `/attendance/health` returns `ok: true`; admin and employee login work; existing attendance records and CSV export are correct.
4. Documents app `/api/health` returns `ok: true` and `database: true`.
5. Documents admin login works; existing clients/documents appear; create and download a test PDF; verify a share link.
6. Restart/redeploy both apps and confirm database rows, website storage, and PDFs remain.
7. Compare source and destination row counts and inspect the migrated data.

If any check fails, keep DNS and the Render/Railway services unchanged and fix the Hostinger deployment first.

## 6. DNS cutover and rollback

After all checks pass, attach the domains in hPanel and update only the DNS records Hostinger specifies for the main domain, `www`, and `documents`. Attendance needs no separate DNS record because it is served at `trisetsolutions.com/attendance` by the main Node app. DNS may be managed outside Hostinger; use the authoritative DNS provider shown for the domain. Do not change nameservers unless you intentionally want to move all DNS/email services.

Keep Render/Railway apps and original databases available during DNS propagation. If the Hostinger sites fail, restore the previous DNS records and continue serving from the existing deployments. Decommission old services only after the new domains, data, and persistent files are stable.

## What cannot be completed from this repository

This code change prepares the apps for Hostinger MySQL while keeping PostgreSQL support for a Render rollback, and mounts attendance only when `ATTENDANCE_ENABLED=true`. It cannot create Hostinger resources, export private production data, or update DNS. Those actions require your hPanel/DNS access and the current database/file backups. Never share passwords or database URLs in chat or commit them to the repository. The original `triset-attendance` repository remains separate; the deployable integration copy is `attendance/` in this repository.
