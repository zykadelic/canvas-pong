import Game from './Game.js';

const cssRgb = window.getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb');
const canvas = document.querySelector('#canvas');
const healthBars = {
  left: document.querySelector('.player-health[data-player=left]'),
  right: document.querySelector('.player-health[data-player=right]'),
};
const titleScreen = document.querySelector('#titleScreen');
const playButton = document.querySelector('[data-play]');
const game = new Game({ canvas, debug: { fps: true } });
game.color = `rgb(${cssRgb})`;

const drawPlayerHealth = (player) => {
  const hearts = healthBars[player.playField].children;
  const health = player.health / player.maxHealth * hearts.length;
  const fraction = health - Math.floor(health);

  for (let i = 0; i < hearts.length; i++) {
    if (i + 1 <= health) hearts[i].dataset.fill = 'full';
    else if (i === Math.floor(health) && fraction >= 0.5) hearts[i].dataset.fill = 'half';
    else hearts[i].dataset.fill = 'empty';
  }

  if (health === 0) {
    healthBars[player.playField].classList.remove('player-health--low');
    healthBars[player.playField].classList.add('player-health--dead');
  } else if (health < 0.5) {
    healthBars[player.playField].classList.add('player-health--low');
  } else {
    healthBars[player.playField].classList.remove('player-health--low', 'player-health--dead');
  }
};

const startGame = () => {
  titleScreen.classList.add('hidden');
  game.start();
  drawPlayerHealth(game.leftPlayer);
  drawPlayerHealth(game.rightPlayer);
}

playButton.addEventListener('click', startGame);
window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') startGame();
});

window.addEventListener(Game.EVENTS.playerScored, (e) => {
  drawPlayerHealth(e.detail.missingPlayer);
});

window.addEventListener(Game.EVENTS.gameOver, (e) => {
  console.log(`${e.detail.winner.playField} player wins!`);
  setTimeout(() => titleScreen.classList.remove('hidden'), 300);
});
