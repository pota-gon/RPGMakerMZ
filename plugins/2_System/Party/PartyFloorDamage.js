/*:
@plugindesc
パーティー床ダメージ率 Ver1.0.3(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Party/PartyFloorDamage.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.3: リファクタリング(_stateSteps を states を使うように修正)
* Ver1.0.2: meta データの取得処理を修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
特徴の特殊能力値: 床ダメージ率 のパーティー能力版を追加します

## 使い方
アクター・職業・武器・防具・ステートのメモ欄に  
<床ダメージ率: 50%> を記載します  
すると、床ダメージ率がパーティー全体に適用されます

パーティー床ダメージ率は、通常の床ダメージ率と合わせて
一番小さい値(ダメージが少なくなる値)が適用されます

@param PartyFloorDamageMetaName
@text パーティー床ダメージ率タグ
@desc パーティー床ダメージ率に使うメモ欄タグの名称
デフォルトは 床ダメージ率
@default 床ダメージ率
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_meta(meta, tag) {
        if (meta) {
            const data = meta[tag];
            if (data) {
                if (data !== true) {
                    return data.trim();
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const PartyFloorDamageMetaName = String(params.PartyFloorDamageMetaName || '床ダメージ率');

    // パーティー床ダメージの算出
    function partyFloorDamage(meta, basicFloorDamage) {
        const floor_damage_str = Potadra_meta(meta, PartyFloorDamageMetaName);
        if (floor_damage_str) {
            return basicFloorDamage * (parseFloat(floor_damage_str) / 100);
        }
        return basicFloorDamage;
    }

    /**
     * 床ダメージの処理
     */
    Game_Actor.prototype.executeFloorDamage = function() {
        const basicFloorDamage = this.basicFloorDamage();
        const floorDamages = [Math.floor(basicFloorDamage * this.fdr), this.maxFloorDamage()];

        for (const actor of $gameParty.allMembers()) {
            // パーティー床ダメージの算出(アクター)
            floorDamages.push(partyFloorDamage(actor.actor().meta, basicFloorDamage));

            // パーティー床ダメージの算出(職業)
            floorDamages.push(partyFloorDamage(actor.currentClass().meta, basicFloorDamage));

            // パーティー床ダメージの算出(武器・防具)
            for (const item of actor.equips()) {
                if (item) {
                    floorDamages.push(partyFloorDamage(item.meta, basicFloorDamage));
                }
            }

            // パーティー床ダメージの算出(ステート)
            // ステート
            for (const state of actor.states()) {
                if (!state) continue;

                floorDamages.push(partyFloorDamage(state.meta, basicFloorDamage));
            }
        }

        const realDamage = Math.min.apply(null, floorDamages);
        this.gainHp(-realDamage);
        if (realDamage > 0) {
            this.performMapDamage();
        }
    };
})();
