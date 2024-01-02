/*:
@plugindesc
オプションボリューム切り替え範囲 Ver1.0.4(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Option/VolumeOffset.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- TODO追加

・TODO
- ヘルプ更新

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
オプションのボリューム切り替え範囲を変更します。

## 使い方


@param volumeOffset
@type number
@text ボリューム切替範囲
@desc ボリュームの切り替え範囲
@default 20
@min 1
@max 100
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

    // 各パラメータ用定数
    const volumeOffset = Number(params.volumeOffset || 0);

    /**
     * ボリュームの切り替え範囲
     *
     * @returns {} 
     */
    Window_Options.prototype.volumeOffset = function() {
        return volumeOffset;
    };
})();
