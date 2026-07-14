const http = require('http');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

const Connection = require('./lib/Connection');
const RoomManager = require('./lib/RoomManager');
const MESSAGE_TYPES = require('./lib/messageTypes');

const PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, '..', 'client');

const roomManager = new RoomManager();

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
  ws.on('close', () => handleDisconnect(connection));
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
    case MESSAGE_TYPES.JOIN_QUEUE:
      handleJoinQueue(connection, message);
      break;
    case MESSAGE_TYPES.JOIN_SPECTATE:
      handleJoinSpectate(connection);
      break;
    case MESSAGE_TYPES.INPUT:
      if (connection.room) connection.room.handleInput(connection, message.input);
      break;
    case MESSAGE_TYPES.REQUEST_REMATCH:
      if (connection.room) connection.room.restart();
      break;
    default:
      connection.send(JSON.stringify({ type: MESSAGE_TYPES.ERROR, message: 'unknown_type' }));
  }
}

function handleJoinSpectate(connection) {
  const room = roomManager.findRoomForSpectator();
  if (!room) {
    connection.send(JSON.stringify({ type: MESSAGE_TYPES.ERROR, message: 'no_active_room' }));
    return;
  }
  room.addSpectator(connection);
  connection.send(JSON.stringify({ type: MESSAGE_TYPES.SPECTATE_JOINED, roomId: room.id }));
}

function handleDisconnect(connection) {
  roomManager.removeConnection(connection);
}

function handleJoinQueue(connection, message) {
  if (message.name) connection.name = String(message.name).slice(0, 24);

  const room = roomManager.findOrCreateRoom();
  const side = room.addPlayer(connection);

  if (!side) {
    connection.send(JSON.stringify({ type: MESSAGE_TYPES.ERROR, message: 'room_full' }));
    return;
  }

  connection.send(JSON.stringify({ type: MESSAGE_TYPES.WAITING_FOR_OPPONENT, side, roomId: room.id }));
  room.startIfReady();
}

server.listen(PORT, () => {
  console.log(`Pong server listening on port ${PORT}`);
});
