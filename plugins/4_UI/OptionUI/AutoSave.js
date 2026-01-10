/*:
@plugindesc
オートセーブオプション Ver1.0.6(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/OptionUI/AutoSave.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.6: ヘルプ更新
* Ver1.0.5: オプションの最大値の設定判定が想定より大きくなっていた問題を修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
オートセーブの有無を変更するオプションを追加します

## 使い方
1. プラグインを導入
2. オプションにオートセーブが追加されます
3. ON で、オートセーブ有効。OFF で、オートセーブを無効にできます
*/
(() => {
    'use strict';

    // 初期値
    ConfigManager.autoSave = false;

    /**
     * オプションデータを生成して返す
     *
     * @returns {} オプションデータ
     */
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.apply(this, arguments);
        config.autoSave = this.autoSave;
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
        this.autoSave = this.readFlag(config, "autoSave", $dataSystem.optAutosave);
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
     * オートセーブの有効状態
     *
     * @returns {} 
     */
    Game_System.prototype.isAutosaveEnabled = function() {
        return ConfigManager.autoSave;
    };

    /**
     * 
     */
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.apply(this, arguments);
        this.addCommand(TextManager.autosave, "autoSave");
    };

    // オートセーブ判定
    function autoSave(mode, autosave) {
        const autoSavefileId = 0;
        let save_count = autosave ? autoSavefileId : 1;

        // ロード画面でオートセーブが有効でなくてもオートセーブがあるとき、ロード出来るようにする
        if (mode === 'load' && !autosave && DataManager.savefileExists(autoSavefileId)) {
            save_count = 0;
        }

        return save_count;
    }

    /**
     * 項目数の取得
     *
     * @returns {} 
     */
    Window_SavefileList.prototype.maxItems = function() {
        return DataManager.maxSavefiles() - autoSave(this._mode, this._autosave);
    };

    /**
     * 
     *
     * @param {} index - 
     * @returns {} 
     */
    Window_SavefileList.prototype.indexToSavefileId = function(index) {
        return index + autoSave(this._mode, this._autosave);
    };

    /**
     * 
     *
     * @param {} savefileId - 
     * @returns {} 
     */
    Window_SavefileList.prototype.savefileIdToIndex = function(savefileId) {
        return savefileId - autoSave(this._mode, this._autosave);
    };
})();
