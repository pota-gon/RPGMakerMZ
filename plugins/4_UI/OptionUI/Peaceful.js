/*:
@plugindesc
ピースフル Ver1.0.2(2023/7/3)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/OptionUI/Peaceful.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.2: オプションの最大値の設定判定が想定より大きくなっていた問題を修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
マイクラのピースフルのようにランダムエンカウントを
無効にするオプションを追加します

## 使い方
メニュー > オプション に ピースフルオプションが追加されます  
切り替えることで、ランダムエンカウントを無効にすることが出来ます

* ピースフルONで、ランダムエンカウント無効  
* ピースフルOFFで、ランダムエンカウント有効

@param NewGameOption
@type boolean
@text ニューゲーム時
@desc ニューゲーム開始時のオプションの状態
@default false

@param OptionName
@type string
@text ピースフルオプション名
@desc ランダムエンカウントを無効にするオプション名
@default ピースフル
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
    const OptionName    = String(params.OptionName || 'ピースフル');

    /**
     * オプションデータを生成して返す
     *
     * @returns {} オプションデータ
     */
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.apply(this, arguments);
        config.peaceful = this.peaceful;
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
        this.peaceful = this.readFlag(config, "peaceful", NewGameOption);
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
        this.addCommand(OptionName, "peaceful");
    };

    /**
     * エンカウントの更新
     */
    Scene_Map.prototype.updateEncounter = function() {
        if (ConfigManager.peaceful) {
            $gamePlayer.makeEncounterCount(); // ピースフル解除時にエンカウントしてしまうため、エンカウントを再設定する
        } else if ($gamePlayer.executeEncounter()) {
            SceneManager.push(Scene_Battle);
        }
    };
})();
