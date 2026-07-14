const { BOARD_WIDTH, BOARD_HEIGHT, BALL_RADIUS, BALL_SPEED, BALL_MAX_SPEED } = require('./constants');

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

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.handleWallCollision();
  }

  handleWallCollision() {
    if (this.y - this.radius <= 0) {
      this.y = this.radius;
      this.vy *= -1;
    } else if (this.y + this.radius >= BOARD_HEIGHT) {
      this.y = BOARD_HEIGHT - this.radius;
      this.vy *= -1;
    }
  }

  clampSpeed() {
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > BALL_MAX_SPEED) {
      const scale = BALL_MAX_SPEED / speed;
      this.vx *= scale;
      this.vy *= scale;
    }
  }
}

module.exports = Ball;
