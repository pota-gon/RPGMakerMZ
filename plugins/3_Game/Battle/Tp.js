/*:
@plugindesc
TP Ver1.0.2(2023/12/9)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Tp.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.2: TP最大値 を設定する機能追加

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
TPの設定を変更します

## 使い方
TP関連のパラメータを必要に応じて変更してください

@param MaxTp
@type number
@text TP最大値
@desc TPの最大値
@default 100

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
    function Potadra_convertNum(value, default_value) {
        return Number(value || default_value);
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

    // 各パラメータ用変数
    const MaxTp            = Potadra_convertNum(params.MaxTp, 100);
    const FixedTp          = Potadra_convertBool(params.FixedTp);
    const InitTp           = Potadra_convertNum(params.InitTp, 0);
    const NoChargeTpDamage = Potadra_convertBool(params.NoChargeTpDamage);

    /**
     * TP の最大値を取得
     *
     * @returns {number} 
     */
    Game_BattlerBase.prototype.maxTp = function() {
        return MaxTp;
    };

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
