class Pong {
  static settings = Object.freeze({
    ball: { speed: 20, radius: 20 },
    tray: { width: 20, height: 200, x: 50 },
    score: { y: 15, max: 10 },
  });

  static velocity = (speed, radian) => {
    return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };
  };

  host = true;

  handleMouseMove = (event) => {
    if (!this.player.current) return;
    if (this.send) this.player.current.old = this.player.current.y;
    this.player.current.y =
      (event.pageY * this.canvas.height) / this.canvas.clientHeight;
  };

  draw() {
    if (this.player.left.y - Pong.settings.tray.height / 2 < 0)
      this.player.left.y = Pong.settings.tray.height / 2;
    if (this.player.left.y + Pong.settings.tray.height / 2 > this.canvas.height)
      this.player.left.y = this.canvas.height - Pong.settings.tray.height / 2;
    if (this.player.right.y - Pong.settings.tray.height / 2 < 0)
      this.player.right.y = Pong.settings.tray.height / 2;
    if (
      this.player.right.y + Pong.settings.tray.height / 2 >
      this.canvas.height
    )
      this.player.right.y = this.canvas.height - Pong.settings.tray.height / 2;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.fillStyle = 'white';
    this.context.fillRect(
      Pong.settings.tray.x - Pong.settings.tray.width / 2,
      this.player.left.y - Pong.settings.tray.height / 2,
      Pong.settings.tray.width,
      Pong.settings.tray.height,
    );
    this.context.fillRect(
      this.canvas.width - Pong.settings.tray.x - Pong.settings.tray.width / 2,
      this.player.right.y - Pong.settings.tray.height / 2,
      Pong.settings.tray.width,
      Pong.settings.tray.height,
    );
    this.context.arc(
      this.ball.x,
      this.ball.y,
      Pong.settings.ball.radius,
      0,
      2 * Math.PI,
    );
    this.context.font = '48px Impact';
    this.context.fillText(
      this.player.left.score,
      this.canvas.width / 4 -
        this.context.measureText(this.player.left.score).width / 2,
      Pong.settings.score.y + 48,
    );
    this.context.fillText(
      this.player.right.score,
      (this.canvas.width * 3) / 4 -
        this.context.measureText(this.player.right.score).width / 2,
      Pong.settings.score.y + 48,
    );
    this.context.fillText(
      this.player.left.name,
      this.canvas.width / 4 -
        this.context.measureText(this.player.left.name).width / 2,
      this.canvas.height - Pong.settings.score.y,
    );
    this.context.fillText(
      this.player.right.name,
      (this.canvas.width * 3) / 4 -
        this.context.measureText(this.player.right.name).width / 2,
      this.canvas.height - Pong.settings.score.y,
    );
    this.context.fill();
    this.context.closePath();

    this.context.setLineDash([
      this.canvas.height / (15 + 14),
      this.canvas.height / (15 + 14),
    ]);
    this.context.beginPath();
    this.context.strokeStyle = 'white';
    this.context.moveTo(this.canvas.width / 2, 0);
    this.context.lineTo(this.canvas.width / 2, this.canvas.height);
    this.context.stroke();
    this.context.closePath();
  }

  updateBall = (x, y, radian) => {
    if (!this.host) return;
    this.ball.x = x;
    this.ball.y = y;
    this.ball.velocity = Pong.velocity(Pong.settings.ball.speed, radian);
    if (this.send)
      this.send({
        type: 'ball',
        x: this.ball.x,
        y: this.ball.y,
        velocity: this.ball.velocity,
      });
  };

  update = () => {
    if (this.player.current && this.send)
      if (this.player.current.old != this.player.current.y) {
        this.player.current.old = this.player.current.y;
        this.send({
          type: 'tray',
          y: this.player.current.y,
          left: this.player.left == this.player.current,
        });
      }
    const next = {
      x: this.ball.x + this.ball.velocity.x,
      y: this.ball.y + this.ball.velocity.y,
    };

    if (
      next.x - Pong.settings.ball.radius < 0 ||
      next.x + Pong.settings.ball.radius > this.canvas.width
    ) {
      if (this.host) {
        if (next.x - Pong.settings.ball.radius < 0) ++this.player.right.score;
        else ++this.player.left.score;
        if (this.send)
          this.send({
            type: 'score',
            left: this.player.left.score,
            right: this.player.right.score,
          });
        if (this.player.right.score == Pong.settings.score.max)
          return this.stop(this.player.right);
        else if (this.player.left.score == Pong.settings.score.max)
          return this.stop(this.player.left);
      }
      let ajust = 0;
      if (next.x + Pong.settings.ball.radius > this.canvas.width)
        ajust = Math.PI;
      return this.updateBall(
        this.canvas.width / 2,
        this.canvas.height / 2,
        (Math.random() * Math.PI) / 2 - Math.PI / 4 + ajust,
      );
    }

    if (
      next.y >= this.player.left.y - Pong.settings.tray.height / 2 &&
      next.y <= this.player.left.y + Pong.settings.tray.height / 2
    )
      if (next.x - Pong.settings.ball.radius < Pong.settings.tray.x)
        return this.updateBall(
          this.ball.x,
          this.ball.y,
          (Math.random() * Math.PI) / 2 - Math.PI / 4,
        );
    if (
      next.y >= this.player.right.y - Pong.settings.tray.height / 2 &&
      next.y <= this.player.right.y + Pong.settings.tray.height / 2
    )
      if (
        next.x + Pong.settings.ball.radius >
        this.canvas.width - Pong.settings.tray.x
      )
        return this.updateBall(
          this.ball.x,
          this.ball.y,
          (Math.random() * Math.PI) / 2 - Math.PI / 4 + Math.PI,
        );

    if (
      next.y - Pong.settings.ball.radius < 0 ||
      next.y + Pong.settings.ball.radius > this.canvas.height
    )
      this.ball.velocity.y *= -1;

    this.ball.x += this.ball.velocity.x;
    this.ball.y += this.ball.velocity.y;

    this.draw();
  };

  constructor(canvas, left, right) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.player = {
      left: {
        name: left,
        score: 0,
        y: canvas.height / 2,
      },
      right: {
        name: right,
        score: 0,
        y: canvas.height / 2,
      },
    };
  }

  setPlayer(player) {
    this.player.current = player;
  }

  setHost(host) {
    this.host = host;
  }

  setEnd(end) {
    this.end = end;
  }

  setSend(fct) {
    this.send = fct;
  }

  start() {
    this.ball = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      velocity: Pong.velocity(
        Pong.settings.ball.speed,
        (Math.random() * Math.PI) / 2 - Math.PI / 4,
      ),
    };

    document.addEventListener('mousemove', this.handleMouseMove);
    this.interval = setInterval(this.update, 1000 / 60);
  }

  stop(player) {
    this.draw();
    document.removeEventListener('mousemove', this.handleMouseMove);
    clearInterval(this.interval);
    if (this.end) this.end(player == this.player.current);
  }

  receive(data) {
    switch (data.type) {
      case 'ball':
        this.ball.x = data.x;
        this.ball.y = data.y;
        this.ball.velocity = data.velocity;
        break;
      case 'tray':
        if (data.left) this.player.left.y = data.y;
        else this.player.right.y = data.y;
        break;
      case 'score':
        this.player.left.score = data.left;
        this.player.right.score = data.right;
        if (this.player.right.score == Pong.settings.score.max)
          this.stop(this.player.right);
        else if (this.player.left.score == Pong.settings.score.max)
          this.stop(this.player.left);
        break;
    }
  }
}
