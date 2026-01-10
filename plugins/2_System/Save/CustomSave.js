/*:
@plugindesc
セーブ内容カスタマイズ Ver1.0.0(2025/10/19)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Save/CustomSave.js
@orderAfter NoEncrypt
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
セーブ内容のカスタマイズを実施します

## 使い方
パラメータの設定を変更し、必要なセーブデータを選択してください

@param System
@type boolean
@text システム
@desc システムのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param Screen
@type boolean
@text スクリーン
@desc スクリーンのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param Timer
@type boolean
@text タイマー
@desc タイマーのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param Switches
@type boolean
@text スイッチ
@desc スイッチのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param Variables
@type boolean
@text 変数
@desc 変数のセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param SelfSwitches
@type boolean
@text セルフスイッチ
@desc セルフスイッチのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param Actor
@type boolean
@text アクター
@desc アクターのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param Party
@type boolean
@text パーティー
@desc パーティーのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param Map
@type boolean
@text マップ
@desc マップのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true

@param Player
@type boolean
@text プレイヤー
@desc プレイヤーのセーブデータを保存するか
@on 保存する
@off 保存しない
@default true
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

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const System       = Potadra_convertBool(params.System);
    const Screen       = Potadra_convertBool(params.Screen);
    const Timer        = Potadra_convertBool(params.Timer);
    const Switches     = Potadra_convertBool(params.Switches);
    const Variables    = Potadra_convertBool(params.Variables);
    const SelfSwitches = Potadra_convertBool(params.SelfSwitches);
    const Actor        = Potadra_convertBool(params.Actor);
    const Party        = Potadra_convertBool(params.Party);
    const Map          = Potadra_convertBool(params.Map);
    const Player       = Potadra_convertBool(params.Player);

    /**
     * 
     *
     * @param {} saveName - 
     * @param {} object - 
     */
    const _StorageManager_saveObject = StorageManager.saveObject;
    StorageManager.saveObject = function(saveName, object) {
        // system
        if (!System) { 
            delete object.system;
        } else {
            // 子要素の削除
        }

        // screen
        if (!Screen) {
            delete object.screen;
        } else {
            // 子要素の削除
        }

        // タイマー
        if (!Timer) {
            delete object.timer;
        } else {
            // 子要素の削除
        }

        // スイッチ
        if (!Switches) {
            delete object.switches;
        }

        // 変数
        if (!Variables) {
            delete object.variables;
        }

        // セルフスイッチ
        if (!SelfSwitches) {
            delete object.selfSwitches;
        }

        // アクター
        if (!Actor) {
            delete object.actors;
        } else {
            // 子要素の削除
        }

        // パーティー
        if (!Party) {
            delete object.party;
        } else {
            // 子要素の削除
        }

        // マップ
        if (!Map) {
            delete object.map;
        } else {
            // 子要素の削除
        }

        // プレイヤー
        if (!Player) {
            delete object.player;
        } else {
            // 子要素の削除
        }

        return _StorageManager_saveObject.apply(this, arguments);
    };
})();
