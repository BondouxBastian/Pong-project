const http = require('http');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

const Connection = require('./lib/Connection');
const MESSAGE_TYPES = require('./lib/messageTypes');

const PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, '..', 'client');

const server = http.createServer((req, res) => {
  const filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(CLIENT_DIR, filePath);

  if (!fullPath.startsWith(CLIENT_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentTypeFor(fullPath) });
    res.end(data);
  });
});

function contentTypeFor(filePath) {
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.js')) return 'application/javascript';
  return 'application/octet-stream';
}

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const connection = new Connection(ws);
  handleConnect(connection);

  ws.on('message', (raw) => handleMessage(connection, raw));
});

function handleConnect(connection) {
  connection.send(JSON.stringify({ type: MESSAGE_TYPES.WELCOME, id: connection.id }));
}

function handleMessage(connection, raw) {
  let message;
  try {
    message = JSON.parse(raw);
  } catch (err) {
    connection.send(JSON.stringify({ type: MESSAGE_TYPES.ERROR, message: 'invalid_json' }));
    return;
  }

  switch (message.type) {
    default:
      connection.send(JSON.stringify({ type: MESSAGE_TYPES.ERROR, message: 'unknown_type' }));
  }
}

server.listen(PORT, () => {
  console.log(`Pong server listening on port ${PORT}`);
});
