import Player from './Player.js';
import Ball from './Ball.js';

export default class Game {
  static EVENTS = {
    playerScored: 'player:scored',
    gameOver: 'game:over',
  };

  #canvas;
  #previousTime;
  // #targetDelta = 1 / 60 * 1000; // 60 fps
  #running = false;
  #missedBallRunway = 500;


  constructor(canvas) {
    this.#canvas = canvas;
    this.context = canvas.getContext('2d');
    this.width;
    this.height;
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

  #render() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.leftPlayer.render();
    this.rightPlayer.render();
    this.ball.render();
  }

  #loop(time) {
    if (!this.#previousTime) {
      this.#previousTime = time;
      window.requestAnimationFrame((time) => this.#loop(time));
      return;
    }

    const delta = time - this.#previousTime;
    this.#previousTime = time;
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
