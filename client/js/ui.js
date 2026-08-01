const UI = (() => {
  const screens = {
    lobby: document.getElementById('lobby'),
    game: document.getElementById('game-screen'),
    gameover: document.getElementById('gameover-screen'),
    leaderboard: document.getElementById('leaderboard-screen'),
  };

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.add('hidden'));
    screens[name].classList.remove('hidden');
  }

  return { showScreen };
})();
