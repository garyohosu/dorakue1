# SEQUENCE.md — 暁の小径 シーケンス定義

## 概要

主要フローを 6 つのシーケンス図で表す。各図は対応する UC を参照している。

| ID | タイトル | 対応 UC |
|---|---|---|
| SD-01 | タイトル画面〜ゲーム開始 | UC-01, UC-02, UC-03 |
| SD-02 | フィールド移動〜ランダムエンカウント | UC-04, UC-05, UC-07 |
| SD-03 | 戦闘メインフロー | UC-08, UC-09, UC-10, UC-11, UC-21 |
| SD-04 | セーブ・ロード | UC-17, UC-18 |
| SD-05 | 重要アイテム取得〜イベント進行 | UC-06, UC-19 |
| SD-06 | ラスボス戦〜エンディング | UC-20 |

---

## SD-01 タイトル画面〜ゲーム開始

```mermaid
sequenceDiagram
    actor Player as プレイヤー
    participant Title as TitleScene
    participant Field as FieldScene
    participant LS as LocalStorage

    Player->>Title: ブラウザでアクセス
    Title->>LS: セーブデータ確認（path_of_dawn_save_v1）
    alt セーブデータあり
        LS-->>Title: データ存在
        Title->>Player: メニュー表示（続きから：有効）
    else セーブデータなし
        LS-->>Title: データなし
        Title->>Player: メニュー表示（続きから：灰色）
    end

    alt 新しく始める
        Player->>Title: 「新しく始める」選択
        Title->>LS: 初期データ書き込み（HP24, MP6, Lv1, 80リム…）
        Title->>Field: FieldScene遷移（白鐘城）
        Field->>Player: 初期配置・ゲーム開始
    else 続きから
        Player->>Title: 「続きから」選択
        Title->>LS: セーブデータ読み込み
        alt データ正常
            LS-->>Title: データ返却
            Title->>Field: FieldScene遷移
            Field->>Player: 前回セーブ時の状態から再開
        else バージョン不一致・データ破損
            LS-->>Title: エラー
            Title->>Player: 警告表示後タイトルへ戻る
        end
    end
```

---

## SD-02 フィールド移動〜ランダムエンカウント

```mermaid
sequenceDiagram
    actor Player as プレイヤー
    participant Field as FieldScene
    participant Battle as BattleScene

    Player->>Field: 方向キー / WASD 入力
    loop 移動ループ（長押し時 150〜220ms 間隔）
        Field->>Field: タイル判定（山・水・壁・通行不可）
        alt 通行可
            Field->>Field: 主人公移動・カメラスクロール
            opt エンカウント可能タイル
                Field->>Field: 乱数エンカウント判定
                opt 成立
                    Field->>Battle: BattleScene遷移（エリア別敵テーブルから選択）
                end
            end
        else 通行不可
            Field->>Player: 移動ブロック（無反応）
        end
    end

    Note over Player, Field: 入口タイルに乗った場合（UC-05）
    Player->>Field: 入口タイルに乗る
    alt 入場条件を満たす
        Field->>Field: 対応マップへシーン切り替え
    else 条件不足（フラグ未達・重要アイテム不所持）
        Field->>Player: 入場拒否メッセージ
        Note right of Field: 例:「月紋の鍵がなければ開かない。」
    end
```

---

## SD-03 戦闘メインフロー

```mermaid
sequenceDiagram
    actor Player as プレイヤー
    participant Battle as BattleScene
    participant Field as FieldScene

    Battle->>Player: 戦闘開始・コマンド表示（攻める / 術法 / 道具 / 退く）

    loop ターン繰り返し
        Player->>Battle: コマンド選択

        alt 攻める
            Battle->>Battle: 先攻判定（素早さ比較・確率25〜85%）
            Battle->>Battle: ダメージ計算 max(1, (ATK−DEF/2)×乱数(0.85〜1.15))
            opt 5%確率：冴えた一撃
                Battle->>Player: 「冴えた一撃！」（ダメージ×1.8）
            end
        else 術法
            Battle->>Battle: MP消費・術効果適用（攻撃 / 回復 / 補助 / 脱出 / 帰還）
        else 道具
            Battle->>Battle: アイテム消費・効果適用・所持数−1
        else 退く
            alt 通常戦闘
                Battle->>Battle: 逃走判定（55+(主人公速−敵速)×4, 下限20% 上限90%）
                alt 成功
                    Battle->>Field: FieldScene へ戻る
                else 失敗
                    Battle->>Player: 「退く隙がない。」（ターン消費）
                end
            else ボス戦
                Battle->>Player: 「ここでは退けない。」
            end
        end

        opt 主人公先攻でなかった場合は敵が先行
            Battle->>Battle: 敵行動
        end
        Battle->>Battle: もう一方の行動後HP0判定

        alt 敵HP≤0
            Battle->>Player: 勝利：経験値・所持金取得
            opt 必要経験値到達
                Battle->>Player: Lvアップ表示・パラメータ上昇
            end
            Battle->>Field: FieldScene へ戻る
        else 主人公HP≤0
            Battle->>Player: 「アレンは夜霧に包まれた。」
            Battle->>Player: ゲームオーバー画面（最後の記録から再開 / タイトルへ戻る）
        end
    end
```

