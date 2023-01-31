export default class Ball {
  constructor(canvasContext) {
    this.ctx = canvasContext;
    this.radius = 20;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    // velocity
    this.dx = 4;
    this.dy = 2;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();

    // wall collision: inverse the velocity
    if (this.y + this.dy < this.radius || this.y + this.dy > canvas.height - this.radius) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    return this;
  }

  serve() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    // inverse horizontal direction between serves
    this.dx = -this.dx;
  }

  detectPlayerCollision(player1, player2) {
    const attemptHit = (player) => {
      if (this.y >= player.y && this.y <= player.y + player.height) {
        this.dx = -this.dx;
        return true;
      } else {
        player.missed = true;
        return false;
      }
    }

    if (!player1.missed && this.x - this.radius < player1.x + player1.width) attemptHit(player1);
    if (!player2.missed && this.x + this.radius > player2.x) attemptHit(player2);
  }
};
