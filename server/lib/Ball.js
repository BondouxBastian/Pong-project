const { BOARD_WIDTH, BOARD_HEIGHT, BALL_RADIUS, BALL_SPEED } = require('./constants');

class Ball {
  constructor() {
    this.radius = BALL_RADIUS;
    this.reset(Math.random() < 0.5 ? -1 : 1);
  }

  reset(direction = 1) {
    this.x = BOARD_WIDTH / 2;
    this.y = BOARD_HEIGHT / 2;
    const angle = Math.random() * 0.6 - 0.3;
    this.vx = Math.cos(angle) * BALL_SPEED * direction;
    this.vy = Math.sin(angle) * BALL_SPEED;
  }
}

module.exports = Ball;