---

## SD-04 セーブ・ロード

```mermaid
sequenceDiagram
    actor Player as プレイヤー
    participant Menu as MenuScene
    participant Title as TitleScene
    participant Field as FieldScene
    participant LS as LocalStorage

    Note over Player, LS: セーブ（UC-17）
    Player->>Menu: 「記録」選択 または 記録係NPCと会話
    Menu->>Player: 「記録しますか？ はい / いいえ」
    alt はい
        Menu->>LS: path_of_dawn_save_v1 書き込み
        Note right of LS: プレイヤーデータ・マップID・座標・向き・所持アイテム・装備・重要アイテム・進行フラグ・宝箱状態・撃破済み固定敵・音量設定・最後に休んだ場所
        alt 書き込み成功
            LS-->>Menu: 完了
            Menu->>Player: 「記録しました。」
        else 書き込み失敗
            LS-->>Menu: エラー
            Menu->>Player: 「記録に失敗しました。ブラウザの保存設定を確認してください。」
        end
    else いいえ
        Menu->>Player: キャンセル（メニューへ戻る）
    end

    Note over Player, LS: ロード（UC-18）
    Player->>Title: 「続きから」選択
    Title->>LS: path_of_dawn_save_v1 読み込み
    alt データ正常・バージョン一致
        LS-->>Title: データ返却
        Title->>Field: FieldScene遷移
        Field->>Player: 前回セーブ時の状態から再開
    else バージョン不一致
        LS-->>Title: 不一致通知
        Title->>Player: 警告表示後タイトルへ戻る
    end
```

---

## SD-05 重要アイテム取得〜イベント進行

```mermaid
sequenceDiagram
    actor Player as プレイヤー
    participant Field as FieldScene
    participant Battle as BattleScene
    participant NPC as NPC会話イベント

    Note over Player, NPC: 取得経路（UC-19）

    Player->>Field: 森の洞窟最奥の宝箱を調べる
    Field->>Player: 月紋の鍵 取得（gotMoonKey = true）

    Player->>Battle: 星見の塔・青火の番人を撃破
    Battle->>Player: 青灯の珠 取得（defeatedTowerBoss = true, gotBlueLampOrb = true）

    Player->>NPC: 神官メリカと会話
    NPC->>Player: 潮路の貝 取得（gotTideShell = true, learnedShrineHint = true）

    Player->>NPC: 王に青灯の珠を提示
    NPC->>Player: 朝霧の鏡 取得（gotMorningMirror = true）

    Player->>Field: 王の許可後・宝物庫へ入る
    Field->>Player: 白鐘の破片 取得（gotWhiteBellShard = true）

    Note over Player, NPC: 使用シナリオ

    Player->>Field: 星見の塔入口タイルに乗る（月紋の鍵所持）
    Field->>Player: openedTowerDoor = true → 入場許可

    Player->>Field: 海辺の祠の祭壇で全重要アイテムを使用
    alt 全アイテム所持
        Field->>Player: gotDawnMark = true, openedSeaPath = true, canEnterFinalDungeon = true
    else 不足あり
        Field->>Player: 「あと〇〇が必要だ。」（不足アイテムを明示）
    end

    Player->>Field: 黒冠砦へ入場（canEnterFinalDungeon = true）
    Field->>Player: enteredFinalDungeon = true
```

---

## SD-06 ラスボス戦〜エンディング

```mermaid
sequenceDiagram
    actor Player as プレイヤー
    participant Field as FieldScene
    participant Battle as BattleScene
    participant Ending as EndingScene
    participant Title as TitleScene

    Player->>Field: 黒冠砦最奥に到達
    Field->>Player: ラスボス前警告メッセージ
    Field->>Battle: ボス戦開始（黒冠卿オルヴェス 第1形態 HP260）

    loop 第1形態戦闘
        Battle->>Battle: 通常戦闘と同ロジック（逃走不可）
    end

    Battle->>Battle: 第1形態HP0
    Battle->>Player: 形態移行演出
    Battle->>Battle: 最終形態「夜明け喰らい」開始（HP340）

    loop 最終形態戦闘
        Battle->>Battle: 通常戦闘と同ロジック（逃走不可）
    end

    Battle->>Battle: 最終形態HP0
    Battle->>Player: defeatedFinalBoss = true
    Battle->>Ending: EndingScene へ遷移

    Ending->>Player: エンディングテキスト・演出表示
    Player->>Ending: Enter / Space で決定
    Ending->>Title: TitleScene へ遷移
```
