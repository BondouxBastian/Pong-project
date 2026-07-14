const Paddle = require('./Paddle');
const Ball = require('./Ball');
const { BOARD_WIDTH, PADDLE_MARGIN, PADDLE_WIDTH, BALL_SPEED_INCREMENT, MAX_SCORE } = require('./constants');

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

  update() {
    if (this.winner) return;

    this.leftPaddle.update();
    this.rightPaddle.update();
    this.ball.update();
    this.handlePaddleCollisions();
    this.handleScoring();
  }

  handlePaddleCollisions() {
    this.resolvePaddleCollision(this.leftPaddle, 1);
    this.resolvePaddleCollision(this.rightPaddle, -1);
  }

  resolvePaddleCollision(paddle, direction) {
    const ball = this.ball;
    const withinX =
      direction === 1
        ? ball.x - ball.radius <= paddle.x + paddle.width && ball.x - ball.radius >= paddle.x
        : ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width;

    const movingTowardPaddle = direction === 1 ? ball.vx < 0 : ball.vx > 0;
    const withinY = ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height;

    if (withinX && withinY && movingTowardPaddle) {
      const relativeIntersectY = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
      const bounceAngle = relativeIntersectY * (Math.PI / 4);
      const speed = Math.hypot(ball.vx, ball.vy) + BALL_SPEED_INCREMENT;

      ball.vx = direction * Math.cos(bounceAngle) * speed;
      ball.vy = Math.sin(bounceAngle) * speed;
      ball.clampSpeed();

      ball.x = direction === 1 ? paddle.x + paddle.width + ball.radius : paddle.x - ball.radius;
    }
  }

  handleScoring() {
    const ball = this.ball;
    if (ball.x + ball.radius < 0) {
      this.scoreRight += 1;
      this.onPointScored();
    } else if (ball.x - ball.radius > BOARD_WIDTH) {
      this.scoreLeft += 1;
      this.onPointScored();
    }
  }

  onPointScored() {
    if (this.scoreLeft >= MAX_SCORE) {
      this.winner = 'left';
    } else if (this.scoreRight >= MAX_SCORE) {
      this.winner = 'right';
    } else {
      this.ball.reset(Math.random() < 0.5 ? -1 : 1);
    }
  }

  toSnapshot() {
    return {
      ball: { x: this.ball.x, y: this.ball.y },
      leftPaddle: { y: this.leftPaddle.y },
      rightPaddle: { y: this.rightPaddle.y },
      scoreLeft: this.scoreLeft,
      scoreRight: this.scoreRight,
      winner: this.winner,
    };
  }
}

module.exports = GameState;
