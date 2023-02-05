export default class Ball {
  #context;

  constructor(canvas) {
    this.#context = canvas.getContext('2d');
    this.radius = 20;
    this.position = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };
    this.velocity = {
      x: 4,
      y: 2,
    };
  }

  draw() {
    this.#context.beginPath();
    this.#context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    this.#context.fillStyle = 'white';
    this.#context.fill();
    this.#context.closePath();

    // wall collision: inverse the y velocity
    if (this.position.y + this.velocity.y < this.radius || this.position.y + this.velocity.y > canvas.height - this.radius) {
      this.velocity.y = -this.velocity.y;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    return this;
  }

  serve() {
    this.position.x = canvas.width / 2;
    this.position.y = canvas.height / 2;

    // inverse horizontal direction between serves
    this.velocity.x = -this.velocity.x;
  }

  detectPlayerCollision(player1, player2) {
    const attemptHit = (player) => {
      if (this.position.y >= player.position.y && this.position.y <= player.position.y + player.height) {
        this.velocity.x = -this.velocity.x;
        return true;
      } else {
        player.missed = true;
        return false;
      }
    }

    if (!player1.missed && this.position.x - this.radius < player1.position.x + player1.width) attemptHit(player1);
    if (!player2.missed && this.position.x + this.radius > player2.position.x) attemptHit(player2);
  }
};
