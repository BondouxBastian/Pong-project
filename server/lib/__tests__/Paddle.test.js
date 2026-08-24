const Paddle = require('../Paddle');
const { BOARD_HEIGHT, PADDLE_HEIGHT, PADDLE_SPEED } = require('../constants');

describe('Paddle', () => {
  test('starts vertically centered on the board', () => {
    const paddle = new Paddle(10);
    expect(paddle.y).toBe((BOARD_HEIGHT - PADDLE_HEIGHT) / 2);
  });

  test('moves up when moveUp input is set', () => {
    const paddle = new Paddle(10);
    const startY = paddle.y;
    paddle.setInput({ up: true, down: false });
    paddle.update();
    expect(paddle.y).toBe(startY - PADDLE_SPEED);
  });

  test('moves down when moveDown input is set', () => {
    const paddle = new Paddle(10);
    const startY = paddle.y;
    paddle.setInput({ up: false, down: true });
    paddle.update();
    expect(paddle.y).toBe(startY + PADDLE_SPEED);
  });

  test('does not move when both inputs are set (cancel out)', () => {
    const paddle = new Paddle(10);
    const startY = paddle.y;
    paddle.setInput({ up: true, down: true });
    paddle.update();
    expect(paddle.y).toBe(startY);
  });

  test('cannot go above the top of the board', () => {
    const paddle = new Paddle(10);
    paddle.setInput({ up: true, down: false });
    for (let i = 0; i < 200; i += 1) paddle.update();
    expect(paddle.y).toBe(0);
  });

  test('cannot go below the bottom of the board', () => {
    const paddle = new Paddle(10);
    paddle.setInput({ up: false, down: true });
    for (let i = 0; i < 200; i += 1) paddle.update();
    expect(paddle.y).toBe(BOARD_HEIGHT - PADDLE_HEIGHT);
  });

  test('reset() centers the paddle and clears inputs', () => {
    const paddle = new Paddle(10);
    paddle.setInput({ up: true, down: false });
    paddle.update();
    paddle.reset();
    expect(paddle.y).toBe((BOARD_HEIGHT - PADDLE_HEIGHT) / 2);
    expect(paddle.moveUp).toBe(false);
    expect(paddle.moveDown).toBe(false);
  });
});
