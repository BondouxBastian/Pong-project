(function init() {
  Renderer.drawStaticScene();
  InputHandler.bind();
  Network.connect();

  Network.on('open', () => {
    UI.setLobbyStatus('Connecté au serveur.');
  });

  Network.on('close', () => {
    UI.setLobbyStatus('Connexion perdue.');
  });

  Network.on('welcome', (message) => {
    ClientState.playerId = message.id;
  });

  Network.on('waiting_for_opponent', (message) => {
    ClientState.side = message.side;
    ClientState.roomId = message.roomId;
    UI.showScreen('game');
    UI.setGameStatus('En attente d\'un adversaire...');
  });

  Network.on('room_ready', () => {
    UI.setGameStatus('');
    InputHandler.startSending((input) => Network.send('input', { input }));
  });

  Network.on('game_state', (message) => {
    ClientState.latestGameState = message.state;
    Renderer.drawState(message.state);
    UI.updateScore(message.state);
  });

  Network.on('game_over', (message) => {
    InputHandler.stopSending();
    const won = message.winner === ClientState.side;
    UI.setGameOverTitle(ClientState.side ? (won ? 'Victoire !' : 'Défaite') : 'Partie terminée');
    UI.showScreen('gameover');
  });

  Network.on('opponent_disconnected', () => {
    InputHandler.stopSending();
    UI.setGameOverTitle('Adversaire déconnecté');
    UI.showScreen('gameover');
  });

  Network.on('spectate_joined', () => {
    UI.showScreen('game');
    UI.setGameStatus('Mode spectateur');
  });

  Network.on('leaderboard', (message) => {
    UI.renderLeaderboard(message.ranking);
  });

  document.getElementById('play-btn').addEventListener('click', () => {
    const name = document.getElementById('name-input').value.trim();
    Network.send('join_queue', { name });
  });

  document.getElementById('spectate-btn').addEventListener('click', () => {
    Network.send('join_spectate');
  });

  document.getElementById('leaderboard-btn').addEventListener('click', () => {
    Network.send('get_leaderboard');
    UI.showScreen('leaderboard');
  });

  document.getElementById('rematch-btn').addEventListener('click', () => {
    Network.send('request_rematch');
    UI.showScreen('game');
  });

  document.getElementById('back-to-lobby-btn').addEventListener('click', () => {
    UI.showScreen('lobby');
  });

  document.getElementById('leaderboard-back-btn').addEventListener('click', () => {
    UI.showScreen('lobby');
  });
})();
