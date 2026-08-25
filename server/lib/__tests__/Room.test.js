const Room = require('../Room');
const MESSAGE_TYPES = require('../messageTypes');

function fakeConnection() {
  return { side: null, room: null, name: 'player', send: jest.fn() };
}

describe('Room', () => {
  test('assigns the first player to left and the second to right', () => {
    const room = new Room();
    const p1 = fakeConnection();
    const p2 = fakeConnection();

    expect(room.addPlayer(p1)).toBe('left');
    expect(room.addPlayer(p2)).toBe('right');
  });

  test('rejects a third player', () => {
    const room = new Room();
    room.addPlayer(fakeConnection());
    room.addPlayer(fakeConnection());

    expect(room.addPlayer(fakeConnection())).toBeNull();
  });

  test('a connection that joins as a spectator does not take a player slot', () => {
    const room = new Room();
    const spectator = fakeConnection();
    room.addSpectator(spectator);

    expect(spectator.side).toBe('spectator');
    expect(room.isFull()).toBe(false);
  });

  test('starts the game loop only once both slots are filled', () => {
    const room = new Room();
    room.addPlayer(fakeConnection());
    room.startIfReady();
    expect(room.started).toBe(false);

    room.addPlayer(fakeConnection());
    room.startIfReady();
    expect(room.started).toBe(true);

    room.stopLoop();
  });

  test('handleInput() is ignored for a spectator', () => {
    const room = new Room();
    const spectator = fakeConnection();
    room.addSpectator(spectator);
    const spy = jest.spyOn(room.gameState, 'setInput');

    room.handleInput(spectator, { up: true, down: false });

    expect(spy).not.toHaveBeenCalled();
  });

  test('handleInput() forwards player input to the game state', () => {
    const room = new Room();
    const player = fakeConnection();
    room.addPlayer(player);
    const spy = jest.spyOn(room.gameState, 'setInput');

    room.handleInput(player, { up: true, down: false });

    expect(spy).toHaveBeenCalledWith('left', { up: true, down: false });
  });

  test('removing a player stops the loop and notifies everyone of the disconnect', () => {
    const room = new Room();
    const p1 = fakeConnection();
    const p2 = fakeConnection();
    room.addPlayer(p1);
    room.addPlayer(p2);
    room.startIfReady();

    room.removeConnection(p1);

    expect(room.started).toBe(false);
    expect(p2.send).toHaveBeenCalledWith(
      JSON.stringify({ type: MESSAGE_TYPES.OPPONENT_DISCONNECTED })
    );
  });

  test('removing a spectator does not affect players or stop the loop', () => {
    const room = new Room();
    room.addPlayer(fakeConnection());
    room.addPlayer(fakeConnection());
    room.startIfReady();
    const spectator = fakeConnection();
    room.addSpectator(spectator);

    room.removeConnection(spectator);

    expect(room.spectators.size).toBe(0);
    expect(room.started).toBe(true);
    room.stopLoop();
  });

  test('tick() broadcasts GAME_OVER and stops the loop once there is a winner', () => {
    const room = new Room();
    const p1 = fakeConnection();
    const p2 = fakeConnection();
    room.addPlayer(p1);
    room.addPlayer(p2);
    room.gameState.winner = 'left';

    room.tick();

    expect(p1.send).toHaveBeenCalledWith(
      JSON.stringify({ type: MESSAGE_TYPES.GAME_OVER, winner: 'left' })
    );
    expect(room.started).toBe(false);
  });

  test('restart() replaces the game state and restarts the loop if the room is full', () => {
    const room = new Room();
    room.addPlayer(fakeConnection());
    room.addPlayer(fakeConnection());
    room.gameState.winner = 'left';

    room.restart();

    expect(room.gameState.winner).toBeNull();
    expect(room.started).toBe(true);
    room.stopLoop();
  });

  test('isEmpty() is true only when no players and no spectators remain', () => {
    const room = new Room();
    expect(room.isEmpty()).toBe(true);

    const player = fakeConnection();
    room.addPlayer(player);
    expect(room.isEmpty()).toBe(false);

    room.removeConnection(player);
    expect(room.isEmpty()).toBe(true);
  });

  test('broadcast() sends the payload to every player and spectator', () => {
    const room = new Room();
    const p1 = fakeConnection();
    const p2 = fakeConnection();
    const spectator = fakeConnection();
    room.addPlayer(p1);
    room.addPlayer(p2);
    room.addSpectator(spectator);

    room.broadcast({ type: 'test' });

    const expected = JSON.stringify({ type: 'test' });
    expect(p1.send).toHaveBeenCalledWith(expected);
    expect(p2.send).toHaveBeenCalledWith(expected);
    expect(spectator.send).toHaveBeenCalledWith(expected);
  });
});
