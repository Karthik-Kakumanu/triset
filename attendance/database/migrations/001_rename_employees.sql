-- Run only against a BACKUP/COPY of the existing attendance database.
-- This preserves all attendance employee rows and updates the related foreign key.
-- Do not run this in the shared Hostinger database: its employees table belongs to
-- the documents app.
RENAME TABLE employees TO attendance_employees;
