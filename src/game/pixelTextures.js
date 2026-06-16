export const TEXTURE_KEYS = {
  PLAYER_DOWN: 'player_down',
  PLAYER_UP: 'player_up',
  PLAYER_LEFT: 'player_left',
  PLAYER_RIGHT: 'player_right',
  TILE_GRASS: 'tile_grass',
  TILE_FOREST: 'tile_forest',
  TILE_MOUNTAIN: 'tile_mountain',
  TILE_WATER: 'tile_water',
  TILE_ROAD: 'tile_road',
  TILE_FLOOR: 'tile_floor',
  TILE_WALL: 'tile_wall',
  TILE_EXIT: 'tile_exit',
  TILE_THRONE: 'tile_throne',
  TILE_HOUSE_FLOOR: 'tile_house_floor',
  LOCATION_CASTLE: 'location_castle',
  LOCATION_TOWN: 'location_town',
  LOCATION_CAVE: 'location_cave',
  NPC_KING: 'npc_king',
  NPC_KEEPER: 'npc_keeper',
  NPC_GUARD: 'npc_guard',
  NPC_TOWNSPERSON: 'npc_townsperson',
  NPC_MERCHANT: 'npc_merchant',
  NPC_ELDER: 'npc_elder'
};

const SIZE = 32;

export function registerPixelTextures(scene) {
  createTexture(scene, TEXTURE_KEYS.TILE_GRASS, drawGrass);
  createTexture(scene, TEXTURE_KEYS.TILE_FOREST, drawForest);
  createTexture(scene, TEXTURE_KEYS.TILE_MOUNTAIN, drawMountain);
  createTexture(scene, TEXTURE_KEYS.TILE_WATER, drawWater);
  createTexture(scene, TEXTURE_KEYS.TILE_ROAD, drawRoad);
  createTexture(scene, TEXTURE_KEYS.TILE_FLOOR, drawFloor);
  createTexture(scene, TEXTURE_KEYS.TILE_WALL, drawWall);
  createTexture(scene, TEXTURE_KEYS.TILE_EXIT, drawExit);
  createTexture(scene, TEXTURE_KEYS.TILE_THRONE, drawThrone);
  createTexture(scene, TEXTURE_KEYS.TILE_HOUSE_FLOOR, drawHouseFloor);
  createTexture(scene, TEXTURE_KEYS.LOCATION_CASTLE, drawCastle);
  createTexture(scene, TEXTURE_KEYS.LOCATION_TOWN, drawTown);
  createTexture(scene, TEXTURE_KEYS.LOCATION_CAVE, drawCave);
  createTexture(scene, TEXTURE_KEYS.PLAYER_DOWN, (ctx) => drawPlayer(ctx, 'down'));
  createTexture(scene, TEXTURE_KEYS.PLAYER_UP, (ctx) => drawPlayer(ctx, 'up'));
  createTexture(scene, TEXTURE_KEYS.PLAYER_LEFT, (ctx) => drawPlayer(ctx, 'left'));
  createTexture(scene, TEXTURE_KEYS.PLAYER_RIGHT, (ctx) => drawPlayer(ctx, 'right'));
  createTexture(scene, TEXTURE_KEYS.NPC_KING, drawKing);
  createTexture(scene, TEXTURE_KEYS.NPC_KEEPER, drawKeeper);
  createTexture(scene, TEXTURE_KEYS.NPC_GUARD, drawGuard);
  createTexture(scene, TEXTURE_KEYS.NPC_TOWNSPERSON, drawTownsperson);
  createTexture(scene, TEXTURE_KEYS.NPC_MERCHANT, drawMerchant);
  createTexture(scene, TEXTURE_KEYS.NPC_ELDER, drawElder);
}

function createTexture(scene, key, draw) {
  if (scene.textures.exists(key)) return;

  const texture = scene.textures.createCanvas(key, SIZE, SIZE);
  const canvas = texture.getSourceImage();
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, SIZE, SIZE);
  draw(ctx);
  texture.refresh();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function dot(ctx, x, y, color) {
  rect(ctx, x, y, 2, 2, color);
}

function drawGrass(ctx) {
  rect(ctx, 0, 0, SIZE, SIZE, '#4d9a48');
  rect(ctx, 0, 0, SIZE, 4, '#63b15a');
  rect(ctx, 0, 28, SIZE, 4, '#3f813b');

  const bright = '#79c56c';
  const dark = '#367634';
  [[4, 7], [15, 4], [25, 9], [7, 19], [18, 23], [27, 18]].forEach(([x, y]) => {
    rect(ctx, x, y, 2, 6, bright);
    rect(ctx, x + 2, y + 2, 2, 4, dark);
  });
  [[2, 14], [11, 12], [22, 15], [14, 27], [29, 27]].forEach(([x, y]) => dot(ctx, x, y, dark));
}

