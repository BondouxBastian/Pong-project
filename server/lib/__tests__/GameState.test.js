const GameState = require('../GameState');
const { BOARD_WIDTH, MAX_SCORE } = require('../constants');

describe('GameState', () => {
  test('scores a point for the right player when the ball exits on the left', () => {
    const state = new GameState();
    state.ball.x = -state.ball.radius - 1;
    state.handleScoring();
    expect(state.scoreRight).toBe(1);
    expect(state.scoreLeft).toBe(0);
  });

  test('scores a point for the left player when the ball exits on the right', () => {
    const state = new GameState();
    state.ball.x = BOARD_WIDTH + state.ball.radius + 1;
    state.handleScoring();
    expect(state.scoreLeft).toBe(1);
    expect(state.scoreRight).toBe(0);
  });

  test('declares a winner once a player reaches MAX_SCORE', () => {
    const state = new GameState();
    state.scoreLeft = MAX_SCORE - 1;
    state.ball.x = BOARD_WIDTH + state.ball.radius + 1;
    state.handleScoring();
    expect(state.scoreLeft).toBe(MAX_SCORE);
    expect(state.winner).toBe('left');
  });

  test('declares the right player winner once they reach MAX_SCORE', () => {
    const state = new GameState();
    state.scoreRight = MAX_SCORE - 1;
    state.ball.x = -state.ball.radius - 1;
    state.handleScoring();
    expect(state.scoreRight).toBe(MAX_SCORE);
    expect(state.winner).toBe('right');
  });

  test('update() runs paddles, ball, collisions and scoring for a full tick', () => {
    const state = new GameState();
    const ballXBefore = state.ball.x;
    state.update();
    expect(state.ball.x).not.toBe(ballXBefore);
  });

  test('resets the ball to center after a point when no one has won yet', () => {
    const state = new GameState();
    state.ball.x = -state.ball.radius - 1;
    state.handleScoring();
    expect(state.winner).toBeNull();
    expect(state.ball.x).toBe(BOARD_WIDTH / 2);
  });

  test('update() does nothing once a winner is set', () => {
    const state = new GameState();
    state.winner = 'left';
    const ballXBefore = state.ball.x;
    state.leftPaddle.setInput({ up: true, down: false });
    state.update();
    expect(state.ball.x).toBe(ballXBefore);
  });

  test('left paddle collision bounces the ball back to the right', () => {
    const state = new GameState();
    const paddle = state.leftPaddle;
    state.ball.x = paddle.x + paddle.width + state.ball.radius;
    state.ball.y = paddle.y + paddle.height / 2;
    state.ball.vx = -5;
    state.ball.vy = 0;

    state.resolvePaddleCollision(paddle, 1);

    expect(state.ball.vx).toBeGreaterThan(0);
  });

  test('right paddle collision bounces the ball back to the left', () => {
    const state = new GameState();
    const paddle = state.rightPaddle;
    state.ball.x = paddle.x - state.ball.radius;
    state.ball.y = paddle.y + paddle.height / 2;
    state.ball.vx = 5;
    state.ball.vy = 0;

    state.resolvePaddleCollision(paddle, -1);

    expect(state.ball.vx).toBeLessThan(0);
  });

  test('ball moving away from the paddle is not affected by collision check', () => {
    const state = new GameState();
    const paddle = state.leftPaddle;
    state.ball.x = paddle.x + paddle.width + state.ball.radius;
    state.ball.y = paddle.y + paddle.height / 2;
    state.ball.vx = 5; // moving away, to the right
    state.ball.vy = 0;

    state.resolvePaddleCollision(paddle, 1);

    expect(state.ball.vx).toBe(5);
  });

  test('setInput() routes input to the correct paddle', () => {
    const state = new GameState();
    state.setInput('left', { up: true, down: false });
    state.setInput('right', { up: false, down: true });
    expect(state.leftPaddle.moveUp).toBe(true);
    expect(state.rightPaddle.moveDown).toBe(true);
  });

  test('toSnapshot() exposes the fields the client needs, nothing more', () => {
    const state = new GameState();
    const snapshot = state.toSnapshot();
    expect(snapshot).toEqual({
      ball: { x: state.ball.x, y: state.ball.y },
      leftPaddle: { y: state.leftPaddle.y },
      rightPaddle: { y: state.rightPaddle.y },
      scoreLeft: 0,
      scoreRight: 0,
      winner: null,
    });
  });
});
