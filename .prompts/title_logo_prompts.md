# タイトルロゴ画像生成プロンプト (Title Logo Prompts)

これらのプロンプトは、ImageGenやGemini/Imagen系の画像生成AIに入力して、ゲームのタイトル画面に表示する1980年代家庭用ゲーム機風のレトロなロゴ及びタイトル背景画像を生成するためのものです。

## 共通設定 (Common Style Guidelines)
すべてのプロンプトに以下のスタイル修飾子が含まれています。
- `8-bit retro game title screen` (8ビットレトロゲームのタイトル画面)
- `16-color limited palette` (16色の制限されたパレット)
- `crisp pixels, no blur, no anti-aliasing` (ぼかし・アンチエイリアスなしのシャープなピクセル)
- `flat shading with simple gradients` (シンプルなグラデーションを伴うフラットなシェーディング)

---

## 1. タイトルロゴ「暁の小径 / Path of Dawn」単体 (Title Logo Only)
- **特徴**: カリグラフィー風、またはブロックノイズ感のあるドットフォントのロゴ。「暁の小径」と「Path of Dawn」。
- **プロンプト (English)**:
  > A retro 8-bit video game logo. The Japanese title text says "暁の小径" in a bold, pixelated gold font with red outlines. Directly below, the English subtitle "Path of Dawn" is written in a smaller, crisp white pixel font. The entire logo is isolated on a solid black background. Low resolution, 16-color palette, crisp pixels, flat shading.

## 2. タイトル画面全体 (Title Screen Background with Logo)
- **特徴**: 朝日（夜明け）の光が地平線から差し込んでいる、ドット絵の叙情的な背景にロゴが浮かんでいるもの。
- **プロンプト (English)**:
  > A complete retro 8-bit home console game title screen. In the upper-middle, a pixel art logo displays "暁の小径" in gold and "Path of Dawn" in white. The background is a dramatic dawn scene: a black sky transitioning downwards to dark blue, purple, and a bright orange-yellow horizon where the sun is starting to rise over a distant dark mountain range. A small silhouette of a lighthouse stands on a cliff in the corner. Low resolution, 16-color palette, clean pixel art, flat color banding.
