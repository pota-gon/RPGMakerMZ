/*:
@plugindesc
ファストトラベル Ver0.9.6(2023/7/9)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Map/FastTravel.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver0.9.6: メニュー表示名の設定をコンボボックスに変更

・TODO
- ページ対応
- 右にコマンド配置
- エスケープ機能実装
- エスケープ先から1歩動く機能搭載
- 移動時アニメーション・SE
- ヘルプ更新

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
ファストトラベルを簡単に実装します。

## 使い方


@param MenuCommand
@type combo
@text メニュー表示名
@desc メニューの表示名
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
    0(なし)の場合、0番目が常に参照されます。
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
@param showSwitch
@type switch
@text 移動先表示スイッチ
@desc このスイッチがONのときに行き先を表示します
0(なし)の場合、常に移動先が表示されます
@default 0

@param hideSwitch
@type switch
@text 移動先非表示スイッチ
@desc このスイッチがONのときに行き先を非表示にします
0(なし)の場合、常に移動先が表示されます
@default 0

@param moveSwitch
@type switch
@text 移動判定スイッチ
@desc 移動をしたときにこのスイッチがONになります
0(なし)の場合、使用しません
@default 0

@param moveChangeVariable
@type number
@text 移動先マップ情報番号変更
@desc 移動先マップ情報の変数を変更します。
@default 0

@param move_common_event
@type common_event
@text 移動後コモンイベントID
@desc 移動後のコモンイベントID
コモンイベント名を指定した場合は、こちらの設定は不要です
@default 0
@min 0

    @param move_common_event_name
    @parent move_common_event
    @type string
    @text 移動後コモンイベント名
    @desc 移動後のコモンイベント名(名前でコモンイベント検索)
    コモンイベントIDを指定した場合は、こちらの設定は不要です

@param move_map_name
@type string
@text マップ移動先名
@desc 移動先のマップ名称を指定します

@param map_help
@type multiline_string
@text マップ説明
@desc マップについての説明
文章の表示と同様の表示が可能です。

@param common_event
@type common_event
@text コモンイベントID
@desc 移動処理のコモンイベントID
コモンイベント名を指定した場合は、こちらの設定は不要です
@default 0
@min 0

    @param common_event_name
    @parent common_event
    @type string
    @text コモンイベント名
    @desc 移動処理のコモンイベント名(名前でコモンイベント検索)
    コモンイベントIDを指定した場合は、こちらの設定は不要です

@param mapId
@type number
@text マップID
@desc 移動先のマップID
マップ名を指定した場合は、こちらの設定は不要です
@default 0
@min 0

    @param mapName
    @parent mapId
    @type string
    @text マップ名
    @desc 移動先のマップ名
    マップIDを指定した場合は、こちらの設定は不要です

    @param x
    @parent mapId
    @type number
    @text X座標
    @desc 移動先のマップX座標
    @default 0
    @min 0

    @param y
    @parent mapId
    @type number
    @text Y座標
    @desc 移動先のマップY座標
    @default 0
    @min 0

    @param direction
    @parent mapId
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
    @parent mapId
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
    @parent mapId
    @type struct<SE>
    @text 場所移動SE
    @desc 場所移動時に再生するSE。指定しない場合、再生しません
    @default {"name":"Move1","volume":"90","pitch":"100","pan":"0"}

    @param map_id_variable
    @parent mapId
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
    @parent mapId
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
    @parent mapId
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

@param boat_x
@type number
@text 小型船のX座標
@desc 移動先の小型船X座標
@default 0
@min 0

@param boat_y
@type number
@text 小型船のY座標
@desc 移動先の小型船Y座標
@default 0
@min 0

@param ship_x
@type number
@text 大型船のX座標
@desc 移動先の大型船X座標
@default 0
@min 0

@param ship_y
@type number
@text 大型船のY座標
@desc 移動先の大型船Y座標
@default 0
@min 0

@param air_ship_x
@type number
@text 飛行船のX座標
@desc 移動先の飛行船X座標
@default 0
@min 0

@param air_ship_y
@type number
@text 飛行船のY座標
@desc 移動先の飛行船Y座標
@default 0
@min 0
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
@default 90
@max 100
@min 0

@param pitch
@type number
@text ピッチ
@desc 再生するSEのピッチ
@default 100
@max 150
@min 50

@param pan
@type number
@text 位相
@desc 再生するSEの位相
@default 0
@max 100
@min -100
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_checkSwitch(switch_no, bool = true) {
        if (switch_no === 0 || $gameSwitches.value(switch_no) === bool) {
            return true;
        } else {
            return false;
        }
    }
    function Potadra_convertAudio(struct_audio) {
        if (struct_audio) {
            const audio  = JSON.parse(struct_audio);
            const name   = String(audio.name);
            const volume = Number(audio.volume || 90);
            const pitch  = Number(audio.pitch || 100);
            const pan    = Number(audio.pan || 0);
            return {"name": name, "volume": volume, "pitch": pitch, "pan": pan};
        } else {
            return false;
        }
    }
    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) {
            return val;
        }
        for (let i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column) {
                if (data[i][search_column] == id) {
                    if (column) {
                        val = data[i][column];
                    } else {
                        val = data[i];
                    }
                    break;
                }
            } else if (i == id) {
                val = data[i];
                break;
            }
        }
        return val;
    }
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }
    function Potadra_checkVariable(variable_no) {
        if (variable_no > 0 && variable_no <= 5000) {
            return true;
        } else {
            return false;
        }
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MenuCommand         = String(params.MenuCommand);
    const MenuSwitch          = Number(params.MenuSwitch || 0);
    const DisableMenuSwitch   = Number(params.DisableMenuSwitch || 0);
    const MapListVariable     = Number(params.MapListVariable) || 0;
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

    let MoveMapList;
    if (MenuCommand && params.mapLists) {
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
     *    現在乗り物に乗っていることが前提。
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
     * ファストトラベル画面の処理を行うクラスです。
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
            if (moveMapLists) {
                for (const value of moveMapLists) {
                    const map_data   = JSON.parse(value);
                    const showSwitch = Number(map_data.showSwitch || 0);
                    const hideSwitch = Number(map_data.hideSwitch || 0);
                    if (Potadra_checkSwitch(showSwitch) && Potadra_checkSwitch(hideSwitch, false)) {
                        this._moveMapLists.push(map_data);
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
            this.createHelpWindow();
            this.createFastTravelWindow();
        }

        /**
         * 
         */
        createFastTravelWindow() {
            const rect = this.fastTravelWindowRect();
            this._fastTravelWindow = new Window_FastTravel(rect);
            this._fastTravelWindow.setHandler('ok',     this.commandMap.bind(this));
            this._fastTravelWindow.setHandler("cancel", this.onCancel.bind(this));
            this._fastTravelWindow.setupMapLists(this._moveMapLists);
            this._fastTravelWindow.setHelpWindow(this._helpWindow);
            this.addWindow(this._fastTravelWindow);
        }

        /**
         * 
         *
         * @returns {} 
         */
        fastTravelWindowRect() {
            const wx = 0;
            const wy = this.helpAreaTop();
            const ww = Graphics.boxWidth / 3;
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
         * 
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
            const map_data               = this._moveMapLists[this._fastTravelWindow.index()];
            const moveSwitch             = Number(map_data.moveSwitch || 0);
            const moveChangeVariable     = Number(map_data.moveChangeVariable || 0);
            const common_event_name      = String(map_data.common_event_name);
            const move_common_event_name = String(map_data.move_common_event_name);
            const mapName                = String(map_data.mapName);
            const x                      = Number(map_data.x || 0);
            const y                      = Number(map_data.y || 0);
            const direction              = Number(map_data.direction || 0);
            const fade_type              = Number(map_data.fade_type || 0);
            const se                     = Potadra_convertAudio(map_data.se);
            const boat_x                 = Number(map_data.boat_x || 0);
            const boat_y                 = Number(map_data.boat_y || 0);
            const ship_x                 = Number(map_data.ship_x || 0);
            const ship_y                 = Number(map_data.ship_y || 0);
            const air_ship_x             = Number(map_data.air_ship_x || 0);
            const air_ship_y             = Number(map_data.air_ship_y || 0);

            let common_event           = Number(map_data.common_event || 0);
            let move_common_event      = Number(map_data.move_common_event || 0);
            let mapId                  = Number(map_data.mapId || 0);
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

            if (mapId === 0 && mapName) {
                mapId = Potadra_nameSearch($dataMapInfos, mapName, 'id', 'name', 1);
            }

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
            let boatX = boat_x;
            let boatY = boat_y;
            if (boat_x === 0) boatX = $dataSystem.boat.startX;
            if (boat_y === 0) boatY = $dataSystem.boat.startY;

            // 大型船
            let shipX = ship_x;
            let shipY = ship_y;
            if (ship_x === 0) shipX = $dataSystem.ship.startX;
            if (ship_y === 0) shipY = $dataSystem.ship.startY;

            // 飛行船
            let airX = air_ship_x;
            let airY = air_ship_y;
            if (air_ship_x === 0) airX = $dataSystem.airship.startX;
            if (air_ship_y === 0) airY = $dataSystem.airship.startY;

            // 乗り物の位置設定
            $gameMap.boat().setPosition(boatX, boatY);
            $gameMap.ship().setPosition(shipX, shipY);
            $gameMap.airship().setPosition(airX, airY);

            // 移動先記憶
            if (map_id_variable !== 0) $gameVariables.setValue(map_id_variable, mapId);
            if (x_variable !== 0) $gameVariables.setValue(x_variable, x);
            if (y_variable !== 0) $gameVariables.setValue(y_variable, y);

            // 出口記憶
            if (exit_map_id_variable !== 0) $gameVariables.setValue(exit_map_id_variable, $gameMap._mapId);
            if (exit_x_variable !== 0) $gameVariables.setValue(exit_x_variable, $gamePlayer.x);
            if (exit_y_variable !== 0) $gameVariables.setValue(exit_y_variable, $gamePlayer.y);

            if (common_event === 0 && common_event_name) {
                common_event = Potadra_nameSearch($dataCommonEvents, common_event_name, 'id', 'name', 0);
            }
            if (common_event === 0) {
                if (se) {
                    AudioManager.playSe(se);
                }
                $gameMap._interpreter.command201([0, mapId, x, y, direction, fade_type]);
            } else {
                $gameTemp.reserveCommonEvent(common_event);
            }
            if (move_common_event === 0 && move_common_event_name) {
                move_common_event = Potadra_nameSearch($dataCommonEvents, move_common_event_name, 'id', 'name', 0);
            }
            if (move_common_event !== 0) {
                $gameTemp.reserveCommonEvent(move_common_event);
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
     * ウィンドウの表示を行うウィンドウクラスです。
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

                    let mapId        = Number(map_data.mapId || 0);
                    let common_event = Number(map_data.common_event || 0);
                    let command_name;

                    if (mapId === 0 && mapName) {
                        mapId = Potadra_nameSearch($dataMapInfos, mapName, 'id', 'name', 1);
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
