import Phaser from 'phaser';
import { initAudio } from './audio/sfx.js';
import { gameConfig } from './game/config.js';

function unlockAudio() {
  initAudio();
}

window.addEventListener('pointerdown', unlockAudio, { once: true });
window.addEventListener('keydown', unlockAudio, { once: true });

const game = new Phaser.Game(gameConfig);

if (import.meta.env.DEV) {
  window.__dorakueGame = game;
}
