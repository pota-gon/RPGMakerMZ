/*:
@plugindesc
ファストトラベル Ver1.0.6(2026/1/26)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/MapUI/FastTravel.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.6
- メニューの設定が空配列のときにエラーになる問題を修正
- FastTravel.js のプラグインパラメータの位置を整理
* Ver1.0.5: 説明文が全て空の場合、ヘルプウィンドウを非表示にする機能を追加
* Ver1.0.4: 存在しないMapIDを指定したときに警告メッセージを表示し、エラーにしないように修正
* Ver1.0.3: マップ名の表示機能が正しく動作していない問題を修正
* Ver1.0.2: ヘルプ更新
* Ver1.0.1
- メニュー表示名の説明を修正
- コモンイベントの設定の説明に「0(なし)の場合、使用しません」を追加
* Ver1.0.0
- 「@type location」に対応(再設定が必要になります)
  + マップIDの指定
  + 乗り物の指定
- プラグインパラメータ move_common_event を after_common_event に変更(再設定が必要になります)

・TODO
- ページ対応
- 右にコマンド配置
- エスケープ機能実装
- エスケープ先から1歩動く機能搭載
- 移動時アニメーション・SE

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
ファストトラベルを簡単に実装します

## 使い方
メニューやプラグインコマンドから呼び出せるファストトラベル機能を提供
行き先の表示条件をスイッチで管理したり、
移動前後にコモンイベントを実行する設定等が可能

ファストトラベルは、メニューから呼び出す方法と
イベントから呼び出す方法の2通りがあります

### 1. メニューから呼び出す場合
1. プラグインパラメータの `MenuCommand` 以下を設定します
2. `MenuCommand` の `メニュー表示名` を設定すると
   メニューにコマンドが追加されます(空にすると追加されません)
3. `移動先マップ情報` (`mapLists`) に
   ファストトラベルで行ける場所のリストを登録します
   複数のリストを登録し、`移動先マップ情報番号` の変数で切り替えることも可能
4. 各移動先の詳細(行き先名、移動座標、表示条件など)を
   `移動先マップ情報` の中で設定します

### 2. イベントから呼び出す場合
1. イベントコマンドの「プラグインコマンド」を選択します
2. `fast_travel` コマンドを選択します
3. 引数の `移動先マップ情報` に移動させたい場所のリストを直接設定します
   こちらで設定した内容は、メニュー用の設定とは独立しています

## プラグインコマンド

### ファストトラベル (`fast_travel`)
イベントから直接ファストトラベル画面を呼び出します
引数 `移動先マップ情報` で指定した場所のリストが表示されます

### メニューと同じ内容を呼び出す (`fast_travel_menu`)
プラグインパラメータの `MenuCommand` で設定した内容と
同じファストトラベル画面をイベントから呼び出します

## プラグインパラメータ

### メニュー設定 (`MenuCommand`)
- **メニュー表示名**
メインメニューに表示されるコマンド名です。空にすると表示されません

- **メニュー表示スイッチ**
ONのときだけメニューにコマンドを表示します。0の場合は常に表示されます

- **メニュー禁止スイッチ**
ONのときコマンドが使用不可（灰色表示）になります

- **移動先マップ情報番号**
`移動先マップ情報`のどのリストを使用するかを変数で指定します。
例えば変数の値が1なら、`移動先マップ情報`の2番目のリストが使われます
0の場合は常に1番目のリストが使われます

- **移動先マップ情報**
ファストトラベル先のリストです。複数のリストを作成できます

### その他
- **キャンセル判定スイッチ**
ファストトラベル画面でキャンセルした時にONになるスイッチです

- **移動先マップID記憶変数**など
ファストトラベルで移動した際の「移動先」「移動元」「エスケープ先」の
座標を記憶するためのグローバルな変数設定です
各移動先で個別に設定することもできます

- **行き先の表示列数**
ファストトラベル先のリストを何列で表示するかを設定します

## 移動先マップ情報の設定 (`MoveMapList`)
ファストトラベルの行き先一つ一つに対する詳細設定です

- **移動先表示スイッチ**
このスイッチがONの時に、行き先がリストに表示されます

- **移動先非表示スイッチ**
このスイッチがONの時に、行き先がリストから非表示になります
（表示スイッチより優先されます）

- **移動判定スイッチ**
この場所へ移動した時にONになるスイッチです

- **移動先マップ情報番号変更**
この場所へ移動した時に `移動先マップ情報番号` で
指定した変数の値を変更します
これにより、特定の場所へ行くとリストの内容が切り替わるといった演出が可能

- **マップ移動先名**
リストに表示される行き先の名前です

- **マップ説明**
行き先を選択した時に、右側のヘルプウィンドウに表示される説明文です
※全ての行き先で空の場合、ヘルプウィンドウは表示されません

- **コモンイベントID**:
  - **移動処理のコモンイベントID**
  指定すると、通常の場所移動の代わりにこのコモンイベントが実行されます。
  
  - **移動前コモンイベントID**
  場所移動の直前に実行されるコモンイベントです

  - **移動後コモンイベントID**
  場所移動の直後に実行されるコモンイベントです

- **マップ**
  - **マップ**
  移動先のマップと座標を指定します

  - **向き**
  移動後のプレイヤーの向きを指定します

  - **フェード**
  場所移動時の画面のフェード方法を指定します

  - **場所移動SE**
  場所移動時に再生するSEです

  - **各種座標記憶変数**
  この移動先独自の座標記憶変数を設定します
  ここで設定した変数が、グローバルな設定より優先されます

- **小型船/大型船/飛行船座標**
場所移動と同時に、各乗り物の位置を指定した座標に移動させます

@param MenuCommand
@type combo
@text メニュー表示名
@desc メニューの表示が出来るコマンド
空文字でメニューに表示しません
@default ファストトラベル
@option ファストトラベル

    @param MenuSwitch
    @parent MenuCommand
    @type switch
    @text メニュー表示スイッチ
    @desc ONのときメニューにコマンドを表示します
    0(なし)の場合、常にメニューへ表示します
    @default 0

    @param DisableMenuSwitch
    @parent MenuCommand
    @type switch
    @text メニュー禁止スイッチ
    @desc ONのときコマンドの使用を禁止します
    @default 0

    @param MapListVariable
    @parent MenuCommand
    @type variable
    @text 移動先マップ情報番号
    @desc 移動先マップ情報の番号を管理する変数
    0(なし)の場合、0番目が常に参照されます
    @default 0

    @param mapLists
    @parent MenuCommand
    @type struct<MapList>[]
    @text 移動先マップ情報

@param cancelSwitch
@type switch
@text キャンセル判定スイッチ
@desc キャンセルをしたときにこのスイッチがONになります
0(なし)の場合、使用しません
@default 0

    @param MapIdVariable
    @parent mapId
    @type variable
    @text 移動先マップID記憶変数
    @desc 移動先マップIDを記憶する変数
    0 の場合は、移動先マップIDは記憶しません
    @default 0

    @param X_Variable
    @parent MapIdVariable
    @type variable
    @text 移動先マップX座標記憶変数
    @desc 移動先のマップX座標記憶変数
    0 の場合は、移動先マップX座標は記憶しません
    @default 0

    @param Y_Variable
    @parent MapIdVariable
    @type variable
    @text 移動先マップY座標記憶変数
    @desc 移動先のマップY座標記憶変数
    0 の場合は、移動先マップY座標は記憶しません
    @default 0

@param ExitMapIdVariable
@type variable
@text 出口マップID記憶変数
@desc 出口のマップIDを記憶する変数
0 の場合は、出口のマップIDは記憶しません
@default 0

    @param Exit_X_Variable
    @parent ExitMapIdVariable
    @type variable
    @text 出口マップX座標記憶変数
    @desc 出口のマップX座標記憶変数
    0 の場合は、出口のマップX座標は記憶しません
    @default 0

    @param Exit_Y_Variable
    @parent ExitMapIdVariable
    @type variable
    @text 出口マップY座標記憶変数
    @desc 出口のマップY座標記憶変数
    0 の場合は、出口のマップY座標は記憶しません
    @default 0

@param EscapeMapIdVariable
@type variable
@text エスケープマップID記憶変数
@desc エスケープのマップIDを記憶する変数
0 の場合は、エスケープのマップIDは記憶しません
@default 0

    @param Escape_X_Variable
    @parent EscapeMapIdVariable
    @type variable
    @text エスケープマップX座標記憶変数
    @desc エスケープのマップX座標記憶変数
    0 の場合は、エスケープのマップX座標は記憶しません
    @default 0

    @param Escape_Y_Variable
    @parent EscapeMapIdVariable
    @type variable
    @text エスケープマップY座標記憶変数
    @desc エスケープのマップY座標記憶変数
    0 の場合は、エスケープのマップY座標は記憶しません
    @default 0

@param MaxCols
@type number
@text 行き先の表示列数
@desc 行き先の表示列数
@default 1
@min 1
@max 3

@param FullWidthWhenNoHelp
@type boolean
@text 説明なし時に全幅表示
@desc 説明文がない場合、リストを全幅表示します
@default false
@on 全幅表示
@off 通常表示

@command fast_travel
@text ファストトラベル
@desc ファストトラベルを呼び出します

    @arg maps
    @type struct<MoveMapList>[]
    @text 移動先マップ情報

@command fast_travel_menu
@text メニューと同じ内容を呼び出す
@desc メニューと同じ内容を呼び出します
*/

