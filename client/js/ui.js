/* exported UI */
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

  const scoreLeftEl = document.getElementById('score-left');
  const scoreRightEl = document.getElementById('score-right');
  const gameStatusEl = document.getElementById('game-status');
  const lobbyStatusEl = document.getElementById('lobby-status');
  const gameoverTitleEl = document.getElementById('gameover-title');

  function updateScore(state) {
    scoreLeftEl.textContent = state.scoreLeft;
    scoreRightEl.textContent = state.scoreRight;
  }

  function setGameStatus(text) {
    gameStatusEl.textContent = text;
  }

  function setLobbyStatus(text) {
    lobbyStatusEl.textContent = text;
  }

  function setGameOverTitle(text) {
    gameoverTitleEl.textContent = text;
  }

  const leaderboardBodyEl = document.getElementById('leaderboard-body');

  function renderLeaderboard(ranking) {
    leaderboardBodyEl.innerHTML = '';
    ranking.forEach((entry) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${entry.name}</td><td>${entry.wins}</td><td>${entry.losses}</td>`;
      leaderboardBodyEl.appendChild(row);
    });
  }

  return {
    showScreen,
    updateScore,
    setGameStatus,
    setLobbyStatus,
    setGameOverTitle,
    renderLeaderboard,
  };
})();
