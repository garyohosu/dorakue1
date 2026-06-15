# ユーザーインターフェース画像生成プロンプト (UI Prompts)

これらのプロンプトは、ImageGenやGemini/Imagen系の画像生成AIに入力して、ゲーム内で使用する1980年代家庭用ゲーム機風の低解像度UIパーツ（8-bitドット絵）を生成するためのものです。

## 共通設定 (Common Style Guidelines)
すべてのプロンプトに以下のスタイル修飾子が含まれています。
- `8-bit retro game style pixel art` (8ビットレトロゲーム風ドット絵)
- `16-color limited palette` (16色の制限されたパレット)
- `crisp pixels, no blur, no anti-aliasing` (ぼかし・アンチエイリアスなしのシャープなピクセル)
- `flat shading` (フラットなシェーディング)
- `isolated on solid black background` (純黒背景で隔離)

---

## 1. メッセージ・ウィンドウ枠 (Text Message Window Frame)
- **特徴**: 黒または濃紺の背景に、白・薄青・金をあしらったシンプルな二重枠。
- **プロンプト (English)**:
  > A retro 8-bit game style pixel art UI element of a dialog window frame. A rectangular black box with a double-line border. The outer line of the border is solid white, and the inner line is thin gold. Clean sharp pixels, flat shading, low resolution, 16-color palette, isolated on a solid black background.

## 2. 選択指示カーソル (Selection Cursor / Pointer)
- **特徴**: 指マークではなく、シンプルな三角形（矢印）またはドット絵の羽ペン型。
- **プロンプト (English - Triangle Cursor)**:
  > A retro 8-bit game style pixel art UI cursor pointer. A small solid white triangle pointing directly to the right. Low resolution, crisp pixels, flat shading, 16-color palette, 16x16 pixel size, isolated on a solid black background.
- **プロンプト (English - Quill/Pen Cursor)**:
  > A retro 8-bit game style pixel art UI cursor icon. A tiny white feather quill pen with a blue tip, pointing downwards-right. 16x16 pixels, crisp pixels, flat shading, 16-color palette, isolated on a solid black background.

## 3. ステータス表示パネル枠 (Status Panel Frame)
- **特徴**: プレイヤー情報（レベル、HP、MP、所持金）を表示するための枠線。
- **プロンプト (English)**:
  > A retro 8-bit game style pixel art UI panel frame for player status. A vertical rectangular box with a thick light blue border and a solid dark navy blue background. Low resolution, crisp pixels, flat shading, 16-color palette, isolated on a solid black background.

## 4. コマンドメニュー・ウィンドウ (Command Menu Window)
- **特徴**: 移動中や戦闘中にコマンド（攻める、術法、道具、退くなど）を表示するためのボックス。
- **プロンプト (English)**:
  > A retro 8-bit game style pixel art UI menu box. A small horizontal rectangular menu window with a solid black background, bordered by a single crisp white pixel line. Low resolution, 16-color palette, isolated on a solid black background.

## 5. 装備比較・アイテム一覧用の小さな枠 (Grid Icon Boxes for Inventory / Equipment)
- **特徴**: アイテムや武器・防具のアイコンを1つずつ並べるためのグリッド枠。
- **プロンプト (English)**:
  > A retro 8-bit game style pixel art UI inventory slot frame. A square 32x32 pixel slot with a dark grey background and a thin white outline border. Low resolution, 16-color palette, crisp pixels, isolated on a solid black background.
