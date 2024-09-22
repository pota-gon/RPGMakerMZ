/*:
@plugindesc
最強装備判定リトライ Ver1.0.0(2022/12/2)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Equip/RetryOptimize.js
@orderBefore ExcludeAtOptimize
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 公開

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
装備に「武器タイプ装備」や「二刀流」があった場合、  
最強装備が正常に反映されないため、  
最強装備の装備を実施したあと、もう一度最強装備します。

## 使い方
初期設定は必要ありません。  
プラグイン導入だけで動作します。

@param Optimize
@text 最強装備タグ
@desc 最強装備の優先度を決めるメモ欄タグの名称
デフォルトは 最強装備。武器・防具のメモ欄に記載
@default 最強装備

@param SkipOptimize
@text Skipタグ
@desc 最強装備対象外の防具のメモ欄タグの名称
デフォルトは Skip
@default Skip
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

    // 各パラメータ用変数
    const Optimize     = String(params.Optimize) || '最強装備';
    const SkipOptimize = String(params.SkipOptimize) || 'Skip';

    /**
     * 最強装備
     */
    Game_Actor.prototype.optimizeEquipments = function() {
        const maxSlots = this.equipSlots().length;
        for (let i = 0; i < maxSlots; i++) {
            const equip = this.equips()[i];

            if (equip && Potadra_meta(equip.meta, SkipOptimize)) {
                continue;
            }

            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }

            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }

        for (let i = 0; i < maxSlots; i++) {
            if (!this.equips()[i] && this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }
    };

    /**
     * 指定アイテムと装備アイテムの能力の差分の値を返す
     *
     * @param {RPG.EquipItem} item - アイテム
     * @returns {number} 指定アイテムと装備アイテムの能力の差分の値
     */
    Game_Actor.prototype.calcEquipItemPerformance = function(item) {
        const performance = Potadra_meta(item.meta, Optimize);
        return performance ? performance : item.params.reduce((a, b) => a + b);
    };
})();
