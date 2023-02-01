import Player from './Player.js';
import Ball from './Ball.js';

export default class Game {
  #canvas;
  #context;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#context = canvas.getContext('2d');
    this.#resize();

    this.ball = new Ball(this.#context);
    this.leftPlayer = new Player(this.#context, 'left');
    this.rightPlayer = new Player(this.#context, 'right');
    this.#renderBaseFrame();

    this.newServeDelay = -this.ball.dx * 50;

    window.addEventListener('resize', () => {
      this.#resize();
      this.#renderBaseFrame(); // TODO unless game is running
    });
  }

  #resize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
  }

  // used to draw a static preview of the game before it has started
  #renderBaseFrame() {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.leftPlayer.draw();
    this.rightPlayer.draw();
  }

  #loop() {
    this.#renderBaseFrame();
    this.ball.draw().detectPlayerCollision(this.leftPlayer, this.rightPlayer);

    if (this.leftPlayer.missed && this.ball.x + this.ball.radius < this.newServeDelay) {
      this.leftPlayer.health--;
      this.ball.serve();
      this.leftPlayer.missed = false;

      window.dispatchEvent(new CustomEvent('player:scored', {
        detail: {
          scoringPlayer: this.rightPlayer,
          missingPlayer: this.leftPlayer,
        },
      }));
    }

    if (this.rightPlayer.missed && this.ball.x > canvas.width - this.newServeDelay) {
      this.rightPlayer.health--;
      this.ball.serve();
      this.rightPlayer.missed = false;

      window.dispatchEvent(new CustomEvent('player:scored', {
        detail: {
          scoringPlayer: this.leftPlayer,
          missingPlayer: this.rightPlayer,
        },
      }));
    }

    if (this.leftPlayer.health <= 0) {
      window.dispatchEvent(new CustomEvent('game:over', {
        detail: {
          winningPlayer: this.rightPlayer,
          losingPlayer: this.leftPlayer,
        },
      }));
      return;
    }

    if (this.rightPlayer.health <= 0) {
      window.dispatchEvent(new CustomEvent('game:over', {
        detail: {
          winningPlayer: this.leftPlayer,
          losingPlayer: this.rightPlayer,
        },
      }));
      return;
    }

    window.requestAnimationFrame(() => this.#loop());
  }

  start() {
    this.leftPlayer.health = this.leftPlayer.maxHealth;
    this.rightPlayer.health = this.rightPlayer.maxHealth;

    this.#loop();
  }
}
