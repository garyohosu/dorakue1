import Phaser from 'phaser';
import { initAudio, playCancel, playConfirm, playCursor } from '../audio/sfx.js';
import { playBgm, setBgmVolume } from '../audio/bgm.js';
import { GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../game/constants.js';
import { createInitialPlayer } from '../data/player.js';
import { hasSavedPlayer, loadSavedPlayer } from '../data/save.js';

const MENU_ITEMS = [
  { label: '新しく始める', action: 'newGame' },
  { label: '続きから', action: 'continue' },
  { label: '操作説明', action: 'help' },
  { label: 'クレジット', action: 'credits' }
];

const HELP_TEXT = [
  '操作説明',
  '',
  '移動: 方向キー / WASD',
  '決定: Enter / Space / Z',
  '戻る: Esc / X',
  'スマホ: 十字キー / A / B',
  '',
  'フィールドでは1キー入力で1マス移動します。'
].join('\n');

const CREDITS_TEXT = [
  'クレジット',
  '',
  '暁の小径 / Path of Dawn',
  '制作検証: dorakue1',
  '実装: AIコーディング支援と人間の確認',
  '音声: Web Audio APIによるオリジナル仮音源',
  '画像: 現段階では単色図形のみ'
].join('\n');

function safelyPlay(fn) {
  try {
    fn();
  } catch (error) {
    console.warn('Audio playback skipped:', error);
  }
}

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.TITLE);
    this.selectedIndex = 0;
    this.panelMode = null;
    this.hasSave = hasSavedPlayer();
    this.bgmStarted = false;
  }

  create() {
    this.selectedIndex = 0;
    this.panelMode = null;

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x101826).setOrigin(0);
    this.add.rectangle(0, 0, GAME_WIDTH, 92, 0x172335).setOrigin(0);
    this.add.rectangle(0, GAME_HEIGHT - 56, GAME_WIDTH, 56, 0x0b1220).setOrigin(0);

    this.add.text(GAME_WIDTH / 2, 86, '暁の小径', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#f8f1d8'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 128, 'Path of Dawn', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#b9d7ff'
    }).setOrigin(0.5);

    this.menuTexts = MENU_ITEMS.map((item, index) => {
      const menuText = this.add.text(226, 206 + index * 42, item.label, {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: this.getMenuItemColor(item)
      });

      menuText.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.selectedIndex = index;
          this.renderMenu();
          this.confirmSelection();
        });

      return menuText;
    });

    this.messageText = this.add.text(GAME_WIDTH / 2, 394, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffe7a3',
      align: 'center'
    }).setOrigin(0.5);

    this.panelBox = this.add.rectangle(GAME_WIDTH / 2, 292, 456, 214, 0x07111f, 0.96)
      .setStrokeStyle(2, 0xf8f1d8)
      .setVisible(false)
      .setInteractive();

    this.panelBox.on('pointerdown', () => {
      if (this.panelMode) this.closePanel();
    });

    this.panelText = this.add.text(116, 200, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
      lineSpacing: 8
    }).setVisible(false).setInteractive();

    this.panelText.on('pointerdown', () => {
      if (this.panelMode) this.closePanel();
    });

    this.renderMenu();
    this.setupInput();
    this.setupAudioUnlock();
  }

  setupInput() {
    this.input.keyboard.on('keydown', this.handleKeyDown, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard.off('keydown', this.handleKeyDown, this);
    });
  }

  setupAudioUnlock() {
    const unlockAndStartBgm = () => {
      if (this.bgmStarted) return;
      this.bgmStarted = true;
      try {
        initAudio();
        setBgmVolume(0.35);
        playBgm('title');
      } catch (error) {
        console.warn('Title BGM skipped:', error);
      }
    };

    this.input.keyboard.once('keydown', unlockAndStartBgm);
    this.input.once('pointerdown', unlockAndStartBgm);
  }

  handleKeyDown(event) {
    event.preventDefault();

    if (this.panelMode) {
      if (this.isCancel(event) || this.isConfirm(event)) {
        this.closePanel();
      } else {
        safelyPlay(playCancel);
      }
      return;
    }

    if (this.isUp(event)) {
      this.moveCursor(-1);
      return;
    }

    if (this.isDown(event)) {
      this.moveCursor(1);
      return;
    }

    if (this.isConfirm(event)) {
      this.confirmSelection();
      return;
    }

    if (this.isCancel(event)) {
      this.messageText.setText('');
      safelyPlay(playCancel);
    }
  }

  isUp(event) {
    return event.code === 'ArrowUp' || event.code === 'KeyW';
  }

  isDown(event) {
    return event.code === 'ArrowDown' || event.code === 'KeyS';
  }

  isConfirm(event) {
    return event.code === 'Enter' || event.code === 'Space' || event.code === 'KeyZ';
  }

  isCancel(event) {
    return event.code === 'Escape' || event.code === 'KeyX';
  }

  moveCursor(delta) {
    this.selectedIndex = (this.selectedIndex + delta + MENU_ITEMS.length) % MENU_ITEMS.length;
    this.messageText.setText('');
    this.renderMenu();
    safelyPlay(playCursor);
  }

  renderMenu() {
    this.menuTexts.forEach((text, index) => {
      const item = MENU_ITEMS[index];
      text.setText(`${index === this.selectedIndex ? '>' : ' '} ${item.label}`);
      text.setColor(this.getMenuItemColor(item));
    });
  }

  getMenuItemColor(item) {
    if (item.action === 'continue' && !this.hasSave) return '#8b93a3';
    return '#ffffff';
  }

  confirmSelection() {
    const item = MENU_ITEMS[this.selectedIndex];

    if (item.action === 'newGame') {
      safelyPlay(playConfirm);
      this.scene.start(SCENE_KEYS.FIELD, { player: createInitialPlayer() });
      return;
    }

    if (item.action === 'continue') {
      const savedPlayer = loadSavedPlayer();
      if (!savedPlayer) {
        this.messageText.setText('記録がありません。');
        safelyPlay(playCancel);
        return;
      }

      safelyPlay(playConfirm);
      this.scene.start(SCENE_KEYS.FIELD, { player: savedPlayer });
      return;
    }

    if (item.action === 'help') {
      safelyPlay(playConfirm);
      this.openPanel('help', HELP_TEXT);
      return;
    }

    if (item.action === 'credits') {
      safelyPlay(playConfirm);
      this.openPanel('credits', CREDITS_TEXT);
    }
  }

  openPanel(mode, text) {
    this.panelMode = mode;
    this.panelBox.setVisible(true);
    this.panelText.setText(text).setVisible(true);
    this.messageText.setText('');
  }

  closePanel() {
    this.panelMode = null;
    this.panelBox.setVisible(false);
    this.panelText.setVisible(false);
    safelyPlay(playCancel);
  }
}
