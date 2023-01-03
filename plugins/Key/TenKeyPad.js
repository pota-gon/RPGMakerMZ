/*:
@plugindesc
テンキー入力 Ver1.0.0(2022/12/2)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Key/TenKeyPad.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 公開

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
テンキーの 7 を Qキー 9 を W キーに拡張します。

## 使い方
初期設定は必要ありません。  
プラグイン導入だけで動作します。
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
