/* exported Renderer */
const Renderer = (() => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');

  const PADDLE_WIDTH = 12;
  const PADDLE_HEIGHT = 90;
  const PADDLE_MARGIN = 20;
  const BALL_RADIUS = 8;

  function drawBoard() {
    ctx.fillStyle = '#06060a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#2d7dd2';
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawStaticScene() {
    drawBoard();
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(PADDLE_MARGIN, (canvas.height - PADDLE_HEIGHT) / 2, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(
      canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
      (canvas.height - PADDLE_HEIGHT) / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawState(state) {
    drawBoard();

    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(PADDLE_MARGIN, state.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(
      canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
      state.rightPaddle.y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  return { drawStaticScene, drawState };
})();
