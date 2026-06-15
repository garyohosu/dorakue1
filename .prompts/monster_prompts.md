# モンスター画像生成プロンプト (Monster Prompts)

これらのプロンプトは、ImageGenやGemini/Imagen系の画像生成AIに入力して、戦闘画面のフロントビューに表示される1980年代風の低解像度敵モンスター画像を生成するためのものです。

## 共通設定 (Common Style Guidelines)
すべてのプロンプトに以下のスタイル修飾子が含まれています。
- `8-bit retro game style pixel art` (8ビットレトロゲーム風ドット絵)
- `16-color limited palette` (16色の制限されたパレット)
- `crisp pixels, no blur, no anti-aliasing` (ぼかし・アンチエイリアスなしのシャープなピクセル)
- `flat shading, basic colors` (フラットなシェーディング、基本色)
- `front view battle sprite` (戦闘画面のフロントビュー表示用スプライト)
- `isolated on solid black background` (純黒背景で隔離)

---

## 1. 通常敵 (Normal Enemies)

### 1.1 風切り草 (Windgrass / windgrass)
- **特徴**: 葉が刃のような植物モンスター。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a Windgrass. It is a small fantasy plant monster with sharp, blade-like light green and yellow leaves growing from a central root base. Front view, low resolution, 16-color palette, crisp pixels, flat shading, isolated on solid black background.

### 1.2 小さな泥人 (Clayman / mudling)
- **特徴**: 丸い泥の人形。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a mud monster named Mudling. It is a small, round, lumpy brown clay doll with two simple glowing yellow dots for eyes. Lumpy textured mud body, front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.3 苔羽虫 (Moss Fly / moss_midge)
- **特徴**: 緑色の小さな羽虫。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a moss beetle named Moss Midge. A small green winged insect, with a mossy textured shell and glowing red eyes. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.4 洞火の影 (Cave Fire Shadow / cave_wisp)
- **特徴**: 青い火を持つ影。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a shadow flame named Cave Wisp. A dark ghostly silhouette hovering with a bright blue mystical fire glowing in its core. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.5 木根の獣 (Tree Root Beast / root_beast)
- **特徴**: 根でできた小獣。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a root creature named Root Beast. A small wild beast composed of tangled, gnarled brown tree roots with glowing yellow eyes peeking out. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.6 灰毛の山犬 (Grey Mountain Hound / gray_hound)
- **特徴**: 灰色の痩せ犬。牙をむいている。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a wild wolf named Grey Hound. A lean, snarling dog with spiky grey fur, baring its white teeth. Aggressive pose, front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.7 石殻兵 (Stone Beetle Soldier / stone_shell)
- **特徴**: 石のような甲殻を持つ虫の兵士。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a stone insect soldier named Stone Shell. A beetle-like bipedal warrior with a hard grey rock-textured shell armor, holding a simple stone club. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.8 錆びた操り人形 (Rusty Wooden Puppet / rust_puppet)
- **特徴**: 錆びた木製の人形。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a wooden doll named Rusty Puppet. A creaky, wooden marionette puppet with orange rust stains on its metal joints, standing in a slightly tilted, uncanny pose. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.9 塔の衛兵影 (Tower Guard Shadow / tower_shade)
- **特徴**: 槍を持つ黒い影の兵士。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a shadow knight named Tower Shade. A tall dark purple silhouette of a guard holding a long spear, with faint glowing blue eyes. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.10 黒霧の術士 (Black Mist Mage / black_mist_mage)
- **特徴**: 黒いローブをまとった魔法使い。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a dark wizard named Black Mist Mage. He wears a deep purple and black hooded robe, with dark mist rising from his hands. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.11 羽音の監視者 (One-Eyed Watcher / wing_watch)
- **特徴**: 一つ目の鳥型影。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a shadow bird named Wing Watch. A crow-like black silhouette with a single, large glowing yellow eye in the center of its head. Spanned wings, front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.12 古い鎧 (Ancient Living Armor / old_armor)
- **特徴**: 剣を引きずっている空の古い甲冑。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a haunted suit of armor named Old Armor. A hollow, dented silver iron knight armor standing, dragging a large rusted iron sword. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.13 夜冠の使徒 (Acolyte of the Night Crown / night_crown_agent)
- **特徴**: 黒冠の仮面を被った兵士。黒いマント。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a masked cultist named Night Crown Agent. He wears a black iron crown mask with glowing red eye slits, a dark navy cloak, and is in a defensive stance. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.14 黒硝子の獣 (Black Glass Beast / glass_beast)
- **特徴**: 黒い黒曜石のような硝子でできた四足の獣。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of an obsidian beast named Glass Beast. A four-legged predatory beast made of sharp, reflective black glass shards. Shiny and sharp edges, front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 1.15 霧まといの古代獣 (Mist-Shrouded Ancient Beast / mist_ancient)
- **特徴**: 霧をまとった大きな古代の獣。
- **プロンプト**:
  > A retro 8-bit game style pixel art monster sprite of a fog monster named Mist Ancient. A large, menacing beastly silhouette partially obscured by white swirling fog and mist, with glowing pale blue eyes. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

---

## 2. 中ボス (Mid-Bosses)

### 2.1 青火の番人 (Sentinel of Blue Flame / blue_flame_keeper)
- **特徴**: 青い炎のランタンを掲げた番兵。
- **プロンプト**:
  > A retro 8-bit game style pixel art boss sprite of a spectral guardian named Blue Flame Keeper. A ghostly warrior in dark grey chainmail armor holding a tall staff with a large, bright glowing blue fire at the top. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 2.2 黒門の守衛 (Guard of the Black Gate / black_gate_guard)
- **特徴**: 巨大な黒い門番の鎧。
- **プロンプト**:
  > A retro 8-bit game style pixel art boss sprite of a giant gatekeeper knight named Black Gate Guard. A towering, bulky knight clad in massive black steel armor, holding a huge shield and a heavy mace. Menacing standing pose, front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

---

## 3. ラスボス (Final Bosses)

### 3.1 黒冠卿オルヴェス (Lord of the Night Crown, Olves / orves)
- **特徴**: ラスボス第1形態。黒い王冠と長い長衣をまとった人型。不敵な笑み。
- **プロンプト**:
  > A retro 8-bit game style pixel art boss sprite of the evil lord named Lord Olves. An aristocratic villain wearing a dark crown, a long flowing black and purple robe, smiling sinisterly. Dark magical energy swirling around him. Front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.

### 3.2 夜明け喰らい (Dawn Eater / dawn_eater)
- **特徴**: ラスボス最終形態。空を黒く染める巨大な影と白い目。古代獣のよう。
- **プロンプト**:
  > A retro 8-bit game style pixel art final boss sprite of a cosmic shadow monster named Dawn Eater. A giant, chaotic shadow beast made of dark swirling smoke, with multiple glowing white eyes and a massive mouth swallowing light. Terrifying abstract shape, front view, low resolution, 16-color palette, crisp pixels, isolated on solid black background.
