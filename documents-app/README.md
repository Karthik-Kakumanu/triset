# TRISET Documents

Separate internal document-generation application for TRISET Solutions India Private Limited. The existing public TRISET website remains outside this application.

## Local setup

```powershell
cd documents-app
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5174`. The interface runs in demo mode until MySQL is configured. The API listens on `http://localhost:4174`.

For MySQL, create a database user and run `migrations/001_initial.sql`, then set the `DB_*` variables in `.env`. Secrets are never stored in source code. The backend recalculates PDF totals from submitted line items and stores generated PDFs under the configurable `PDF_STORAGE_PATH`; production deployments should use persistent Hostinger storage or an object-storage adapter.

## Production / Hostinger

Build the frontend with `npm run build`, set `NODE_ENV=production`, configure `PORT` to the Hostinger assigned port, configure the MySQL and `JWT_SECRET` variables, and start with `npm start`. The backend serves `dist` in production and listens on `process.env.PORT`. Set `CLIENT_ORIGIN` to `https://documents.trisetsolutions.com` and configure the subdomain proxy to the Node Web App.

The migration includes users, company settings, clients, employees, editable service categories/services, quotations, invoices, purchase orders, payslips, and document history with foreign keys and search indexes. Seed the first admin user through your deployment secret/bootstrap process rather than committing a password.
