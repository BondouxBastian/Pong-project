const GameState = require('./GameState');
const MESSAGE_TYPES = require('./messageTypes');
const { TICK_RATE } = require('./constants');

let nextRoomId = 1;

class Room {
  constructor() {
    this.id = `room-${nextRoomId++}`;
    this.players = {}; // side -> connection
    this.spectators = new Set();
    this.gameState = new GameState();
    this.started = false;
    this.loopHandle = null;
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
      this.stopLoop();
      this.broadcast({ type: MESSAGE_TYPES.OPPONENT_DISCONNECTED });
    } else {
      this.spectators.delete(connection);
    }
  }

  startIfReady() {
    if (this.isFull() && !this.started) {
      this.started = true;
      this.broadcast({ type: MESSAGE_TYPES.ROOM_READY });
      this.startLoop();
    }
  }

  startLoop() {
    if (this.loopHandle) return;
    const intervalMs = 1000 / TICK_RATE;
    this.loopHandle = setInterval(() => this.tick(), intervalMs);
  }

  stopLoop() {
    if (this.loopHandle) {
      clearInterval(this.loopHandle);
      this.loopHandle = null;
    }
    this.started = false;
  }

  tick() {
    this.gameState.update();
    this.broadcast({ type: MESSAGE_TYPES.GAME_STATE, state: this.gameState.toSnapshot() });

    if (this.gameState.winner) {
      this.broadcast({ type: MESSAGE_TYPES.GAME_OVER, winner: this.gameState.winner });
      this.onGameOver && this.onGameOver(this.gameState.winner);
      this.stopLoop();
    }
  }

  isEmpty() {
    return !this.players.left && !this.players.right && this.spectators.size === 0;
  }

  restart() {
    this.gameState = new GameState();
    this.started = false;
    this.startIfReady();
  }

  broadcast(message) {
    const payload = JSON.stringify(message);
    Object.values(this.players).forEach((conn) => conn && conn.send(payload));
    this.spectators.forEach((conn) => conn.send(payload));
  }
}

module.exports = Room;
