/*:
@plugindesc
TP Ver1.0.1(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Battle/Tp.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
TPの設定を変更します。

## 使い方
TP関連のパラメータを必要に応じて変更してください。

@param FixedTp
@type boolean
@text TP初期化固定
@desc TP初期化の値を固定にするか
@on 固定にする
@off 固定にしない
@default true

@param InitTp
@parent FixedTp
@type number
@text 戦闘開始TP初期値
@desc 戦闘開始時のTP初期値
@default 0

@param NoChargeTpDamage
@type boolean
@text 被ダメージ時にTPを回復しない
@desc 被ダメージ時にTPを回復するかどうか
@on 回復しない
@off 回復する
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
    function Potadra_convertNum(value, default_value) {
        return Number(value) || default_value;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const FixedTp          = Potadra_convertBool(params.FixedTp);
    const InitTp           = Potadra_convertNum(params.InitTp, 0);
    const NoChargeTpDamage = Potadra_convertBool(params.NoChargeTpDamage);

    /**
     * TP の初期化
     */
    if (FixedTp) {
        Game_Battler.prototype.initTp = function() {
            this.setTp(InitTp);
        };
    }

    /**
     * 被ダメージによる TP チャージ
     *
     * @param {} damageRate - 
     */
    if (NoChargeTpDamage) {
        Game_Battler.prototype.chargeTpByDamage = function(damageRate) {};
    }
})();
