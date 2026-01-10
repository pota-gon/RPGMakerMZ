/*:
@plugindesc
オートセーブ上書き許可 Ver1.0.0(2023/4/25)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Save/OverWriteAutoSave.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
オートセーブを上書き出来るようにします

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

@param PlayTest
@type boolean
@text テスト時のみ有効
@desc テスト時のみ有効にするか
@on 有効にする
@off 常に有効
@default false
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
    function Potadra_isTest(play_test = true) {
        return !play_test || Utils.isOptionValid("test");
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const PlayTest = Potadra_convertBool(params.PlayTest);

    /**
     * 
     *
     * @param {} savefileId - 
     * @returns {} 
     */
    Window_SavefileList.prototype.isEnabled = function(savefileId) {
        if (this._mode === "save" && Potadra_isTest(PlayTest)) {
            return savefileId >= 0;
        } else {
            return !!DataManager.savefileInfo(savefileId);
        }
    };
})();
