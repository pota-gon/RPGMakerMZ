/*:
@plugindesc
アクター装備 Ver1.0.1(2022/12/2)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Equip/ActorEquip.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- ヘルプ更新

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
装備のメモ欄にアクターを装備できる機能を追加します。

## 使い方
初期設定は必要ありません。  
プラグイン導入だけで動作します。

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
        if (!id) {
            return val;
        }
        for (let i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column) {
                if (data[i][search_column] == id) {
                    if (column) {
                        val = data[i][column];
                    } else {
                        val = data[i];
                    }
                    break;
                }
            } else if (i == id) {
                val = data[i];
                break;
            }
        }
        return val;
    }
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const ActorEquip = String(params.ActorEquip) || '仲間';
    const Only       = String(params.Only) || 'Only';

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
    Game_Actor.prototype.bestEquipItem = function(slotId) {
        const etypeId = this.equipSlots()[slotId];
        const items = $gameParty
            .equipItems()
            .filter(item => item.etypeId === etypeId && this.canEquip(item) && (checkActor(this.actorId(), etypeId, item)) && onlyEquip(this, item));
        let bestItem = null;
        let bestPerformance = -1000;
        for (let i = 0; i < items.length; i++) {
            const performance = this.calcEquipItemPerformance(items[i]);
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestItem = items[i];
            }
        }
        return bestItem;
    };
})();
