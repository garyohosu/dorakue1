import Phaser from 'phaser';
import { playCancel, playConfirm, playText } from '../audio/sfx.js';
import { GAME_HEIGHT, GAME_WIDTH, MAP_IDS, SCENE_KEYS, TILE, TILE_SIZE, TILE_TYPES } from '../game/constants.js';
import { TEXTURE_KEYS } from '../game/pixelTextures.js';
import { createInitialPlayer } from '../data/player.js';
import { getMap } from '../data/maps.js';
import { getNpcsForMap } from '../data/npcs.js';
import MessageBox from '../ui/MessageBox.js';

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const STATUS_BAR = {
  x: 12,
  y: 8,
  width: GAME_WIDTH - 24,
  height: 28,
  textX: 24,
  textY: 14
};

const TOUCH_BUTTON = {
  size: 44,
  gap: 8,
  alpha: 0.72,
  depth: 35
};

function safelyPlay(fn) {
  try {
    fn();
  } catch (error) {
    console.warn('Audio playback skipped:', error);
  }
}

export default class FieldScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.FIELD);
    this.nextMoveAt = 0;
  }

  create(data = {}) {
    this.nextMoveAt = 0;
    this.player = this.createPlayerState(data.player);
    this.map = getMap(this.player.mapId);
    this.npcs = getNpcsForMap(this.map.id);
    this.blockMarker = null;

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0a101a).setOrigin(0);
    this.drawMap();
    this.drawNpcs();
    this.createPlayerSprite();
    this.createStatusWindow();
    this.createNoticeText();
    this.messageBox = new MessageBox(this);
    this.setupMessageTouch();
    this.createTouchControls();
    this.showInitialHint();
    this.setupInput();
    this.publishDebugState();
  }

  createPlayerState(playerData) {
    const initialPlayer = createInitialPlayer();
    if (!playerData) return initialPlayer;

    return {
      ...initialPlayer,
      ...playerData,
      flags: {
        ...initialPlayer.flags,
        ...(playerData.flags ?? {})
      }
    };
  }

  drawMap() {
    this.map.tiles.forEach((row, y) => {
      row.forEach((tileId, x) => {
        const tile = TILE_TYPES[tileId];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        this.add.image(px, py, tile.textureKey).setOrigin(0);
        this.add.rectangle(px, py, TILE_SIZE, TILE_SIZE, 0x000000, 0)
          .setOrigin(0)
          .setStrokeStyle(1, 0x111827, 0.2);
      });
    });
  }

  drawNpcs() {
    this.npcSprites = this.npcs.map((npc) => {
      const { x, y } = this.tileToWorld(npc.x, npc.y);
      return this.add.image(x, y, npc.textureKey).setDepth(9);
    });
  }

  createPlayerSprite() {
    const { x, y } = this.tileToWorld(this.player.x, this.player.y);
    this.playerSprite = this.add.image(x, y, this.getPlayerTexture())
      .setDepth(10);
  }

  createStatusWindow() {
    this.add.rectangle(STATUS_BAR.x, STATUS_BAR.y, STATUS_BAR.width, STATUS_BAR.height, 0x05070d, 0.9)
      .setOrigin(0)
      .setStrokeStyle(2, 0xf8f1d8)
      .setDepth(20);

    this.statusText = this.add.text(STATUS_BAR.textX, STATUS_BAR.textY, this.getStatusText(), {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
      wordWrap: { width: STATUS_BAR.width - 24, useAdvancedWrap: true }
    }).setDepth(21);
  }

  createNoticeText() {
    this.noticeText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 26, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#fff2b0',
      backgroundColor: '#05070dcc',
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5).setDepth(30);
  }

  setupMessageTouch() {
    this.messageBox.container.on('pointerdown', () => {
      if (!this.messageBox.isOpen()) return;
      const result = this.messageBox.advance();
      safelyPlay(result === 'advanced' ? playText : playCancel);
      this.publishDebugState();
    });
  }

  createTouchControls() {
    if (!this.shouldShowTouchControls()) return;

    this.touchControls = this.add.container(0, 0).setDepth(TOUCH_BUTTON.depth);

    const baseX = 82;
    const baseY = GAME_HEIGHT - 78;
    this.addTouchButton(baseX, baseY - TOUCH_BUTTON.size - TOUCH_BUTTON.gap, '\u25b2', () => this.tryMove('up'));
    this.addTouchButton(baseX, baseY + TOUCH_BUTTON.size + TOUCH_BUTTON.gap, '\u25bc', () => this.tryMove('down'));
    this.addTouchButton(baseX - TOUCH_BUTTON.size - TOUCH_BUTTON.gap, baseY, '\u25c0', () => this.tryMove('left'));
    this.addTouchButton(baseX + TOUCH_BUTTON.size + TOUCH_BUTTON.gap, baseY, '\u25b6', () => this.tryMove('right'));

    this.addTouchButton(GAME_WIDTH - 86, GAME_HEIGHT - 90, 'A', () => this.handleTouchConfirm(), 52);
    this.addTouchButton(GAME_WIDTH - 148, GAME_HEIGHT - 42, 'B', () => this.handleTouchCancel(), 44);
  }

  shouldShowTouchControls() {
    return navigator.maxTouchPoints > 0 || window.matchMedia?.('(pointer: coarse)').matches;
  }

  addTouchButton(x, y, label, onPress, size = TOUCH_BUTTON.size) {
    const button = this.add.container(x, y);
    const fill = this.add.circle(0, 0, size / 2, 0x05070d, TOUCH_BUTTON.alpha)
      .setStrokeStyle(2, 0xf8f1d8, 0.86);
    const text = this.add.text(0, 0, label, {
      fontFamily: 'monospace',
      fontSize: label.length === 1 ? '20px' : '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    button.add([fill, text]);
    button.setSize(size, size);
    button.setInteractive(
      new Phaser.Geom.Circle(0, 0, size / 2),
      Phaser.Geom.Circle.Contains
    );
    button.on('pointerdown', (pointer, localX, localY, event) => {
      event?.stopPropagation();
      onPress();
    });
    button.on('pointerover', () => fill.setFillStyle(0x172335, 0.9));
    button.on('pointerout', () => fill.setFillStyle(0x05070d, TOUCH_BUTTON.alpha));

    this.touchControls.add(button);
    return button;
  }

  handleTouchConfirm() {
    if (this.messageBox?.isOpen()) {
      const result = this.messageBox.advance();
      safelyPlay(result === 'advanced' ? playText : playCancel);
      this.publishDebugState();
      return;
    }

    this.interact();
  }

  handleTouchCancel() {
    if (this.messageBox?.isOpen()) {
      this.messageBox.close();
      safelyPlay(playCancel);
      this.publishDebugState();
      return;
    }

    safelyPlay(playCancel);
  }

  setupInput() {
    this.input.keyboard.on('keydown', this.handleKeyDown, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard.off('keydown', this.handleKeyDown, this);
    });
  }

  handleKeyDown(event) {
    event.preventDefault();

    if (this.messageBox?.isOpen()) {
      this.handleMessageKey(event);
      return;
    }

    if (event.code === 'ArrowUp' || event.code === 'KeyW') {
      this.tryMove('up');
    } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
      this.tryMove('down');
    } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      this.tryMove('left');
    } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      this.tryMove('right');
    } else if (this.isConfirm(event)) {
      this.interact();
    } else if (this.isCancel(event)) {
      safelyPlay(playCancel);
    }
  }

  handleMessageKey(event) {
    if (this.isConfirm(event)) {
      const result = this.messageBox.advance();
      safelyPlay(result === 'advanced' ? playText : playCancel);
      this.publishDebugState();
      return;
    }

    if (this.isCancel(event)) {
      this.messageBox.close();
      safelyPlay(playCancel);
      this.publishDebugState();
    }
  }

  isConfirm(event) {
    return event.code === 'Enter' || event.code === 'Space' || event.code === 'KeyZ';
  }

  isCancel(event) {
    return event.code === 'Escape' || event.code === 'KeyX';
  }

  tryMove(direction) {
    if (this.messageBox?.isOpen()) return;

    const now = this.time.now;
    if (now < this.nextMoveAt) return;
    this.nextMoveAt = now + 120;

    const delta = DIRECTIONS[direction];
    const target = {
      x: this.player.x + delta.x,
      y: this.player.y + delta.y
    };

    this.player.direction = direction;

    const npc = this.getNpcAt(target.x, target.y);
    if (npc) {
      this.showNpcPrompt(target.x, target.y);
      return;
    }

    if (!this.canMoveTo(target.x, target.y)) {
      this.showBlocked(target.x, target.y);
      safelyPlay(playCancel);
      return;
    }

    this.player.x = target.x;
    this.player.y = target.y;
    this.updatePlayerSprite();
    this.noticeText.setText('');
    this.publishDebugState();

    this.tryTransitionAt(this.player.x, this.player.y);
  }

  interact() {
    if (this.messageBox?.isOpen()) return;

    const facing = this.getFacingPosition();
    const npc = this.getNpcAt(facing.x, facing.y);
    if (npc) {
      this.startNpcConversation(npc);
      return;
    }

    if (this.tryInspectTile(facing.x, facing.y)) return;

    if (this.tryTransitionAt(this.player.x, this.player.y)) return;

    if (this.tryTransitionAt(facing.x, facing.y)) return;

    safelyPlay(playCancel);
  }

  canMoveTo(x, y) {
    if (x < 0 || y < 0 || x >= this.map.width || y >= this.map.height) {
      return false;
    }

    const tileId = this.map.tiles[y][x];
    return TILE_TYPES[tileId]?.passable === true;
  }

  tryInspectTile(x, y) {
    const tileId = this.getTileAt(x, y);

    if (tileId === TILE.CHEST) {
      this.openChestForCurrentMap();
      return true;
    }

    if (tileId === TILE.ALTAR && this.map.id === MAP_IDS.FINAL) {
      this.completeFinalAltar();
      return true;
    }

    return false;
  }

  getTileAt(x, y) {
    if (x < 0 || y < 0 || x >= this.map.width || y >= this.map.height) {
      return null;
    }

    return this.map.tiles[y][x];
  }

  tryTransitionAt(x, y) {
    const transition = this.findTransitionAt(x, y);
    if (!transition) return false;

    if (!this.canUseTransition(transition)) {
      this.showTransitionBlocked(transition, x, y);
      return true;
    }

    this.goToMap(transition);
    return true;
  }

  canUseTransition(transition) {
    if (!transition.requiredFlag) return true;
    return this.player.flags[transition.requiredFlag] === true;
  }

  showTransitionBlocked(transition, x, y) {
    safelyPlay(playCancel);
    this.noticeText.setText(transition.missingMessage ?? '\u307e\u3060\u3053\u3053\u306b\u306f\u5165\u308c\u306a\u3044\u3002');
    this.showTileMarker(x, y, 0xfff2b0, 0.3);
    this.publishDebugState();
  }

  findTransitionAt(x, y) {
    const transitions = [
      ...(this.map.entrances ?? []),
      ...(this.map.exits ?? [])
    ];

    return transitions.find((transition) => transition.x === x && transition.y === y);
  }

  goToMap(transition) {
    const targetMap = getMap(transition.targetMapId);

    if (transition.setFlag) {
      this.player.flags[transition.setFlag] = true;
    }

    this.player.mapId = targetMap.id;
    this.player.x = transition.targetX;
    this.player.y = transition.targetY;
    this.player.direction = transition.targetDirection ?? this.player.direction;

    safelyPlay(playConfirm);
    this.scene.restart({ player: this.player });
  }

  startNpcConversation(npc) {
    this.noticeText.setText('');
    safelyPlay(playConfirm);
    this.messageBox.show({
      speaker: npc.name,
      lines: this.getNpcDialogue(npc),
      onComplete: () => this.completeNpcConversation(npc)
    });
    this.publishDebugState();
  }

  getNpcDialogue(npc) {
    if (this.player.flags.gotTideMirror && npc.mirrorDialogue) {
      return npc.mirrorDialogue;
    }

    if (this.player.flags.gotDawnMark && npc.dawnDialogue) {
      return npc.dawnDialogue;
    }

    if (npc.id === 'king' && this.player.flags.gotBlueOrb && !this.player.flags.gotDawnMark && npc.orbDialogue) {
      return npc.orbDialogue;
    }

    if (this.player.flags.gotMoonKey && npc.keyDialogue) {
      return npc.keyDialogue;
    }

    if (npc.id === 'king' && this.player.flags.acceptedQuest) {
      return npc.acceptedDialogue;
    }

    return npc.dialogue;
  }

  completeNpcConversation(npc) {
    if (npc.id === 'king' && !this.player.flags.acceptedQuest) {
      this.player.flags.acceptedQuest = true;
    }

    if (npc.id === 'king' && this.player.flags.gotBlueOrb && !this.player.flags.gotDawnMark) {
      this.player.flags.gotDawnMark = true;
      this.statusText.setText(this.getStatusText());
    }

    this.publishDebugState();
  }

  showBlocked(x, y) {
    if (this.getTileAt(x, y) === TILE.CHEST) {
      this.noticeText.setText('\u5b9d\u7bb1\u306f\u6c7a\u5b9a\u30ad\u30fc\u3067\u8abf\u3079\u3089\u308c\u308b\u3002');
      this.showTileMarker(x, y, 0xfff2b0, 0.28);
      this.publishDebugState();
      return;
    }

    if (this.getTileAt(x, y) === TILE.ALTAR) {
      this.noticeText.setText('\u796d\u58c7\u306f\u6c7a\u5b9a\u30ad\u30fc\u3067\u8abf\u3079\u3089\u308c\u308b\u3002');
      this.showTileMarker(x, y, 0xd25c8b, 0.3);
      this.publishDebugState();
      return;
    }

    this.noticeText.setText('\u305d\u3053\u3078\u306f\u9032\u3081\u306a\u3044\u3002');
    this.showTileMarker(x, y, 0xffffff, 0.22);
    this.publishDebugState();
  }

  showNpcPrompt(x, y) {
    this.noticeText.setText('\u8a71\u3057\u304b\u3051\u308b\u306b\u306f\u6c7a\u5b9a\u30ad\u30fc\u3092\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\u3002');
    this.showTileMarker(x, y, 0xfff2b0, 0.28);
    this.publishDebugState();
  }

  showTileMarker(x, y, color, alpha) {
    if (this.blockMarker) {
      this.blockMarker.destroy();
      this.blockMarker = null;
    }

    if (x >= 0 && y >= 0 && x < this.map.width && y < this.map.height) {
      this.blockMarker = this.add.rectangle(
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        color,
        alpha
      ).setOrigin(0).setDepth(8);

      this.time.delayedCall(120, () => {
        if (this.blockMarker) {
          this.blockMarker.destroy();
          this.blockMarker = null;
        }
      });
    }
  }

  updatePlayerSprite() {
    const { x, y } = this.tileToWorld(this.player.x, this.player.y);
    this.playerSprite.setPosition(x, y);
    this.playerSprite.setTexture(this.getPlayerTexture());
    this.statusText.setText(this.getStatusText());
  }

  tileToWorld(tileX, tileY) {
    return {
      x: tileX * TILE_SIZE + TILE_SIZE / 2,
      y: tileY * TILE_SIZE + TILE_SIZE / 2
    };
  }

  getFacingPosition() {
    const delta = DIRECTIONS[this.player.direction] ?? DIRECTIONS.down;
    return {
      x: this.player.x + delta.x,
      y: this.player.y + delta.y
    };
  }

  getNpcAt(x, y) {
    return this.npcs.find((npc) => npc.x === x && npc.y === y);
  }

  showInitialHint() {
    if (this.player.flags.acceptedQuest || this.player.flags.seenInitialHint) return;

    this.noticeText.setText('\u738b\u306b\u8a71\u3057\u304b\u3051\u3066\u304f\u3060\u3055\u3044\u3002');
    this.player.flags.seenInitialHint = true;
  }

  openMoonChest() {
    this.noticeText.setText('');

    if (this.player.flags.openedMoonChest) {
      safelyPlay(playCancel);
      this.messageBox.show({
        lines: ['\u5b9d\u7bb1\u306f\u304b\u3089\u3063\u307d\u3060\u3002']
      });
      this.publishDebugState();
      return;
    }

    this.player.flags.openedMoonChest = true;
    this.player.flags.gotMoonKey = true;
    this.statusText.setText(this.getStatusText());
    safelyPlay(playConfirm);
    this.messageBox.show({
      lines: [
        '\u5b9d\u7bb1\u3092\u958b\u3051\u305f\u3002',
        '\u6708\u7d0b\u306e\u9375\u3092\u624b\u306b\u5165\u308c\u305f\uff01'
      ]
    });
    this.publishDebugState();
  }

  openChestForCurrentMap() {
    if (this.map.id === MAP_IDS.CAVE) {
      this.openMoonChest();
      return;
    }

    if (this.map.id === MAP_IDS.TOWER) {
      this.openTowerChest();
      return;
    }

    if (this.map.id === MAP_IDS.SHRINE) {
      this.openShrineChest();
      return;
    }

    safelyPlay(playCancel);
    this.messageBox.show({
      lines: ['\u5b9d\u7bb1\u306f\u958b\u304b\u306a\u3044\u3002']
    });
    this.publishDebugState();
  }

  openTowerChest() {
    this.noticeText.setText('');

    if (this.player.flags.openedTowerChest) {
      safelyPlay(playCancel);
      this.messageBox.show({
        lines: ['\u5b9d\u7bb1\u306f\u304b\u3089\u3063\u307d\u3060\u3002']
      });
      this.publishDebugState();
      return;
    }

    this.player.flags.openedTowerChest = true;
    this.player.flags.gotBlueOrb = true;
    this.statusText.setText(this.getStatusText());
    safelyPlay(playConfirm);
    this.messageBox.show({
      lines: [
        '\u5854\u306e\u6700\u4e0a\u90e8\u3067\u9752\u3044\u5149\u304c\u5f3e\u3051\u305f\u3002',
        '\u9752\u706f\u306e\u73e0\u3092\u624b\u306b\u5165\u308c\u305f\uff01',
        '\u738b\u57ce\u3078\u623b\u308a\u3001\u30bb\u30ea\u30aa\u30eb\u738b\u306b\u5831\u544a\u3057\u3088\u3046\u3002'
      ]
    });
    this.publishDebugState();
  }

  openShrineChest() {
    this.noticeText.setText('');

    if (this.player.flags.openedShrineChest) {
      safelyPlay(playCancel);
      this.messageBox.show({
        lines: ['\u5b9d\u7bb1\u306f\u304b\u3089\u3063\u307d\u3060\u3002']
      });
      this.publishDebugState();
      return;
    }

    this.player.flags.openedShrineChest = true;
    this.player.flags.gotTideMirror = true;
    this.statusText.setText(this.getStatusText());
    safelyPlay(playConfirm);
    this.messageBox.show({
      lines: [
        '\u6f6e\u306e\u97f3\u304c\u77f3\u5ba4\u306b\u6e80\u3061\u305f\u3002',
        '\u6f6e\u8def\u306e\u93e1\u3092\u624b\u306b\u5165\u308c\u305f\uff01',
        '\u9ed2\u3044\u5cac\u3078\u7d9a\u304f\u9053\u304c\u3001\u6d77\u8fba\u306b\u958b\u3051\u305d\u3046\u3060\u3002'
      ]
    });
    this.publishDebugState();
  }

  completeFinalAltar() {
    this.noticeText.setText('');

    if (this.player.flags.clearedGame) {
      safelyPlay(playConfirm);
      this.messageBox.show({
        lines: [
          '\u767d\u9418\u306f\u9759\u304b\u306b\u671d\u3092\u544a\u3052\u3066\u3044\u308b\u3002',
          '\u30ea\u30e5\u30df\u30ca\u306e\u65c5\u306f\u3001\u3059\u3067\u306b\u591c\u660e\u3051\u3092\u8fce\u3048\u305f\u3002'
        ]
      });
      this.publishDebugState();
      return;
    }

    this.player.flags.clearedGame = true;
    this.statusText.setText(this.getStatusText());
    safelyPlay(playConfirm);
    this.messageBox.show({
      lines: [
        '\u6f6e\u8def\u306e\u93e1\u304c\u95c7\u306e\u796d\u58c7\u306b\u671d\u306e\u5149\u3092\u8fd4\u3057\u305f\u3002',
        '\u9ed2\u3044\u9727\u306f\u6d77\u3078\u3068\u307b\u3069\u3051\u3001\u9060\u304f\u767d\u9418\u304c\u9cf4\u308a\u59cb\u3081\u308b\u3002',
        '\u9577\u3044\u591c\u306f\u7d42\u308f\u3063\u305f\u3002',
        '\u30a2\u30ec\u30f3\u306e\u65c5\u306f\u3001\u671d\u306e\u5c0f\u5f84\u306b\u8a9e\u308a\u7d99\u304c\u308c\u308b\u3002',
        'THE END'
      ]
    });
    this.publishDebugState();
  }

  getStatusText() {
    const keyText = this.player.flags.gotMoonKey ? '  \u6708\u7d0b\u306e\u9375' : '';
    const towerText = this.player.flags.openedTowerDoor ? '  \u5854\u958b\u9580' : '';
    const orbText = this.player.flags.gotBlueOrb ? '  \u9752\u706f\u306e\u73e0' : '';
    const dawnText = this.player.flags.gotDawnMark ? '  \u671d\u9727\u306e\u5370' : '';
    const mirrorText = this.player.flags.gotTideMirror ? '  \u6f6e\u8def\u306e\u93e1' : '';
    const clearText = this.player.flags.clearedGame ? '  \u591c\u660e\u3051' : '';
    return `\u73fe\u5728\u5730: ${this.map.name}  ${this.player.name}  Lv ${this.player.level}  HP ${this.player.hp}/${this.player.maxHp}  MP ${this.player.mp}/${this.player.maxMp}  ${this.player.gold}\u30ea\u30e0${keyText}${towerText}${orbText}${dawnText}${mirrorText}${clearText}`;
  }

  getPlayerTexture() {
    const textureByDirection = {
      up: TEXTURE_KEYS.PLAYER_UP,
      down: TEXTURE_KEYS.PLAYER_DOWN,
      left: TEXTURE_KEYS.PLAYER_LEFT,
      right: TEXTURE_KEYS.PLAYER_RIGHT
    };

    return textureByDirection[this.player.direction] ?? TEXTURE_KEYS.PLAYER_DOWN;
  }

  publishDebugState() {
    if (!import.meta.env.DEV) return;
    window.__dorakueDebug = {
      scene: 'FieldScene',
      mapId: this.map.id,
      mapName: this.map.name,
      player: {
        x: this.player.x,
        y: this.player.y,
        direction: this.player.direction
      },
      flags: { ...this.player.flags },
      npcs: this.npcs.map((npc) => ({
        id: npc.id,
        x: npc.x,
        y: npc.y
      })),
      dialog: {
        open: this.messageBox?.isOpen() ?? false,
        speaker: this.messageBox?.speaker ?? ''
      },
      notice: this.noticeText?.text ?? ''
    };
  }
}
