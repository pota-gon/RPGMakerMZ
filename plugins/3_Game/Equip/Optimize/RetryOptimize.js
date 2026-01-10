/*:
@plugindesc
最強装備判定リトライ Ver1.0.2(2025/8/6)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Equip/Optimize/RetryOptimize.js
@orderBefore ExcludeAtOptimize
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.2: 不要な処理を削除
* Ver1.0.1: 高速化対応
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
装備に「武器タイプ装備」や「二刀流」があった場合  
最強装備が正常に反映されないため  
最強装備の装備を実施したあと、もう一度最強装備します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

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
    const Optimize     = String(params.Optimize || '最強装備');
    const SkipOptimize = String(params.SkipOptimize || 'Skip');

    /**
     * 最強装備
     */
    Game_Actor.prototype.optimizeEquipments = function() {
        // 1. 計算中の能力値再計算を無効化
        // refreshは非常に重い処理なので、最適化中は一時的に何もしない関数に置き換えます。
        const originalRefresh = this.refresh;
        this.refresh = function() {};

        const maxSlots = this.equipSlots().length;

        // 2. 最適化対象の装備をすべて外す
        for (let i = 0; i < maxSlots; i++) {
            const item = this.equips()[i];
            if (item && Potadra_meta(item.meta, SkipOptimize)) {
                continue;
            }
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }

        // 3. 最強装備を決定（2回実行して依存関係を解決）
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < maxSlots; i++) {
                if (this.isEquipChangeOk(i)) {
                    const best_equip_item = this.bestEquipItem(i);
                    if (best_equip_item) {
                        this.changeEquip(i, this.bestEquipItem(i));
                    }
                }
            }
        }

        // 4. 処理を元に戻し、最後に一度だけ能力値を再計算
        this.refresh = originalRefresh;
        this.refresh();
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
