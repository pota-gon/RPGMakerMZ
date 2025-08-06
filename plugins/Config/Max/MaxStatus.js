/*:
@plugindesc
ステータス最大値設定 Ver0.0.2(2024/12/27)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/Config/Max/MaxStatus.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver0.0.2
- 敵キャラのパラメータ設定実装
- URL記載
- ヘルプ更新
* Ver0.0.1: 作成開始

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
通常能力値の最大値を設定する機能を追加します

## 使い方
1. 最大値を変更したいプラグインパラメータを変更
2. 能力値が設定した上限に切り替わります
※ -1 を設定すると無限になります

@param ActorHPMax
@text アクターHP最大値
@desc アクターのHPの最大値
※ -1 を設定すると無限になります
@default 99999
@min -1
@max 999999999999999

@param ActorMPMax
@text アクターMP最大値
@desc アクターのMPの最大値
※ -1 を設定すると無限になります
@default 99999
@min -1
@max 999999999999999

@param ActorOtherMax
@text アクターその他能力値最大値
@desc アクターのその他の通常能力値の最大値
※ -1 を設定すると無限になります
@default 9999
@min -1
@max 999999999999999

@param EnemyHPMax
@text 敵キャラHP最大値
@desc 敵キャラのHPの最大値
※ -1 を設定すると無限になります
@default 99999
@min -1
@max 999999999999999

@param EnemyMPMax
@text 敵キャラMP最大値
@desc 敵キャラのMPの最大値
※ -1 を設定すると無限になります
@default 99999
@min -1
@max 999999999999999

@param EnemyOtherMax
@text 敵キャラその他能力値最大値
@desc 敵キャラのその他の通常能力値の最大値
※ -1 を設定すると無限になります
@default 9999
@min -1
@max 999999999999999
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
    const ActorHPMax    = Number(params.ActorHPMax || 0);
    const ActorMPMax    = Number(params.ActorMPMax || 0);
    const ActorOtherMax = Number(params.ActorOtherMax || 0);
    const EnemyHPMax    = Number(params.EnemyHPMax || 0);
    const EnemyMPMax    = Number(params.EnemyMPMax || 0);
    const EnemyOtherMax = Number(params.EnemyOtherMax || 0);

    /**
     * 通常能力値の最大値取得
     *
     * @param {} paramId - 
     * @returns {} 
     */
    Game_Actor.prototype.paramMax = function(paramId) {
        if (paramId === 0) {
            return ActorHPMax === -1 ? Infinity : ActorHPMax;
        } else if (paramId === 1) {
            return ActorMPMax === -1 ? Infinity : ActorMPMax;
        } else {
            return ActorOtherMax === -1 ? Infinity : ActorOtherMax;
        }
    };
    Game_Enemy.prototype.paramMax = function(paramId) {
        if (paramId === 0) {
            return EnemyHPMax === -1 ? Infinity : EnemyHPMax;
        } else if (paramId === 1) {
            return EnemyMPMax === -1 ? Infinity : EnemyMPMax;
        } else {
            return EnemyOtherMax === -1 ? Infinity : EnemyOtherMax;
        }
    };
})();
