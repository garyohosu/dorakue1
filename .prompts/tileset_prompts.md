# マップタイルセット画像生成プロンプト (Tileset Prompts)

これらのプロンプトは、ImageGenやGemini/Imagen系の画像生成AIに入力して、ワールドマップや建物・ダンジョン内を構築するための1980年代風の低解像度タイルセット（1タイルあたり32x32または16x16ピクセル、8-bitドット絵）を生成するためのものです。

## 共通設定 (Common Style Guidelines)
すべてのプロンプトに以下のスタイル修飾子が含まれています。
- `8-bit retro game style pixel art` (8ビットレトロゲーム風ドット絵)
- `16-color limited palette` (16色の制限されたパレット)
- `crisp pixels, no blur, no anti-aliasing` (ぼかし・アンチエイリアスなしのシャープなピクセル)
- `flat shading, simple patterns` (フラットなシェーディング、シンプルなパターン)
- `top-down grid view tile` (見下ろし型グリッドビュー用タイル)

---

## 1. ワールドマップ用基本地形タイル (World Map Basic Terrain Tiles)

### 1.1 草原 & 道 (Grassland and Dirt Path)
- **プロンプト**:
  > A retro 8-bit game style pixel art seamless texture tile of grassland and dirt path. Top-down view, 32x32 pixel grid tile. One side shows green pixel grass pattern, transitioning to a light brown sandy dirt path. 16-color palette, flat shading, crisp pixels.

### 1.2 森 & 山 (Forest and Mountain Obstacles)
- **プロンプト (森/Forest)**:
  > A retro 8-bit game style pixel art tile of dense green forest. Top-down view, 32x32 pixels. Simple dark green and light green pixelated evergreen pine trees clustered together. Flat shading, 16-color palette.
- **プロンプト (山/Mountain)**:
  > A retro 8-bit game style pixel art tile of rocky mountains. Top-down view, 32x32 pixels. Pointy grey and brown rock peaks with light highlights on one side and dark shadows on the other. Flat shading, 16-color palette.

### 1.3 水/海 & 砂地 (Water/Ocean and Beach Sand)
- **プロンプト (水/Water)**:
  > A retro 8-bit game style pixel art seamless tile of ocean water. Top-down view, 32x32 pixels. Blue color with simple light blue wave lines. Flat shading, 16-color palette.
- **プロンプト (砂地/Sand)**:
  > A retro 8-bit game style pixel art seamless tile of sandy beach. Top-down view, 32x32 pixels. Light yellow sand texture with small dark yellow dots representing grains. Flat shading, 16-color palette.

### 1.4 危険湿地 & 橋 (Poisonous Swamp and Bridge)
- **プロンプト (危険湿地/Swamp)**:
  > A retro 8-bit game style pixel art seamless tile of poisonous swamp. Top-down view, 32x32 pixels. Dark purple muddy water with small bright green bubble dots. Flat shading, 16-color palette.
- **プロンプト (橋/Bridge)**:
  > A retro 8-bit game style pixel art tile of a wooden bridge. Top-down view, 32x32 pixels. Horizontal brown wooden planks with dark gaps and ropes on the borders, designed to connect grass tiles. Flat shading, 16-color palette.

---

## 2. ワールドマップ用ロケーションアイコン (World Map Location Icons)
ワールドマップ上に配置する、城、町、ダンジョン等のシンボル。

- **プロンプト (城アイコン / Castle)**:
  > A retro 8-bit game style pixel art world map icon of a castle town. 32x32 pixels, top-down view. A small silver-grey castle tower with a red flag on top, surrounded by tiny white houses and a grey brick wall. Flat shading, 16-color palette, isolated on a black background.
- **プロンプト (町アイコン / Town)**:
  > A retro 8-bit game style pixel art world map icon of a village. 32x32 pixels, top-down view. Clustered tiny houses with red tiled roofs and brown wooden walls, with a tiny dirt path in between. Flat shading, 16-color palette, isolated on a black background.
- **プロンプト (洞窟入口アイコン / Cave Entrance)**:
  > A retro 8-bit game style pixel art world map icon of a cave entrance. 32x32 pixels, top-down view. A dark, black hole opening in the side of a small grey rocky mound. Flat shading, 16-color palette, isolated on a black background.
- **プロンプト (古い塔アイコン / Tower)**:
  > A retro 8-bit game style pixel art world map icon of a stone tower. 32x32 pixels, top-down view. A tall, cylindrical grey stone tower rising up with a single window at the top. Flat shading, 16-color palette, isolated on a black background.
- **プロンプト (海辺の祠アイコン / Shrine)**:
  > A retro 8-bit game style pixel art world map icon of a stone shrine. 32x32 pixels, top-down view. A small, simple white stone temple shrine with two pillars, sitting on a sandy base. Flat shading, 16-color palette, isolated on a black background.

---

## 3. 屋内・ダンジョン用タイル (Indoor & Dungeon Tiles)

### 3.1 床 & 壁 (Floor and Wall)
- **プロンプト (城・町の床 / Indoor Floor)**:
  > A retro 8-bit game style pixel art seamless tile of indoor wooden floor planks. Top-down view, 32x32 pixels. Warm brown horizontal wooden boards with dark lines dividing them. Flat shading, 16-color palette.
- **プロンプト (ダンジョンの床 / Dungeon Floor)**:
  > A retro 8-bit game style pixel art seamless tile of dungeon stone floor. Top-down view, 32x32 pixels. Dark grey stone cobbles with cracks and mossy green spots in the seams. Flat shading, 16-color palette.
- **プロンプト (壁 / Wall)**:
  > A retro 8-bit game style pixel art tile of a brick wall. Top-down view, 32x32 pixels. Grey brick pattern with black outlines, creating a solid wall block. Flat shading, 16-color palette.

### 3.2 階段 & 扉 (Stairs and Door)
- **プロンプト (階段 / Stairs)**:
  > A retro 8-bit game style pixel art tile of a stone staircase. Top-down view, 32x32 pixels. Simple grey stone steps leading downwards into darkness, with perspective showing depth. Flat shading, 16-color palette.
- **プロンプト (扉 / Door)**:
  > A retro 8-bit game style pixel art tile of a wooden door. Top-down view, 32x32 pixels. Heavy brown wooden door with a iron band across the middle and a golden keyhole. Flat shading, 16-color palette.

### 3.3 宝箱 (Treasure Chests)
- **プロンプト (閉じた宝箱 / Closed Chest)**:
  > A retro 8-bit game style pixel art sprite of a closed treasure chest. 32x32 pixels, top-down view. A brown wooden chest with gold trim on the corners and a silver lock in the center. Flat shading, 16-color palette, isolated on a black background.
- **プロンプト (開いた宝箱 / Opened Chest)**:
  > A retro 8-bit game style pixel art sprite of an open empty treasure chest. 32x32 pixels, top-down view. The lid of the brown wooden chest is open, showing a dark empty interior. Flat shading, 16-color palette, isolated on a black background.
