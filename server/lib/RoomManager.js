const Room = require('./Room');

class RoomManager {
  constructor(onGameOver) {
    this.rooms = new Map();
    this.onGameOver = onGameOver;
  }

  findOrCreateRoom() {
    for (const room of this.rooms.values()) {
      if (!room.isFull() && !room.started) return room;
    }
    const room = new Room();
    room.onGameOver = (winnerSide) => this.onGameOver && this.onGameOver(room, winnerSide);
    this.rooms.set(room.id, room);
    return room;
  }
}

module.exports = RoomManager;
