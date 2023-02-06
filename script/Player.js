export default class Player {
  #game;
  #speed;
  #movingUp;
  #movingDown;

  constructor(game, playField) {
    if (!['left', 'right'].includes(playField)) {
      throw new Error(`Player was instantiated with invalid playField: ${playField}`);
    }

    const posXOffset = 40;
    this.#game = game;
    this.context = game.context;
    this.#speed = 0.9;
    this.#movingUp = false;
    this.#movingDown = false;

    this.width = 20;
    this.height = 100;
    this.playField = playField;
    this.position = {
      x: this.playField === 'left' ? posXOffset : this.#game.width - this.width - posXOffset,
      y: (this.#game.height - this.height) / 2,
    };
    this.maxHealth = 11;
    this.health = this.maxHealth;

    // used to prevent a ball hit if the ball has already
    // passed the player by the time they reach it
    this.didMiss = false;

    this.#setupControls();
  }

  #setupControls() {
    window.addEventListener('keydown', (e) => {
      if (this.playField === 'left') {
        if (e.key === 'w') this.#movingUp = true;
        if (e.key === 's') this.#movingDown = true;
      } else {
        if (e.key === 'ArrowUp' || e.key === 'Up') this.#movingUp = true;
        if (e.key === 'ArrowDown' || e.key === 'Down') this.#movingDown = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      if (this.playField === 'left') {
        if (e.key === 'w') this.#movingUp = false;
        if (e.key === 's') this.#movingDown = false;
      } else {
        if (e.key === 'ArrowUp' || e.key === 'Up') this.#movingUp = false;
        if (e.key === 'ArrowDown' || e.key === 'Down') this.#movingDown = false;
      }
    });
  }

  #checkWallCollision() {
    if (this.position.y < 0) this.position.y = 0;
    if (this.position.y > this.#game.height - this.height) this.position.y = this.#game.height - this.height;
  }

  update(delta) {
    if (this.#movingUp) this.position.y -= this.#speed * delta;
    if (this.#movingDown) this.position.y += this.#speed * delta;
    this.#checkWallCollision();
  }

  render() {
    this.context.beginPath();
    this.context.rect(this.position.x, this.position.y, this.width, this.height);
    this.context.fillStyle = 'white';
    this.context.fill();
    this.context.closePath();
  }
}