function drawForest(ctx) {
  rect(ctx, 0, 0, SIZE, SIZE, '#315f38');
  rect(ctx, 2, 23, 28, 7, '#254b2f');

  drawTree(ctx, 6, 7, '#2f7d42', '#1f5730');
  drawTree(ctx, 16, 5, '#3b8f4a', '#275f35');
  drawTree(ctx, 22, 11, '#2c6f3c', '#1f4a2b');
  rect(ctx, 14, 22, 4, 8, '#6e5133');
  rect(ctx, 24, 24, 3, 6, '#5a4029');
}

function drawTree(ctx, x, y, light, dark) {
  rect(ctx, x + 4, y, 8, 4, light);
  rect(ctx, x + 2, y + 4, 12, 4, light);
  rect(ctx, x, y + 8, 16, 6, dark);
  rect(ctx, x + 3, y + 14, 10, 4, dark);
}

function drawMountain(ctx) {
  rect(ctx, 0, 0, SIZE, SIZE, '#8a7b69');
  rect(ctx, 2, 26, 28, 4, '#6f6255');

  rect(ctx, 14, 3, 4, 3, '#ddd8c9');
  rect(ctx, 12, 6, 8, 4, '#c8c1b0');
  rect(ctx, 10, 10, 12, 4, '#8c8b8c');
  rect(ctx, 8, 14, 16, 4, '#6f7275');
  rect(ctx, 6, 18, 20, 5, '#595f63');
  rect(ctx, 4, 23, 24, 5, '#454b50');

  rect(ctx, 18, 10, 4, 4, '#9b9a96');
  rect(ctx, 22, 18, 3, 5, '#73777a');
  rect(ctx, 8, 22, 5, 3, '#363b40');
}

function drawWater(ctx) {
  rect(ctx, 0, 0, SIZE, SIZE, '#2b6da8');
  rect(ctx, 0, 0, SIZE, 4, '#3a83bd');
  rect(ctx, 0, 28, SIZE, 4, '#1d5488');

  drawWave(ctx, 3, 8, '#72b7de');
  drawWave(ctx, 15, 15, '#8ac9eb');
  drawWave(ctx, 6, 24, '#4e9bc8');
  rect(ctx, 24, 6, 5, 2, '#1f5f96');
  rect(ctx, 2, 18, 5, 2, '#1f5f96');
}

function drawWave(ctx, x, y, color) {
  rect(ctx, x, y, 5, 2, color);
  rect(ctx, x + 5, y + 2, 5, 2, color);
  rect(ctx, x + 10, y, 5, 2, color);
}

function drawRoad(ctx) {
  rect(ctx, 0, 0, SIZE, SIZE, '#a88452');
  rect(ctx, 0, 0, SIZE, 4, '#b8935d');
  rect(ctx, 0, 28, SIZE, 4, '#8c6a40');

  [[5, 7], [19, 5], [26, 13], [11, 18], [21, 24], [4, 27]].forEach(([x, y]) => dot(ctx, x, y, '#6f5233'));
  [[8, 12], [16, 15], [27, 22]].forEach(([x, y]) => dot(ctx, x, y, '#cfab72'));
  rect(ctx, 2, 4, 2, 24, '#8b6a3f');
  rect(ctx, 28, 4, 2, 24, '#c39d66');
}

function drawFloor(ctx) {
  rect(ctx, 0, 0, SIZE, SIZE, '#786f68');
  rect(ctx, 0, 0, SIZE, 4, '#90877d');
  rect(ctx, 0, 28, SIZE, 4, '#625a55');

  for (let y = 0; y < SIZE; y += 8) {
    rect(ctx, 0, y, SIZE, 1, '#59524d');
  }
  for (let x = 0; x < SIZE; x += 8) {
    rect(ctx, x, 0, 1, SIZE, '#59524d');
  }
  [[5, 5], [17, 10], [27, 20], [10, 25]].forEach(([x, y]) => dot(ctx, x, y, '#9a9083'));
}

function drawWall(ctx) {
  rect(ctx, 0, 0, SIZE, SIZE, '#3c424b');
  rect(ctx, 0, 0, SIZE, 5, '#5a626d');
  rect(ctx, 0, 27, SIZE, 5, '#252a31');

  for (let y = 6; y < SIZE; y += 8) {
    rect(ctx, 0, y, SIZE, 2, '#252a31');
  }
  for (let x = 0; x < SIZE; x += 10) {
    rect(ctx, x, 6, 2, 8, '#2b3038');
    rect(ctx, x + 5, 14, 2, 8, '#2b3038');
  }
  rect(ctx, 5, 8, 6, 2, '#6c7480');
  rect(ctx, 19, 21, 7, 2, '#59616b');
}

