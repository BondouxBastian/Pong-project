const GameState = require('./GameState');

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
}

module.exports = Room;
