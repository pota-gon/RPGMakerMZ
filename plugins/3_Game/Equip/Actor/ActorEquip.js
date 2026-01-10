/*:
@plugindesc
アクター装備 Ver1.0.4(2025/7/22)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Equip/Actor/ActorEquip.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.4: bestEquipItemの処理を共通化
* Ver1.0.3: エラーが発生するバグ修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
装備のメモ欄にアクターを装備できる機能を追加します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

@param ActorEquip
@text 仲間タグ
@desc アクター装備とするメモ欄タグの名称
デフォルトは 仲間
@default 仲間

@param Only
@text Onlyタグ
@desc 1つしか装備できない防具のメモ欄タグの名称
デフォルトは Only
@default Only
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



    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (id === null || id === undefined) return val;
        let cache = Potadra__searchCache_get(data);
        if (!cache) {
            cache = {};
            Potadra__searchCache_set(data, cache);
        }
        const key = `${search_column}:${id}`;
        if (key in cache) {
            const entry = cache[key];
            return column ? entry?.[column] ?? val : entry;
        }
        let result = val;
        for (let i = initial; i < data.length; i++) {
            const item = data[i];
            if (!item) continue;
            if (search_column && item[search_column] == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
            if (!search_column && i == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
        }
        cache[key] = val;
        return val;
    }
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }


    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const ActorEquip = String(params.ActorEquip || '仲間');
    const Only       = String(params.Only || 'Only');

    // アクター装備
    function actorEquip(item) {
        let actor = false;
        if (item) {
            const actorName = Potadra_meta(item.meta, ActorEquip);
            if (actorName) {
                const actorId = Potadra_nameSearch($dataActors, actorName.trim());
                if (actorId) {
                    actor = $gameActors.actor(actorId);
                }
            }
        }
        return actor;
    }

    /**
     * 通常能力値の加算値取得
     *
     * @param {number} paramId - 能力値ID
     * @returns {number} 通常能力値の加算値
     */
    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        let value = _Game_Actor_paramPlus.apply(this, arguments);
        for (const item of this.equips()) {
            if (item) {
                const actor = actorEquip(item);
                if (actor) value += actor.param(paramId);
            }
        }
        return value;
    };

    /**
     * 特徴を保持する全オブジェクトの配列取得
     *
     * @returns {array} 特徴を保持する全オブジェクトの配列
     */
    const _Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;
    Game_Actor.prototype.traitObjects = function() {
        const objects = _Game_Actor_traitObjects.apply(this, arguments);
        for (const item of this.equips()) {
            if (item) {
                const actor = actorEquip(item);
                if (actor) objects.push(actor.actor());
            }
        }
        return objects;
    };

    /**
     * パーティとアイテムを交換する
     *
     * @param {RPG.EquipItem} newItem - パーティから取り出すアイテム
     * @param {RPG.EquipItem} oldItem - パーティに返すアイテム
     * @returns {boolean} 交換の成否
     */
    const _Game_Actor_tradeItemWithParty = Game_Actor.prototype.tradeItemWithParty;
    Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
        const value = _Game_Actor_tradeItemWithParty.apply(this, arguments);
        if (value) {
            let actor = actorEquip(oldItem);
            if (actor) {
                $gameParty.addActor(actor.actorId());
            }
            actor = actorEquip(newItem);
            if (actor) {
                $gameParty.removeActor(actor.actorId());
            }
        }
        return value;
    };

    // アクターの装備可能判定
    function checkActor(actorId, etypeId, item) {
        if (item && item.etypeId === etypeId) {
            const actor = actorEquip(item);
            if (actor) {
                // 自分と同じアクターは装備できない
                if (actorId === actor.actorId()) return false;

                // アクターを装備しているアクターは候補にしない
                for (const item of $gameActors._data[actor.actorId()].equips()) {
                    if (item) {
                        const equip_actor = actorEquip(item);
                        if (equip_actor) return false;
                    }
                }
            }
        }
        return true;
    }

    // 固定装備
    function onlyEquip(actor, item) {
        if (item && Potadra_meta(item.meta, Only) && actor.isEquipped(item)) {
            return false;
        }
        return true;
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
        if (value === true) {
            value = checkActor(this._actor.actorId(), this.etypeId(), item);

            // 固定装備
            if (value === true) value = onlyEquip(this._actor, item);
        }
        return value;
    };

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
        return items.filter(item => checkActor(this.actorId(), etypeId, item) && onlyEquip(this, item));
    };
})();
