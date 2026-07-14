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

  findRoomForSpectator() {
    for (const room of this.rooms.values()) {
      if (room.started) return room;
    }
    return null;
  }

  removeConnection(connection) {
    const room = connection.room;
    if (!room) return;
    room.removeConnection(connection);
    if (room.isEmpty()) {
      this.rooms.delete(room.id);
    }
  }
}

module.exports = RoomManager;
