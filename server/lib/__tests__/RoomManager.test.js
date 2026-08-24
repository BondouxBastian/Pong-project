const RoomManager = require('../RoomManager');

function fakeConnection() {
  return { side: null, room: null, name: 'player', send: jest.fn() };
}

describe('RoomManager', () => {
  test('findOrCreateRoom() creates a room when none exist', () => {
    const manager = new RoomManager();
    const room = manager.findOrCreateRoom();
    expect(room).toBeDefined();
    expect(manager.rooms.size).toBe(1);
  });

  test('a second player joins the same room instead of a new one', () => {
    const manager = new RoomManager();
    const roomA = manager.findOrCreateRoom();
    roomA.addPlayer(fakeConnection());

    const roomB = manager.findOrCreateRoom();
    expect(roomB).toBe(roomA);
  });

  test('a fresh room is created once the current one is full', () => {
    const manager = new RoomManager();
    const roomA = manager.findOrCreateRoom();
    roomA.addPlayer(fakeConnection());
    roomA.addPlayer(fakeConnection());
    roomA.started = true;

    const roomB = manager.findOrCreateRoom();
    expect(roomB).not.toBe(roomA);
  });

  test('findRoomForSpectator() returns null when no game is in progress', () => {
    const manager = new RoomManager();
    manager.findOrCreateRoom();
    expect(manager.findRoomForSpectator()).toBeNull();
  });

  test('findRoomForSpectator() returns a room once it has started', () => {
    const manager = new RoomManager();
    const room = manager.findOrCreateRoom();
    room.started = true;
    expect(manager.findRoomForSpectator()).toBe(room);
  });

  test('removeConnection() deletes the room once it becomes empty', () => {
    const manager = new RoomManager();
    const room = manager.findOrCreateRoom();
    const conn = fakeConnection();
    room.addPlayer(conn);

    manager.removeConnection(conn);

    expect(manager.rooms.has(room.id)).toBe(false);
  });

  test('onGameOver callback receives the room and winning side', () => {
    const onGameOver = jest.fn();
    const manager = new RoomManager(onGameOver);
    const room = manager.findOrCreateRoom();

    room.onGameOver('left');

    expect(onGameOver).toHaveBeenCalledWith(room, 'left');
  });
});
