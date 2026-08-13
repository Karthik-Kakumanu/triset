function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

function readJson(request, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBytes) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        request.destroy();
      }
    });
    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(Object.assign(new Error('Invalid JSON'), { statusCode: 400 }));
      }
    });
    request.on('error', reject);
  });
}

module.exports = { sendJson, readJson };
