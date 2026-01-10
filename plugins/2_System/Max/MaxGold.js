/*:
@plugindesc
所持金の最大数変更 Ver1.3.4(2022/4/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Max/MaxGold.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.3.4: リファクタ

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
所持金の最大数をパラメータで指定した値に変更します

## 使い方
パラメータを変更し、所持金の最大数を変更してください  
導入時は、 999999999999999 となっています

@param MaxGold
@type number
@text 所持金最大数
@desc 所持金の最大数
@default 999999999999999
@min 0
@max 999999999999999
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MaxGold = Number(params.MaxGold || 999999999999999);

    /**
     * パーティを扱うクラスです。所持金やアイテムなどの情報が含まれます。
     * このクラスのインスタンスは $gameParty で参照されます。
     *
     * @class
     */

    /**
     * 所持金の最大値を取得
     *
     * @returns {number} 所持金の最大値
     */
    Game_Party.prototype.maxGold = function() {
        // 変更
        // return 99999999;
        return MaxGold;
    };
})();
