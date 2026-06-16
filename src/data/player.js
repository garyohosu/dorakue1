import { MAP_IDS } from '../game/constants.js';

export const INITIAL_PLAYER = {
  name: '\u30a2\u30ec\u30f3',
  level: 1,
  exp: 0,
  nextExp: 18,
  hp: 24,
  maxHp: 24,
  mp: 6,
  maxMp: 6,
  attack: 7,
  defense: 3,
  gold: 80,
  herbs: 2,
  mapId: MAP_IDS.WORLD,
  x: 4,
  y: 3,
  direction: 'down',
  flags: {
    acceptedQuest: false,
    seenInitialHint: false,
    gotMoonKey: false,
    openedMoonChest: false,
    openedTowerDoor: false,
    gotBlueOrb: false,
    openedTowerChest: false,
    gotMorningMirror: false,
    gotWhiteBellShard: false,
    gotDawnMark: false,
    openedShrineDoor: false,
    gotTideShell: false,
    gotTideMirror: false,
    openedShrineChest: false,
    openedFinalPath: false,
    defeatedFinalBoss: false,
    clearedGame: false
  }
};

export function createInitialPlayer() {
  return JSON.parse(JSON.stringify(INITIAL_PLAYER));
}
