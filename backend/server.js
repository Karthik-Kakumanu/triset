const http = require('http');
const { loadEnv } = require('./src/config/env');

loadEnv();

const { handleRequest } = require('./src/routes/router');
const { initializeDatabase } = require('./src/config/db');
const attendanceEnabled = String(process.env.ATTENDANCE_ENABLED || '').toLowerCase() === 'true';
const attendance = attendanceEnabled ? require('../attendance/server') : null;

const startServer = async () => {
  await initializeDatabase();
  if (attendance) {
    await attendance.initDatabase();
    attendance.startAutoCheckoutScheduler();
  }

  const port = Number(process.env.PORT || 4173);
  const host = process.env.HOST || '0.0.0.0';

  const server = http.createServer((request, response) => {
    if (attendance) {
      const url = new URL(request.url, 'http://localhost');
      if (url.pathname === '/attendance' && (request.method === 'GET' || request.method === 'HEAD')) {
        response.writeHead(308, { Location: `/attendance/${url.search}` });
        response.end();
        return;
      }
      if (url.pathname.startsWith('/attendance/')) {
        request.url = `${url.pathname.slice('/attendance'.length)}${url.search}`;
        attendance.app(request, response);
        return;
      }
    }

    handleRequest(request, response).catch((error) => {
      console.error('[server:error]', error);
      response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ ok: false, error: 'Internal server error' }));
    });
  });

  server.listen(port, host, () => {
    console.log(`TRISET server running at http://${host}:${port}/`);
  });
};

startServer().catch((error) => {
  console.error('[startup:error]', error);
  process.exit(1);
});
