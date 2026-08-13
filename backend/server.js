const http = require('http');
const { handleRequest } = require('./src/routes/router');
const { loadEnv } = require('./src/config/env');
const { initializeDatabase } = require('./src/config/db');

loadEnv();

const startServer = async () => {
  await initializeDatabase();

  const port = Number(process.env.PORT || 4173);
  const host = process.env.HOST || '127.0.0.1';

  const server = http.createServer((request, response) => {
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

