/*:
@plugindesc
装備スロット変更 Ver1.4.7(2025/7/22)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Equip/ChangeSlot.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.4.7: bestEquipItemの処理を共通化
* Ver1.4.6: リファクタリング(共通処理 Potadra_checkSystem を使うように修正)
* Ver1.4.5
- 装備タイプ名を指定出来る機能追加
- エラーが発生するバグ修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
装備スロットを複数設定可能にします

## 使い方
パラメータ(装備スロット)に装備タイプを設定することで  
装飾品を2つにするなど装備スロットを複数にすることが出来ます  
※ 導入時の設定は、装飾品が2つになる設定です

### 装備タイプの設定方法について
データベースの「タイプ」から設定できます  
以下は、設定を変更していない場合の番号です

1. 武器
2. 盾
3. 頭
4. 身体
5. 装飾品

### 種別タグについて
装飾品などで、兜・靴など同じ種別の装備は1つしか  
装備できないようにするためのメモ欄タグの名称

1. 装備タイプを 装飾品 など複数ある装備タイプにする  
2. メモ欄に <種別:兜> 等など、種別を記載する  
3. 装飾品の <種別:兜> は、1種類しか装備できなくなります

### 装備制限タグについて
強力な装備など一定数しか装備できないメモ欄タグの名称  
例: <装備制限:1> で1つしか装備できない装備にできます

@param Slots
@type string[]
@text 装備スロット
@desc 装備スロット()の番号か装備タイプ名を指定
装備タイプがデフォルトの場合は、1: 武器 5: 装飾品
@default ["武器", "盾", "頭", "身体", "装飾品", "装飾品"]

@param FixStatusEquipOver
@type boolean
@text 装備タイプバグ修正
@desc 装備タイプが7個以上あるときステータスの
装備に表示しきれないバグ修正(スクロールできるように修正)
@on 修正する
@off 修正しない
@default false

@param Slot
@type number
@text スロット列数
@desc スロットの列数
@default 1
@min 1

@param Type
@type combo
@text 種別タグ
@desc 装飾品などで、兜・靴など同じ種別の装備は1つしか
装備できないようにするためのメモ欄タグの名称<種別:兜>
@default 種別
@option 種別

@param Limit
@type combo
@text 装備制限タグ
@desc 強力な装備など一定数しか装備できないメモ欄タグの名称
例: <装備制限:1> で1つしか装備できない装備にできます
@default 装備制限
@option 装備制限
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    const best_equip_item_smlx_skill_label = Potadra_isPlugin('SMLXSkillLabel');
    const best_equip_item_change_slot      = Potadra_isPlugin('ChangeSlot');
    const best_equip_item_actor_equip      = Potadra_isPlugin('ActorEquip');
    const best_equip_item_unique_equip     = Potadra_isPlugin('UniqueEquip');
    if (best_equip_item_smlx_skill_label || best_equip_item_change_slot || best_equip_item_actor_equip || best_equip_item_unique_equip) {
        function normal_performance(actor, items) {
            let bestItem = null;
            let bestPerformance = -1000;
            for (let i = 0; i < items.length; i++) {
                const performance = actor.calcEquipItemPerformance(items[i]);
                if (performance > bestPerformance) {
                    bestPerformance = performance;
                    bestItem = items[i];
                }
            }
            return bestItem;
        }
        function same_performance(actor, items) {
            let bestItem = null;
            let bestPerformance = -1000;
            let same_items = [];
            for (let i = 0; i < items.length; i++) {
                const performance = actor.calcEquipItemPerformance(items[i]);
                if (performance > bestPerformance) {
                    bestPerformance = performance;
                    bestItem = items[i];
                    same_items = [];
                } else if (performance === bestPerformance) {
                    same_items.push(items[i]);
                }
            }
            if (same_items.length > 0) {
                bestItem = same_items[Math.floor(Math.random() * same_items.length)];
            }
            return bestItem;
        }
        Game_Actor.prototype.bestEquipItem = function(slotId) {
            const etypeId = this.equipSlots()[slotId];
            const items = this.PotadraEquipItems(slotId, etypeId);
            let bestItem = null;
            if (best_equip_item_unique_equip) {
                bestItem = same_performance(this, items);
            } else {
                bestItem = normal_performance(this, items);
            }
            return bestItem;
        };
    }
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_checkSystem(data, name, val = false) {
        if (isNaN(name)) {
            for (let i = 1; i < data.length; i++) {
                if (name === data[i]) {
                    return i;
                }
            }
            return val;
        }
        return Number(name || val);
    }
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_stringArray(data) {
        return data ? JSON.parse(data).map(String) : [];
    }
    function Potadra_convertBool(bool) {
        if (bool === "false" || bool === '' || bool === undefined) {
            return false;
        } else {
            return true;
        }
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
    const Slots              = Potadra_stringArray(params.Slots);
    const FixStatusEquipOver = Potadra_convertBool(params.FixStatusEquipOver);
    const Slot               = Number(params.Slot || 0);
    const Type               = String(params.Type || '種別');
    const Limit              = String(params.Limit || '装備制限');

    /**
     * アクターを扱うクラスです。
     * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
     * Game_Party クラス（$gameParty）からも参照されます。
     *
     * @class
     */

    /**
     * 装備スロットの配列を取得
     *
     * @returns {array} 装備スロットの配列
     */
    Game_Actor.prototype.equipSlots = function() {
        const slots = [];
        for (let i = 0; i < Slots.length; i++) {
            slots.push(Potadra_checkSystem($dataSystem.equipTypes, Slots[i]));
        }

        if (slots.length >= 2 && this.isDualWield()) {
            slots[1] = 1;
        }

        return slots;
    };

    // 装備タイプバグ修正
    if (FixStatusEquipOver) {
        /**
         * オブジェクト初期化
         *     info_viewport : 情報表示用ビューポート
         *
         * @param {} rect -
         */
        const _Window_StatusEquip_initialize = Window_StatusEquip.prototype.initialize;
        Window_StatusEquip.prototype.initialize = function(rect) {
            _Window_StatusEquip_initialize.apply(this, arguments);
            this.refresh();
            this.select(0);
            this.activate();
        };
    }

    // 装備スロット列変更
    if (Slot > 1) {
        /**
         * 
         *
         * @returns {} 
         */
        Window_EquipSlot.prototype.slotNameWidth = function() {
            return 138 / Slot;
        };

        /**
         * 桁数の取得
         *
         * @returns {} 
         */
        Window_EquipSlot.prototype.maxCols = function() {
            return Slot;
        };
    }

    /**
     * アイテムをリストに含めるかどうか
     *
     * @param {} item - 
     * @returns {} 
     */
    const _Window_EquipItem_includes = Window_EquipItem.prototype.includes;
    Window_EquipItem.prototype.includes = function(item) {
        let value = _Window_EquipItem_includes.apply(this, arguments);
        if (value === true && item) {
            // 種別装備チェック
            value = canEquipType(this._actor, item, this._slotId);

            // 装備制限チェック
            if (value === true) value = catEquipLimit(this._actor, item);
        }
        return value;
    };

    // 種別装備チェック
    function canEquipType(actor, item, slotId) {
        const item_type = Potadra_meta(item.meta, Type);

        if (item_type) {
            const equips = actor.equips();
            for (let i = 0; i < equips.length; i++) {
                const equip_item = equips[i];
                if (equip_item && i !== slotId) {
                    const equip_item_type = Potadra_meta(equip_item.meta, Type);
                    if (equip_item_type && item_type === equip_item_type) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    // 装備制限チェック
    function catEquipLimit(actor, item) {
        const item_limit_str = Potadra_meta(item.meta, Limit);
        let limit_count = 1;

        if (item_limit_str) {
            const item_limit = Number(item_limit_str);
            for (const equip_item of actor.equips()) {
                if (equip_item && equip_item === item) {
                    limit_count++;
                    if (limit_count > item_limit) return false;
                }
            }
        }

        return true;
    }

    /**
     * 指定スロットの最強装備を返す
     *
     * @param {number} slotId - スロットID
     * @returns {} 
     */
    // 元の PotadraEquipItems 保持
    if (typeof Game_Actor.prototype.PotadraEquipItems !== 'function') {
        Game_Actor.prototype.PotadraEquipItems = function(slotId, etypeId) {
            return $gameParty.equipItems().filter(item => item.etypeId === etypeId && this.canEquip(item));
        };
    }
    const _Game_Actor_PotadraEquipItems = Game_Actor.prototype.PotadraEquipItems;
    Game_Actor.prototype.PotadraEquipItems = function(slotId, etypeId) {
        const items = _Game_Actor_PotadraEquipItems.apply(this, arguments);
        return items.filter(item => canEquipType(this, item, slotId) && catEquipLimit(this, item));
    };
})();
