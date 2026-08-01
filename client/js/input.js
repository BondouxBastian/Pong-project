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

  return { bind, state };
})();
