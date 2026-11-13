# Attendance module

This copy is integrated into the TRISET main website and is served at
`https://trisetsolutions.com/attendance`. It is not a separate Hostinger Web App:
the main website backend mounts this Express application when
`ATTENDANCE_ENABLED=true`.

## Local setup

From the repository root, install the module dependencies with
`npm install --prefix attendance`. Configure the shared MySQL `DB_HOST`,
`DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` values, plus:

- `ATTENDANCE_ENABLED=true`
- `ATTENDANCE_JWT_SECRET` (use a unique, long random secret)
- `ATTENDANCE_ADMIN_NAME`, `ATTENDANCE_ADMIN_EMAIL`, and
  `ATTENDANCE_ADMIN_PASSWORD` for initial setup only

Then start the main website with `npm start`. The attendance module creates its
schema on startup. It uses `attendance_employees` so it does not conflict with
the documents app's `employees` table.

## Existing attendance data

Do not point the updated app at existing attendance data until that data is
backed up and migrated. Follow the backup, isolated-copy, import, and row-count
verification steps in [HOSTINGER_DEPLOYMENT.md](../HOSTINGER_DEPLOYMENT.md).
The one-time migration at
`database/migrations/001_rename_employees.sql` must run only on a verified copy
of the old attendance database, never on the shared destination database.

The original standalone source repository is separate. Make integration changes
in this root-level `attendance/` copy; do not copy its `.git`, `.env`,
`node_modules`, or storage into this repository.
