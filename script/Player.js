export default class Player {
  constructor(canvasContext, playerSide) {
    if (!['left', 'right'].includes(playerSide)) throw new Error(`Player was instantiated with invalid playerSide: ${playerSide}`);

    this.ctx = canvasContext;
    this.width = 20;
    this.height = 100;
    this.x = 40;
    this.y = (canvas.height - this.height) / 2;
    this.speed = 7;
    this.playerSide = playerSide;
    this.movingUp = false;
    this.movingDown = false;
    this.score = 0;
    // used to prevent a ball hit if the ball has already passed the player by the time they reach it
    this.missed = false;

    if (this.playerSide === 'left') {
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
      console.log(`${this.playerSide} player moving up`);
      if (this.y < 0) this.y = 0;
    }
    if (this.movingDown) {
      this.y += this.speed;
      console.log(`${this.playerSide} player moving down`);
      if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;
    }

    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();
  }

  #drawScore() {
    let scoreOffset = 20;
    if (this.playerSide === 'left') scoreOffset = -scoreOffset;
    this.ctx.font = '32px monospace';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(this.score, canvas.width / 2 + scoreOffset, 30);
  }

  draw() {
    this.#drawPaddle();
    this.#drawScore();

    return this;
  }

  // collisionDetection(ball) {
  //   const self = this;
  //   const determineHit = (ball) => {
  //     if (!this.missed && ball.y >= this.y && ball.y <= this.y + this.height) {
  //       ball.dx = -ball.dx;
  //     } else {
  //       this.missed = true;
  //     }
  //   }

  //   if (this.side === 'left') {
  //     if (ball.x - ball.radius < this.x + this.width) determineHit(ball);
  //   } else {
  //     if (ball.x + ball.radius > this.x) determineHit(ball);
  //   }
  // }

  scores() {
    this.score++;
    console.log(`${this.playerSide} player scores`);
  }
}
