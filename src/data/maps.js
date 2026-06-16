import { MAP_IDS, TILE } from '../game/constants.js';

const G = TILE.GRASS;
const F = TILE.FOREST;
const M = TILE.MOUNTAIN;
const W = TILE.WATER;
const R = TILE.ROAD;
const C = TILE.CASTLE;
const T = TILE.TOWN;
const V = TILE.CAVE;
const O = TILE.FLOOR;
const X = TILE.WALL;
const E = TILE.EXIT;
const H = TILE.THRONE;
const B = TILE.HOUSE_FLOOR;

export const WORLD_MAP = {
  id: MAP_IDS.WORLD,
  name: '\u30ea\u30e5\u30df\u30ca\u5730\u65b9',
  width: 20,
  height: 15,
  startPositions: {
    newGame: { x: 4, y: 3, direction: 'down' },
    fromCastle: { x: 4, y: 3, direction: 'down' },
    fromTown: { x: 13, y: 3, direction: 'down' }
  },
  entrances: [
    {
      x: 3,
      y: 3,
      targetMapId: MAP_IDS.CASTLE,
      targetX: 10,
      targetY: 13,
      targetDirection: 'up'
    },
    {
      x: 12,
      y: 3,
      targetMapId: MAP_IDS.TOWN,
      targetX: 10,
      targetY: 13,
      targetDirection: 'up'
    },
    {
      x: 17,
      y: 3,
      targetMapId: MAP_IDS.CAVE,
      targetX: 10,
      targetY: 13,
      targetDirection: 'up'
    }
  ],
  exits: [],
  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, G, G, G, G, G, G, G, F, F, G, G, G, M, M, M, G, G, G, W],
    [W, G, F, F, W, R, R, G, F, G, G, R, R, R, G, M, G, F, G, W],
    [W, G, F, C, R, M, R, R, R, R, R, R, T, R, R, M, G, V, R, W],
    [W, G, G, G, R, G, G, G, F, F, G, G, R, G, R, M, G, R, R, W],
    [W, F, F, G, R, R, R, G, G, G, M, G, R, R, R, R, R, R, R, W],
    [W, G, G, G, G, F, R, R, R, G, M, G, G, G, R, G, W, W, G, W],
    [W, G, M, M, G, F, F, F, R, G, M, M, M, G, R, G, W, G, G, W],
    [W, G, G, M, G, G, G, F, R, R, R, R, G, G, R, G, W, G, F, W],
    [W, F, G, M, M, M, G, G, G, F, F, R, G, G, R, R, R, G, F, W],
    [W, G, G, G, G, M, G, W, W, W, G, R, G, M, M, M, R, G, G, W],
    [W, G, F, F, G, G, G, W, G, W, G, R, G, G, G, M, R, F, G, W],
    [W, G, G, G, R, R, R, R, G, W, G, R, R, R, G, G, R, G, G, W],
    [W, W, G, G, G, F, F, G, G, G, G, G, F, R, R, R, G, G, W, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W]
  ]
};

