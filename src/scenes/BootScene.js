import Phaser from 'phaser';
import { SCENE_KEYS } from '../game/constants.js';
import { registerPixelTextures } from '../game/pixelTextures.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  create() {
    registerPixelTextures(this);
    this.scene.start(SCENE_KEYS.TITLE);
  }
}