function drawExit(ctx) {
  drawFloor(ctx);
  rect(ctx, 7, 11, 18, 14, '#2c2732');
  rect(ctx, 9, 13, 14, 12, '#66513d');
  rect(ctx, 14, 17, 4, 4, '#d8c06d');
  rect(ctx, 7, 25, 18, 3, '#d6b46d');
  rect(ctx, 12, 5, 8, 4, '#f1d070');
  rect(ctx, 10, 7, 12, 2, '#a97d3c');
}

function drawThrone(ctx) {
  drawFloor(ctx);
  rect(ctx, 8, 7, 16, 20, '#71404a');
  rect(ctx, 10, 9, 12, 16, '#9b4d5c');
  rect(ctx, 6, 12, 4, 13, '#c9a24a');
  rect(ctx, 22, 12, 4, 13, '#c9a24a');
  rect(ctx, 11, 5, 10, 4, '#d8be63');
  rect(ctx, 13, 3, 6, 2, '#f0dc89');
  rect(ctx, 11, 25, 10, 3, '#513039');
}

function drawHouseFloor(ctx) {
  rect(ctx, 0, 0, SIZE, SIZE, '#d7bd85');
  rect(ctx, 0, 0, SIZE, 8, '#8b4f4b');
  rect(ctx, 2, 8, 28, 4, '#ae6258');
  rect(ctx, 4, 12, 24, 16, '#dec995');
  rect(ctx, 13, 20, 6, 8, '#5a382b');
  rect(ctx, 7, 15, 4, 4, '#6c8aa0');
  rect(ctx, 21, 15, 4, 4, '#6c8aa0');
  rect(ctx, 4, 28, 24, 3, '#8e744e');
}

function drawCastle(ctx) {
  drawGrass(ctx);
  rect(ctx, 3, 22, 26, 8, '#9c8b6b');
  rect(ctx, 5, 12, 22, 13, '#d9dedb');
  rect(ctx, 3, 9, 6, 16, '#eef1ec');
  rect(ctx, 23, 9, 6, 16, '#eef1ec');
  rect(ctx, 12, 6, 8, 19, '#f4f1de');
  rect(ctx, 14, 3, 4, 3, '#f7d66b');
  rect(ctx, 13, 7, 6, 5, '#b8c4c7');
  rect(ctx, 8, 6, 2, 5, '#aeb8bb');
  rect(ctx, 22, 6, 2, 5, '#aeb8bb');
  rect(ctx, 14, 21, 4, 6, '#5b5d66');
  rect(ctx, 7, 16, 3, 3, '#6b8390');
  rect(ctx, 22, 16, 3, 3, '#6b8390');
}

function drawTown(ctx) {
  drawGrass(ctx);
  rect(ctx, 3, 23, 26, 6, '#9f7b4e');

  drawHouse(ctx, 4, 13, '#b85d4f', '#e3d2a1');
  drawHouse(ctx, 15, 10, '#6f7fae', '#ddc796');
  drawHouse(ctx, 21, 16, '#8c6aa7', '#e7d8aa');
}

function drawCave(ctx) {
  drawForest(ctx);
  rect(ctx, 4, 24, 24, 5, '#253326');
  rect(ctx, 6, 16, 20, 12, '#4f5550');
  rect(ctx, 8, 12, 16, 16, '#687064');
  rect(ctx, 11, 18, 10, 10, '#15191d');
  rect(ctx, 13, 20, 6, 8, '#07090d');
  rect(ctx, 10, 15, 4, 3, '#909884');
  rect(ctx, 19, 16, 3, 2, '#9aa28d');
  rect(ctx, 15, 21, 2, 2, '#7db4d7');
}

function drawHouse(ctx, x, y, roof, wall) {
  rect(ctx, x + 2, y, 8, 3, roof);
  rect(ctx, x, y + 3, 12, 4, roof);
  rect(ctx, x + 2, y + 7, 8, 8, wall);
  rect(ctx, x + 5, y + 11, 3, 4, '#4a3528');
  rect(ctx, x + 2, y + 8, 2, 2, '#6f8fa6');
}

function drawPlayer(ctx, direction) {
  rect(ctx, 0, 0, SIZE, SIZE, 'rgba(0, 0, 0, 0)');

  const lookingUp = direction === 'up';
  const lookingLeft = direction === 'left';
  const lookingRight = direction === 'right';

  rect(ctx, 11, 5, 10, 4, '#4a2e28');
  rect(ctx, 9, 9, 14, 5, '#5a352c');
  rect(ctx, 10, 12, 12, 7, '#d6a07f');

  if (!lookingUp) {
    const eyeY = 14;
    rect(ctx, lookingRight ? 17 : 13, eyeY, 2, 2, '#1d2530');
    rect(ctx, lookingLeft ? 13 : 17, eyeY, 2, 2, '#1d2530');
  } else {
    rect(ctx, 11, 13, 10, 3, '#3f2823');
  }

  rect(ctx, 10, 19, 12, 8, '#2f6f9f');
  rect(ctx, 8, 20, 3, 7, '#244f76');
  rect(ctx, 21, 20, 3, 7, '#244f76');
  rect(ctx, 12, 27, 3, 4, '#2b3038');
  rect(ctx, 17, 27, 3, 4, '#2b3038');
  rect(ctx, 10, 31, 5, 1, '#15191f');
  rect(ctx, 17, 31, 5, 1, '#15191f');
}

