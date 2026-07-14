const GameState = require('./GameState');
const MESSAGE_TYPES = require('./messageTypes');

let nextRoomId = 1;

class Room {
  constructor() {
    this.id = `room-${nextRoomId++}`;
    this.players = {}; // side -> connection
    this.spectators = new Set();
    this.gameState = new GameState();
    this.started = false;
  }

  isFull() {
    return !!this.players.left && !!this.players.right;
  }

  addPlayer(connection) {
    const side = !this.players.left ? 'left' : !this.players.right ? 'right' : null;
    if (!side) return null;
    this.players[side] = connection;
    connection.side = side;
    connection.room = this;
    return side;
  }

  addSpectator(connection) {
    this.spectators.add(connection);
    connection.room = this;
    connection.side = 'spectator';
  }

  removeConnection(connection) {
    if (connection.side === 'left' || connection.side === 'right') {
      delete this.players[connection.side];
      this.broadcast({ type: MESSAGE_TYPES.OPPONENT_DISCONNECTED });
    } else {
      this.spectators.delete(connection);
    }
  }

  isEmpty() {
    return !this.players.left && !this.players.right && this.spectators.size === 0;
  }

  broadcast(message) {
    const payload = JSON.stringify(message);
    Object.values(this.players).forEach((conn) => conn && conn.send(payload));
    this.spectators.forEach((conn) => conn.send(payload));
  }
}

module.exports = Room;
