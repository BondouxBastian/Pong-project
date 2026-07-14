const MESSAGE_TYPES = {
  // client -> server
  JOIN_QUEUE: 'join_queue',
  JOIN_SPECTATE: 'join_spectate',
  INPUT: 'input',
  REQUEST_REMATCH: 'request_rematch',
  GET_LEADERBOARD: 'get_leaderboard',

  // server -> client
  WELCOME: 'welcome',
  WAITING_FOR_OPPONENT: 'waiting_for_opponent',
  ROOM_READY: 'room_ready',
  GAME_STATE: 'game_state',
  GAME_OVER: 'game_over',
  OPPONENT_DISCONNECTED: 'opponent_disconnected',
  SPECTATE_JOINED: 'spectate_joined',
  LEADERBOARD: 'leaderboard',
  ERROR: 'error',
};

module.exports = MESSAGE_TYPES;
