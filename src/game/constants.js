export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 480;
export const TILE_SIZE = 32;

export const SCENE_KEYS = {
  BOOT: 'BootScene',
  TITLE: 'TitleScene',
  FIELD: 'FieldScene'
};

export const MAP_IDS = {
  WORLD: 'world',
  CASTLE: 'castle',
  TOWN: 'town'
};

export const TILE = {
  GRASS: 'grass',
  FOREST: 'forest',
  MOUNTAIN: 'mountain',
  WATER: 'water',
  ROAD: 'road',
  CASTLE: 'castle',
  TOWN: 'town',
  FLOOR: 'floor',
  WALL: 'wall',
  EXIT: 'exit',
  THRONE: 'throne',
  HOUSE_FLOOR: 'house_floor'
};

export const TILE_TYPES = {
  [TILE.GRASS]: {
    label: '\u8349\u539f',
    textureKey: 'tile_grass',
    passable: true
  },
  [TILE.FOREST]: {
    label: '\u68ee',
    textureKey: 'tile_forest',
    passable: true
  },
  [TILE.MOUNTAIN]: {
    label: '\u5c71',
    textureKey: 'tile_mountain',
    passable: false
  },
  [TILE.WATER]: {
    label: '\u6c34',
    textureKey: 'tile_water',
    passable: false
  },
  [TILE.ROAD]: {
    label: '\u9053',
    textureKey: 'tile_road',
    passable: true
  },
  [TILE.CASTLE]: {
    label: '\u767d\u9418\u57ce',
    textureKey: 'location_castle',
    passable: true
  },
  [TILE.TOWN]: {
    label: '\u59cb\u307e\u308a\u306e\u753a',
    textureKey: 'location_town',
    passable: true
  },
  [TILE.FLOOR]: {
    label: '\u5e8a',
    textureKey: 'tile_floor',
    passable: true
  },
  [TILE.WALL]: {
    label: '\u58c1',
    textureKey: 'tile_wall',
    passable: false
  },
  [TILE.EXIT]: {
    label: '\u51fa\u53e3',
    textureKey: 'tile_exit',
    passable: true
  },
  [TILE.THRONE]: {
    label: '\u7389\u5ea7',
    textureKey: 'tile_throne',
    passable: false
  },
  [TILE.HOUSE_FLOOR]: {
    label: '\u5bb6',
    textureKey: 'tile_house_floor',
    passable: false
  }
};