export const CASTLE_MAP = {
  id: MAP_IDS.CASTLE,
  name: '\u767d\u9418\u57ce',
  width: 20,
  height: 15,
  startPositions: {
    fromWorld: { x: 10, y: 13, direction: 'up' }
  },
  entrances: [],
  exits: [
    {
      x: 10,
      y: 14,
      targetMapId: MAP_IDS.WORLD,
      targetX: 4,
      targetY: 3,
      targetDirection: 'down'
    }
  ],
  tiles: [
    [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    [X, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, X],
    [X, O, O, X, O, O, O, O, H, H, H, H, O, O, O, O, X, O, O, X],
    [X, O, O, X, O, O, O, O, H, H, H, H, O, O, O, O, X, O, O, X],
    [X, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, X],
    [X, O, O, O, X, O, O, O, O, O, O, O, O, O, O, X, O, O, O, X],
    [X, O, O, O, X, O, O, O, O, O, O, O, O, O, O, X, O, O, O, X],
    [X, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, X],
    [X, O, O, O, O, X, X, O, O, O, O, O, X, X, O, O, O, O, O, X],
    [X, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, X],
    [X, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, X],
    [X, O, O, X, O, O, O, O, O, O, O, O, O, O, O, O, X, O, O, X],
    [X, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, X],
    [X, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, X],
    [X, X, X, X, X, X, X, X, X, X, E, X, X, X, X, X, X, X, X, X]
  ]
};

export const TOWN_MAP = {
  id: MAP_IDS.TOWN,
  name: '\u59cb\u307e\u308a\u306e\u753a',
  width: 20,
  height: 15,
  startPositions: {
    fromWorld: { x: 10, y: 13, direction: 'up' }
  },
  entrances: [],
  exits: [
    {
      x: 10,
      y: 14,
      targetMapId: MAP_IDS.WORLD,
      targetX: 13,
      targetY: 3,
      targetDirection: 'down'
    }
  ],
  tiles: [
    [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    [X, O, O, O, O, O, O, O, O, R, R, O, O, O, O, O, O, O, O, X],
    [X, O, B, B, B, O, O, O, O, R, R, O, O, B, B, B, O, O, O, X],
    [X, O, B, B, B, O, O, O, O, R, R, O, O, B, B, B, O, O, O, X],
    [X, O, B, B, B, O, O, O, O, R, R, O, O, B, B, B, O, O, O, X],
    [X, O, O, O, O, O, O, O, O, R, R, O, O, O, O, O, O, O, O, X],
    [X, O, O, O, O, O, B, B, B, R, R, B, B, B, O, O, O, O, O, X],
    [X, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, X],
    [X, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, X],
    [X, O, O, O, O, O, O, O, O, R, R, O, O, O, O, O, O, O, O, X],
    [X, O, B, B, B, O, O, O, O, R, R, O, O, B, B, B, O, O, O, X],
    [X, O, B, B, B, O, O, O, O, R, R, O, O, B, B, B, O, O, O, X],
    [X, O, O, O, O, O, O, O, O, R, R, O, O, O, O, O, O, O, O, X],
    [X, O, O, O, O, O, O, O, O, R, R, O, O, O, O, O, O, O, O, X],
    [X, X, X, X, X, X, X, X, X, X, E, X, X, X, X, X, X, X, X, X]
  ]
};

export const CAVE_MAP = {
  id: MAP_IDS.CAVE,
  name: '\u6708\u82d4\u306e\u6d1e',
  width: 20,
  height: 15,
  startPositions: {
    fromWorld: { x: 10, y: 13, direction: 'up' }
  },
  entrances: [],
  exits: [
    {
      x: 10,
      y: 14,
      targetMapId: MAP_IDS.WORLD,
      targetX: 17,
      targetY: 4,
      targetDirection: 'down'
    }
  ],
  tiles: [
    [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    [X, O, O, O, O, X, X, O, O, O, O, O, X, X, O, O, O, O, O, X],
    [X, O, X, X, O, O, O, O, X, X, X, O, O, O, O, X, X, X, O, X],
    [X, O, X, O, O, X, X, O, O, O, X, O, X, X, O, O, O, X, O, X],
    [X, O, O, O, X, X, O, O, X, O, O, O, O, X, X, O, O, O, O, X],
    [X, X, X, O, O, O, O, X, X, O, X, X, O, O, O, O, X, X, O, X],
    [X, O, O, O, X, X, O, O, O, O, O, X, X, X, O, O, O, X, O, X],
    [X, O, X, X, X, O, O, X, X, O, O, O, O, X, O, X, O, O, O, X],
    [X, O, O, O, X, O, X, X, O, O, X, X, O, O, O, X, X, X, O, X],
    [X, X, X, O, O, O, O, O, O, X, X, O, O, X, O, O, O, O, O, X],
    [X, O, O, O, X, X, X, O, X, X, O, O, X, X, X, O, X, X, O, X],
    [X, O, X, O, O, O, X, O, O, O, O, X, O, O, O, O, O, X, O, X],
    [X, O, X, X, X, O, O, O, X, O, O, O, O, X, X, X, O, O, O, X],
    [X, O, O, O, O, O, X, O, O, O, O, O, X, O, O, O, O, X, O, X],
    [X, X, X, X, X, X, X, X, X, X, E, X, X, X, X, X, X, X, X, X]
  ]
};

export const MAPS = {
  [WORLD_MAP.id]: WORLD_MAP,
  [CASTLE_MAP.id]: CASTLE_MAP,
  [TOWN_MAP.id]: TOWN_MAP,
  [CAVE_MAP.id]: CAVE_MAP
};

export function getMap(mapId = MAP_IDS.WORLD) {
  return MAPS[mapId] ?? WORLD_MAP;
}
