/* exported InputHandler */
const InputHandler = (() => {
  const state = { up: false, down: false };

  function bind() {
    window.addEventListener('keydown', (e) => setKey(e.code, true));
    window.addEventListener('keyup', (e) => setKey(e.code, false));
    bindTouch();
  }

  function setKey(code, isDown) {
    if (code === 'ArrowUp' || code === 'KeyW') state.up = isDown;
    if (code === 'ArrowDown' || code === 'KeyS') state.down = isDown;
  }

  function bindTouch() {
    const canvas = document.getElementById('board');
    if (!canvas) return;

    const setFromTouch = (touch) => {
      const rect = canvas.getBoundingClientRect();
      const relativeY = touch.clientY - rect.top;
      state.up = relativeY < rect.height / 2;
      state.down = !state.up;
    };

    const clear = () => {
      state.up = false;
      state.down = false;
    };

    canvas.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        setFromTouch(e.touches[0]);
      },
      { passive: false }
    );

    canvas.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        setFromTouch(e.touches[0]);
      },
      { passive: false }
    );

    canvas.addEventListener('touchend', clear);
    canvas.addEventListener('touchcancel', clear);
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
