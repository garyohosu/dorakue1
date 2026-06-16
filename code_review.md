# コードレビュー: dorakue1 / 暁の小径

仕様書 (`spec.md`) に対するソースコードのレビューです。  
現在の実装フェーズ（最小完成版MVP相当）を前提に、仕様との差異・問題点・改善提案を整理します。

---

## 🟢 仕様通りに実装されている点

| 項目 | 評価 |
|---|---|
| Phaser + Vite + JavaScript 構成 | ✅ 仕様どおり |
| LocalStorage でセーブ/ロード | ✅ 実装済み |
| タイルベース移動（32px/タイル） | ✅ 仕様どおり |
| 方向キー / WASD 対応 | ✅ 実装済み |
| 決定: Enter / Space / Z | ✅ 実装済み |
| キャンセル: Esc / X | ✅ 実装済み |
| マップ遷移（城/町/洞窟/塔/祠/最終） | ✅ 実装済み |
| requiredFlag による入口制御 | ✅ 実装済み |
| NPC 会話とフラグ分岐 | ✅ 実装済み |
| ランダムエンカウント | ✅ 実装済み |
| HP 0 で白鐘城へ帰還 | ✅ 実装済み |
| レベルアップ処理 | ✅ 実装済み |
| タッチコントロール（仮想パッド） | ✅ 仕様外だが追加済みで問題なし |
| Web Audio API による SE | ✅ 実装済み |

---

## 🔴 仕様との重大な差異

### 1. セーブキーが仕様と異なる

