import { createFinalBoss, runBattle } from '../src/data/battle.js';
import { getMap, MAPS } from '../src/data/maps.js';
import { NPCS } from '../src/data/npcs.js';
import { createInitialPlayer } from '../src/data/player.js';
import { loadSavedPlayer, savePlayer } from '../src/data/save.js';
import { MAP_IDS, TILE, TILE_TYPES } from '../src/game/constants.js';

const REQUIRED_ROUTE = [
  'castle:king',
  'town:merchant',
  'town:innkeeper',
  'cave:moon-chest',
  'tower:entrance',
  'tower:tower-chest',
  'castle:king-dawn-mark',
  'shrine:entrance',
  'shrine:mirror-chest',
  'final:entrance',
  'final:altar-boss'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function positionKey(x, y) {
  return `${x},${y}`;
}

function isPassable(map, x, y) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  return TILE_TYPES[map.tiles[y][x]]?.passable === true;
}

function reachableTiles(map, start) {
  assert(isPassable(map, start.x, start.y), `${map.id} start is not passable at ${start.x},${start.y}`);

  const queue = [start];
  const visited = new Set([positionKey(start.x, start.y)]);
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];

  while (queue.length > 0) {
    const current = queue.shift();
    directions.forEach((direction) => {
      const next = {
        x: current.x + direction.x,
        y: current.y + direction.y
      };
      const key = positionKey(next.x, next.y);
      if (visited.has(key) || !isPassable(map, next.x, next.y)) return;
      visited.add(key);
      queue.push(next);
    });
  }

  return visited;
}

function assertReachableTile(mapId, start, target, label) {
  const map = getMap(mapId);
  const reachable = reachableTiles(map, start);
  assert(reachable.has(positionKey(target.x, target.y)), `${label} is unreachable in ${map.name}`);
}

function assertReachableInteraction(mapId, start, target, label) {
  const map = getMap(mapId);
  const reachable = reachableTiles(map, start);
  const adjacent = [
    { x: target.x, y: target.y - 1 },
    { x: target.x, y: target.y + 1 },
    { x: target.x - 1, y: target.y },
    { x: target.x + 1, y: target.y }
  ];
  const canInteract = adjacent.some((tile) => reachable.has(positionKey(tile.x, tile.y)));
  assert(canInteract, `${label} cannot be reached for interaction in ${map.name}`);
}

function getNpc(id) {
  const npc = NPCS.find((candidate) => candidate.id === id);
  assert(npc, `missing NPC ${id}`);
  return npc;
}

function getFirstTile(mapId, tileId) {
  const map = getMap(mapId);
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (map.tiles[y][x] === tileId) return { x, y };
    }
  }
  throw new Error(`missing tile ${tileId} in ${mapId}`);
}

function validateMapData() {
  Object.values(MAPS).forEach((map) => {
    assert(map.tiles.length === map.height, `${map.id} height does not match tile rows`);
    map.tiles.forEach((row, index) => {
      assert(row.length === map.width, `${map.id} row ${index} width mismatch`);
      row.forEach((tileId) => {
        assert(TILE_TYPES[tileId], `${map.id} has unknown tile ${tileId}`);
      });
    });

    [...(map.entrances ?? []), ...(map.exits ?? [])].forEach((transition) => {
      assert(MAPS[transition.targetMapId], `${map.id} transition points to missing map ${transition.targetMapId}`);
      assert(isPassable(map, transition.x, transition.y), `${map.id} transition source is not passable`);
      assert(isPassable(getMap(transition.targetMapId), transition.targetX, transition.targetY), `${map.id} transition target is not passable`);
    });
  });
}

