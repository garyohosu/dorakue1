# CLASS.md — 暁の小径 クラス設計

## 概要

JavaScript (Phaser) を前提とした主要クラスと責務の定義。
各シーンは `Phaser.Scene` を継承し、マネージャー類は独立モジュールとして実装する。

---

## クラス図

```mermaid
classDiagram
    class PlayerData {
        +string name
        +int level
        +int hp
        +int maxHp
        +int mp
        +int maxMp
        +int baseAtk
        +int baseDef
        +int agi
        +int exp
        +int nextExp
        +int gold
        +ItemStack[] items
        +string weaponId
        +string armorId
        +string[] spells
        +string[] keyItems
        +Record flags
        +string mapId
        +int x
        +int y
        +string direction
        +string lastRestPlace
        +string[] openedChests
        +string[] defeatedFixed
        +int volumeBgm
        +int volumeSe
    }

    class FlagStore {
        -Record flags
        +set(name, value) void
        +get(name) bool
        +checkAll(names) bool
    }

    class SaveManager {
        +string SAVE_KEY
        +save(PlayerData, FlagStore) bool
        +load() SavePayload
        +exists() bool
        +clear() void
    }

    class BattleSystem {
        +calcDamage(atk, def) int
        +calcFleeRate(playerSpd, enemySpd) int
        +applySpell(spellId, player, enemy) void
        +gainExp(player, exp) LevelUpResult
    }

    class DialogManager {
        +show(lines) Promise
        +showChoice(options) Promise~int~
        +close() void
    }

    class EnemyData {
        +string id
        +string name
        +int hp
        +int atk
        +int def
        +int spd
        +int exp
        +int gold
        +string[] skills
        +bool isBoss
    }

    class MapData {
        +string id
        +int width
        +int height
        +int[][] tiles
        +EntranceData[] entrances
        +NPCData[] npcs
        +ChestData[] chests
        +string bgmId
        +bool canEncounter
    }

    class TitleScene {
        -SaveManager saveManager
        +create() void
        +onNewGame() void
        +onContinue() void
        +onShowHelp() void
    }

    class FieldScene {
        -PlayerData player
        -FlagStore flags
        -MapData currentMap
        -DialogManager dialog
        +create() void
        +handleMove(dir) void
        +checkEncounter() void
        +checkEntrance() void
        +interactFacing() void
        +checkConditionEntry(mapId) bool
    }

    class BattleScene {
        -PlayerData player
        -EnemyData enemy
        -BattleSystem system
        +create() void
        +playerAttack() void
        +playerSpell(spellId) void
        +playerItem(itemId) void
        +playerFlee() void
        +enemyTurn() void
        +onVictory() void
        +onDefeat() void
    }

    class MenuScene {
        -PlayerData player
        -SaveManager saveManager
        -FlagStore flags
        +create() void
        +openItems() void
        +openSpells() void
        +openEquip() void
        +openStatus() void
        +saveGame() void
        +openSettings() void
    }

    class GameOverScene {
        +create() void
        +onReload() void
        +onTitle() void
    }

    class EndingScene {
        +create() void
        +playSequence() void
        +onFinish() void
    }

    %% SaveManager との関係
    SaveManager --> PlayerData : serialize / deserialize
    SaveManager --> FlagStore : serialize / deserialize

    %% TitleScene
    TitleScene --> SaveManager : uses
    TitleScene ..> FieldScene : transitions to

    %% FieldScene
    FieldScene --> PlayerData : reads / writes
    FieldScene --> FlagStore : reads / writes
    FieldScene --> MapData : loads
    FieldScene --> DialogManager : uses
    FieldScene ..> BattleScene : transitions to (encounter / boss)
    FieldScene ..> MenuScene : opens (overlay)

    %% BattleScene
    BattleScene --> PlayerData : mutates
    BattleScene --> EnemyData : fights
    BattleScene --> BattleSystem : delegates
    BattleScene ..> FieldScene : returns to (victory / flee)
    BattleScene ..> GameOverScene : transitions to (defeat)
    BattleScene ..> EndingScene : transitions to (final boss victory)

    %% MenuScene
    MenuScene --> PlayerData : reads / writes
    MenuScene --> SaveManager : uses
    MenuScene --> FlagStore : reads

    %% EndingScene
    EndingScene ..> TitleScene : transitions to
```

---

## クラス責務サマリー

| クラス | 責務 |
|---|---|
| `PlayerData` | プレイヤーの全状態を保持するデータオブジェクト（DTO） |
| `FlagStore` | ゲーム進行フラグの読み書き。`checkAll` で複数フラグの同時確認が可能 |
| `SaveManager` | `path_of_dawn_save_v1` キーで LocalStorage に PlayerData + FlagStore を JSON 保存・読み込みする |
| `BattleSystem` | ダメージ計算・逃走成功率・術法効果・レベルアップ判定のロジックをシーンから分離した純粋関数群 |
| `DialogManager` | テキストウィンドウの表示・テキスト送り・選択肢表示を非同期 Promise で提供する |
| `EnemyData` | 敵の静的データ定義（ボス・通常敵共通） |
| `MapData` | タイルマップ・NPC・入口・宝箱・エンカウント設定を保持する |
| `TitleScene` | タイトル画面。新規ゲーム初期化または続きからロードを起点として FieldScene へ遷移する |
| `FieldScene` | ワールドマップ・各ローカルマップ上での移動・NPC会話・エンカウント・入口判定を担う |
| `BattleScene` | 1対1ターン制戦闘。コマンド受付・ダメージ処理・勝敗判定・報酬付与を行う |
| `MenuScene` | メニューオーバーレイ。装備変更・ステータス確認・セーブを提供する |
| `GameOverScene` | HP0による敗北後の画面。最後の記録から再開またはタイトルへ誘導する |
| `EndingScene` | ラスボス撃破後のエンディング演出とスタッフクレジットを表示しタイトルへ戻る |

---

## 主要データフロー

```mermaid
classDiagram
    class SavePayload {
        +string version
        +PlayerData player
        +Record~string,bool~ flags
        +string[] openedChests
        +string[] defeatedFixed
        +int volumeBgm
        +int volumeSe
    }

    class ItemStack {
        +string id
        +int count
    }

    class EntranceData {
        +string targetMapId
        +int targetX
        +int targetY
        +string requiredFlag
        +string requiredItemId
        +string denyMessage
    }

    class NPCData {
        +string id
        +int x
        +int y
        +string[] dialogLines
        +string conditionFlag
        +string setFlag
        +bool isSaveNpc
        +bool isShop
        +bool isInn
    }

    class LevelUpResult {
        +bool leveledUp
        +int newLv
        +int hpGain
        +int mpGain
        +string learnedSpell
    }

    PlayerData *-- ItemStack : items
    MapData *-- EntranceData : entrances
    MapData *-- NPCData : npcs
    SaveManager --> SavePayload : produces / consumes
    SavePayload --> PlayerData : contains
    BattleSystem --> LevelUpResult : returns
```
