export default class Player {
  constructor(canvasContext, playingSide) {
    if (!['left', 'right'].includes(playingSide)) throw new Error(`Player was instantiated with invalid playingSide: ${playingSide}`);

    this.ctx = canvasContext;
    this.width = 20;
    this.height = 100;
    this.x = 40;
    this.y = (canvas.height - this.height) / 2;
    this.speed = 7;
    this.playingSide = playingSide;
    this.movingUp = false;
    this.movingDown = false;
    this.maxHealth = 11;
    this.health = 11;
    // used to prevent a ball hit if the ball has already passed the player by the time they reach it
    this.missed = false;

    if (this.playingSide === 'left') {
      addEventListener('keydown', (e) => {
        if (e.key === 'w') this.movingUp = true;
        if (e.key === 's') this.movingDown = true;
      });
      addEventListener('keyup', (e) => {
        if (e.key === 'w') this.movingUp = false;
        if (e.key === 's') this.movingDown = false;
      });
    } else {
      this.x = canvas.width - this.width - this.x;

      addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'Up') this.movingUp = true;
        if (e.key === 'ArrowDown' || e.key === 'Down') this.movingDown = true;
      });
      addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'Up') this.movingUp = false;
        if (e.key === 'ArrowDown' || e.key === 'Down') this.movingDown = false;
      });
    }
  }

  #drawPaddle() {
    if (this.movingUp) {
      this.y -= this.speed;
      if (this.y < 0) this.y = 0;
    }
    if (this.movingDown) {
      this.y += this.speed;
      if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;
    }

    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();
  }

  draw() {
    this.#drawPaddle();
    return this;
  }
}
