const InputHandler = (() => {
  const state = { up: false, down: false };

  function bind() {
    window.addEventListener('keydown', (e) => setKey(e.code, true));
    window.addEventListener('keyup', (e) => setKey(e.code, false));
  }

  function setKey(code, isDown) {
    if (code === 'ArrowUp' || code === 'KeyW') state.up = isDown;
    if (code === 'ArrowDown' || code === 'KeyS') state.down = isDown;
  }

  let sendInterval = null;

  function startSending(sendFn, intervalMs = 50) {
    stopSending();
    sendInterval = setInterval(() => sendFn({ up: state.up, down: state.down }), intervalMs);
  }

  function stopSending() {
    if (sendInterval) {
      clearInterval(sendInterval);
      sendInterval = null;
    }
  }

  return { bind, state, startSending, stopSending };
})();
