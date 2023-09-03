/*:
@plugindesc
ワールド自動生成 Ver0.5.7(2023/9/3)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Map/GenerateWorld.js
@orderAfter wasdKeyMZ
@orderAfter GridScrollMap
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver0.5.7
- リファクタリング
- 固定リージョンを変更すると表示がおかしくなるバグ修正
- 処理が複雑化してしまうため、タイルを使用しない場合の例外処理を廃止。
- ワールド自動生成マップ以外で、マップJSON出力するとタイル情報が消えてしまうバグ修正
* Ver0.5.6
- リファクタリング
- セーブデータ保持をWeb以外でも有効にできるように変更
- プラグインコマンドのヘルプを一部修正
- 一部プラグインパラメータの必要性がほとんどないため、廃止
* Ver0.5.5
- 乗り物の座標を指定したときに、0,0座標に近い座標に移動してしまうバグ修正
- ロンチプラグインの wasdKeyMZ.js と競合するため、順番をエラー表示するように修正
- コマンドキーを変更出来なかったバグ修正
- コマンドキーのワールド再生成キーのデフォルトを M => R に変更
- コマンドキーのパラメータをコンボボックスに変更し、キーを選択できるように変更
- コンソールログの出力方法を修正
* Ver0.5.4
- 巨大なマップ等でバイオームの判定が遅くなっていた問題を修正
- デバッグ文をテストプレイ時のみコンソールに出力するように修正
* Ver0.5.3: ヘルプ修正
- 進捗ノート削除による対応予定のリンクを削除
- 概要の一部を使い方に移動
- 使い方のヘルプを一部修正
* Ver0.5.2: ヘルプを枠内に表示するように修正
* Ver0.5.1: イベントが表示されている場所には乗り物を呼び出さないように修正
* Ver0.5.0: 開発版を先行公開

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
ワールドを自動生成します。

## 使い方
使い方については最低限の使い方のみ記載しています。

その他の使用方法については、  
下記サンプルプロジェクトを参考にしてください。  
https://github.com/pota-gon/GenerateWorld

※ 開発版のため未実装の機能が複数あります。今後のアップデートで対応します。

### 1. マップ設定
1. タイルセットを『フィールド1』にします。  
   ※ 現時点では、デフォルトのタイルセットのみ対応しています。  
      今後のアップデートで他のタイルセットも使えるようにする予定です。
2. マップのメモ欄に <ワールド自動生成> と記載します。  
3. Aタイルで適当に塗りつぶしてください。  
   (内部で設定されたデータを元に自動的にタイルが選択されます)  
   タイル固定リージョン(デフォルトは1) を指定した場合は、タイルを固定できます。  
   町などのイベントを配置するのに活用してください。

### 2. イベント設定
通常のイベントは、そのままの位置に表示されます。  
タイル固定リージョン(デフォルトは1)と組み合わせると  
町などのイベントが簡単に作れます。

#### 確率指定
イベントのメモ欄に <RateMap: 0.5> のように指定すると、  
50% の確率で表示されるイベントが作成できます。配置位置はランダムとなります。

#### すり抜け
すり抜けオプションを指定すると、  
そのイベントに飛行船で着陸できるようになります。

### 競合について
他プラグインについての競合ですが、かなり大規模なプラグインなため、  
競合対策も難しいので、競合対策はお断りする可能性があります。

以下、確認している競合情報です。  
明記されているものについては対応の予定はございません。ご了承ください。

* んーぞーさんの MiniMap.js  
=> エンカウントなしマップ全域描画をOFFにしないと描画されない。  
   競合を解決しようとすると、  
   ワールド自動生成プラグイン単体での  
   動作に影響が高そうなので対応しない予定です。

* 砂川さんの NRP_OriginalVehicle.js(オリジナルの乗物を追加するプラグイン)  
=> 乗り物自体を追加することは恐らく可能ですが、  
   乗り物を呼び出す機能には対応しない予定です。  
   乗り物をそこまで多く使う必要がない気がするのと、  
   小型船・大型船・飛行船でワールド自動生成プラグイン上の扱いが違うことにより、  
   対応すると設定が複雑になってしまうため、対応しない予定です。

@param RetentionSaveData
@type boolean
@text セーブデータ保持
@desc セーブデータを保持するか
@on 保持する
@off 保持しない
@default true

@param SeedVariable
@type variable
@text シード変数
@desc マップのシード変数
0(なし)の場合、シードを変数に保存しません。
@default 0

@param TileRegion
@type number
@text タイル固定リージョン
@desc タイルを固定するリージョン
@default 1

@param Tilesets
@type struct<Tilesets>[]
@text タイルセット設定
@desc タイルセットごとに必要な設定
@default ["{\"tile_set_id\":\"1\",\"boat_tile_ids\":\"[\\\"2432\\\"]\",\"ship_tile_ids\":\"[\\\"2048\\\"]\",\"airship_tile_ids\":\"[\\\"2624\\\", \\\"2720\\\"]\"}"]

@param Maps
@parent Tilesets
@type struct<Maps>[]
@text マップ設定
@desc マップごとに必要な設定。
未実装。

@param Vehicle
@type boolean
@text 乗り物呼び出し
@desc 乗り物呼び出し機能を使うか
@on 使う
@off 使わない
@default true

    @param BoatSwitch
    @parent Vehicle
    @type switch
    @text 小型船呼び出し許可スイッチ
    @desc ONのときに小型船呼び出しを許可するスイッチ
    0 のときは無条件で呼び出すことが出来ます
    @default 0

    @param ShipSwitch
    @parent Vehicle
    @type switch
    @text 大型船呼び出し許可スイッチ
    @desc ONのときに大型船呼び出しを許可するスイッチ
    0 のときは無条件で呼び出すことが出来ます
    @default 0

    @param AirshipSwitch
    @parent Vehicle
    @type switch
    @text 飛行船呼び出し許可スイッチ
    @desc ONのときに飛行船呼び出しを許可するスイッチ
    0 のときは無条件で呼び出すことが出来ます
    @default 0

@param Test
@text テスト時のみ有効な設定
@desc ※ 分類用のパラメータです。

    @param RegenerateCommand
    @parent Test
    @type combo
    @text ワールド再生成コマンド名
    @desc メニューからワールド再生成が出来るコマンド
    空文字でメニューに表示しません。テスト時のみ有効です
    @default ワールド再生成
    @option ワールド再生成

    @param ExportJsonCommand
    @parent Test
    @type combo
    @text マップJSON出力
    @desc メニューからマップJSON出力が出来るコマンド
    空文字でメニューに表示しません。テスト時のみ有効です
    @default マップJSON出力
    @option マップJSON出力

        @param SameMapExportJson
        @parent ExportJsonCommand
        @type boolean
        @text 同一マップJSON出力
        @desc 同一マップにJSONを出力するか
        出力しない場合、新規マップとして出力されます
        @on 出力する
        @off 出力しない
        @default false

        @param EventExport
        @parent ExportJsonCommand
        @type boolean
        @text イベント出力
        @desc イベントを出力するか
        同一マップでは設定に関係なく出力します
        @on 出力する
        @off 出力しない
        @default false

        @param BackupJson
        @parent ExportJsonCommand
        @type boolean
        @text JSONバックアップ
        @desc バックアップするか
        @on バックアップする
        @off バックアップしない
        @default true

    @param CommandKey
    @parent Test
    @type boolean
    @text コマンドキー対応
    @desc コマンドをキーで実行できるようにするか
    テスト時のみ有効です
    @on キーで実行可能
    @off キーで実行しない
    @default true

        @param RegenerateKey
        @parent CommandKey
        @type combo
        @text ワールド再生成
        @desc ワールド再生成のキー
        @default R
        @option A
        @option B
        @option C
        @option D
        @option E
        @option F
        @option G
        @option H
        @option I
        @option J
        @option K
        @option L
        @option M
        @option N
        @option O
        @option P
        @option Q
        @option R
        @option S
        @option T
        @option U
        @option V
        @option W
        @option X
        @option Y
        @option Z
        @option 0
        @option 1
        @option 2
        @option 3
        @option 4
        @option 5
        @option 6
        @option 7
        @option 8
        @option 9
        @option T0
        @option T1
        @option T2
        @option T3
        @option T4
        @option T5
        @option T6
        @option T7
        @option T8
        @option T9
        @option T*
        @option T+
        @option T-
        @option T.
        @option T/
        @option :
        @option ;
        @option ,
        @option -
        @option .
        @option /
        @option @
        @option [
        @option \|
        @option ]
        @option ^
        @option \_
        @option F1
        @option F2
        @option F3
        @option F4
        @option F5
        @option F6
        @option F7
        @option F8
        @option F9
        @option F10
        @option F11
        @option F12
        @option BackSpace
        @option Pause
        @option 変換
        @option 無変換
        @option End
        @option Home
        @option Delete

        @param ExportJsonKey
        @parent CommandKey
        @type combo
        @text マップJSON出力(イベントあり)
        @desc マップJSON出力のキー
        @default E
        @option A
        @option B
        @option C
        @option D
        @option E
        @option F
        @option G
        @option H
        @option I
        @option J
        @option K
        @option L
        @option M
        @option N
        @option O
        @option P
        @option Q
        @option R
        @option S
        @option T
        @option U
        @option V
        @option W
        @option X
        @option Y
        @option Z
        @option 0
        @option 1
        @option 2
        @option 3
        @option 4
        @option 5
        @option 6
        @option 7
        @option 8
        @option 9
        @option T0
        @option T1
        @option T2
        @option T3
        @option T4
        @option T5
        @option T6
        @option T7
        @option T8
        @option T9
        @option T*
        @option T+
        @option T-
        @option T.
        @option T/
        @option :
        @option ;
        @option ,
        @option -
        @option .
        @option /
        @option @
        @option [
        @option \|
        @option ]
        @option ^
        @option \_
        @option F1
        @option F2
        @option F3
        @option F4
        @option F5
        @option F6
        @option F7
        @option F8
        @option F9
        @option F10
        @option F11
        @option F12
        @option BackSpace
        @option Pause
        @option 変換
        @option 無変換
        @option End
        @option Home
        @option Delete

        @param OutputJsonKey
        @parent CommandKey
        @type string
        @text マップJSON出力(イベントなし)
        @desc マップJSON出力のキー
        同一マップに出力する場合は、イベントも出力します
        @default O
        @option A
        @option B
        @option C
        @option D
        @option E
        @option F
        @option G
        @option H
        @option I
        @option J
        @option K
        @option L
        @option M
        @option N
        @option O
        @option P
        @option Q
        @option R
        @option S
        @option T
        @option U
        @option V
        @option W
        @option X
        @option Y
        @option Z
        @option 0
        @option 1
        @option 2
        @option 3
        @option 4
        @option 5
        @option 6
        @option 7
        @option 8
        @option 9
        @option T0
        @option T1
        @option T2
        @option T3
        @option T4
        @option T5
        @option T6
        @option T7
        @option T8
        @option T9
        @option T*
        @option T+
        @option T-
        @option T.
        @option T/
        @option :
        @option ;
        @option ,
        @option -
        @option .
        @option /
        @option @
        @option [
        @option \|
        @option ]
        @option ^
        @option \_
        @option F1
        @option F2
        @option F3
        @option F4
        @option F5
        @option F6
        @option F7
        @option F8
        @option F9
        @option F10
        @option F11
        @option F12
        @option BackSpace
        @option Pause
        @option 変換
        @option 無変換
        @option End
        @option Home
        @option Delete



@command GenerateWorld
@text ワールド自動生成
@desc ワールド自動生成

    @arg spawn
    @type boolean
    @text スポーン地点設定
    @desc スポーン地点を設定するか
    @on 設定する
    @off 設定しない
    @default true

        @arg direction
        @parent spawn
        @type select
        @text 向き
        @desc 移動先のプレイヤーの向き
        @default 0
        @option そのまま
        @value 0
        @option 下
        @value 2
        @option 左
        @value 4
        @option 右
        @value 6
        @option 上
        @value 8

        @arg vehicle
        @parent spawn
        @type boolean
        @text 乗り物移動
        @desc 乗り物も移動させるか
        @on 移動する
        @off 移動しない
        @default true

@command Spawn
@text スポーン地点設定
@desc スポーン地点設定

    @arg direction
    @type select
    @text 向き
    @desc 移動先のプレイヤーの向き
    @default 0
    @option そのまま
    @value 0
    @option 下
    @value 2
    @option 左
    @value 4
    @option 右
    @value 6
    @option 上
    @value 8

    @arg vehicle
    @type boolean
    @text 乗り物移動
    @desc 乗り物も移動させるか
    @on 移動する
    @off 移動しない
    @default true

@command ExportMapJson
@text マップJSON出力
@desc マップJSON出力

    @arg same_map_export_json
    @type boolean
    @text 同一マップJSON出力
    @desc 同一マップにJSONを出力するか
    出力しない場合、新規マップとして出力されます
    @on 出力する
    @off 出力しない
    @default false

    @arg event_export
    @type boolean
    @text イベント出力
    @desc イベントを出力するか
    同一マップでは設定に関係なく出力します
    @on 出力する
    @off 出力しない
    @default false

    @arg backup_json
    @type boolean
    @text JSONバックアップ
    @desc バックアップするか
    @on バックアップする
    @off バックアップしない
    @default true
*/