function validateReachability() {
  const player = createInitialPlayer();
  assertReachableTile(MAP_IDS.WORLD, player, { x: 3, y: 3 }, 'castle entrance');
  assertReachableTile(MAP_IDS.WORLD, player, { x: 12, y: 3 }, 'town entrance');
  assertReachableTile(MAP_IDS.WORLD, { x: 13, y: 3 }, { x: 17, y: 3 }, 'cave entrance');
  assertReachableTile(MAP_IDS.WORLD, { x: 17, y: 4 }, { x: 11, y: 1 }, 'tower entrance');
  assertReachableTile(MAP_IDS.WORLD, { x: 11, y: 2 }, { x: 16, y: 12 }, 'shrine entrance');
  assertReachableTile(MAP_IDS.WORLD, { x: 16, y: 11 }, { x: 2, y: 12 }, 'final entrance');

  assertReachableInteraction(MAP_IDS.CASTLE, { x: 10, y: 13 }, getNpc('king'), 'king');
  assertReachableInteraction(MAP_IDS.TOWN, { x: 10, y: 13 }, getNpc('merchant'), 'merchant');
  assertReachableInteraction(MAP_IDS.TOWN, { x: 10, y: 13 }, getNpc('innkeeper'), 'innkeeper');
  assertReachableInteraction(MAP_IDS.CAVE, { x: 10, y: 13 }, getFirstTile(MAP_IDS.CAVE, TILE.CHEST), 'moon chest');
  assertReachableInteraction(MAP_IDS.TOWER, { x: 10, y: 13 }, getFirstTile(MAP_IDS.TOWER, TILE.CHEST), 'tower chest');
  assertReachableInteraction(MAP_IDS.SHRINE, { x: 10, y: 13 }, getFirstTile(MAP_IDS.SHRINE, TILE.CHEST), 'shrine chest');
  assertReachableInteraction(MAP_IDS.FINAL, { x: 10, y: 13 }, getFirstTile(MAP_IDS.FINAL, TILE.ALTAR), 'final altar');
}

function validateProgressionFlags() {
  const player = createInitialPlayer();
  player.flags.acceptedQuest = true;
  player.flags.openedMoonChest = true;
  player.flags.gotMoonKey = true;
  assert(player.flags.gotMoonKey, 'moon key progression failed');

  const towerEntrance = getMap(MAP_IDS.WORLD).entrances.find((transition) => transition.targetMapId === MAP_IDS.TOWER);
  assert(towerEntrance.requiredFlag === 'gotMoonKey', 'tower should require moon key');
  player.flags[towerEntrance.setFlag] = true;
  player.flags.openedTowerChest = true;
  player.flags.gotBlueOrb = true;
  assert(player.flags.openedTowerDoor && player.flags.gotBlueOrb, 'tower progression failed');

  player.flags.gotDawnMark = true;
  const shrineEntrance = getMap(MAP_IDS.WORLD).entrances.find((transition) => transition.targetMapId === MAP_IDS.SHRINE);
  assert(shrineEntrance.requiredFlag === 'gotDawnMark', 'shrine should require dawn mark');
  player.flags[shrineEntrance.setFlag] = true;
  player.flags.openedShrineChest = true;
  player.flags.gotTideMirror = true;
  assert(player.flags.openedShrineDoor && player.flags.gotTideMirror, 'shrine progression failed');

  const finalEntrance = getMap(MAP_IDS.WORLD).entrances.find((transition) => transition.targetMapId === MAP_IDS.FINAL);
  assert(finalEntrance.requiredFlag === 'gotTideMirror', 'final area should require tide mirror');
  player.flags[finalEntrance.setFlag] = true;
  assert(player.flags.openedFinalPath, 'final path flag failed');
}

function validateBattleBalance() {
  const fresh = createInitialPlayer();
  fresh.herbs = 0;
  const freshBoss = runBattle(fresh, createFinalBoss());
  assert(freshBoss.outcome === 'defeat', 'fresh player should not beat final boss');

  const ready = createInitialPlayer();
  ready.level = 6;
  ready.maxHp = 62;
  ready.hp = 62;
  ready.maxMp = 16;
  ready.mp = 16;
  ready.attack = 20;
  ready.defense = 8;
  ready.herbs = 5;
  const readyBoss = runBattle(ready, createFinalBoss());
  assert(readyBoss.outcome === 'victory', 'prepared player should beat final boss');
  assert(readyBoss.lines.some((line) => line.includes('黒鐘の王を倒した')), 'final boss victory text is missing');
  assert(!readyBoss.lines.some((line) => line.includes('経験値')), 'final boss should not show grind rewards');
}

function validateSaveCompatibility() {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key)
  };

  const player = createInitialPlayer();
  player.mapId = MAP_IDS.FINAL;
  player.flags.clearedGame = true;
  player.flags.defeatedFinalBoss = true;
  assert(savePlayer(player), 'savePlayer returned false');
  const loaded = loadSavedPlayer();
  assert(loaded.mapId === MAP_IDS.FINAL, 'saved map did not load');
  assert(loaded.flags.clearedGame && loaded.flags.defeatedFinalBoss, 'clear flags did not load');
}

validateMapData();
validateReachability();
validateProgressionFlags();
validateBattleBalance();
validateSaveCompatibility();

console.log(`OK game validation: ${REQUIRED_ROUTE.join(' -> ')}`);