| | 内容 |
|---|---|
| **仕様 (sec 14.12)** | `path_of_dawn_save_v1` |
| **実装 ([save.js](file:///C:/PROJECT/dorakue1/src/data/save.js))** | `dorakue1.save.v1` |

セーブキーが異なると、既存の保存データとの互換性が壊れます。どちらかに統一してください。

---

### 2. ラスボスの名前と仕様が不一致

| | 内容 |
|---|---|
| **仕様 (sec 15.3)** | 第1形態: `黒冠卿オルヴェス` / 最終形態: `夜明け喰らい` |
| **実装 ([battle.js](file:///C:/PROJECT/dorakue1/src/data/battle.js#L40))** | `黒鐘の王` (ラスボス唯一の名前) |
| **実装 ([FieldScene.js](file:///C:/PROJECT/dorakue1/src/scenes/FieldScene.js#L742))** | `黒鐘の王` (話者名) |

仕様のラスボス名「黒冠卿オルヴェス」が使われておらず、オリジナルの「黒鐘の王」になっています。また2形態構成が実装されていません（最小版では1形態でも可とされているが、名前は仕様に合わせるべきです）。

---

### 3. エンカウントテーブルの敵名が仕様と不一致

仕様（sec 15.1）で定義された敵名と、実装（[battle.js](file:///C:/PROJECT/dorakue1/src/data/battle.js)）のエンカウントテーブルが大幅に異なります。

| マップ | 仕様の敵 | 実装の敵 |
|---|---|---|
| WORLD | `風切り草`, `小さな泥人` | `夜露スライム`, `こかげコウモリ` |
| CAVE | `小さな泥人`, `苔羽虫`, `洞火の影`, `木根の獣` | `月苔の小鬼`, `石殻ムカデ` |
| TOWER | `錆びた操り人形`, `塔の衛兵影`, `黒霧の術士`, `羽音の監視者` | `星見の影`, `青火の使い` |
| SHRINE | （出現なし） | `潮鳴りの番人`, `濡れた石像` |
| FINAL | `古い鎧`, `夜冠の使徒`, `黒硝子の獣`, `霧まといの古代獣` | `黒霧の騎士`, `夜明け喰らい` |

> [!WARNING]
> FINAL マップのエンカウントに `夜明け喰らい` が入っています。これは仕様でラスボス最終形態の名前です。通常エンカウントに最終ボスと同名の敵が出るのは、物語上の整合性が壊れます。

---

### 4. 草回復量が仕様と異なる

| | 内容 |
|---|---|
| **仕様 (sec 14.7)** | `小癒し草` → HP **30** 回復 |
| **実装 ([battle.js](file:///C:/PROJECT/dorakue1/src/data/battle.js#L35-L36))** | `HERB_HEAL = 18` → HP **18** 回復 |

---

### 5. 草の最大所持数が仕様と異なる

| | 内容 |
|---|---|
| **仕様 (sec 14.7)** | 最大 **99** 個 |
| **実装 ([battle.js](file:///C:/PROJECT/dorakue1/src/data/battle.js#L36))** | `MAX_HERBS = 9` |

---

### 6. 宿屋料金が仕様と異なる

| | 内容 |
|---|---|
| **仕様 (sec 10.2, 19.7)** | リノンの宿屋 → **8リム** |
| **実装 ([battle.js](file:///C:/PROJECT/dorakue1/src/data/battle.js#L134))** | `const price = 10` → **10リム** |

---

### 7. 初期 `nextExp` が仕様と異なる

| | 内容 |
|---|---|
| **仕様 (sec 14.2)** | レベル1→2の必要経験値 = **10** |
| **実装 ([player.js](file:///C:/PROJECT/dorakue1/src/data/player.js#L7))** | `nextExp: 18` |

---

### 8. 初期プレイヤーの開始位置が仕様と異なる

| | 内容 |
|---|---|
| **仕様 (sec 5.2, 14.1)** | 開始マップ: `castle` (白鐘城内、王の前) |
| **実装 ([player.js](file:///C:/PROJECT/dorakue1/src/data/player.js#L16-L18))** | `mapId: MAP_IDS.WORLD`, ワールドマップ (x:4, y:3) から開始 |

仕様では「新規開始時は白鐘城に配置し、王の前に主人公を置く」とあります。現在の実装ではワールドマップから始まります。

---

### 9. 重要フラグ名が仕様と異なる

仕様（sec 14.10, 17章）と実装（[player.js](file:///C:/PROJECT/dorakue1/src/data/player.js), [FieldScene.js](file:///C:/PROJECT/dorakue1/src/scenes/FieldScene.js)）でフラグ名が一部ずれています。

| 仕様フラグ名 | 実装フラグ名 | 備考 |
|---|---|---|
| `gotBlueLampOrb` | `gotBlueOrb` | 短縮されている |
| `gotMorningMirror` | ❌ 未定義 | player.js に存在しない |
| `gotTideShell` | `gotTideMirror` | 名前が別アイテムになっている |
| `gotWhiteBellShard` | ❌ 未定義 | player.js に存在しない |
| `defeatedTowerBoss` | ❌ 未定義 | 実装なし |
| `learnedCaveHint` | ❌ 未定義 | 実装なし |
| `learnedTowerHint` | ❌ 未定義 | 実装なし |
| `learnedShrineHint` | ❌ 未定義 | 実装なし |

> [!IMPORTANT]
> `gotTideMirror` は仕様では「朝霧の鏡(`gotMorningMirror`)」に相当するフラグとして使われていますが、仕様上は`潮路の貝`のフラグ(`gotTideShell`)です。FieldScene内でのフラグ使用箇所との整合を確認してください。

---

### 10. 「暁の印」完成条件の実装が不完全

仕様（sec 10.6）では海辺の祠で以下の5つのフラグが揃った時に `gotDawnMark = true` になります：
- `gotMoonKey`, `gotBlueLampOrb`, `gotMorningMirror`, `gotWhiteBellShard`, `gotTideShell`

現在の実装（[FieldScene.js](file:///C:/PROJECT/dorakue1/src/scenes/FieldScene.js#L689-L714)）では、祠の宝箱を開けると `gotTideMirror = true` になるだけで、5アイテム揃えて `gotDawnMark` を完成させるロジックがありません。

---

### 11. 最終マップの入口フラグが仕様と異なる

| | 内容 |
|---|---|
| **仕様 (sec 10.6)** | ラストダンジョン入場条件: `canEnterFinalDungeon`（`gotDawnMark` 完成後） |
| **実装 ([maps.js](file:///C:/PROJECT/dorakue1/src/data/maps.js#L86))** | `requiredFlag: 'gotTideMirror'` |

---

### 12. カラム山村マップが未実装

仕様（sec 9.3, 10.4）では「カラム山村」が重要な中継地点として定義されています（村長NPC、潮路の貝入手、塔情報取得など）が、`MAP_IDS` にも `maps.js` にもカラム山村が存在しません。

---

## 🟡 仕様に記載があるが未実装の機能

| 機能 | 仕様箇所 | 状況 |
|---|---|---|
| メニュー画面 (M/X キー) | sec 6.8, 7.1 | 未実装（キー処理なし） |
| ステータス画面 | sec 6.9 | 未実装 |
| ゲームオーバー画面 | sec 6.10 | 未実装（白鐘城帰還のみ） |
| エンディング画面 | sec 6.11 | 未実装（メッセージで代用） |
| タイトル画面「操作説明」「クレジット」 | sec 6.1 | 要確認（TitleScene未読） |
| 術（スペル）システム | sec 14.5 | 未実装 |
| 状態異常（毒） | sec 14.6 | 未実装 |
| 装備システム | sec 14.8-9 | 未実装 |
| 「記録」コマンドでのセーブ | sec 6.8 | 未実装（自動セーブのみ） |
| 冴えた一撃 (5%で1.8倍) | sec 14.4 | 未実装 |
| 素早さによる先攻判定 | sec 14.3 | 未実装（常に主人公先攻） |
| 逃走 | sec 14.3 | 未実装（戦闘コマンドなし） |
| 宝箱 CHEST タイル の通行判定 | sec 8.5 | ❌ 通行不可だが壁判定で弾かれ宝箱を開けられない可能性あり |

---

## 🔵 コード品質・設計上の指摘

### 13. ダメージ計算式が仕様と異なる

**仕様 (sec 14.4)**:
```
基礎ダメージ = 攻撃力 - floor(防御力 / 2)
乱数補正 = 0.85 〜 1.15
最終ダメージ = max(1, floor(基礎ダメージ * 乱数補正))
```

**実装 ([battle.js](file:///C:/PROJECT/dorakue1/src/data/battle.js#L149-L151))**:
```js
const variation = (turn % 3) - 1;  // -1, 0, or 1 の固定パターン
return Math.max(1, attack - Math.floor(defense / 2) + variation);
```

乱数の代わりにターン数で決定論的にダメージが変動します。同じ敵との戦闘は毎回同じ結果になります。

---

### 14. 戦闘でプレイヤー選択がない

[FieldScene.js](file:///C:/PROJECT/dorakue1/src/scenes/FieldScene.js#L576-L602) の `tryStartEncounter()` は完全自動で戦闘を解決しています。仕様（sec 6.7）では `攻める / 術法 / 道具 / 退く` のコマンド選択が必要です。

---

### 15. `HOUSE_FLOOR` タイルが通行不可

[constants.js](file:///C:/PROJECT/dorakue1/src/game/constants.js#L128-L132) で `HOUSE_FLOOR` の `passable: false` になっていますが、町マップ内では `HOUSE_FLOOR` (`B`) が通路として使われています。これにより町内での移動が制限されます。

---

### 16. 「続きから」ロードの開始マップ

[save.js](file:///C:/PROJECT/dorakue1/src/data/save.js) の `loadSavedPlayer()` はプレイヤーデータを正しく復元しますが、TitleScene 側でどのように FieldScene に引き渡すか要確認（初期プレイヤーと区別して渡しているか）。

---

### 17. `SHRINE` 入口の `requiredFlag` が `gotDawnMark` になっている

[maps.js](file:///C:/PROJECT/dorakue1/src/data/maps.js#L75) では、祠への入口に `requiredFlag: 'gotDawnMark'` が設定されています。しかし仕様では「暁の印は祠で完成するもの」なので、祠に入るのに暁の印は必要ありません。祠の入口は条件なし（または別フラグ）であるべきです。

---

## 📋 優先度別アクションリスト

### 🔴 高優先（ゲーム進行に直結）

1. ラスボス名を `黒冠卿オルヴェス` に変更
2. エンカウントテーブルを仕様の敵名に修正
3. FINAL マップから `夜明け喰らい` を通常敵として削除
4. `gotDawnMark` 完成ロジックを祠イベントに実装
5. 最終マップ入口フラグを `gotDawnMark` に修正
6. 祠入口の `requiredFlag` を修正（入場を無条件または別フラグに）
7. `HOUSE_FLOOR` を `passable: true` に変更（町を歩けるようにする）

### 🟡 中優先（仕様整合）

8. セーブキーを `path_of_dawn_save_v1` に統一
9. `HERB_HEAL` を 30 に変更
10. `MAX_HERBS` を 99 に変更
11. 宿屋料金を 8リム に変更
12. `nextExp: 10` に変更（Lv1→2の必要EXP）
13. フラグ名を仕様に合わせて統一（`gotBlueOrb` → `gotBlueLampOrb` など）
14. ダメージ計算に乱数を使用（仕様の 0.85〜1.15 倍）

### 🟢 低優先（拡張）

15. カラム山村マップの追加
16. 初期スタートを白鐘城内に変更
17. メニュー画面（M/X）の実装
18. 術システムの実装
19. 装備システムの実装
20. 戦闘コマンド選択UIの実装
