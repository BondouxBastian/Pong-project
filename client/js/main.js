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
})();
