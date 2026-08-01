const Network = (() => {
  let socket = null;
  let handlers = {};

  function connect() {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(`${protocol}//${location.host}`);

    socket.addEventListener('open', () => handlers.open && handlers.open());
    socket.addEventListener('close', () => handlers.close && handlers.close());
    socket.addEventListener('error', (err) => handlers.error && handlers.error(err));
  }

  return { connect };
})();
