const Ball = require('../Ball');
const { BOARD_WIDTH, BOARD_HEIGHT, BALL_MAX_SPEED } = require('../constants');

describe('Ball', () => {
  test('reset() places the ball at the center of the board', () => {
    const ball = new Ball();
    ball.reset(1);
    expect(ball.x).toBe(BOARD_WIDTH / 2);
    expect(ball.y).toBe(BOARD_HEIGHT / 2);
  });

  test('reset(1) sends the ball to the right, reset(-1) to the left', () => {
    const ball = new Ball();
    ball.reset(1);
    expect(ball.vx).toBeGreaterThan(0);
    ball.reset(-1);
    expect(ball.vx).toBeLessThan(0);
  });

  test('update() moves the ball by its velocity', () => {
    const ball = new Ball();
    ball.x = 100;
    ball.y = 100;
    ball.vx = 5;
    ball.vy = 2;
    ball.update();
    expect(ball.x).toBe(105);
    expect(ball.y).toBe(102);
  });

  test('bounces off the top wall', () => {
    const ball = new Ball();
    ball.y = ball.radius - 1;
    ball.vy = -3;
    ball.update();
    expect(ball.vy).toBeGreaterThan(0);
    expect(ball.y).toBeGreaterThanOrEqual(ball.radius);
  });

  test('bounces off the bottom wall', () => {
    const ball = new Ball();
    ball.y = BOARD_HEIGHT - ball.radius + 1;
    ball.vy = 3;
    ball.update();
    expect(ball.vy).toBeLessThan(0);
    expect(ball.y).toBeLessThanOrEqual(BOARD_HEIGHT - ball.radius);
  });

  test('clampSpeed() never lets speed exceed BALL_MAX_SPEED', () => {
    const ball = new Ball();
    ball.vx = 1000;
    ball.vy = 1000;
    ball.clampSpeed();
    const speed = Math.hypot(ball.vx, ball.vy);
    expect(speed).toBeLessThanOrEqual(BALL_MAX_SPEED + 1e-9);
  });

  test('clampSpeed() leaves speed untouched when already under the max', () => {
    const ball = new Ball();
    ball.vx = 1;
    ball.vy = 1;
    ball.clampSpeed();
    expect(ball.vx).toBe(1);
    expect(ball.vy).toBe(1);
  });
});