function drawNpcBase(ctx, palette) {
  rect(ctx, 0, 0, SIZE, SIZE, 'rgba(0, 0, 0, 0)');
  rect(ctx, 9, 28, 14, 3, 'rgba(0, 0, 0, 0.28)');

  rect(ctx, 11, 6, 10, 4, palette.hair);
  rect(ctx, 9, 10, 14, 5, palette.hair);
  rect(ctx, 10, 13, 12, 6, palette.skin);
  rect(ctx, 13, 15, 2, 2, '#1d2530');
  rect(ctx, 17, 15, 2, 2, '#1d2530');

  rect(ctx, 10, 19, 12, 8, palette.body);
  rect(ctx, 8, 20, 3, 7, palette.dark);
  rect(ctx, 21, 20, 3, 7, palette.dark);
  rect(ctx, 12, 27, 3, 4, palette.legs);
  rect(ctx, 17, 27, 3, 4, palette.legs);
}

function drawKing(ctx) {
  drawNpcBase(ctx, {
    hair: '#6f5134',
    skin: '#d9a47f',
    body: '#7f3555',
    dark: '#4c2238',
    legs: '#2b2734'
  });

  rect(ctx, 10, 4, 3, 4, '#d9b348');
  rect(ctx, 15, 2, 3, 6, '#f1d46f');
  rect(ctx, 20, 4, 3, 4, '#d9b348');
  rect(ctx, 10, 8, 13, 2, '#c99b35');
  rect(ctx, 13, 20, 6, 6, '#f0d36c');
  rect(ctx, 15, 21, 2, 4, '#fff1a1');
}

function drawKeeper(ctx) {
  drawNpcBase(ctx, {
    hair: '#263448',
    skin: '#d8a47e',
    body: '#3f7c72',
    dark: '#2d5b56',
    legs: '#28343c'
  });

  rect(ctx, 7, 22, 4, 7, '#233b44');
  rect(ctx, 21, 22, 4, 7, '#233b44');
  rect(ctx, 13, 20, 6, 2, '#d9c27c');
  rect(ctx, 14, 23, 4, 3, '#f4e7a1');
}

function drawGuard(ctx) {
  drawNpcBase(ctx, {
    hair: '#5b626c',
    skin: '#d4a078',
    body: '#53697d',
    dark: '#35475a',
    legs: '#232b35'
  });

  rect(ctx, 9, 6, 14, 4, '#b8c0c8');
  rect(ctx, 11, 3, 10, 4, '#d5dce1');
  rect(ctx, 18, 21, 2, 8, '#d7d0aa');
  rect(ctx, 18, 14, 2, 7, '#d7d0aa');
  rect(ctx, 16, 13, 6, 2, '#d7d0aa');
}

function drawTownsperson(ctx) {
  drawNpcBase(ctx, {
    hair: '#70422e',
    skin: '#d7a37c',
    body: '#8b6843',
    dark: '#5d452d',
    legs: '#2c3436'
  });

  rect(ctx, 11, 19, 10, 2, '#d7bd79');
  rect(ctx, 12, 23, 8, 2, '#705f3b');
}

function drawMerchant(ctx) {
  drawNpcBase(ctx, {
    hair: '#473127',
    skin: '#d8a17b',
    body: '#496f9b',
    dark: '#334e70',
    legs: '#2d3038'
  });

  rect(ctx, 11, 20, 10, 8, '#d6b36a');
  rect(ctx, 13, 21, 6, 2, '#fff0a8');
  rect(ctx, 8, 9, 16, 3, '#d88b4c');
  rect(ctx, 10, 6, 12, 3, '#e6a45d');
}

function drawElder(ctx) {
  drawNpcBase(ctx, {
    hair: '#d6d2c8',
    skin: '#d4a17d',
    body: '#5f6073',
    dark: '#454657',
    legs: '#2e3039'
  });

  rect(ctx, 8, 11, 16, 4, '#d6d2c8');
  rect(ctx, 11, 18, 10, 3, '#ece6d4');
  rect(ctx, 23, 21, 2, 9, '#8d7146');
  rect(ctx, 22, 29, 4, 2, '#8d7146');
}