/*~struct~Tilesets:
@param tile_set_id
@type tileset
@text タイルセットID
@default 1

@param map_id
@type number
@text タイルセットマップID
@desc タイルの設定を決めるマップID
0 の場合は使用しません。未実装。実装するか検討中。
@default 0
@min 0

@param boat_tile_ids
@type number[]
@text 小型船タイルID
@desc 小型船を呼び出せるタイルID
@default ["2432"]

@param ship_tile_ids
@type number[]
@text 大型船タイルID
@desc 大型船を呼び出せるタイルID
@default ["2048"]

@param airship_tile_ids
@type number[]
@text 飛行船タイルID
@desc 飛行船を呼び出せるタイルID
@default ["2624", "2720"]
*/

/*~struct~Maps:
@param map_id
@type number
@text マップID
@desc 設定するマップID
マップ名を指定した場合は、こちらの設定は不要です
@default 0
@min 0

@param map_name
@type string
@text マップ名
@desc 設定するマップ名(マップIDが 0 のとき有効)
マップIDを指定した場合は、こちらの設定は不要です
*/
(() => {
    'use strict';

    const SEED_LENGTH = 255;
    const BIOME = {
        2048: {'top_tile' : [[2048, 0, 1, 0]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, -0.5, -1, 1]]}, // 海
        2096: {'top_tile' : [[2048, 0, 1, 0]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, 0, -1, 1]]}, // 深い海
        2144: {'top_tile' : [[2048, 0, 1, 0]], 'bottom_tile' : [[2048, 0, -1, 0], [2144, 0, -1, 1]]}, // 岩礁
        2192: {'top_tile' : [[2048, 0, 1, 0]], 'bottom_tile' : [[2048, 0, -1, 0], [2192, 0, -1, 1]]}, // 氷山
        2240: {'top_tile' : [[3200, 0, 1, 0], [3392, 0.5, 1, 1]], 'bottom_tile' : [[2240, 0, -1, 0]]}, // 毒の沼
        2288: {'top_tile' : [[3200, 0, 1, 0], [3392, 0.2, 1, 1]], 'bottom_tile' : [[2240, 0, -1, 0]]}, // 枯れ木
        2336: {'top_tile' : [[3200, 0, 1, 0], [3392, 0.5, 1, 1]], 'bottom_tile' : [[2336, 0, -1, 0]]}, // 溶岩
        2384: {'top_tile' : [[3200, 0, 1, 0], [3392, 0.2, 1, 1]], 'bottom_tile' : [[2336, 0, -1, 0]]}, // 溶岩の泡
        2432: {'top_tile' : [[2816, 0, 1, 0], [3008, 0.2, 0.35, 1], [3104, 0.35, 0.5, 1], [3872, 0.5, 1, 1]], 'bottom_tile' : [[2432, 0, -1, 0]]}, // 池
        2480: {'top_tile' : [[2816, 0, 1, 0], [3008, 0.2, 0.3, 1], [3104, 0.3, 0.45, 1], [3872, 0.45, 1, 1]], 'bottom_tile' : [[2432, 0, -1, 0]]}, // 岩
        2528: {'top_tile' : [[3968, 0, 1, 0], [4160, 0.2, 1, 1]], 'bottom_tile' : [[2528, 0, -1, 0]]}, // 凍った海
        2576: {'top_tile' : [[2048, 0, 1, 0]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, -0.5, -1, 1]]}, // 渦
        2624: {'top_tile' : [[2816, 0, 1, 0], [3008, 0.25, 0.35, 1], [3104, 0.35, 0.5, 1], [3872, 0.5, 1, 1]], 'bottom_tile' : [[2624, 0, -1, 0]]}, // 大地の境界
        2672: {'top_tile' : [[2816, 0, 1, 0], [3008, 0.25, 0.35, 1], [3104, 0.35, 0.5, 1], [3872, 0.5, 1, 1]], 'bottom_tile' : [[2624, 0, -1, 0]]}, // 下界に落ちる滝
        2720: {'top_tile' : [[4064, 0, 1, 0], [4112, 0.5, 1, 1]], 'bottom_tile' : [[2720, 0, -1, 0]]}, // 雲（大地の境界）
        2768: {'top_tile' : [[4064, 0, 1, 0], [4112, 0.5, 1, 1]], 'bottom_tile' : [[2720, 0, -1, 0]]}, // 雲
        2816: {'top_tile' : [[2816, 0, 1, 0], [3008, 0.25, 0.35, 1], [3104, 0.35, 0.5, 1], [3872, 0.5, 1, 1]], 'bottom_tile' : [[2816, 0, -0.1, 0], [2048, -0.1, -1, 0], [2096, -0.5, -1, 1]]}, // 平原
        2864: {'top_tile' : [[2816, 0, 1, 0], [2864, 0.35, 1, 1]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, -0.5, -1, 1]]}, // 草原A（濃）
        2912: {'top_tile' : [[2912, 0, 1, 0], [3056, 0.25, 0.35, 1], [3104, 0.35, 0.5, 1], [3872, 0.5, 1, 1]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, -0.5, -1, 1]]}, // 草原B
        2960: {'top_tile' : [[2912, 0, 1, 0], [2960, 0.35, 1, 1]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, -0.5, -1, 1]]}, // 草原B（濃）
        3008: {'top_tile' : [[2816, 0, 1, 0], [3008, 0, 1, 1]], 'bottom_tile' : [[2816, 0, -1, 0]]}, // 森
        3056: {'top_tile' : [[2816, 0, 1, 0], [3056, 0, 1, 1]], 'bottom_tile' : [[2816, 0, -1, 0]]}, // 森（針葉樹）
        3104: {'top_tile' : [[2816, 0, 1, 0], [3104, 0, 1, 1]], 'bottom_tile' : [[2816, 0, -1, 0]]}, // 山（草）
        3152: {'top_tile' : [[3296, 0, 1, 0], [3152, 0, 1, 1]], 'bottom_tile' : [[3296, 0, -1, 0]]}, // 山（土）
        3200: {'top_tile' : [[3200, 0, 1, 0], [3392, 0.3, 0.5, 1], [3488, 0.5, 1, 1]], 'bottom_tile' : [[3200, 0, -0.1, 0], [2048, -0.1, -1, 0], [2096, -0.5, -1, 1]]}, // 荒れ地A
        3248: {'top_tile' : [[3200, 0, 1, 0], [3248, 0.35, 1, 1]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, -0.5, -1, 1]]}, // 荒れ地B
        3296: {'top_tile' : [[3296, 0, 1, 0], [3392, 0.3, 0.5, 1], [3152, 0.5, 1, 1]], 'bottom_tile' : [[3296, 0, -0.1, 0], [2048, -0.1, -1, 0], [2096, -0.5, -1, 1]]}, // 土肌A
        3344: {'top_tile' : [[3296, 0, 1, 0], [3248, 0.35, 1, 1]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, -0.5, -1, 1]]}, // 土肌B
        3392: {'top_tile' : [[3200, 0, 1, 0], [3392, 0, 1, 1]], 'bottom_tile' : [[3200, 0, -1, 0]]}, // 森（枯れ木）
        3440: {'top_tile' : [[2816, 0, 1, 0], [3440, 0, 1, 1]], 'bottom_tile' : [[2816, 0, -1, 0]]}, // 道（土）
        3488: {'top_tile' : [[3200, 0, 1, 0], [3488, 0, 1, 1]], 'bottom_tile' : [[3200, 0, -1, 0]]}, // 丘（土）
        3536: {'top_tile' : [[3200, 0, 1, 0], [3536, 0, 1, 1]], 'bottom_tile' : [[3200, 0, -1, 0]]}, // 山（砂岩）
        3584: {'top_tile' : [[3584, 0, 1, 0], [3776, 0.15, 0.25, 1], [3536, 0.4, 1, 1]], 'bottom_tile' : [[3584, 0, -0.1, 0], [2048, -0.1, -1, 0], [2096, -0.5, -1, 1]]}, // 砂漠
        3632: {'top_tile' : [[3584, 0, 1, 0], [3632, 0.35, 1, 1]], 'bottom_tile' : [[2048, 0, -1, 0], [2096, -0.5, -1, 1]]}, // 砂漠B
        3680: {'top_tile' : [[3680, 0, 1, 0], [3392, 0.3, 0.5, 1], [3872, 0.5, 1, 1]], 'bottom_tile' : [[3680, 0, -0.1, 0], [2048, -0.1, -1, 0], [2096, -0.5, -1, 1]]}, // 岩地A
        3728: {'top_tile' : [[3680, 0, 1, 0], [3728, 0.3, 1, 1], [3920, 0.5, 1, 1]], 'bottom_tile' : [[3680, 0, -0.1, 0], [2048, -0.1, -1, 0], [2096, -0.5, -1, 1]]}, // 岩地B（溶岩）
        3776: {'top_tile' : [[3584, 0, 1, 0], [3776, 0, 1, 1]], 'bottom_tile' : [[3584, 0, -1, 0]]}, // 森（ヤシの木）
        3824: {'top_tile' : [[2816, 0, 1, 0], [3824, 0, 1, 1]], 'bottom_tile' : [[2816, 0, -1, 0]]}, // 道（舗装）
        3872: {'top_tile' : [[3680, 0, 1, 0], [3872, 0, 1, 1]], 'bottom_tile' : [[3680, 0, -1, 0]]}, // 山（岩）
        3920: {'top_tile' : [[3680, 0, 1, 0], [3920, 0, 1, 1]], 'bottom_tile' : [[3680, 0, -1, 0], [3728, -0.25, -1, 1]]}, // 山（溶岩）
        3968: {'top_tile' : [[3968, 0, 1, 0], [4160, 0.3, 0.5, 1], [4016, 0.5, 1, 1]], 'bottom_tile' : [[3968, 0, -0.1, 0], [2048, -0.1, -1, 0], [2096, -0.5, -1, 1]]}, // 雪原
        4016: {'top_tile' : [[3968, 0, 1, 0], [4016, 0, 1, 1]], 'bottom_tile' : [[3968, 0, -1, 0]]}, // 山（雪）
        4064: {'top_tile' : [[4064, 0, 1, 0], [4112, 0.5, 1, 1]], 'bottom_tile' : [[2720, 0, -1, 0]]}, // 雲
        4112: {'top_tile' : [[4064, 0, 1, 0], [4112, 0.5, 1, 1]], 'bottom_tile' : [[2720, 0, -1, 0]]}, // 大きな雲
        4160: {'top_tile' : [[3968, 0, 1, 0], [4160, 0, 1, 1]], 'bottom_tile' : [[3968, 0, -1, 0]]}, // 森（雪）
        4208: {'top_tile' : [[3200, 0, 1, 0], [3392, 0.3, 0.5, 1], [3488, 0.5, 1, 1]], 'bottom_tile' : [[3200, 0, -1, 0], [4208, 0, -1, 1]]}, // 穴
        4256: {'top_tile' : [[3200, 0, 1, 0], [4256, 0, 1, 1]], 'bottom_tile' : [[3200, 0, -1, 0]]}, // 丘（砂岩）
        4304: {'top_tile' : [[3968, 0, 1, 0], [4304, 0, 1, 1]], 'bottom_tile' : [[3968, 0, -1, 0]]} // 丘（雪）
    };
    let seed = [151,160,137,91,90,15,
        131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
        190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
        88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
        77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
        102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
        135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
        5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
        223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
        129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
        251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
        49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
        138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    let tileIds        = [];
    let aroundTileIds  = [];
    let distantTileIds = [];
    let x_points       = [];
    let y_points       = [];
    function showTime(time, message) {
        let endTime = Date.now(); // 終了時間
        console.debug(message + '時間: ' + (endTime - time) + 'ms'); // 何ミリ秒かかったかを表示する
    }
    class PotadraXorShift {
        constructor(w, h, t, seed = 1) {
            this.w = w;
            this.h = h;
            this.t = t;
            this.s = seed;
        }
        xorshift(min = 0, max = 254) {
            let t = this.w ^ (this.w << 11);
            this.w = this.h;
            this.h = this.t;
            this.t = this.s;
            this.s = (this.s ^ (this.s >>> 19)) ^ (t ^ (t >>> 8)); 
            return min + (Math.abs(this.s) % (max + 1 - min));
        }
    }
    // ベースプラグインの処理
    function Potadra_checkSwitch(switch_no, bool = true) {
        if (switch_no === 0 || $gameSwitches.value(switch_no) === bool) {
            return true;
        } else {
            return false;
        }
    }
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_convertBool(bool) {
        if (bool === "false" || bool === '' || bool === undefined) {
            return false;
        } else {
            return true;
        }
    }
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_getPluginParams(plugin_name) {
        let params = false;
        if (Potadra_isPlugin(plugin_name)) {
            params = PluginManager.parameters(plugin_name);
        }
        return params;
    }
    function Potadra_checkVariable(variable_no) {
        if (variable_no > 0 && variable_no <= 5000) {
            return true;
        } else {
            return false;
        }
    }
    function Potadra_meta(meta, tag) {
        if (meta) {
            const data = meta[tag];
            if (data) {
                if (data !== true) {
                    return data.trim();
                } else {
                    return true;
                }
            }
        }
        return false;
    }
    function Potadra_numberArray(data) {
        const arr = [];
        if (data) {
            for (const value of JSON.parse(data)) {
                arr.push(Number(value));
            }
        }
        return arr;
    }
    function Potadra_isTest(play_test = true) {
        return !play_test || Utils.isOptionValid("test");
    }
    function Potadra_getDirPath(dir) {
        if (StorageManager.isLocalMode()) {
            const path = require("path");
            const base = path.dirname(process.mainModule.filename);
            return path.join(base, dir + '/');
        } else {
            return dir + '/';
        }
    }
    function Potadra_nowTime() {
        const date = new Date();
        const day  = date.getFullYear() + '_' + (date.getMonth() + 1).padZero(2) + '_' + date.getDate().padZero(2);
        const time = date.getHours().padZero(2) + '_' + date.getMinutes().padZero(2) + '_' + date.getSeconds().padZero(2);
        return day + '_' + time;
    }
    function Potadra_keyCode(key) {
        const key_mapper = {
            'Tab': 9, 'Enter': 13, 'Shift': 16, 'Ctrl': 17, 'Alt': 18, 'Esc': 27, 'Space': 32,
            'PageUp': 33, 'PageDown': 34, 'Left': 37, 'Up': 38, 'Right': 39, 'Down': 40, 'Insert': 45,
            'A': 65,    'a': 65,
            'B': 66,    'b': 66,
            'C': 67,    'c': 67,
            'D': 68,    'd': 68,
            'E': 69,    'e': 69,
            'F': 70,    'f': 70,
            'G': 71,    'g': 71,
            'H': 72,    'h': 72,
            'I': 73,    'i': 73,
            'J': 74,    'j': 74,
            'K': 75,    'k': 75,
            'L': 76,    'l': 76,
            'M': 77,    'm': 77,
            'N': 78,    'n': 78,
            'O': 79,    'o': 79,
            'P': 80,    'p': 80,
            'Q': 81,    'q': 81,
            'R': 82,    'r': 82,
            'S': 83,    's': 83,
            'T': 84,    't': 84,
            'U': 85,    'u': 85,
            'V': 86,    'v': 86,
            'W': 87,    'w': 87,
            'X': 88,    'x': 88,
            'Y': 89,    'y': 89,
            'Z': 90,    'z': 90,
            '0': 48,    'T0': 96,
            '1': 49,    'T1': 97,
            '2': 50,    'T2': 98,
            '3': 51,    'T3': 99,
            '4': 52,    'T4': 100,
            '5': 53,    'T5': 101,
            '6': 54,    'T6': 102,
            '7': 55,    'T7': 103,
            '8': 56,    'T8': 104,
            '9': 57,    'T9': 105,
            'T*': 106,  'T+': 107, 'T-': 109, 'T.': 110, 'T/': 111,
            ':': 186,   ';': 187, ',' : 188, '-': 189,
            '.': 190,   '/': 191, '@': 192, '[': 192,
            '\|': 220,  ']': 221, '^': 222, '\_': 226,
            'F1': 112,  'f1': 112,
            'F2': 113,  'f2': 113,
            'F3': 114,  'f3': 114,
            'F4': 115,  'f4': 115,
            'F5': 116,  'f5': 116,
            'F6': 117,  'f6': 117,
            'F7': 118,  'f7': 118,
            'F8': 119,  'f8': 119,
            'F9': 120,  'f9': 120,
            'F10': 121, 'f10': 121,
            'F11': 122, 'f11': 122,
            'F12': 123, 'f12': 123,
            'BackSpace': 8, 'Pause': 19, '変換': 28, '無変換': 29, 'End': 35, 'Home': 36, 'Delete': 46,
            'NumLock': 144, 'ScrollLock': 145, 'CapsLock': 240, 'ひらがな': 242, '半角/全角': 244,
        };
        const key_code = key_mapper[key];
        const result = Object.keys(Input.keyMapper).find(code => Number(code) === key_code);
        if (result) return false;
        return key_code;
    }
    function PotadraAutoTile_FLOOR_AUTOTILE_TABLE() {
        return {
            24142313: 0,
            20142313: 1,
            24302313: 2,
            20302313: 3,
            24142331: 4,
            20142331: 5,
            24302331: 6,
            20302331: 7,
            24142113: 8,
            20142113: 9,
            24302113: 10,
            20302113: 11,
            24142131: 12,
            20142131: 13,
            24302131: 14,
            20302131: 15,
            4140313: 16,
            4300313: 17,
            4140331: 18,
            4300331: 19,
            22122313: 20,
            22122331: 21,
            22122113: 22,
            22122131: 23,
            24342333: 24,
            24342133: 25,
            20342333: 26,
            20342133: 27,
            24142515: 28,
            20142515: 29,
            24302515: 30,
            20302515: 31,
            4340333: 32,
            22122515: 33,
            2120313: 34,
            2120331: 35,
            22322333: 36,
            22322133: 37,
            24342535: 38,
            20342535: 39,
            4140515: 40,
            4300515: 41,
            2320333: 42,
            2120515: 43,
            4340535: 44,
            22322535: 45,
            2320535: 46,
            100111: 47
        };
    }
    function PotadraAutoTile_WALL_AUTOTILE_TABLE() {
        return {
            22122111: 0,
            2120111: 1,
            20102111: 2,
            100111: 3,
            22322131: 4,
            2320131: 5,
            20302131: 6,
            300131: 7,
            22122313: 8,
            2120313: 9,
            20102313: 10,
            100313: 11,
            22322333: 12,
            2320333: 13,
            20302333: 14,
            300333: 15
        };
    }
    function PotadraAutoTile_UpperLeft(tileID, UpperLeftID, UpperID, LeftID) {
        if (Tilemap.isSameKindTile(tileID, UpperLeftID) && Tilemap.isSameKindTile(tileID, UpperID) && Tilemap.isSameKindTile(tileID, LeftID)) {
            return 24000000;
        } else if (Tilemap.isSameKindTile(tileID, UpperID) && Tilemap.isSameKindTile(tileID, LeftID)) {
            return 20000000;
        } else if (Tilemap.isSameKindTile(tileID, UpperID)) {
            return  4000000;
        } else if (Tilemap.isSameKindTile(tileID, LeftID)) {
            return 22000000;
        }
            return  2000000;
    }
    function PotadraAutoTile_UpperRight(tileID, UpperRightID, UpperID, RightID) {
        if (Tilemap.isSameKindTile(tileID, UpperRightID) && Tilemap.isSameKindTile(tileID, UpperID) && Tilemap.isSameKindTile(tileID, RightID)) {
            return 140000;
        } else if (Tilemap.isSameKindTile(tileID, UpperID) && Tilemap.isSameKindTile(tileID, RightID)) {
            return 300000;
        } else if (Tilemap.isSameKindTile(tileID, UpperID)) {
            return 340000;
        } else if (Tilemap.isSameKindTile(tileID, RightID)) {
            return 120000;
        }
            return 320000;
    }
    function PotadraAutoTile_LowerLeft(tileID, LowerLeftID, LowerID, LeftID) {
        if (Tilemap.isSameKindTile(tileID, LowerLeftID) && Tilemap.isSameKindTile(tileID, LowerID) && Tilemap.isSameKindTile(tileID, LeftID)) {
            return 2300;
        } else if (Tilemap.isSameKindTile(tileID, LowerID) && Tilemap.isSameKindTile(tileID, LeftID)) {
            return 2100;
        } else if (Tilemap.isSameKindTile(tileID, LowerID)) {
            return  300;
        } else if (Tilemap.isSameKindTile(tileID, LeftID)) {
            return 2500;
        }
            return  500;
    }
    function PotadraAutoTile_LowerRight(tileID, LowerRightID, LowerID, RightID) {
        if (Tilemap.isSameKindTile(tileID, LowerRightID) && Tilemap.isSameKindTile(tileID, LowerID) && Tilemap.isSameKindTile(tileID, RightID)) {
            return 13;
        } else if (Tilemap.isSameKindTile(tileID, LowerID) && Tilemap.isSameKindTile(tileID, RightID)) {
            return 31;
        } else if (Tilemap.isSameKindTile(tileID, LowerID)) {
            return 33;
        } else if (Tilemap.isSameKindTile(tileID, RightID)) {
            return 15;
        }
            return 35;
    }
    function PotadraAutoTile_WallUpperLeft(tileID, UpperID, LeftID) {
        if (Tilemap.isSameKindTile(tileID, UpperID) && Tilemap.isSameKindTile(tileID, LeftID)) {
            return 22000000;
        } else if (Tilemap.isSameKindTile(tileID, UpperID)) {
            return  2000000;
        } else if (Tilemap.isSameKindTile(tileID, LeftID)) {
            return 20000000;
        }
            return        0;
    }
    function PotadraAutoTile_WallUpperRight(tileID, UpperID, RightID) {
        if (Tilemap.isSameKindTile(tileID, UpperID) && Tilemap.isSameKindTile(tileID, RightID)) {
            return 120000;
        } else if (Tilemap.isSameKindTile(tileID, UpperID)) {
            return 320000;
        } else if (Tilemap.isSameKindTile(tileID, RightID)) {
            return 100000;
        }
            return 300000;
    }
    function PotadraAutoTile_WallLowerLeft(tileID, LowerID, LeftID) {
        if (Tilemap.isSameKindTile(tileID, LowerID) && Tilemap.isSameKindTile(tileID, LeftID)) {
            return 2100;
        } else if (Tilemap.isSameKindTile(tileID, LowerID)) {
            return  100;
        } else if (Tilemap.isSameKindTile(tileID, LeftID)) {
            return 2300;
        }
            return  300;
    }
    function PotadraAutoTile_WallLowerRight(tileID, LowerID, RightID) {
        if (Tilemap.isSameKindTile(tileID, LowerID) && Tilemap.isSameKindTile(tileID, RightID)) {
            return 11;
        } else if (Tilemap.isSameKindTile(tileID, LowerID)) {
            return 31;
        } else if (Tilemap.isSameKindTile(tileID, RightID)) {
            return 13;
        }
            return 33;
    }
    function PotadraDirection_UNDER() { return 2; }
    function PotadraDirection_LEFT()  { return 4; }
    function PotadraDirection_RIGHT() { return 6; }
    function PotadraDirection_UP()    { return 8; }
    function PotadraEdge_isEdge(x, y, max_x = $dataMap.width, max_y = $dataMap.height, min_edge = 0) {
        const max_edge = min_edge + 1;
        return x === min_edge || y === min_edge || x === max_x - max_edge || y === max_y - max_edge;
    }
    function PotadraEdge_isEdgeX(x, max_x = $dataMap.width, min_edge = 0) {
        const max_edge = min_edge + 1;
        return x === min_edge || x === max_x - max_edge;
    }
    function PotadraEdge_isEdgeY(y, max_y = $dataMap.height, min_edge = 0) {
        const max_edge = min_edge + 1;
        return y === min_edge || y === max_y - max_edge;
    }
    function PotadraEvent_check_ng_postions(ng_positions, position) {
        for (const ng_position of ng_positions) {
            if (ng_position.x === position.x && ng_position.y === position.y) {
                return false;
            }
        }
        return true;
    }
    function PotadraGenerate_index(x, y, z) {
        return (z * $dataMap.height + y) * $dataMap.width + x;
    }
    function PotadraGenerate_move(x, y, direction = 0, fadeType = null) {
        $gamePlayer.reserveTransfer($gameMap.mapId(), x, y, direction, fadeType);
        $gamePlayer.performTransfer();
    }
    function PotadraGenerate_setTmpLine(tmp, json_events) {
        let tmp_line = '';
        $dataMap.events.forEach((event, i) => {
            if (i !== 0) tmp += ',\n';
            if (event) {
                for (let item in event) {
                    if (!json_events.includes(item)) {
                        delete event[item];
                    }
                }
            }
            tmp += JSON.stringify(event);
            tmp_line += tmp;
            tmp = '';
        });
        return tmp_line + '\n';
    }
    function PotadraLoop_roundX(x, sum_x = 0) {
        return PotadraEdge_isEdgeX(x) && $gameMap.isLoopHorizontal() ? (x + sum_x).mod($dataMap.width) : (x + sum_x);
    }
    function PotadraLoop_roundY(y, sum_y = 0) {
        return PotadraEdge_isEdgeY(y) && $gameMap.isLoopVertical() ? (y + sum_y).mod($dataMap.height) : (y + sum_y);
    }
    function PotadraPerlinNoise_fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    function PotadraPerlinNoise_lerp(t, a, b) {
        return a + t * (b - a);
    }
    function PotadraPerlinNoise_grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : x;
        return (( h & 1 ) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    function PotadraPerlinNoise_my_noise(x, y, seed_length, my_seed) {
        x /= 10;
        y /= 10;
        let X = Math.floor(x);
        let Y = Math.floor(y);
        x -= X;
        y -= Y;
        X = X & seed_length;
        Y = Y & seed_length;
        const u = PotadraPerlinNoise_fade(x);
        const v = PotadraPerlinNoise_fade(y);
        const A  = my_seed[X] + Y;
        const AA = my_seed[A];
        const AB = my_seed[A + 1];
        const B  = my_seed[X + 1] + Y;
        const BA = my_seed[B];
        const BB = my_seed[B + 1];
        return PotadraPerlinNoise_overFix(PotadraPerlinNoise_lerp(v,
                            PotadraPerlinNoise_lerp(u, PotadraPerlinNoise_grad(my_seed[AA], x    , y),
                                         PotadraPerlinNoise_grad(my_seed[BA], x - 1, y)),
                            PotadraPerlinNoise_lerp(u, PotadraPerlinNoise_grad(my_seed[AB], x    , y - 1),
                                         PotadraPerlinNoise_grad(my_seed[BB], x - 1, y - 1))),
                            PotadraPerlinNoise_lerp(v, 
                                      PotadraPerlinNoise_lerp(u, PotadraPerlinNoise_grad(my_seed[AA + 1], x    , y),
                                                   PotadraPerlinNoise_grad(my_seed[BA + 1], x - 1, y)),
                                      PotadraPerlinNoise_lerp(u, PotadraPerlinNoise_grad(my_seed[AB + 1], x    , y - 1),
                                                   PotadraPerlinNoise_grad(my_seed[BB + 1], x - 1, y - 1))));
    }
    function PotadraPerlinNoise_overFix(value) {
        if (value > 1) return 1;
        if (value < -1) return -1;
        return value;
    }
    function PotadraShip_checkValues(BoatSwitch, ShipSwitch, AirshipSwitch) {
        const boat    = Potadra_checkSwitch(BoatSwitch);
        const ship    = Potadra_checkSwitch(ShipSwitch);
        const airship = Potadra_checkSwitch(AirshipSwitch);
        if (boat || ship || airship) return [boat, ship, airship];
        return false;
    }
    function PotadraShip_directionXY() {
        const direction = $gamePlayer.direction();
        switch (direction) {
            case PotadraDirection_UNDER():
                return {x: 0, y: 1};
            case PotadraDirection_LEFT():
                return {x: -1, y: 0};
            case PotadraDirection_RIGHT():
                return {x: 1, y: 0};
            case PotadraDirection_UP():
                return {x: 0, y: -1};
            default:
                return {x: 0, y: 0};
        }
    }
    function PotadraShip_checkShip(value, tileId, tile_ids) {
        if (!value) return false;
        for (const tile_id of tile_ids) {
            if (Tilemap.isSameKindTile(tile_id, tileId)) return true;
        }
        return false;
    }
    function PotadraSpawn_spawn(direction = 0, vehicle = true) {
        let currents = PotadraSpawn_setPositionPlayer();
        if (vehicle) PotadraSpawn_setPositionVehicle(currents[0], currents[1]); // 乗り物
        PotadraSpawn_spawnPlayer(currents[0], currents[1], direction);
    }
    function PotadraSpawn_spawnPlayer(x, y, direction) {
        if (x === -1 && y === -1) {
            PotadraGenerate_move($gamePlayer.x, $gamePlayer.y, direction);
        } else {
            PotadraGenerate_move(x, y, direction);
        }
    }
    function PotadraSpawn_setPositionPlayer() {
        if (!$gamePlayer.isInAirship()) {
            let passable = false;
            if ($gamePlayer.isInBoat()) {
                passable = $gameMap.isBoatPassable($gamePlayer.x, $gamePlayer.y);
            } else if ($gamePlayer.isInShip()) {
                passable = $gameMap.isShipPassable($gamePlayer.x, $gamePlayer.y);
            } else {
                passable = PotadraSpawn_isPassable($gamePlayer.x, $gamePlayer.y);
            }
            if (passable) return [$gamePlayer.x, $gamePlayer.y];
            for (let x = 0; x < $dataMap.width; x++) {
                for (let y = 0; y < $dataMap.height; y++) {
                    if ($gamePlayer.isInBoat()) {
                        passable = $gameMap.isBoatPassable(x, y);
                    } else if ($gamePlayer.isInShip()) {
                        passable = $gameMap.isShipPassable(x, y);
                    } else {
                        passable = PotadraSpawn_isPassable(x, y);
                    }
                    if (passable) return [x, y];
                }
            }
        }
        return [-1, -1];
    }
    function PotadraSpawn_isPassable(x, y, and_flg = false) {
        if (and_flg) {
            return $gameMap.isPassable(x, y, PotadraDirection_UNDER()) && $gameMap.isPassable(x, y, PotadraDirection_LEFT()) &&
                   $gameMap.isPassable(x, y, PotadraDirection_RIGHT()) && $gameMap.isPassable(x, y, PotadraDirection_UP());
        } else {
            return $gameMap.isPassable(x, y, PotadraDirection_UNDER()) || $gameMap.isPassable(x, y, PotadraDirection_LEFT()) ||
                   $gameMap.isPassable(x, y, PotadraDirection_RIGHT()) || $gameMap.isPassable(x, y, PotadraDirection_UP());
        }
    }
    function PotadraSpawn_setPositionVehicle(current_x, current_y, min_x = 0, min_y = 0, max_x = $dataMap.width, max_y = $dataMap.height) {
        let boats = PotadraSpawn_checkBoat(current_x, current_y, min_x, min_y, max_x, max_y);
        PotadraSpawn_checkShip(current_x, current_y, min_x, min_y, max_x, max_y, boats[0], boats[1]);
        let move_airship = PotadraSpawn_checkAirShip(current_x, current_y, max_x, max_y);
        if (!move_airship) PotadraSpawn_checkAirShip(min_x, min_y, current_x, current_y);
    }
    function PotadraSpawn_check(x, y, d) {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (!$gameMap.isPassable(x2, y2, $gamePlayer.reverseDir(d))) {
            return false;
        }
        if ($gamePlayer.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
        return true;
    }
    function PotadraSpawn_isLandOk(x, y) {
        return PotadraSpawn_check(x, y, 2) || PotadraSpawn_check(x, y, 4) || PotadraSpawn_check(x, y, 6) || PotadraSpawn_check(x, y, 8);
    }
    function PotadraSpawn_checkBoat(current_x, current_y, min_x, min_y, max_x, max_y) {
        let boat = $gameMap.boat();
        if (boat._mapId === $gameMap.mapId()) {
            let boat_x = boat._x;
            let boat_y = boat._y;
            if ($gameMap.isBoatPassable(boat_x, boat_y) && PotadraSpawn_isLandOk(boat_x, boat_y) && !(boat_x === current_x && boat_y === current_y)) {
                boat.setPosition(boat_x, boat_y);
                return [boat_x, boat_y];
            }
            for (let x = min_x; x < max_x; x++) {
                for (let y = min_y; y < max_y; y++) {
                    if (x === current_x && y === current_y) continue;
                    if ($gameMap.isBoatPassable(x, y) && PotadraSpawn_isLandOk(x, y)) {
                        boat.setPosition(x, y);
                        return [x, y];
                    }
                }
            }
        }
        return [-1, -1];
    }
    function PotadraSpawn_checkShip(current_x, current_y, min_x, min_y, max_x, max_y, boat_x, boat_y) {
        let ship = $gameMap.ship();
        if (ship._mapId === $gameMap.mapId()) {
            let ship_x = ship._x;
            let ship_y = ship._y;
            if ($gameMap.isShipPassable(ship_x, ship_y) && PotadraSpawn_isLandOk(ship_x, ship_y) && !(ship_x === current_x && ship_y === current_y) && !(ship_x === boat_x && ship_y === boat_y)) {
                ship.setPosition(ship_x, ship_y);
                return true;
            }
            for (let x = min_x; x < max_x; x++) {
                for (let y = min_y; y < max_y; y++) {
                    if ( (x === current_x && y === current_y) || (x === boat_x && y === boat_y)) continue;
                    if ($gameMap.isShipPassable(x, y) && PotadraSpawn_isLandOk(x, y)) {
                        ship.setPosition(x, y);
                        return true;
                    }
                }
            }
        }
    }
    function PotadraSpawn_checkAirShip(min_x, min_y, max_x, max_y) {
        let airship = $gameMap.airship();
        if (airship._mapId === $gameMap.mapId()) {
            let air_x = airship._x;
            let air_y = airship._y;
            if ($gameMap.isAirshipLandOk(air_x, air_y)) {
                airship.setPosition(air_x, air_y);
                return true;
            }
            for (let x = min_x; x < max_x; x++) {
                for (let y = min_y; y < max_y; y++) {
                    if ($gameMap.isAirshipLandOk(x, y)) {
                        airship.setPosition(x, y);
                        return true;
                    }
                }
            }
        }
        return false;
    }



    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const RetentionSaveData = Potadra_convertBool(params.RetentionSaveData);
    const SeedVariable      = Number(params.SeedVariable) || 0;
    const TileRegion        = Number(params.TileRegion) || 1;
    const RegenerateCommand = String(params.RegenerateCommand);
    const ExportJsonCommand = String(params.ExportJsonCommand);
    const SameMapExportJson = Potadra_convertBool(params.SameMapExportJson);
    const BackupJson        = Potadra_convertBool(params.BackupJson);
    const EventExport       = Potadra_convertBool(params.EventExport);
    const CommandKey        = Potadra_convertBool(params.CommandKey);
    const RegenerateKey     = String(params.RegenerateKey) || 'M';
    const ExportJsonKey     = String(params.ExportJsonKey) || 'E';
    const OutputJsonKey     = String(params.OutputJsonKey) || 'O';
    const Vehicle           = Potadra_convertBool(params.Vehicle);
    const BoatSwitch        = Number(params.BoatSwitch) || 0;
    const ShipSwitch        = Number(params.ShipSwitch) || 0;
    const AirshipSwitch     = Number(params.AirshipSwitch) || 0;

    let Tilesets, Maps;
    if (params.Tilesets) Tilesets = JSON.parse(params.Tilesets);
    if (params.Maps) Maps = JSON.parse(params.Maps);
    // const Biomes = JSON.parse(params.Biomes);

    // 他プラグイン連携(パラメータ取得)
    const backup_params  = Potadra_getPluginParams('BackUpDatabase');
    const backUpPathText = backup_params ? String(backup_params.backUpPathText) || '/backup' : '/backup';

    //==============================================================================
    // Scene_Map
    //==============================================================================

    // TODO : タイルセットマップ実装
    /**
     * マップ読み込み後処理
     */
    /*const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.apply(this, arguments);
    };*/

    //==============================================================================
    // Spriteset_Map
    //==============================================================================

    /**
     * タイルマップの作成
     */
    const _Spriteset_Map_createTilemap = Spriteset_Map.prototype.createTilemap;
    Spriteset_Map.prototype.createTilemap = function() {
        let s;
        if (Potadra_checkVariable(SeedVariable)) {
            s = $gameVariables.value(SeedVariable);
        } else {
            s = Math.floor( Math.random() * (99999999 - (-99999999)) ) - 99999999;
        }
        if (isGenerateWorld()) {
            if (RetentionSaveData) {
                if (!$gameMap._potadra_auto) GenerateWorld(s);
            } else {
                if (!$gameTemp._potadra_auto) GenerateWorld(s);
            }
            PotadraSpawn_spawn(0, true);
        }
        _Spriteset_Map_createTilemap.apply(this, arguments);
    };

    //==============================================================================
    // Game_Map
    //==============================================================================

    /**
     * マップデータの取得
     *
     * @returns {} 
     */
    const _Game_Map_data = Game_Map.prototype.data;
    Game_Map.prototype.data = function() {
        if (isGenerateWorld()) {
            if (RetentionSaveData) {
                return this._potadra_worlds;
            } else {
                return $gameTemp._potadra_worlds;
            }
        }
        return _Game_Map_data.apply(this, arguments);
    };

    /**
     * 指定座標にあるタイル ID の取得
     *
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} z - レイヤー
     * @returns {number} タイル ID
     * @returns {} 
     */
    const _Game_Map_tileId = Game_Map.prototype.tileId;
    Game_Map.prototype.tileId = function(x, y, z) {
        if (isGenerateWorld()) {
            return getMapData(x, y, z) || 0;
        }
        return _Game_Map_tileId.apply(this, arguments);
    };

    //------------------------------------------------------------------------------
    // Game_Player
    //------------------------------------------------------------------------------
    // プレイヤーを扱うクラスです。
    // イベントの起動判定や、マップのスクロールなどの機能を持っています。
    // このクラスのインスタンスは $gamePlayer で参照されます。
    //------------------------------------------------------------------------------
    const _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function() {
        const value = _Game_Player_triggerButtonAction.apply(this, arguments);
        if (Vehicle && Tilesets && Input.isTriggered("ok") && !this.isInVehicle()) {
            checkShipMap(this, Tilesets);
        }
        return value;
    };

    const _Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
        const value = _Game_Player_triggerTouchAction.apply(this, arguments);
        if (Vehicle && Tilesets && $gameTemp.isDestinationValid() && !this.isInVehicle()) {
            checkShipMap(this, Tilesets);
        }
        return value;
    };

    //==============================================================================
    // 飛行船のすり抜けイベント着陸対応
    //==============================================================================

    /**
     * 接岸／着陸可能判定
     *     d : 方向（2,4,6,8）
     *
     * @param {} x - 
     * @param {} y - 
     * @param {} d - 
     * @returns {} 
     */
    Game_Vehicle.prototype.isLandOk = function(x, y, d) {
        if (this.isAirship()) {
            if (!$gameMap.isAirshipLandOk(x, y)) {
                return false;
            }
            // ワールド自動生成時のみ、すり抜けONのイベントは着陸出来るように変更
            if (isGenerateWorld()) {
                if ($gameMap.eventsXyNt(x, y).length > 0) {
                    return false;
                }
            } else {
                if ($gameMap.eventsXy(x, y).length > 0) {
                    return false;
                }
            }
        } else {
            const x2 = $gameMap.roundXWithDirection(x, d);
            const y2 = $gameMap.roundYWithDirection(y, d);
            if (!$gameMap.isValid(x2, y2)) {
                return false;
            }
            if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
                return false;
            }
            if (this.isCollidedWithCharacters(x2, y2)) {
                return false;
            }
        }
        return true;
    };

    //==============================================================================
    // プラグインコマンド
    //==============================================================================

    // プラグインコマンド(ワールド自動生成)
    PluginManager.registerCommand(plugin_name, "GenerateWorld", args => {
        // ワールド自動生成
        GenerateWorld();

        // キャラクターの移動可能場所チェック
        if (Potadra_convertBool(args.spawn)) PotadraSpawn_spawn(Number(args.direction) || 0, Potadra_convertBool(args.vehicle));
    });

    // プラグインコマンド(スポーン地点設定)
    PluginManager.registerCommand(plugin_name, "Spawn", args => {
        // キャラクターの移動可能場所チェック
        PotadraSpawn_spawn(Number(args.direction) || 0, Potadra_convertBool(args.vehicle));
    });

    // プラグインコマンド(マップJSON出力)
    PluginManager.registerCommand(plugin_name, "ExportMapJson", args => {
        same_map_export_json = Potadra_convertBool(args.same_map_export_json);
        event_export = Potadra_convertBool(args.event_export);
        backup_json = Potadra_convertBool(args.backup_json);
        JsonExport(same_map_export_json, event_export, backup_json);
    });

    //==============================================================================
    // ワールド自動生成
    //==============================================================================
    function GenerateWorld(s = Math.floor( Math.random() * (99999999 - (-99999999)) ) - 99999999) {
        if (_Game_Map_tileId.call(this, 0, 0, 0) === 0) return false;

        let firstTime = Date.now(); // 開始時間

        // シードを変数に記憶
        if (Potadra_checkVariable(SeedVariable)) {
            $gameVariables.setValue(SeedVariable, s);
        }

        // 乱数設定(Xorshift)
        const random = new PotadraXorShift($dataSystem.advanced.screenWidth, $dataSystem.advanced.screenHeight, $dataSystem.tileSize, s);
        let p = new Array(255);
        for(let i = 0; i < 256; i++) p[i] = seed.splice(random.xorshift(), 1)[0];
        seed = Array.from(new Set(p.filter(Boolean).concat(seed)));

        showTime(firstTime, 'シード設定');

        let startTime = Date.now(); // 開始時間

        // バイオーム判定
        CustomBiome();

        showTime(startTime, 'バイオーム判定');

        // ワールド自動生成マップかどうかの判定
        if (RetentionSaveData) {
            $gameMap._potadra_auto = $gameMap.mapId();
        } else {
            $gameTemp._potadra_auto = $gameMap.mapId();
        }

        // 地形の整形
        startTime = Date.now(); // 開始時間
        fixWorld();
        showTime(startTime, '地形の整形');

        // オートタイル配置
        startTime = Date.now(); // 開始時間
        setAutoTile();
        showTime(startTime, 'オートタイル配置');

        // イベント設定
        startTime = Date.now(); // 開始時間
        setEvents();    
        showTime(startTime, 'イベント設定配置');

        showTime(firstTime, 'マップ作成');
    }

    //==============================================================================
    // イベントの設定
    //==============================================================================
    function setEvents() {
        const ng_positions         = [];
        const positions            = [];
        const passable_positions   = [];
        const unpassable_positions = [];
        const regions              = {};

        // RateMap イベント以外
        for (const event of $gameMap.events()) {
            const meta = event.event().meta;
            const meta_value = Potadra_meta(meta, 'RateMap');
            if (!meta_value && !event.isThrough()) {
                ng_positions.push({x: event.event().x, y: event.event().y});
            }
        }

        // 位置取得
        for (let x = 0; x < $dataMap.width; x++) {
            for (let y = 0; y < $dataMap.height; y++) {
                if (!PotadraEvent_check_ng_postions(ng_positions, {x: x, y: y})) {
                    continue;
                }

                if (PotadraSpawn_isPassable(x, y, true)) {
                    passable_positions.push({x: x, y: y});
                } else {
                    unpassable_positions.push({x: x, y: y});
                }
                positions.push({x: x, y: y});

                const region = $gameMap.tileId(x, y, 5);
                if (!regions[region]) regions[region] = [];
                regions[region].push({x: x, y: y});
            }
        }

        // RateMap イベント
        for (const event of $gameMap.events()) {
            const meta = event.event().meta;
            const meta_value = Potadra_meta(meta, 'RateMap');
            if (meta_value) {
                // RateMap イベント
                let probability = Number(meta_value) || 0;
                if (Math.random() < probability) {
                    // 表示対象
                    const region_value = Potadra_meta(meta, 'Region');
                    if (region_value) {
                        const region = Number(region_value);
                        if (region > 0) {
                            const r = regions[region];
                            if (r) {
                                const rand = Math.floor(Math.random() * r.length);
                                event.locate(r[rand].x, r[rand].y);
                                r.splice(rand, 1);
                                continue;
                            }
                        }
                    }
                    const rand = Math.floor(Math.random() * passable_positions.length);
                    event.locate(passable_positions[rand].x, passable_positions[rand].y);
                    passable_positions.splice(rand, 1);
                } else {
                    // 非表示対象
                    $gameMap.eraseEvent(event._eventId);
                }
            }
        }
    }

    //==============================================================================
    // バイオーム
    //==============================================================================
    function MiniatureTileId(x, y, z = 0) {
        let tileId = _Game_Map_tileId.call(this, x, y, z);
        const autotileType = tileId >= Tilemap.TILE_ID_A1 ? Math.floor((tileId - Tilemap.TILE_ID_A1) % 48) : -1;
        if (autotileType > 0) {
            tileId -= autotileType;
        }
        return tileId;
    }

    function SetBiomeSize() {
        let tmp_x;
        for (tmp_x = 0; tmp_x < $dataMap.width; tmp_x++) {
            const tmp_tile_id = _Game_Map_tileId.call(this, tmp_x, 0, 0);
            if (tmp_tile_id === 0) {
                break;
            }
        }
        return $dataMap.width / tmp_x;
    }

    // カスタムバイオーム
    function CustomBiome() {
        const BiomeSize = SetBiomeSize();
        const max_i = Math.ceil($dataMap.width / BiomeSize);
        const max_j = Math.ceil($dataMap.height / BiomeSize);

        // ミニチュアの読み込み
        const tiles  = [];
        const layer1 = [];
        const layer2 = [];
        const layer3 = [];
        const layer4 = [];
        const layer5 = [];
        for (let x = 0; x < max_i; x++) {
            tiles[x]  = [];
            layer1[x] = [];
            layer2[x] = [];
            layer3[x] = [];
            layer4[x] = [];
            layer5[x] = [];
            for (let y = 0; y < max_j; y++) {
                const region  = _Game_Map_tileId.call(this, x, y, 5);
                const layer_2 = _Game_Map_tileId.call(this, x, y, 1);
                if (region === TileRegion) {
                    layer1[x][y] = MiniatureTileId(x, y);
                    layer2[x][y] = MiniatureTileId(x, y, 1);
                    layer3[x][y] = MiniatureTileId(x, y, 2);
                    layer4[x][y] = MiniatureTileId(x, y, 3);
                    layer5[x][y] = MiniatureTileId(x, y, 4);
                    tiles[x][y] = region;
                } else if (region > 0) {
                    tiles[x][y] = region;
                } else if (layer_2 > 0) {
                    tiles[x][y] = MiniatureTileId(x, y, 1);
                } else {
                    tiles[x][y] = MiniatureTileId(x, y);
                }
            }
        }

        // マップ初期化
        for (let x = 0; x < $dataMap.width; x++) {
            for (let y = 0; y < $dataMap.height; y++) {
                setTileId(x, y, 1);
                setTileId(x, y, 2);
                setTileId(x, y, 3);
                setTileId(x, y, 4); // 影
                setTileId(x, y, 5); // リージョン
            }
        }

        // ミニチュアの反映
        for (let i = 0; i < max_i; i++) {
            for (let j = 0; j < max_j; j++) {
                const start_x = i * BiomeSize;
                const start_y = j * BiomeSize;
                let end_x = start_x + BiomeSize;
                let end_y = start_y + BiomeSize;
                if (end_x > $dataMap.width) end_x = $dataMap.width;
                if (end_y > $dataMap.height) end_y = $dataMap.height;

                for (let x = start_x; x < end_x; x++) {
                    for (let y = start_y; y < end_y; y++) {
                        const tile = tiles[i][j];
                        if (tile === TileRegion) { // 固定
                            if (layer1[i][j] && layer1[i][j] !== 0) setTileId(x, y, 0, layer1[i][j]);
                            if (layer2[i][j] && layer2[i][j] !== 0) setTileId(x, y, 1, layer2[i][j]);
                            if (layer3[i][j] && layer3[i][j] !== 0) setTileId(x, y, 2, layer3[i][j]);
                            if (layer4[i][j] && layer4[i][j] !== 0) setTileId(x, y, 3, layer4[i][j]);
                            if (layer5[i][j] && layer5[i][j] !== 0) setTileId(x, y, 4, layer5[i][j]);
                        } else if (BIOME[tile]) {
                            createBiome(x, y, BIOME[tile], SEED_LENGTH);
                        } else {
                            // console.debug(tile);
                        }
                    }
                }
            }
        }
    }

    //==============================================================================
    // 地形の整形
    //==============================================================================
    function fixWorld() {
        for (let x = 0; x < $dataMap.width; x++) {
            for (let y = 0; y < $dataMap.height; y++) {
                const layer1 = edgeTileId(x, y, 0, 2816);
                const layer2 = edgeTileId(x, y, 1, 2096);
                const value = PotadraPerlinNoise_my_noise(x, y, SEED_LENGTH, seed);

                // 山(岩) のとき
                if (layer2 === 3872) {
                    if (value > 0.6) {
                        if (isScope(3, x, y, x + 1, y + 1, [0, 0, 0, 0]) && isScope(1, x - 1, y, x + 2, y + 1, [3872, 3872, 3872, 3872, 3872, 3872, 3872, 3872])) {
                            setTileId(x, y, 3, 202);
                            setTileId(PotadraLoop_roundX(x, 1), y, 3, 203);
                            setTileId(x, PotadraLoop_roundY(y, 1), 3, 210);
                            setTileId(PotadraLoop_roundX(x, 1), PotadraLoop_roundY(y, 1), 3, 211);
                        }
                    }
                }

                // 海のとき
                if (layer1 === 2048) {
                    // 変に繋がっている地形は海にする
                    if (edgeTileId(x + 1, y, 0, 2816) === 2816 && edgeTileId(x, y + 1, 0, 2816) === 2816 && edgeTileId(x + 1, y + 1, 0, 2048) === 2048) {
                        setTileId(x, y, 0, 2048); // 海
                        setTileId(x, y, 1);
                    }

                    // 橋を架ける
                    if (isBridge(x, y)) {
                        setTileId(x, y, 3, 25); // 橋（縦）
                    } else if (isSideBridge(x, y)) {
                        setTileId(x, y, 3, 24); // 橋（横）
                    }
                } else if (isAdjacentTile(x, y, 0, 2048)) {
                    // A2タイルを隣接させない
                    setTileId(x, y, 1);
                }

                // 草原のとき
                if (layer1 === 2816) {
                    // 変に繋がっている地形は海にする
                    if (
                        edgeTileId(x + 1, y, 0, 2048) === 2048 &&  // 右(海)
                        edgeTileId(x, y + 1, 0, 2048) === 2048 &&  // 下(海)
                        edgeTileId(x + 1, y + 1, 0, 2816) === 2816 // 右下(草原)
                       ) {
                        setTileId(x, y, 0, 2048); // 海
                        setTileId(x, y, 1);
                    }

                    // 深い海と草原を隣接させない
                    fillDistantTile(x, y, 1, 2096, 1);

                    // 周りも草原
                    /*if (!PotadraEdge_isEdge(x, y) && isAllAroundTile(x, y, 0, 2816) && isAllAroundTile(x, y, 1, 0) && !isAroundTile(x, y, 3, 120) && !verticalLine(x, 3, 120) && !besideLine(y, 3, 120) && !diagonal(x, y, 3, 120)) {
                        if (!around(x, y, 3, 120, 20)) {
                            setTileId(x, y, 3, 120); // 町
                        }
                    }*/
                }

                // 木なら
                if (layer1 === 7904) {
                    if (edgeTileId(x, y - 1, 0, 1552) === 1552) {
                        fillAroundTile(x, y, 0, 7520, 0);
                    }
                }
            }
        }
    }

    //==============================================================================
    // 関数
    //==============================================================================

    // ワールド自動生成マップかどうかの判定
    function isGenerateWorld() {
        return Potadra_meta($dataMap.meta, 'ワールド自動生成');
    }

    /**
     * マップデータの取得
     *
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} z - レイヤー
     * @returns {} 
     */
    function getMapData(x, y, z) {
        if (RetentionSaveData) {
            return $gameMap._potadra_worlds[PotadraGenerate_index(x, y, z)];
        } else {
            return $gameTemp._potadra_worlds[PotadraGenerate_index(x, y, z)];
        }
    }

    /**
     * 指定座標にあるタイル ID の設定
     *
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} z - レイヤー
     * @param {number} tileId - タイル ID
     */
    function setTileId(x, y, z, tileId) {
        const index = PotadraGenerate_index(x, y, z);
        if (RetentionSaveData) {
            $gameMap._potadra_worlds[index] = tileId;
        } else {
            $gameTemp._potadra_worlds[index] = tileId;
        }
    }

    /**
     * 指定座標にあるタイル ID の取得
     *
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} z - レイヤー
     * @returns {number} タイルID
     */
    function randomTileId(x, y, z) {
        return getMapData(x, y, z) || 0;
    }

    /**
     * 指定座標にあるタイル ID の取得(ループを考慮)
     *
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} z - レイヤー
     * @param {number} tileID - タイルID
     * @returns {number} タイルID
     */
    function loopTileId(x, y, z, tileID = 0) {
        if ($gameMap.isLoopHorizontal()) {
            x = x.mod($gameMap.width());
        }
        if ($gameMap.isLoopVertical()) {
            y = y.mod($gameMap.height());
        }
        // ループなし用(オーバーしたら、隣接タイルは同じとなる)
        if ((x < 0 || x > $dataMap.width - 1) || (y < 0 || y > $dataMap.height - 1)) {
            return tileID;
        }
        return getMapData(x, y, z) || 0;
    }

    /**
     * 指定座標にあるタイル ID の取得(ループを考慮)
     *
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} z - レイヤー
     * @param {number} tileID - タイルID
     * @returns {number} タイル ID
     * @returns {} 
     */
    function edgeTileId(x, y, z, tileID = 0) {
        if (PotadraEdge_isEdge(x, y)) {
            return loopTileId(x, y, z, tileID);
        } else {
            return randomTileId(x, y, z);
        }
    }

    // 橋判定
    function isBridge(x, y) {
        const bridge_tileIds = [
            2816,
            2048,
            2816
        ];
        const bridge_tileIds_side = [
            2048, 2048, 2048, // 1
            2048, 2048,       // 2
            2048, 2048,       // 3
            2048, 2048,       // 4
            2048, 2048,       // 5
            2048, 2048,       // 6
            2048, 2048,       // 7
            2048, 2048,       // 8
            2048, 2048,       // 9
            2048, 2048        // 10
        ];
        return !PotadraEdge_isEdgeY(y) &&
               !besideLine(y, 3, 25) &&
               isScope(0, x, y - 1, x, y + 1, bridge_tileIds) &&
               isScope(0, x - 10, y, x + 10, y, bridge_tileIds_side) &&
               diagonal(x, y, 0, 2048, 1);
    }
    function isSideBridge(x, y) {
        const side_bridge_tileIds = [
            2816, 2048, 2816
        ];
        const side_bridge_tileIds_side = [
            2048, 2048, 2048, // 1
            2048, 2048,       // 2
            2048, 2048,       // 3
            2048, 2048,       // 4
            2048, 2048,       // 5
            2048, 2048,       // 6
            2048, 2048,       // 7
            2048, 2048,       // 8
            2048, 2048,       // 9
            2048, 2048        // 10
        ];
        return !PotadraEdge_isEdgeX(x) &&
               !verticalLine(x, 3, 24) &&
               isScope(0, x - 1, y, x + 1, y, side_bridge_tileIds) &&
               isScope(0, x, y - 10, x, y + 10, side_bridge_tileIds_side) &&
               diagonal(x, y, 0, 2048, 1);
    }

    // 縦の判定
    function verticalLine(x, z, tileID, max_y = $dataMap.height) {
        for (let y = 0; y < max_y; y++) {
            if (edgeTileId(x, y, z, tileID) === tileID) {
                return true;
            }
        }
        return false;
    }
    // 横の判定
    function besideLine(y, z, tileID, max_x = $dataMap.width) {
        for (let x = 0; x < max_x; x++) {
            if (edgeTileId(x, y, z, tileID) === tileID) {
                return true;
            }
        }
        return false;
    }

    function TopTile(value, x, y, top_tiles) {
        top_tiles.forEach((tile) => {
            if (tile[1] < value && value <= tile[2]) {
                setTileId(x, y, tile[3], tile[0]);
            }
        });
    }
    function BottomTile(value, x, y, bottom_tiles) {
        bottom_tiles.forEach((tile) => {
            if (tile[2] <= value && value <= tile[1]) {
                setTileId(x, y, tile[3], tile[0]);
            }
        });
    }
    function createBiome(x, y, biome, seed_length) {
        // const tilesetId       = $gameMap.tilesetId();
        // const BiomeTileSets   = Biome; // JSON.parse(Biome);
        // const tile_set        = BiomeTileSets.tile_set;
        // const biome_tile_sets = BiomeTileSets.biome_tile_sets;
        // console.debug(BiomeTileSets);

        const value = PotadraPerlinNoise_my_noise(x, y, seed_length, seed);
        TopTile(value, x, y, biome.top_tile);
        BottomTile(value, x, y, biome.bottom_tile);
    }

    // 船を呼び出せるマップか判定
    function checkShipMap(player, ShipTilesets) {
        const values = PotadraShip_checkValues(BoatSwitch, ShipSwitch, AirshipSwitch);
        if (values) {
            for (const s of ShipTilesets) {
                const ship_tile_set = JSON.parse(s);
                const tile_set_id = Number(ship_tile_set.tile_set_id);
                if ($gameMap.tilesetId() === tile_set_id) {
                    const boat_tile_ids    = Potadra_numberArray(ship_tile_set.boat_tile_ids);
                    const ship_tile_ids    = Potadra_numberArray(ship_tile_set.ship_tile_ids);
                    const airship_tile_ids = Potadra_numberArray(ship_tile_set.airship_tile_ids);
                    callVehicle(player, values, [boat_tile_ids, ship_tile_ids, airship_tile_ids]);
                }
            }
        }
    }
    function callVehicle(player, values, tile_ids) {
        const direction = PotadraShip_directionXY();
        const x = PotadraLoop_roundX(player.x, direction.x);
        const y = PotadraLoop_roundY(player.y, direction.y);
        const tileId = edgeTileId(x, y, 0);
        if (!$gamePlayer.isCollidedWithEvents(x, y)) {
            if (PotadraShip_checkShip(values[0], tileId, tile_ids[0])) {
                $gameMap.boat().setLocation($gameMap.mapId(), x, y);
            } else if (PotadraShip_checkShip(values[1], tileId, tile_ids[1])) {
                $gameMap.ship().setLocation($gameMap.mapId(), x, y);
            } else if (PotadraShip_checkShip(values[2], tileId, tile_ids[2])) {
                $gameMap.airship().setLocation($gameMap.mapId(), player.x, player.y);
            }
        }
    }

    // 隣接(上左右下)
    function adjacentTile(x, y, z, tileId) {
        tileIds = [tileId];
        let up_y, left_x, right_x, under_y;
        if (PotadraEdge_isEdge(x, y)) {
            up_y    = $gameMap.roundYWithDirection(y, PotadraDirection_UP());
            under_y = $gameMap.roundYWithDirection(y, PotadraDirection_UNDER());
            left_x  = $gameMap.roundXWithDirection(x, PotadraDirection_LEFT());
            right_x = $gameMap.roundXWithDirection(x, PotadraDirection_RIGHT());
            tileIds.push(loopTileId(x, up_y, z, tileId));
            tileIds.push(loopTileId(x, under_y, z, tileId));
            tileIds.push(loopTileId(left_x, y, z, tileId));
            tileIds.push(loopTileId(right_x, y, z, tileId));
        } else {
            up_y    = $gameMap.yWithDirection(y, PotadraDirection_UP());
            under_y = $gameMap.yWithDirection(y, PotadraDirection_UNDER());
            left_x  = $gameMap.xWithDirection(x, PotadraDirection_LEFT());
            right_x = $gameMap.xWithDirection(x, PotadraDirection_RIGHT());
            tileIds.push(randomTileId(x, up_y, z));
            tileIds.push(randomTileId(x, under_y, z));
            tileIds.push(randomTileId(left_x, y, z));
            tileIds.push(randomTileId(right_x, y, z));
        }
        x_points = [x, left_x, right_x];
        y_points = [y, up_y, under_y];
    }

    // 隣のタイルID のチェック
    function isAdjacentTile(x, y, z, tileId) {
        adjacentTile(x, y, z, tileId);
        return Tilemap.isSameKindTile(tileId, tileIds[1]) || Tilemap.isSameKindTile(tileId, tileIds[2]) ||
               Tilemap.isSameKindTile(tileId, tileIds[3]) || Tilemap.isSameKindTile(tileId, tileIds[4]);
    }

    // 周囲
    // 0: 上左右下
    // 4: 左上、右上
    // 6: 左下、右下
    function aroundTile(x, y, z, tileId) {
        aroundTileIds = [tileId];
        let up_y, left_x, right_x, under_y;
        if (PotadraEdge_isEdge(x, y)) {
            up_y    = $gameMap.roundYWithDirection(y, PotadraDirection_UP());
            under_y = $gameMap.roundYWithDirection(y, PotadraDirection_UNDER());
            left_x  = $gameMap.roundXWithDirection(x, PotadraDirection_LEFT());
            right_x = $gameMap.roundXWithDirection(x, PotadraDirection_RIGHT());
            aroundTileIds.push(loopTileId(x, up_y, z, tileId));
            aroundTileIds.push(loopTileId(x, under_y, z, tileId));

            aroundTileIds.push(loopTileId(left_x, y, z, tileId));
            aroundTileIds.push(loopTileId(left_x, up_y, z, tileId));
            aroundTileIds.push(loopTileId(left_x, under_y, z, tileId));

            aroundTileIds.push(loopTileId(right_x, y, z, tileId));
            aroundTileIds.push(loopTileId(right_x, up_y, z, tileId));
            aroundTileIds.push(loopTileId(right_x, under_y, z, tileId));
        } else {
            up_y    = $gameMap.yWithDirection(y, PotadraDirection_UP());
            under_y = $gameMap.yWithDirection(y, PotadraDirection_UNDER());
            left_x  = $gameMap.xWithDirection(x, PotadraDirection_LEFT());
            right_x = $gameMap.xWithDirection(x, PotadraDirection_RIGHT());
            aroundTileIds.push(randomTileId(x, up_y, z, tileId));
            aroundTileIds.push(randomTileId(x, under_y, z, tileId));

            aroundTileIds.push(randomTileId(left_x, y, z, tileId));
            aroundTileIds.push(randomTileId(left_x, up_y, z, tileId));
            aroundTileIds.push(randomTileId(left_x, under_y, z, tileId));

            aroundTileIds.push(randomTileId(right_x, y, z, tileId));
            aroundTileIds.push(randomTileId(right_x, up_y, z, tileId));
            aroundTileIds.push(randomTileId(right_x, under_y, z, tileId));
        }
        x_points = [x, left_x, right_x];
        y_points = [y, up_y, under_y];
    }

    // 離れた
    // 0 : 上左右下
    // 4 : 左上、右上
    // 6 : 左下、右下
    // 7 : 離れた上
    // 12: 離れた左右
    // 18: 離れた下
    function distantTile(x, y, z, tileId) {
        distantTileIds = [tileId];
        let up_y, left_x, right_x, under_y, distant_up_y, distant_left_x, distant_right_x, distant_under_y;
        if (PotadraEdge_isEdge(x, y)) {
            under_y         = $gameMap.roundYWithDirection(y, PotadraDirection_UNDER());
            up_y            = $gameMap.roundYWithDirection(y, PotadraDirection_UP());
            left_x          = $gameMap.roundXWithDirection(x, PotadraDirection_LEFT());
            right_x         = $gameMap.roundXWithDirection(x, PotadraDirection_RIGHT());
            distant_under_y = $gameMap.roundYWithDirection(under_y, PotadraDirection_UNDER());
            distant_up_y    = $gameMap.roundYWithDirection(up_y, PotadraDirection_UP());
            distant_left_x  = $gameMap.roundXWithDirection(left_x, PotadraDirection_LEFT());
            distant_right_x = $gameMap.roundXWithDirection(right_x, PotadraDirection_RIGHT());
            distantTileIds.push(loopTileId(x, up_y, z, tileId));
            distantTileIds.push(loopTileId(x, under_y, z, tileId));
            distantTileIds.push(loopTileId(x, distant_up_y, z, tileId));
            distantTileIds.push(loopTileId(x, distant_under_y, z, tileId));

            distantTileIds.push(loopTileId(left_x, y, z, tileId));
            distantTileIds.push(loopTileId(left_x, up_y, z, tileId));
            distantTileIds.push(loopTileId(left_x, under_y, z, tileId));
            distantTileIds.push(loopTileId(left_x, distant_up_y, z, tileId));
            distantTileIds.push(loopTileId(left_x, distant_under_y, z, tileId));

            distantTileIds.push(loopTileId(right_x, y, z, tileId));
            distantTileIds.push(loopTileId(right_x, up_y, z, tileId));
            distantTileIds.push(loopTileId(right_x, under_y, z, tileId));
            distantTileIds.push(loopTileId(right_x, distant_up_y, z, tileId));
            distantTileIds.push(loopTileId(right_x, distant_under_y, z, tileId));

            distantTileIds.push(loopTileId(distant_left_x, y, z, tileId));
            distantTileIds.push(loopTileId(distant_left_x, up_y, z, tileId));
            distantTileIds.push(loopTileId(distant_left_x, under_y, z, tileId));
            distantTileIds.push(loopTileId(distant_left_x, distant_up_y, z, tileId));
            distantTileIds.push(loopTileId(distant_left_x, distant_under_y, z, tileId));

            distantTileIds.push(loopTileId(distant_right_x, y, z, tileId));
            distantTileIds.push(loopTileId(distant_right_x, up_y, z, tileId));
            distantTileIds.push(loopTileId(distant_right_x, under_y, z, tileId));
            distantTileIds.push(loopTileId(distant_right_x, distant_up_y, z, tileId));
            distantTileIds.push(loopTileId(distant_right_x, distant_under_y, z, tileId));
        } else {
            under_y         = $gameMap.yWithDirection(y, PotadraDirection_UNDER());
            up_y            = $gameMap.yWithDirection(y, PotadraDirection_UP());
            left_x          = $gameMap.xWithDirection(x, PotadraDirection_LEFT());
            right_x         = $gameMap.xWithDirection(x, PotadraDirection_RIGHT());
            distant_under_y = $gameMap.yWithDirection(under_y, PotadraDirection_UNDER());
            distant_up_y    = $gameMap.yWithDirection(up_y, PotadraDirection_UP());
            distant_left_x  = $gameMap.xWithDirection(left_x, PotadraDirection_LEFT());
            distant_right_x = $gameMap.xWithDirection(right_x, PotadraDirection_RIGHT());
            distantTileIds.push(randomTileId(x, up_y, z, tileId));
            distantTileIds.push(randomTileId(x, under_y, z, tileId));
            distantTileIds.push(randomTileId(x, distant_up_y, z, tileId));
            distantTileIds.push(randomTileId(x, distant_under_y, z, tileId));

            distantTileIds.push(randomTileId(left_x, y, z, tileId));
            distantTileIds.push(randomTileId(left_x, up_y, z, tileId));
            distantTileIds.push(randomTileId(left_x, under_y, z, tileId));
            distantTileIds.push(randomTileId(left_x, distant_up_y, z, tileId));
            distantTileIds.push(randomTileId(left_x, distant_under_y, z, tileId));

            distantTileIds.push(randomTileId(right_x, y, z, tileId));
            distantTileIds.push(randomTileId(right_x, up_y, z, tileId));
            distantTileIds.push(randomTileId(right_x, under_y, z, tileId));
            distantTileIds.push(randomTileId(right_x, distant_up_y, z, tileId));
            distantTileIds.push(randomTileId(right_x, distant_under_y, z, tileId));

            distantTileIds.push(randomTileId(distant_left_x, y, z, tileId));
            distantTileIds.push(randomTileId(distant_left_x, up_y, z, tileId));
            distantTileIds.push(randomTileId(distant_left_x, under_y, z, tileId));
            distantTileIds.push(randomTileId(distant_left_x, distant_up_y, z, tileId));
            distantTileIds.push(randomTileId(distant_left_x, distant_under_y, z, tileId));

            distantTileIds.push(randomTileId(distant_right_x, y, z, tileId));
            distantTileIds.push(randomTileId(distant_right_x, up_y, z, tileId));
            distantTileIds.push(randomTileId(distant_right_x, under_y, z, tileId));
            distantTileIds.push(randomTileId(distant_right_x, distant_up_y, z, tileId));
            distantTileIds.push(randomTileId(distant_right_x, distant_under_y, z, tileId));
        }
        x_points = [x, left_x, right_x, distant_left_x, distant_right_x];
        y_points = [y, up_y, under_y, distant_up_y, distant_under_y];
    }

    // 周囲のタイルID のチェック
    function isAroundTile(x, y, z, tileId) {
        aroundTile(x, y, z, tileId);

        return Tilemap.isSameKindTile(tileId, aroundTileIds[1]) || Tilemap.isSameKindTile(tileId, aroundTileIds[2]) ||
               Tilemap.isSameKindTile(tileId, aroundTileIds[3]) || Tilemap.isSameKindTile(tileId, aroundTileIds[4]) ||
               Tilemap.isSameKindTile(tileId, aroundTileIds[5]) || Tilemap.isSameKindTile(tileId, aroundTileIds[6]) ||
               Tilemap.isSameKindTile(tileId, aroundTileIds[7]) || Tilemap.isSameKindTile(tileId, aroundTileIds[8]);
    }
    function isAllAroundTile(x, y, z, tileId) {
        aroundTile(x, y, z, tileId);

        return Tilemap.isSameKindTile(tileId, aroundTileIds[1]) && Tilemap.isSameKindTile(tileId, aroundTileIds[2]) &&
               Tilemap.isSameKindTile(tileId, aroundTileIds[3]) && Tilemap.isSameKindTile(tileId, aroundTileIds[4]) &&
               Tilemap.isSameKindTile(tileId, aroundTileIds[5]) && Tilemap.isSameKindTile(tileId, aroundTileIds[6]) &&
               Tilemap.isSameKindTile(tileId, aroundTileIds[7]) && Tilemap.isSameKindTile(tileId, aroundTileIds[8]);
    }

    // 周囲のタイル塗りつぶし
    function fillAroundTile(_x, _y, z, tileId, changeZ, changeTileId) {
        aroundTile(_x, _y, z, tileId);

        for (let x = 0; x <= 2; x++) {
            for (let y = 0; y <= 2; y++) {
                if (x === 0 && y === 0) continue;
                for (let i = 1; i <= 8; i++) {
                    if (tileId === aroundTileIds[i] && tileId === edgeTileId(x_points[x], y_points[y], z, tileId)) {
                        if (x_points[x] < 0 || y_points[y] < 0) continue;
                        setTileId(x_points[x], y_points[y], changeZ, changeTileId);
                    }
                }
            }
        }
    }

    //　離れたタイル塗りつぶし
    function fillDistantTile(_x, _y, z, tileId, changeZ, changeTileId) {
        distantTile(_x, _y, z, tileId);

        for (let x = 0; x <= 4; x++) {
            for (let y = 0; y <= 4; y++) {
                if (x === 0 && y === 0) continue;
                for (let i = 1; i <= 24; i++) {
                    if (tileId === distantTileIds[i] && tileId === edgeTileId(x_points[x], y_points[y], z, tileId)) {
                        if (x_points[x] < 0 || y_points[y] < 0) continue;
                        setTileId(x_points[x], y_points[y], changeZ, changeTileId);
                    }
                }
            }
        }
    }

    // 斜めの判定
    function diagonal(current_x, current_y, z, tileID, count = 0, map_x = $dataMap.width, map_y = $dataMap.height) {
        let min_x = current_x - count;
        let min_y = current_y - count;
        let max_x = current_x + count;
        let max_y = current_y + count;
        if (count === 0) {
            min_x = 0;
            min_y = 0;
            max_x = map_x;
            max_y = map_y;
        } else {
            if (min_x < 0) min_x = 0;
            if (min_y < 0) min_y = 0;
            if (max_x > map_x) max_x = map_x;
            if (max_y > map_y) max_y = map_y;
        }

        let tmp_y;
        // 左上を調べる
        tmp_y = current_y;
        for (let x = current_x - 1; x > min_x; x--) {
            tmp_y--;
            if (tmp_y < min_y) break;
            if (edgeTileId(x, tmp_y, z, tileID) === tileID) {
                return true;
            }
        }
        // 右上を調べる
        tmp_y = current_y;
        for (let x = current_x - 1; x < max_x; x++) {
            tmp_y--;
            if (tmp_y < min_y) break;
            if (edgeTileId(x, tmp_y, z, tileID) === tileID) {
                return true;
            }
        }
        // 左下を調べる
        tmp_y = current_y;
        for (let x = current_x + 1; x > min_x; x--) {
            tmp_y++;
            if (tmp_y > max_y) break;
            if (edgeTileId(x, tmp_y, z, tileID) === tileID) {
                return true;
            }
        }
        // 右下を調べる
        tmp_y = current_y;
        for (let x = current_x + 1; x < max_x; x++) {
            tmp_y++;
            if (tmp_y > max_y) break;
            if (edgeTileId(x, tmp_y, z, tileID) === tileID) {
                return true;
            }
        }
        return false;
    }
    // 周囲の判定
    // count = 0 で、マップ最大まで判定
    function around(current_x, current_y, z, tileID, count = 0, map_x = $dataMap.width, map_y = $dataMap.height) {
        let min_x = current_x - count;
        let min_y = current_y - count;
        let max_x = current_x + count;
        let max_y = current_y + count;
        if (count === 0) {
            min_x = 0;
            min_y = 0;
            max_x = map_x;
            max_y = map_y;
        } else {
            if (min_x < 0) min_x = 0;
            if (min_y < 0) min_y = 0;
            if (max_x > map_x) max_x = map_x;
            if (max_y > map_y) max_y = map_y;
        }
        for (let x = min_x; x < max_x; x++) {
            for (let y = min_y; y < max_y; y++) {
                if (x === current_x && y === current_y) continue;
                if (edgeTileId(x, y, z, tileID) === tileID) {
                    return true;
                }
            }
        }
        return false;
    }

    // 範囲内のタイルID取得
    function isScope(z, _min_x, _min_y, _max_x, _max_y, tileIds) {
        const min_x = PotadraLoop_roundX(_min_x);
        const min_y = PotadraLoop_roundY(_min_y);
        const max_x = PotadraLoop_roundX(_max_x);
        const max_y = PotadraLoop_roundY(_max_y);
        let count = 0;
        for (let y = min_y; y <= max_y; y++) {
            for (let x = min_x; x <= max_x; x++) {
                if (tileIds[count] !== edgeTileId(x, y, z, 0)) {
                    return false;
                } else {
                    count++;
                }
            }
        }
        return true;
    }

    //==============================================================================
    // オートタイル配置
    //==============================================================================
    function setAutoTile() {
        for (let x = 0; x < $dataMap.width; x++) {
            for (let y = 0; y < $dataMap.height; y++) {
                // リージョン設定
                let layer2 = edgeTileId(x, y, 1);
                let region;
                if (layer2 !== 0) {
                    layer2 -= 2000;
                    region = (layer2 / 48) + TileRegion;
                } else {
                    let layer1 = edgeTileId(x, y, 0);
                    layer1 -= 2000;
                    region = (layer1 / 48) + TileRegion;
                }

                autoTile(x, y, 0);
                autoTile(x, y, 1);
                autoTile(x, y, 2);
                autoTile(x, y, 3);
                setTileId(x, y, 5, region); // リージョン
            }
        }
    }

    /** 
     * オートタイル設定
     *
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} z - レイヤー
     */
    function autoTile(x, y, z) {
        const tileID = randomTileId(x, y, z);
        if (Tilemap.isFloorTypeAutotile(tileID)) {
            let UpperLeftID, UpperID, UpperRightID, LeftID, RightID, LowerLeftID, LowerID, LowerRightID;
            if (PotadraEdge_isEdge(x, y)) {
                UpperLeftID  = loopTileId(x - 1, y - 1, z, tileID); // 左上
                UpperID      = loopTileId(x    , y - 1, z, tileID); // 上
                UpperRightID = loopTileId(x + 1, y - 1, z, tileID); // 右上
                LeftID       = loopTileId(x - 1, y    , z, tileID); // 左
                RightID      = loopTileId(x + 1, y    , z, tileID); // 右
                LowerLeftID  = loopTileId(x - 1, y + 1, z, tileID); // 左下
                LowerID      = loopTileId(x    , y + 1, z, tileID); // 下
                LowerRightID = loopTileId(x + 1, y + 1, z, tileID); // 右下
            } else {
                UpperLeftID  = randomTileId(x - 1, y - 1, z); // 左上
                UpperID      = randomTileId(x    , y - 1, z); // 上
                UpperRightID = randomTileId(x + 1, y - 1, z); // 右上
                LeftID       = randomTileId(x - 1, y    , z); // 左
                RightID      = randomTileId(x + 1, y    , z); // 右
                LowerLeftID  = randomTileId(x - 1, y + 1, z); // 左下
                LowerID      = randomTileId(x    , y + 1, z); // 下
                LowerRightID = randomTileId(x + 1, y + 1, z); // 右下
            }
            const upper_left  = PotadraAutoTile_UpperLeft(tileID, UpperLeftID, UpperID, LeftID);
            const upper_right = PotadraAutoTile_UpperRight(tileID, UpperRightID, UpperID, RightID);
            const lower_left  = PotadraAutoTile_LowerLeft(tileID, LowerLeftID, LowerID, LeftID);
            const lower_right = PotadraAutoTile_LowerRight(tileID, LowerRightID, LowerID, RightID);
            const shape = PotadraAutoTile_FLOOR_AUTOTILE_TABLE()[upper_left + upper_right + lower_left + lower_right] || 0;
            setTileId(x, y, z, tileID + shape);
        } else if (Tilemap.isWallTypeAutotile(tileID)) {
            let UpperID, LeftID, RightID, LowerID;
            if (PotadraEdge_isEdge(x, y)) {
                UpperID      = loopTileId(x    , y - 1, z, tileID); // 上
                LeftID       = loopTileId(x - 1, y    , z, tileID); // 左
                RightID      = loopTileId(x + 1, y    , z, tileID); // 右
                LowerID      = loopTileId(x    , y + 1, z, tileID); // 下
            } else {
                UpperID      = randomTileId(x    , y - 1, z); // 上
                LeftID       = randomTileId(x - 1, y    , z); // 左
                RightID      = randomTileId(x + 1, y    , z); // 右
                LowerID      = randomTileId(x    , y + 1, z); // 下
            }
            const upper_left  = PotadraAutoTile_WallUpperLeft(tileID, UpperID, LeftID);
            const upper_right = PotadraAutoTile_WallUpperRight(tileID, UpperID, RightID);
            const lower_left  = PotadraAutoTile_WallLowerLeft(tileID, LowerID, LeftID);
            const lower_right = PotadraAutoTile_WallLowerRight(tileID, LowerID, RightID);
            const shape = PotadraAutoTile_WALL_AUTOTILE_TABLE()[upper_left + upper_right + lower_left + lower_right] || 0;
            setTileId(x, y, z, tileID + shape);
        } else if (Tilemap.isWaterfallTypeAutotile(tileID)) {
            let tileID1, tileID2;
            if (PotadraEdge_isEdge(x, y)) {
                tileID1 = loopTileId(x - 1, y, z, tileID); // 左
                tileID2 = loopTileId(x + 1, y, z, tileID); // 右
            } else {
                tileID1 = randomTileId(x - 1, y, z); // 左
                tileID2 = randomTileId(x + 1, y, z); // 右
            }
            const left  = Tilemap.isSameKindTile(tileID, tileID1);
            const right = Tilemap.isSameKindTile(tileID, tileID2);
            let shape;
            if (left && right) {
                shape = 0;
            } else if (!left) {
                shape = 1;
            } else if (!right) {
                shape = 2;
            } else {
                shape = 3;
            }
            setTileId(x, y, z, tileID + shape);
        }
    }

    //==============================================================================
    // メニューコマンド
    //==============================================================================

    //--------------------------------------------------------------------------
    // メニューコマンド(ワールド再生成)
    //--------------------------------------------------------------------------
    if (RegenerateCommand && Potadra_isTest()) {
        /**
         * メニュー画面で表示するコマンドウィンドウです。
         *
         * @class
         */
    
        /**
         * 主要コマンドをリストに追加
         */
        const _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
        Window_MenuCommand.prototype.addMainCommands = function() {
            this.addCommand(RegenerateCommand, "regenerate_world");
            _Window_MenuCommand_addMainCommands.apply(this, arguments);
        };


        /**
         * メニュー画面の処理を行うクラスです。
         *
         * @class
         */

        /**
         * コマンドウィンドウの作成
         */
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.apply(this, arguments);
            this._commandWindow.setHandler("regenerate_world", this.regenerate_world.bind(this));
        };

        /**
         * コマンド［ワールド再生成］
         */
        Scene_Menu.prototype.regenerate_world = function() {
            RegenerateWorld();
        };
    }

    //--------------------------------------------------------------------------
    // メニューコマンド(マップJSON出力)
    //--------------------------------------------------------------------------
    if (ExportJsonCommand && Potadra_isTest() && StorageManager.isLocalMode()) {
        /**
         * メニュー画面で表示するコマンドウィンドウです。
         *
         * @class
         */

        /**
         * 主要コマンドをリストに追加
         */
        const _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
        Window_MenuCommand.prototype.addMainCommands = function() {
            this.addCommand(ExportJsonCommand, "export_map_json");
            _Window_MenuCommand_addMainCommands.apply(this, arguments);
        };

        /**
         * メニュー画面の処理を行うクラスです。
         *
         * @class
         */

        /**
         * コマンドウィンドウの作成
         */
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.apply(this, arguments);
            this._commandWindow.setHandler("export_map_json", this.export_map_json.bind(this));
        };

        /**
         * コマンド［マップJSON出力］
         */
        Scene_Menu.prototype.export_map_json = function() {
            JsonExport(SameMapExportJson);
            SceneManager.goto(Scene_Map);
        };
    }

    //==============================================================================
    // マップJSON出力
    //==============================================================================
    function JsonExport(same_map_export_json, event_export = EventExport, backup_json = BackupJson) {
        if (StorageManager.isLocalMode()) {
            const exportDirPath = Potadra_getDirPath('data');
            const backupDirPath = Potadra_getDirPath(backUpPathText);
            let exportFilePath;

            // バックアップフォルダ作成
            if (backup_json) StorageManager.fsMkdir(backupDirPath);

            let filename;
            let json_name = '_' + Potadra_nowTime() + '.json';
            if (same_map_export_json) { // 同一マップに出力
                filename = "Map%1".format($gameMap.mapId().padZero(3));
                exportFilePath = exportDirPath + filename + '.json';

                // 現在のマップ情報をバックアップ
                if (backup_json) {
                    StorageManager.fsRename(exportFilePath, backupDirPath + filename + json_name);
                }
            } else { // 別マップに出力
                const new_map_id = $dataMapInfos.length;
                const MapInfosPath = exportDirPath + 'MapInfos.json';
                filename = "Map%1".format(new_map_id.padZero(3));
                exportFilePath = exportDirPath + filename + '.json';

                // 現在の MapInfos.json をバックアップ
                if (backup_json) {
                    StorageManager.fsRename(MapInfosPath, backupDirPath + 'MapInfos' + json_name);
                }

                // MapInfos.json に情報を登録
                let dataMapInfos = $dataMapInfos;
                dataMapInfos.push({ "id": new_map_id, "expanded": false, "name": "MAP%1".format(new_map_id.padZero(3)), "order": new_map_id, "parentId": 0, "scrollX": 0, "scrollY": 0 });

                // 整形
                let map_infos = '[\n';
                dataMapInfos.forEach((map_info, i) => {
                    if (i !== 0) map_infos += ',\n';
                    map_infos += JSON.stringify(map_info);
                });
                map_infos += ']\n';

                // MapInfos.json を出力
                StorageManager.fsWriteFile(MapInfosPath, map_infos);
            }

            // 整形
            const MAP_JSON = [
                "autoplayBgm", 
                "autoplayBgs",
                "battleback1Name",
                "battleback2Name",
                "bgm",
                "bgs",
                "disableDashing",
                "displayName",
                "encounterList",
                "encounterStep",
                "height",
                "note",
                "parallaxLoopX",
                "parallaxLoopY",
                "parallaxName",
                "parallaxShow",
                "parallaxSx",
                "parallaxSy",
                "scrollType",
                "specifyBattleback",
                "tilesetId",
                "width",
                "data",
                "events"
            ];
            let tmp, lines = [];
            for (let item in $dataMap) {
                if (item === 'data') {
                    if (isGenerateWorld()) {
                        if (RetentionSaveData) {
                            tmp = '\n"data":' + JSON.stringify($gameMap._potadra_worlds);
                        } else {
                            tmp = '\n"data":' + JSON.stringify($gameTemp._potadra_worlds);
                        }
                    } else {
                        tmp = '\n"data":' + JSON.stringify($dataMap.data);
                    }
                } else {
                    tmp = '"' + item + '":' + JSON.stringify($dataMap[item]);
                }

                if (!MAP_JSON.includes(item)) continue;

                // events 整形
                if (item === 'events') {
                    tmp = '\n"events":[\n';
                    if ((same_map_export_json || event_export) && $dataMap.events.length > 0) {
                        const MAP_JSON_EVENTS = ["id", "name", "note", "pages", "x" ,"y"];
                        lines.push(PotadraGenerate_setTmpLine(tmp, MAP_JSON_EVENTS));
                        continue;
                    }
                }
                lines.push(tmp);
            }
            StorageManager.fsWriteFile(exportFilePath, '{\n' + lines.join(',') + ']\n}');
        }
    }

    //==============================================================================
    // コマンドキー
    //==============================================================================
    if (CommandKey && Potadra_isTest()) {
        let regenerate_code, export_json_code, output_json_code;
        if (RegenerateKey) {
            regenerate_code = Potadra_keyCode(RegenerateKey);
            if (regenerate_code) {
                Input.keyMapper[regenerate_code] = RegenerateKey;
            } else {
                console.warn('ワールド再生成のキーが競合しています。この機能を使う場合はプラグインパラメータから他のキーを指定してください。');
            }
        }
        if (ExportJsonKey) {
            export_json_code = Potadra_keyCode(ExportJsonKey);
            if (export_json_code) {
                Input.keyMapper[export_json_code] = ExportJsonKey;
            } else {
                console.warn('マップJSON出力(イベントあり)のキーが競合しています。この機能を使う場合はプラグインパラメータから他のキーを指定してください。');
            }
        }
        if (OutputJsonKey) {
            output_json_code = Potadra_keyCode(OutputJsonKey);
            if (output_json_code) {
                Input.keyMapper[output_json_code] = OutputJsonKey;
            } else {
                console.warn('マップJSON出力(イベントなし)のキーが競合しています。この機能を使う場合はプラグインパラメータから他のキーを指定してください。');
            }
        }

        const _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
        Game_Player.prototype.triggerButtonAction = function() {
            const value = _Game_Player_triggerButtonAction.apply(this, arguments);
            if (regenerate_code && Input.isTriggered(RegenerateKey)) RegenerateWorld();
            if (export_json_code && Input.isTriggered(ExportJsonKey)) JsonExport(SameMapExportJson, true);
            if (output_json_code && Input.isTriggered(OutputJsonKey)) JsonExport(SameMapExportJson, false);
            return value;
        };
    }

    //==============================================================================
    // ワールド再生成
    //==============================================================================
    function RegenerateWorld() {
        GenerateWorld();
        PotadraSpawn_spawn(0);
        SceneManager.goto(Scene_Map);
    }

    //==============================================================================
    // プロトタイプ
    //==============================================================================
    if (RetentionSaveData) {
        const _Game_Map_initialize = Game_Map.prototype.initialize;
        Game_Map.prototype.initialize = function() {
            _Game_Map_initialize.apply(this, arguments);
            this._potadra_worlds = [];
            this._potadra_auto = false;
        };
    } else {
        const _Game_Temp_initialize = Game_Temp.prototype.initialize;
        Game_Temp.prototype.initialize = function() {
            _Game_Temp_initialize.apply(this, arguments);
            this._potadra_worlds = [];
            this._potadra_auto = false;
        };
    }
})();
