import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../game/constants.js';

const BOX_X = 16;
const BOX_Y = GAME_HEIGHT - 142;
const BOX_WIDTH = GAME_WIDTH - 32;
const BOX_HEIGHT = 126;

export default class MessageBox {
  constructor(scene) {
    this.scene = scene;
    this.lines = [];
    this.currentIndex = 0;
    this.speaker = '';
    this.onComplete = null;

    const box = scene.add.rectangle(BOX_X, BOX_Y, BOX_WIDTH, BOX_HEIGHT, 0x07111f, 0.96)
      .setOrigin(0)
      .setStrokeStyle(2, 0xf8f1d8);

    this.speakerText = scene.add.text(BOX_X + 18, BOX_Y + 12, '', {
      fontFamily: 'monospace',
      fontSize: '17px',
      color: '#fff2b0'
    });

    this.bodyText = scene.add.text(BOX_X + 18, BOX_Y + 42, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
      lineSpacing: 7,
      wordWrap: { width: BOX_WIDTH - 36, useAdvancedWrap: true }
    });

    this.promptText = scene.add.text(BOX_X + BOX_WIDTH - 28, BOX_Y + BOX_HEIGHT - 28, '▼', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#fff2b0'
    });

    this.container = scene.add.container(0, 0, [
      box,
      this.speakerText,
      this.bodyText,
      this.promptText
    ]).setDepth(40).setVisible(false);

    this.container.setSize(BOX_WIDTH, BOX_HEIGHT);
    this.container.setInteractive(
      new Phaser.Geom.Rectangle(BOX_X, BOX_Y, BOX_WIDTH, BOX_HEIGHT),
      Phaser.Geom.Rectangle.Contains
    );
  }

  show({ speaker = '', lines = [], onComplete = null }) {
    this.speaker = speaker;
    this.lines = Array.isArray(lines) ? lines : [lines];
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.container.setVisible(true);
    this.render();
  }

  advance() {
    if (!this.isOpen()) return 'closed';

    if (this.currentIndex < this.lines.length - 1) {
      this.currentIndex += 1;
      this.render();
      return 'advanced';
    }

    this.close({ complete: true });
    return 'completed';
  }

  close({ complete = false } = {}) {
    if (!this.isOpen()) return;

    this.container.setVisible(false);
    const onComplete = this.onComplete;
    this.onComplete = null;

    if (complete && onComplete) {
      onComplete();
    }
  }

  isOpen() {
    return this.container.visible;
  }

  render() {
    this.speakerText.setText(this.speaker);
    this.bodyText.setText(this.lines[this.currentIndex] ?? '');
  }
}
