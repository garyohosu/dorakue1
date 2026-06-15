import { initAudio, playCursor } from './audio/sfx.js';
import { playBgm } from './audio/bgm.js';

console.log('暁の小径 / Path of Dawn - Audio System initialized');

// 自動再生制限の解除用リスナー
window.addEventListener('click', () => {
  initAudio();
  console.log('Audio Context activated by user click');
}, { once: true });

window.addEventListener('keydown', () => {
  initAudio();
  console.log('Audio Context activated by user keydown');
}, { once: true });
