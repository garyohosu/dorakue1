import { MAP_IDS, TILE, TILE_TYPES } from '../game/constants.js';

const ENCOUNTER_TABLES = {
  [MAP_IDS.WORLD]: [
    { name: '風切り草', hp: 12, attack: 5, defense: 1, exp: 6, gold: 8 },
    { name: '小さな泥人', hp: 14, attack: 6, defense: 2, exp: 8, gold: 10 }
  ],
  [MAP_IDS.CAVE]: [
    { name: '小さな泥人', hp: 18, attack: 7, defense: 2, exp: 11, gold: 13 },
    { name: '苔羽虫', hp: 20, attack: 8, defense: 3, exp: 13, gold: 14 },
    { name: '洞火の影', hp: 22, attack: 8, defense: 3, exp: 15, gold: 15 },
    { name: '木根の獣', hp: 24, attack: 9, defense: 4, exp: 17, gold: 16 }
  ],
  [MAP_IDS.TOWER]: [
    { name: '錆びた操り人形', hp: 24, attack: 9, defense: 4, exp: 16, gold: 18 },
    { name: '塔の衛兵影', hp: 27, attack: 10, defense: 4, exp: 19, gold: 20 },
    { name: '黒霧の術士', hp: 30, attack: 11, defense: 5, exp: 22, gold: 22 },
    { name: '羽音の監視者', hp: 26, attack: 10, defense: 5, exp: 20, gold: 21 }
  ],
  [MAP_IDS.SHRINE]: [
    { name: '潮鳴りの番人', hp: 31, attack: 11, defense: 5, exp: 24, gold: 24 },
    { name: '濡れた石像', hp: 34, attack: 12, defense: 6, exp: 27, gold: 26 }
  ],
  [MAP_IDS.FINAL]: [
    { name: '古い鎧', hp: 42, attack: 14, defense: 7, exp: 38, gold: 34 },
    { name: '夜冠の使徒', hp: 45, attack: 14, defense: 7, exp: 40, gold: 35 },
    { name: '黒硝子の獣', hp: 48, attack: 15, defense: 8, exp: 45, gold: 38 },
    { name: '霧まといの古代獣', hp: 52, attack: 15, defense: 8, exp: 48, gold: 40 }
  ]
};

const ENCOUNTER_CHANCE_BY_MAP = {
  [MAP_IDS.WORLD]: 0.08,
  [MAP_IDS.CAVE]: 0.13,
  [MAP_IDS.TOWER]: 0.13,
  [MAP_IDS.SHRINE]: 0.14,
  [MAP_IDS.FINAL]: 0.16
};

export const HERB_PRICE = 12;
export const HERB_HEAL = 18;
export const MAX_HERBS = 9;

export function createFinalBoss() {
  return {
    name: '黒冠卿オルヴェス',
    hp: 64,
    attack: 16,
    defense: 8,
    exp: 0,
    gold: 0,
    finalBoss: true
  };
}

export function canEncounter(map, tileId) {
  if (!ENCOUNTER_TABLES[map.id]) return false;
  if (tileId === TILE.CASTLE || tileId === TILE.TOWN || tileId === TILE.CAVE || tileId === TILE.TOWER || tileId === TILE.SHRINE || tileId === TILE.FINAL) {
    return false;
  }

  return TILE_TYPES[tileId]?.passable === true;
}

export function shouldStartEncounter(map, tileId, random = Math.random) {
  if (!canEncounter(map, tileId)) return false;
  return random() < (ENCOUNTER_CHANCE_BY_MAP[map.id] ?? 0);
}

export function createEncounter(mapId, random = Math.random) {
  const table = ENCOUNTER_TABLES[mapId] ?? ENCOUNTER_TABLES[MAP_IDS.WORLD];
  const index = Math.floor(random() * table.length);
  return { ...table[Math.max(0, Math.min(table.length - 1, index))] };
}

