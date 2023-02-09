import { isValidColor } from './utils/color.js';

export default class Ball {
  #game;
  #color;
  #radius = 20;

  constructor(game) {
    this.#game = game;
    this.context = game.context;

    this.color = this.#game.color;
    this.position = {
      // initiate off-screen
      x: -this.#radius,
      y: -this.#radius,
    };
    this.velocity = {
      x: -0.5,
      y: 0.25,
    };
  }

  // NOTE this won't show until the next render
  set color(color) {
    if (isValidColor(color)) this.#color = color;
  }

  get color() {
    return this.#color;
  }

  #checkWallCollision() {
    const hitTop = this.position.y <= this.#radius;
    const hitBottom = this.position.y >= this.#game.height - this.#radius;

    if (hitTop) this.position.y = this.#radius;
    if (hitBottom) this.position.y = this.#game.height - this.#radius;
    if (hitTop || hitBottom) this.velocity.y = -this.velocity.y;
  }

  // TODO fix edge glitch
  #checkPlayerCollision(player) {
    if (player.didMiss) return;

    const playerEdge = player.playField === 'left'
      ? player.position.x + player.width + this.#radius
      : player.position.x - this.#radius;
    const withinX = player.playField === 'left'
      ? this.position.x <= playerEdge
      : this.position.x >= playerEdge;
    if (!withinX) return;

    if (this.position.y >= player.position.y && this.position.y <= player.position.y + player.height) {
      // player collision: inverse the x velocity
      this.velocity.x = -this.velocity.x;
      this.position.x = playerEdge;
    } else {
      player.didMiss = true;
    }
  }

  update(delta) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    this.#checkWallCollision();
    this.#checkPlayerCollision(this.#game.leftPlayer);
    this.#checkPlayerCollision(this.#game.rightPlayer);
  }

  render() {
    this.context.beginPath();
    this.context.arc(this.position.x, this.position.y, this.#radius, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.closePath();
  }

  serve() {
    this.position.x = this.#game.width / 2;
    this.position.y = this.#game.height / 2;

    // inverse horizontal direction between serves
    this.velocity.x = -this.velocity.x;
  }
}
