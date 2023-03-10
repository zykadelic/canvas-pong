import Player from './Player.js';
import Ball from './Ball.js';
import { isValidColor } from './utils/color.js';

export default class Game {
  static EVENTS = {
    playerScored: 'player:scored',
    gameOver: 'game:over',
  };

  #canvas;
  #defaultColor = 'white';
  #color;
  #previousTime;
  #fps = 0.0;
  // #targetDelta = 1 / 60 * 1000; // 60 fps
  #running = false;
  #missedBallRunway = 500;

  constructor({ canvas, debug }) {
    this.debug = {
      fps: !!(debug.fps ?? false),
    };

    this.#canvas = canvas;
    this.context = canvas.getContext('2d');
    this.width;
    this.height;
    this.#color = this.#defaultColor;
    this.#resize();

    this.leftPlayer = new Player(this, 'left');
    this.rightPlayer = new Player(this, 'right');
    this.ball = new Ball(this);
    this.#render();

    window.addEventListener('resize', () => {
      this.#resize();
      this.#render();
    });
  }

  set color(color) {
    if (isValidColor(color)) {
      this.#color = color;
      this.leftPlayer.color = color;
      this.rightPlayer.color = color;
      this.ball.color = color;
      this.#render();
    }
  }

  get color() {
    return this.#color;
  }

  #resize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
    this.width = this.#canvas.width;
    this.height = this.#canvas.height;
  }

  // TODO replace with event bubbling from player.missed()
  #playerMissed(player, otherPlayer) {
    player.health--;
    player.didMiss = false;

    this.#publish(this.constructor.EVENTS.playerScored, {
      scoringPlayer: otherPlayer,
      missingPlayer: player,
    });

    if (player.health > 0) {
      this.ball.serve();
    } else {
      this.#gameOver({ winner: otherPlayer, loser: player });
    }
  }

  #update(delta) {
    this.leftPlayer.update(delta);
    this.rightPlayer.update(delta);
    this.ball.update(delta);

    if (this.leftPlayer.didMiss && this.ball.position.x < -this.#missedBallRunway) {
      this.#playerMissed(this.leftPlayer, this.rightPlayer);
    }
    if (this.rightPlayer.didMiss && this.ball.position.x > this.#missedBallRunway + this.width) {
      this.#playerMissed(this.rightPlayer, this.leftPlayer);
    }
  }

  #renderFPSCounter() {
    this.context.font = '1em Monofonto, sans-serif';
    this.context.textAlign = 'center';
    this.context.fillStyle = this.color;
    this.context.fillText(this.#fps.toFixed(2), this.width / 2, this.height - 20);
  }

  #render() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.leftPlayer.render();
    this.rightPlayer.render();
    this.ball.render();
    if (this.debug.fps) this.#renderFPSCounter();
  }

  #loop(time) {
    if (!this.#previousTime) {
      this.#previousTime = time;
      window.requestAnimationFrame((time) => this.#loop(time));
      return;
    }

    const delta = time - this.#previousTime;
    this.#previousTime = time;
    this.#fps = 1000 / delta;
    this.#update(delta);
    this.#render();
    // let updateOnce = true;
    // while (updateOnce || delta >= this.#targetDelta) {
    //   updateOnce = false;
    //   delta -= this.#targetDelta;
    //   this.#update(delta);
    // }
    // this.#render(delta / this.#targetDelta);

    if (!this.#running) return;
    window.requestAnimationFrame((time) => this.#loop(time));
    // setTimeout(() => {
    //   window.requestAnimationFrame((time) => this.#loop(time));
    // }, targetDelta - delta);
  }

  #publish(event, message = {}) {
    if (!Object.values(this.constructor.EVENTS).includes(event)) {
      throw new Error(`Invalid event type received: ${event}`);
    }
    window.dispatchEvent(new CustomEvent(event, { detail: message }));
  }

  #gameOver({ winner, loser }) {
    this.#running = false;
    this.#publish(this.constructor.EVENTS.gameOver, { winner, loser });
  }

  start() {
    this.leftPlayer.health = this.leftPlayer.maxHealth;
    this.rightPlayer.health = this.rightPlayer.maxHealth;
    this.ball.serve();
    this.#previousTime = null;
    this.#running = true;
    this.#loop();
  }
}