export function runBattle(player, enemy) {
  const lines = [`${enemy.name}が あらわれた！`];
  const battleEnemy = { ...enemy };
  let turns = 0;

  while (player.hp > 0 && battleEnemy.hp > 0 && turns < 16) {
    turns += 1;

    const playerDamage = calculateDamage(player.attack, battleEnemy.defense, turns);
    battleEnemy.hp -= playerDamage;
    lines.push(`${player.name}の攻撃。${enemy.name}に ${playerDamage} ダメージ。`);

    if (battleEnemy.hp <= 0) break;

    const enemyDamage = calculateDamage(battleEnemy.attack, player.defense, turns + 1);
    player.hp = Math.max(0, player.hp - enemyDamage);
    lines.push(`${enemy.name}の攻撃。${player.name}は ${enemyDamage} ダメージを受けた。`);

    if (player.hp > 0 && player.hp <= 8 && player.herbs > 0) {
      player.herbs -= 1;
      player.hp = Math.min(player.maxHp, player.hp + HERB_HEAL);
      lines.push(`${player.name}は小癒し草を使った。HPが回復した。`);
    }
  }

  if (battleEnemy.hp <= 0) {
    if (enemy.finalBoss) {
      lines.push(`${enemy.name}を倒した！`);
      lines.push('暁の印が、黒冠の闇を打ち砕いた。');
      return { outcome: 'victory', lines, levelUps: [] };
    }

    const levelUps = grantRewards(player, enemy.exp, enemy.gold);
    lines.push(`${enemy.name}を倒した！`);
    lines.push(`${enemy.exp} 経験値と ${enemy.gold}リムを手に入れた。`);
    levelUps.forEach((level) => {
      lines.push(`${player.name}は レベル${level} に上がった！`);
    });
    return { outcome: 'victory', lines, levelUps };
  }

  player.hp = player.maxHp;
  player.mp = player.maxMp;
  player.gold = Math.floor(player.gold * 0.8);
  lines.push(`${player.name}は倒れた。`);
  lines.push('白鐘城へ運ばれ、体力は回復した。');
  return { outcome: 'defeat', lines, levelUps: [] };
}

export function buyHerb(player) {
  if (player.herbs >= MAX_HERBS) {
    return { ok: false, lines: ['小癒し草はこれ以上持てません。'] };
  }

  if (player.gold < HERB_PRICE) {
    return { ok: false, lines: [`小癒し草は ${HERB_PRICE}リムです。お金が足りません。`] };
  }

  player.gold -= HERB_PRICE;
  player.herbs += 1;
  return { ok: true, lines: [`小癒し草を1つ買った。`, `持ち物: 小癒し草 ${player.herbs}個`] };
}

export function restAtInn(player) {
  const price = 10;
  if (player.hp === player.maxHp && player.mp === player.maxMp) {
    return { ok: false, lines: ['もう十分に休めています。'] };
  }

  if (player.gold < price) {
    return { ok: false, lines: [`宿代は ${price}リムです。お金が足りません。`] };
  }

  player.gold -= price;
  player.hp = player.maxHp;
  player.mp = player.maxMp;
  return { ok: true, lines: ['宿で休んだ。', 'HPとMPが全回復した。'] };
}

function calculateDamage(attack, defense, turn) {
  const variation = (turn % 3) - 1;
  return Math.max(1, attack - Math.floor(defense / 2) + variation);
}

function grantRewards(player, exp, gold) {
  player.exp += exp;
  player.gold += gold;

  const levelUps = [];
  while (player.exp >= player.nextExp) {
    player.exp -= player.nextExp;
    player.level += 1;
    player.nextExp = Math.floor(player.nextExp * 1.55) + 8;
    player.maxHp += 6;
    player.maxMp += 2;
    player.attack += 2;
    player.defense += 1;
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    levelUps.push(player.level);
  }

  return levelUps;
}
