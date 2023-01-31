import Game from './Game.js';

const canvas = document.querySelector('#canvas');
const titleScreen = document.querySelector('#titleScreen');
const playButton = document.querySelector('[data-play]');
const game = new Game(canvas);

playButton.addEventListener('click', () => {
  titleScreen.classList.add('hidden');
  game.start();
});

window.addEventListener('game:over', (e) => {
  titleScreen.classList.remove('hidden');
  console.log(`Game won at ${e.detail.score}`);
});
