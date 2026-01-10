/*:
@plugindesc
必ず逃走 Ver1.4.4(2022/4/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Escape.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.4.4: コピーライト更新

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
逃走の成功率を100%にします

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

@param EscapeRatio
@type number
@text 逃走成功率
@desc 100 で 100%、 50 で 50% の確率で
逃走に成功するようになります
@max 100
@min 1
@default 100

@param EscapeRatioVariable
@type variable
@text 逃走成功率変数
@desc 逃走成功率を管理する変数
なしの場合、逃走成功率で指定した値が逃走成功率になります
@default 0
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
    const EscapeRatioVariable = Number(params.EscapeRatioVariable || 0);
    let EscapeRatio           = Number(params.EscapeRatio || 1);

    /**
     * 戦闘の進行を管理する静的クラスです。
     *
     * @namespace
     */

    /**
     * 逃走成功率の作成
     */
    BattleManager.makeEscapeRatio = function() {
        if (EscapeRatioVariable !== 0) { // ゲーム中に逃走成功率を変更するための変数を使う場合
            EscapeRatio = $gameVariables.value(EscapeRatioVariable);
            if (EscapeRatio <= 0) {
                EscapeRatio = 100; // 変数が 0 以下の場合、強制的に 100% にする。
            }
        }
        this._escapeRatio = EscapeRatio / 100;
    };
})();
