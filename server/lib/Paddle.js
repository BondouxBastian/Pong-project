const { BOARD_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED } = require('./constants');

class Paddle {
  constructor(x) {
    this.x = x;
    this.y = (BOARD_HEIGHT - PADDLE_HEIGHT) / 2;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.moveUp = false;
    this.moveDown = false;
  }

  setInput({ up, down }) {
    this.moveUp = !!up;
    this.moveDown = !!down;
  }

  update() {
    if (this.moveUp) {
      this.y -= PADDLE_SPEED;
    }
    if (this.moveDown) {
      this.y += PADDLE_SPEED;
    }
  }
}

module.exports = Paddle;