/*~struct~MapList:
@param maps
@type struct<MoveMapList>[]
@text 移動先マップ情報
*/

/*~struct~MoveMapList:
@param map
@type location
@text マップ
@desc 移動先のマップ情報
@default {"mapId":"0","x":"0","y":"0"}

    @param move_map_name
    @parent map
    @type string
    @text マップ移動先名
    @desc 移動先のマップ名称を指定します
    指定しない場合は、マップの名前が表示されます

    @param map_help
    @parent map
    @type multiline_string
    @text マップ説明
    @desc マップについての説明
    文章の表示と同様の表示が可能です

    @param direction
    @parent map
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

    @param fade_type
    @parent map
    @type select
    @text フェード
    @desc フェードアウトとフェードインの設定
    @default 0
    @option 黒
    @value 0
    @option 白
    @value 1
    @option なし
    @value 2

    @param se
    @parent map
    @type struct<SE>
    @text 場所移動SE
    @desc 場所移動時に再生するSE
    指定しない場合、再生しません
    @default {"name":"Move1","volume":"90","pitch":"100","pan":"0"}

@param common_event
@type common_event
@text コモンイベントID
@desc 移動処理のコモンイベントID
0(なし)の場合、使用しません
@default 0
@min 0

    @param before_common_event
    @parent common_event
    @type common_event
    @text 移動前コモンイベントID
    @desc 移動前のコモンイベントID
    0(なし)の場合、使用しません
    @default 0
    @min 0

    @param after_common_event
    @parent common_event
    @type common_event
    @text 移動後コモンイベントID
    @desc 移動後のコモンイベントID
    0(なし)の場合、使用しません
    @default 0
    @min 0

@param switch
@text スイッチ設定
@desc ※ 分類用のパラメータです

    @param showSwitch
    @parent switch
    @type switch
    @text 移動先表示スイッチ
    @desc このスイッチがONのときに行き先を表示します
    0(なし)の場合、常に移動先が表示されます
    @default 0

    @param hideSwitch
    @parent switch
    @type switch
    @text 移動先非表示スイッチ
    @desc このスイッチがONのときに行き先を非表示にします
    0(なし)の場合、常に移動先が表示されます
    @default 0

    @param moveSwitch
    @parent switch
    @type switch
    @text 移動判定スイッチ
    @desc 移動をしたときにこのスイッチがONになります
    0(なし)の場合、使用しません
    @default 0

@param variable
@text 変数設定
@desc ※ 分類用のパラメータです

    @param moveChangeVariable
    @parent variable
    @type variable
    @text 移動先マップ情報番号変更
    @desc 移動先マップ情報の変数を変更します
    @default 0

    @param map_id_variable
    @parent variable
    @type variable
    @text 移動先マップID記憶変数
    @desc 移動先マップIDを記憶するかどうか
    0 の場合は、パラメータの変数を参照
    @default 0

        @param x_variable
        @parent map_id_variable
        @type variable
        @text X座標記憶変数
        @desc 移動先のマップX座標記憶変数
        0 の場合は、パラメータの変数を参照
        @default 0

        @param y_variable
        @parent map_id_variable
        @type variable
        @text Y座標記憶変数
        @desc 移動先のマップY座標記憶変数
        0 の場合は、パラメータの変数を参照
        @default 0

    @param exit_map_id_variable
    @parent variable
    @type variable
    @text 出口マップID記憶変数
    @desc 出口のマップIDを記憶する変数
    0 の場合は、パラメータの変数を参照
    @default 0

        @param exit_x_variable
        @parent exit_map_id_variable
        @type variable
        @text X座標記憶変数
        @desc 出口のマップX座標記憶変数
        0 の場合は、パラメータの変数を参照
        @default 0

        @param exit_y_variable
        @parent exit_map_id_variable
        @type variable
        @text Y座標記憶変数
        @desc 出口のマップY座標記憶変数
        0 の場合は、パラメータの変数を参照
        @default 0

    @param escape_map_id_variable
    @parent variable
    @type variable
    @text エスケープマップID記憶変数
    @desc エスケープのマップIDを記憶する変数
    0 の場合は、パラメータの変数を参照
    @default 0

        @param escape_x_variable
        @parent escape_map_id_variable
        @type variable
        @text X座標記憶変数
        @desc エスケープのマップX座標記憶変数
        0 の場合は、パラメータの変数を参照
        @default 0

        @param escape_y_variable
        @parent escape_map_id_variable
        @type variable
        @text Y座標記憶変数
        @desc エスケープのマップY座標記憶変数
        0 の場合は、パラメータの変数を参照
        @default 0

@param vehicle
@text 乗り物設定
@desc ※ 分類用のパラメータです

    @param boat
    @parent vehicle
    @type location
    @text 小型船座標
    @desc 移動先の小型船座標
    マップIDは設定しても現在のマップになります
    @default {"mapId":"0","x":"0","y":"0"}

    @param ship
    @parent vehicle
    @type location
    @text 大型船座標
    @desc 移動先の大型船座標
    マップIDは設定しても現在のマップになります
    @default {"mapId":"0","x":"0","y":"0"}

    @param air_ship
    @parent vehicle
    @type location
    @text 飛行船座標
    @desc 移動先の飛行船座標
    マップIDは設定しても現在のマップになります
    @default {"mapId":"0","x":"0","y":"0"}
*/

