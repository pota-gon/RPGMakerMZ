/*:
@plugindesc
雪オプション Ver1.0.3(2023/7/3)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/OptionUI/Snow.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.3: オプションの最大値の設定判定が想定より大きくなっていた問題を修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
雪を降らせるオプションを追加します

## 使い方
メニュー > オプション に 雪オプションが追加されます
切り替えることで、雪を降らすことが出来ます

* 雪ONで、雪が降ります  
* 雪OFFで、雪が止みます

@param NewGameOption
@type boolean
@text ニューゲーム時
@desc ニューゲーム開始時のオプションの状態
@default false

@param Power
@type number
@text 雪の強さ
@desc 雪の強さを 1 ～ 9 で設定します
デフォルトは 5 です
@default 5
@min 1
@max 9

@param OptionName
@type string
@text 雪オプション名
@desc 雪を降らせるオプション名
@default 雪
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const NewGameOption = Potadra_convertBool(params.NewGameOption);
    const Power         = Number(params.Power || 5);
    const OptionName    = String(params.OptionName || '雪');

    /**
     * オプションデータを生成して返す
     *
     * @returns {} オプションデータ
     */
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.apply(this, arguments);
        config.snow = this.snow;
        return config;
    };

    /**
     * 指定オプションを適用
     *
     * @param {} config - オプションデータ
     */
    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        this.snow = this.readFlag(config, "snow", NewGameOption);
    };

    /**
     * オプションの項目数
     * ここで指定した値より項目が多い場合、スクロールして表示されます。
     *
     * @returns {number} オプションの項目数
     */
    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        let max_commands = _Scene_Options_maxCommands.apply(this, arguments);
        return max_commands += 1;
    };

    /**
     * 
     */
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.apply(this, arguments);
        this.addCommand(OptionName, "snow");
    };

    /**
     * 
     */
    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.apply(this, arguments);
        if (ConfigManager.snow) {
            $gameScreen.changeWeather('snow', Power, 0);
        } else {
            $gameScreen.changeWeather('none', 0, 0);
        }
    };
})();
