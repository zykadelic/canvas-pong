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
    this.player1 = new Player(this.#context, 'left');
    this.player2 = new Player(this.#context, 'right');
    this.#renderBaseFrame();

    this.newServeDelay = -this.ball.dx * 50;
    this.winningScore = 3;

    window.addEventListener('resize', () => {
      this.#resize();
      this.#renderBaseFrame(); // unless game running
    });
  }

  #resize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
  }

  // used to draw a static preview of the game before it has started
  #renderBaseFrame() {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.player1.draw();
    this.player2.draw();
  }

  // TODO use delta for framerate smoothing
  #loop() {
    this.#renderBaseFrame();

    // player1.collisionDetection(ball);
    // player2.collisionDetection(ball);
    this.ball.draw().detectPlayerCollision(this.player1, this.player2);

    // if (player1.missed && ball.x < 0) player2.scores();
    // if (player2.missed && ball.x > canvas.width - ball.radius) player1.scores();
    if (this.player1.missed && this.ball.x + this.ball.radius < this.newServeDelay) {
      this.player2.scores();
      this.ball.serve();
      this.player1.missed = false;
    }
    if (this.player2.missed && this.ball.x > canvas.width - this.newServeDelay) {
      this.player1.scores();
      this.ball.serve();
      this.player2.missed = false;
    }
    if (this.player1.score >= this.winningScore || this.player2.score >= this.winningScore) {
      this.#renderBaseFrame(); // update score before returning
      // TODO use custom event emitter on `this`
      window.dispatchEvent(new CustomEvent('game:over', {
        detail: {
          score: `${this.player1.score}-${this.player2.score}`,
        },
      }));
      return;
    }

    window.requestAnimationFrame(() => this.#loop());
  }

  start() {
    // TODO full game area reset
    this.player1.score = 0;
    this.player2.score = 0;

    this.#loop();
  }
}