/*~struct~SE:
@param name
@type file
@dir audio/se
@text ファイル名
@desc 再生するSEのファイル名
@default Move1

@param volume
@type number
@text 音量
@desc 再生するSEの音量
@min 0
@max 100
@default 90

@param pitch
@type number
@text ピッチ
@desc 再生するSEのピッチ
@min 50
@max 150
@default 100

@param pan
@type number
@text 位相
@desc 再生するSEの位相
@min -100
@max 100
@default 0
*/
(() => {
    'use strict';

    // ベースプラグインの処理
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
    function Potadra_checkSwitch(switch_no, bool = true) {
        return switch_no === 0 || $gameSwitches.value(switch_no) === bool;
    }
    function Potadra_convertAudio(struct_audio, audio_name) {
        if (!struct_audio) return false;
        let audio;
        try {
            audio = JSON.parse(struct_audio);
        } catch(e){
            return false;
        }
        const name   = audio_name ? String(audio.name || audio_name) : String(audio.name);
        const volume = Number(audio.volume || 90);
        const pitch  = Number(audio.pitch || 100);
        const pan    = Number(audio.pan || 0);
        return {"name": name, "volume": volume, "pitch": pitch, "pan": pan};
    }
    function Potadra_convertMap(struct_map, cast = false) {
        if (!struct_map) return false;
        let map;
        try {
            map = JSON.parse(struct_map);
        } catch(e){
            return false;
        }
        let map_id = map.mapId;
        if (cast) map_id = Number(map_id || 0);
        const x = Number(map.x || 0);
        const y = Number(map.y || 0);
        return {"mapId": map_id, "x": x, "y": y};
    }
    function Potadra_checkName(data, name, val = false) {
        if (isNaN(name)) {
            return Potadra_nameSearch(data, name.trim(), "id", "name", val);
        }
        return Number(name || val);
    }
    function Potadra_checkVariable(variable_no) {
        return variable_no > 0 && variable_no <= 5000;
    }



    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (id === null || id === undefined) return val;
        let cache = Potadra__searchCache_get(data);
        if (!cache) {
            cache = {};
            Potadra__searchCache_set(data, cache);
        }
        const key = `${search_column}:${id}`;
        if (key in cache) {
            const entry = cache[key];
            return column ? entry?.[column] ?? val : entry;
        }
        let result = val;
        for (let i = initial; i < data.length; i++) {
            const item = data[i];
            if (!item) continue;
            if (search_column && item[search_column] == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
            if (!search_column && i == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
        }
        cache[key] = val;
        return val;
    }
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MenuCommand         = String(params.MenuCommand);
    const MenuSwitch          = Number(params.MenuSwitch || 0);
    const DisableMenuSwitch   = Number(params.DisableMenuSwitch || 0);
    const MapListVariable     = Number(params.MapListVariable || 0);
    const cancelSwitch        = Number(params.cancelSwitch || 0);
    const MapIdVariable       = Number(params.MapIdVariable || 0);
    const X_Variable          = Number(params.X_Variable || 0);
    const Y_Variable          = Number(params.Y_Variable || 0);
    const ExitMapIdVariable   = Number(params.ExitMapIdVariable || 0);
    const Exit_X_Variable     = Number(params.Exit_X_Variable || 0);
    const Exit_Y_Variable     = Number(params.Exit_Y_Variable || 0);
    const EscapeMapIdVariable = Number(params.EscapeMapIdVariable || 0);
    const Escape_X_Variable   = Number(params.Escape_X_Variable || 0);
    const Escape_Y_Variable   = Number(params.Escape_Y_Variable || 0);
    const MaxCols             = Number(params.MaxCols || 1);
    const FullWidthWhenNoHelp = Potadra_convertBool(params.FullWidthWhenNoHelp);

    let MoveMapList;
    if (MenuCommand && params.mapLists && params.mapLists !== "[]") {
        const MapList = JSON.parse(params.mapLists);
        const map_list_number = MapListVariable === 0 ? MapListVariable : $gameVariables.value(MapListVariable);
        const move_map_list = JSON.parse(MapList[map_list_number]);
        MoveMapList = JSON.parse(move_map_list.maps);
    }

    // プラグインコマンド(ファストトラベル)
    PluginManager.registerCommand(plugin_name, "fast_travel", args => {
        const move_map_lists = JSON.parse(args.maps);
        SceneManager.push(Scene_FastTravel);
        SceneManager.prepareNextScene(move_map_lists);
    });

    // プラグインコマンド(メニューと同じ設定を呼び出す)
    PluginManager.registerCommand(plugin_name, "fast_travel_menu", args => {
        SceneManager.push(Scene_FastTravel);
        SceneManager.prepareNextScene(MoveMapList);
    });

    /**
     * 強制的に乗り物から降りる
     *    現在乗り物に乗っていることが前提
     *
     * @returns {} 
     */
    function forceGetOffVehicle() {
        if ($gamePlayer.isInAirship()) {
            $gamePlayer.vehicle()._altitude = 0;
            $gamePlayer.setDirection(2);
        }
        $gamePlayer.vehicle().getOff();
        $gamePlayer._vehicleGettingOff = false;
        $gamePlayer._vehicleType = "walk";
        $gamePlayer.setTransparent(false);
        $gamePlayer.setMoveSpeed(4);
        $gamePlayer.setThrough(false);
        return $gamePlayer._vehicleGettingOff;
    }

    /**
     * ファストトラベル画面の処理を行うクラスです
     *
     * @class
     */
    class Scene_FastTravel extends Scene_MenuBase {
        /**
         * 準備
         *
         * @param {} move_map_lists - マップ移動先の一覧
         */
        prepare(moveMapLists) {
            this._moveMapLists = [];
            this._hasHelp = false; // ヘルプテキストが1つでもあるか

            if (moveMapLists) {
                for (const value of moveMapLists) {
                    const map_data   = JSON.parse(value);
                    const showSwitch = Number(map_data.showSwitch || 0);
                    const hideSwitch = Number(map_data.hideSwitch || 0);
                    if (Potadra_checkSwitch(showSwitch) && Potadra_checkSwitch(hideSwitch, false)) {
                        this._moveMapLists.push(map_data);
                        // map_help が存在し、空でない場合
                        if (!this._hasHelp && map_data.map_help) {
                            this._hasHelp = true;
                        }
                    }
                }
            }
        }

        /**
         *
         */
        create() {
            super.create();
            // キャンセル判定スイッチ
            if (cancelSwitch !== 0) {
                $gameSwitches.setValue(cancelSwitch, false);
            }
            // ヘルプテキストがある場合のみヘルプウィンドウを作成
            if (this._hasHelp) {
                this.createHelpWindow();
            }
            this.createFastTravelWindow();
        }

        /*
         * メニュー背景作成
         */
        createBackground() {
            if (this._hasHelp || FullWidthWhenNoHelp) {
                super.createBackground();
            } else { // ヘルプテキストがない場合は、ぼかしい背景をなくす
                this._backgroundFilter = new PIXI.filters.BlurFilter();
                this._backgroundSprite = new Sprite();
                this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
                this.addChild(this._backgroundSprite);
            }
        }

        /**
         * ファストトラベルウィンドウを作成
         */
        createFastTravelWindow() {
            const rect = this.fastTravelWindowRect();
            this._fastTravelWindow = new Window_FastTravel(rect);
            this._fastTravelWindow.setHandler('ok',     this.commandMap.bind(this));
            this._fastTravelWindow.setHandler("cancel", this.onCancel.bind(this));
            this._fastTravelWindow.setupMapLists(this._moveMapLists);
            // ヘルプウィンドウが存在する場合のみ設定
            if (this._helpWindow) {
                this._fastTravelWindow.setHelpWindow(this._helpWindow);
            }
            this.addWindow(this._fastTravelWindow);
        }

        /**
         * ファストトラベルウィンドウの矩形
         *
         * @returns {} 
         */
        fastTravelWindowRect() {
            const wx = 0;
            const wy = this.helpAreaTop();
            let ww = Graphics.boxWidth / 3;
            if (FullWidthWhenNoHelp) {
                // ヘルプテキストがない場合は全幅を使用
                ww = this._hasHelp ? Graphics.boxWidth / 3 : Graphics.boxWidth;
            }
            const wh = Graphics.boxHeight - this.buttonAreaHeight();
            return new Rectangle(wx, wy, ww, wh);
        }

        /**
         * ヘルプ下部表示モード
         *
         * @returns {} 
         */
        isBottomHelpMode() {
            return false;
        }

        /**
         * ヘルプウィンドウの矩形
         *
         * @returns {} 
         */
        helpWindowRect() {
            const wx = Graphics.boxWidth / 3;
            const wy = this.helpAreaTop();
            const ww = (Graphics.boxWidth  / 3) * 2;
            const wh = Graphics.boxHeight - this.buttonAreaHeight();
            return new Rectangle(wx, wy, ww, wh);
        }

        // onPersonalCancel でも良いが、メニュー以外からも呼び出したいのでこの実装
        onCancel() {
            // キャンセル判定スイッチ
            if (cancelSwitch !== 0) {
                $gameSwitches.setValue(cancelSwitch, true);
            }
            this.popScene();
        }

        /**
         * コマンド［マップ移動］
         */
        commandMap() {
            const map_data           = this._moveMapLists[this._fastTravelWindow.index()];
            const moveSwitch         = Number(map_data.moveSwitch || 0);
            const moveChangeVariable = Number(map_data.moveChangeVariable || 0);
            const se                 = Potadra_convertAudio(map_data.se, 'Move1');

            const map       = Potadra_convertMap(map_data.map);
            const mapId     = Potadra_checkName($dataMapInfos, map.mapId, 1);
            const direction = Number(map_data.direction || 0);
            const fade_type = Number(map_data.fade_type || 0);

            const boat     = Potadra_convertMap(map_data.boat);
            const ship     = Potadra_convertMap(map_data.ship);
            const air_ship = Potadra_convertMap(map_data.air_ship);

            const common_event        = Potadra_checkName($dataCommonEvents, map_data.common_event, 0);
            const before_common_event = Potadra_checkName($dataCommonEvents, map_data.before_common_event, 0);
            const after_common_event  = Potadra_checkName($dataCommonEvents, map_data.after_common_event, 0);

            let map_id_variable        = Number(map_data.map_id_variable || 0);
            let x_variable             = Number(map_data.x_variable || 0);
            let y_variable             = Number(map_data.y_variable || 0);
            let exit_map_id_variable   = Number(map_data.exit_map_id_variable || 0);
            let exit_x_variable        = Number(map_data.exit_x_variable || 0);
            let exit_y_variable        = Number(map_data.exit_y_variable || 0);
            let escape_map_id_variable = Number(map_data.escape_map_id_variable || 0);
            let escape_x_variable      = Number(map_data.escape_x_variable || 0);
            let escape_y_variable      = Number(map_data.escape_y_variable || 0);

            if (map_id_variable === 0) map_id_variable = MapIdVariable;
            if (x_variable === 0) x_variable = X_Variable;
            if (y_variable === 0) y_variable = Y_Variable;
            if (exit_map_id_variable === 0) exit_map_id_variable = ExitMapIdVariable;
            if (exit_x_variable === 0) exit_x_variable = Exit_X_Variable;
            if (exit_y_variable === 0) exit_y_variable = Exit_Y_Variable;
            if (escape_map_id_variable === 0) escape_map_id_variable = EscapeMapIdVariable;
            if (escape_x_variable === 0) escape_x_variable = Escape_X_Variable;
            if (escape_y_variable === 0) escape_y_variable = Escape_Y_Variable;

            SceneManager.goto(Scene_Map);

            // 乗る動作の途中(乗ったことにする)
            if ($gamePlayer._vehicleGettingOn) {
                $gamePlayer._vehicleGettingOn = false;
            }

            // 乗り物に乗っている(強制的に降ろす)
            if ($gamePlayer.isInVehicle()) {
                forceGetOffVehicle();
            }

            // 小型船
            let boatX = boat.x;
            let boatY = boat.y;
            if (boatX === 0) boatX = $dataSystem.boat.startX;
            if (boatY === 0) boatY = $dataSystem.boat.startY;

            // 大型船
            let shipX = ship.x;
            let shipY = ship.y;
            if (shipX === 0) shipX = $dataSystem.ship.startX;
            if (shipY === 0) shipY = $dataSystem.ship.startY;

            // 飛行船
            let airX = air_ship.x;
            let airY = air_ship.y;
            if (airX === 0) airX = $dataSystem.airship.startX;
            if (airY === 0) airY = $dataSystem.airship.startY;

            // 乗り物の位置設定
            $gameMap.boat().setPosition(boatX, boatY);
            $gameMap.ship().setPosition(shipX, shipY);
            $gameMap.airship().setPosition(airX, airY);

            // 移動先記憶
            if (map_id_variable !== 0) $gameVariables.setValue(map_id_variable, mapId);
            if (x_variable !== 0) $gameVariables.setValue(x_variable, map.x);
            if (y_variable !== 0) $gameVariables.setValue(y_variable, map.y);

            // 出口記憶
            if (exit_map_id_variable !== 0) $gameVariables.setValue(exit_map_id_variable, $gameMap._mapId);
            if (exit_x_variable !== 0) $gameVariables.setValue(exit_x_variable, $gamePlayer.x);
            if (exit_y_variable !== 0) $gameVariables.setValue(exit_y_variable, $gamePlayer.y);

            if (before_common_event !== 0) {
                $gameTemp.reserveCommonEvent(before_common_event);
            }
            if (common_event === 0) {
                if (se) AudioManager.playSe(se);
                $gameMap._interpreter.command201([0, mapId, map.x, map.y, direction, fade_type]);
            } else {
                $gameTemp.reserveCommonEvent(common_event);
            }
            if (after_common_event !== 0) {
                $gameTemp.reserveCommonEvent(after_common_event);
            }

            // 移動判定スイッチ
            if (moveSwitch !== 0) {
                $gameSwitches.setValue(moveSwitch, true);
            }

            // 移動先マップ情報番号変更
            if (Potadra_checkVariable(MapListVariable)) {
                $gameVariables.setValue(MapListVariable, moveChangeVariable);
            }
        }
    }


    if (MenuCommand) {
        /**
         * メニュー画面で表示するコマンドウィンドウです。
         *
         * @class
         */

        /**
         * 独自コマンドの追加用
         */
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
            if (Potadra_checkSwitch(MenuSwitch)) {
                this.addCommand(MenuCommand, "fast_travel_menu", Potadra_checkSwitch(DisableMenuSwitch, false));
            }
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
            this._commandWindow.setHandler("fast_travel_menu", this.fast_travel_menu.bind(this));
        };

        /**
         * コマンド［ファストトラベル］
         */
        Scene_Menu.prototype.fast_travel_menu = function() {
            SceneManager.push(Scene_FastTravel);
            SceneManager.prepareNextScene(MoveMapList);
        };
    }


    /**
     * ファストトラベル画面の表示を行うウィンドウクラスです
     *
     * @class
     */
    class Window_FastTravel extends Window_Command {
        /**
         * 桁数の取得
         *
         * @returns {number} 桁数
         */
        maxCols() {
            return MaxCols;
        }

        /**
         * ヘルプテキスト更新
         */
        updateHelp() {
            // ヘルプウィンドウが存在しない場合は何もしない
            if (!this._helpWindow) {
                return;
            }
            
            super.updateHelp();
            const map_data = this._data[this.index()];
            this._helpWindow.setText(map_data.map_help);
        }

        /**
         * 行き先マップ一覧を設定
         *
         * @param {} moveMapLists - 
         */
        setupMapLists(moveMapLists) {
            this._data = moveMapLists;
            this.refresh();
            this.select(0);
        }

        /*
         * コマンドリストの作成
         */
        makeCommandList() {
            if (this._data) {
                for (const map_data of this._data) {
                    const move_map_name     = String(map_data.move_map_name);
                    const mapName           = String(map_data.mapName);
                    const common_event_name = String(map_data.common_event_name);

                    const map = Potadra_convertMap(map_data.map);
                    let mapId = Potadra_checkName($dataMapInfos, map.mapId, 1);
                    let common_event = Number(map_data.common_event || 0);
                    let command_name;

                    if (mapId === 0 && mapName) {
                        mapId = Potadra_nameSearch($dataMapInfos, mapName, 'id', 'name', 1);
                    }

                    if (!$dataMapInfos[mapId]) {
                        console.warn(`マップID: ${mapId} が存在しません。`);
                        continue;
                    }

                    if (common_event === 0 && common_event_name) {
                        common_event = Potadra_nameSearch($dataCommonEvents, common_event_name, 'id', 'name', 0);
                    }

                    if (common_event !== 0) command_name = $dataCommonEvents[common_event].name;
                    if (mapId !== 0) command_name = $dataMapInfos[mapId].name || mapId;
                    if (move_map_name) command_name = move_map_name;

                    this.addCommand(command_name, "map");
                }
            }
        }
    }
})();
