import Game from './Game.js';

const canvas = document.querySelector('#canvas');
const healthBars = {
  left: document.querySelector('.player-health[data-player=left]'),
  right: document.querySelector('.player-health[data-player=right]'),
};
const titleScreen = document.querySelector('#titleScreen');
const playButton = document.querySelector('[data-play]');
const game = new Game(canvas);

const drawPlayerHealth = (player) => {
  const hearts = healthBars[player.playingSide].children;
  const health = player.health / player.maxHealth * hearts.length;
  const fraction = health - Math.floor(health);

  for (let i = 0; i < hearts.length; i++) {
    if (i + 1 <= health) hearts[i].dataset.fill = 'full';
    else if (i === Math.floor(health) && fraction >= 0.5) hearts[i].dataset.fill = 'half';
    else hearts[i].dataset.fill = 'empty';
  }

  if (health === 0) {
    healthBars[player.playingSide].classList.remove('player-health--low');
    healthBars[player.playingSide].classList.add('player-health--dead');
  } else if (health < 0.5) {
    healthBars[player.playingSide].classList.add('player-health--low');
  } else {
    healthBars[player.playingSide].classList.remove('player-health--low', 'player-health--dead');
  }
};

const startGame = () => {
  drawPlayerHealth(game.leftPlayer);
  drawPlayerHealth(game.rightPlayer);
  titleScreen.classList.add('hidden');
  game.start();
}

playButton.addEventListener('click', startGame);
window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') startGame();
});

window.addEventListener('player:scored', (e) => {
  drawPlayerHealth(e.detail.missingPlayer);
});

window.addEventListener('game:over', (e) => {
  console.log(`${e.detail.winningPlayer.playingSide} player wins!`);
  setTimeout(() => titleScreen.classList.remove('hidden'), 300);
});
