const WebSocket = require('ws');

let nextConnectionId = 1;

class Connection {
  constructor(ws) {
    this.id = `player-${nextConnectionId++}`;
    this.ws = ws;
    this.side = null;
    this.room = null;
    this.name = this.id;
  }

  send(payload) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(payload);
    }
  }
}

module.exports = Connection;
