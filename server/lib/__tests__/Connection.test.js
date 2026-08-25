const WebSocket = require('ws');
const Connection = require('../Connection');

function fakeWs(readyState) {
  return { readyState, send: jest.fn() };
}

describe('Connection', () => {
  test('assigns a unique id and defaults name to that id', () => {
    const a = new Connection(fakeWs(WebSocket.OPEN));
    const b = new Connection(fakeWs(WebSocket.OPEN));
    expect(a.id).not.toBe(b.id);
    expect(a.name).toBe(a.id);
  });

  test('send() forwards the payload when the socket is open', () => {
    const ws = fakeWs(WebSocket.OPEN);
    const connection = new Connection(ws);
    connection.send('hello');
    expect(ws.send).toHaveBeenCalledWith('hello');
  });

  test('send() does nothing when the socket is not open', () => {
    const ws = fakeWs(WebSocket.CLOSED);
    const connection = new Connection(ws);
    connection.send('hello');
    expect(ws.send).not.toHaveBeenCalled();
  });
});
