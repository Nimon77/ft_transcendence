export class Pong {
  stop = false;
  ball = { x: 0, y: 0 };

  constructor(canvas, options, me, players) {
    canvas.width = options.display.width;
    canvas.height = options.display.height;

    this.context = canvas.getContext('2d');
    this.options = options;

    this.me = me;
    this.players = players.map((player) => {
      return { tray: options.display.height / 2, score: 0, ...player };
    });
  }

  updateBall(x, y) {
    this.ball = { x, y };
    this.draw();
  }

  updateScore(scores) {
    let index = 0;
    this.players.forEach((player) => (player.score = scores[index++]));
  }

  updateTray(player, percent) {
    const player1 = this.players.find((player1) => player1.id == player.id);
    if (!player1) return;

    let tray = percent * this.options.display.height;

    if (tray < this.options.tray.height / 2)
      tray = this.options.tray.height / 2;
    if (tray > this.options.display.height - this.options.tray.height / 2)
      tray = this.options.display.height - this.options.tray.height / 2;

    player1.tray = tray;
  }

  draw() {
    this.context.clearRect(
      0,
      0,
      this.options.display.width,
      this.options.display.height,
    );
    this.context.beginPath();
    this.context.fillStyle = 'white';

    //tray
    this.context.fillRect(
      this.options.tray.x - this.options.tray.width / 2,
      this.players[0].tray - this.options.tray.height / 2,
      this.options.tray.width,
      this.options.tray.height,
    );
    this.context.fillRect(
      this.options.display.width -
        this.options.tray.x -
        this.options.tray.width / 2,
      this.players[1].tray - this.options.tray.height / 2,
      this.options.tray.width,
      this.options.tray.height,
    );

    //la baballe
    this.context.arc(
      this.ball.x,
      this.ball.y,
      this.options.ball.radius,
      0,
      2 * Math.PI,
    );

    //score
    this.context.font = '48px Impact';
    this.context.fillText(
      this.players[0].score,
      this.options.display.width / 4 -
        this.context.measureText(this.players[0].score).width / 2,
      this.options.score.y + 48,
    );
    this.context.fillText(
      this.players[1].score,
      (this.options.display.width * 3) / 4 -
        this.context.measureText(this.players[1].score).width / 2,
      this.options.score.y + 48,
    );

    this.context.fill();
    this.context.closePath();
  }
}
