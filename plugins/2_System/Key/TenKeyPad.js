/*:
@plugindesc
テンキー入力 Ver1.0.1(2023/6/26)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Key/TenKeyPad.js
@orderAfter wasdKeyMZ
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1 ロンチプラグインの wasdKeyMZ.js と競合するため、順番をエラー表示するように修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
テンキーの 7 を Qキー 9 を W キーに拡張します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    Input.keyMapper[103] = 'pageup';
    Input.keyMapper[105] = 'pagedown';
})();
