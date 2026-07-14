const Paddle = require('./Paddle');
const Ball = require('./Ball');
const { BOARD_WIDTH, PADDLE_MARGIN, PADDLE_WIDTH } = require('./constants');

class GameState {
  constructor() {
    this.leftPaddle = new Paddle(PADDLE_MARGIN);
    this.rightPaddle = new Paddle(BOARD_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH);
    this.ball = new Ball();
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.winner = null;
  }

  setInput(side, input) {
    if (side === 'left') this.leftPaddle.setInput(input);
    else if (side === 'right') this.rightPaddle.setInput(input);
  }
}

module.exports = GameState;
