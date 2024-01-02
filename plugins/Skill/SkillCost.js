/*:
@plugindesc
スキルコスト Ver0.7.4(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Skill/SkillCost.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 検索時のバグ修正
- meta データの取得処理を修正
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

・TODO
- MP消費率を割合消費に含めるか検討
- HPが0になるときに使用できるかを切り替える機能追加
- ヘルプ更新

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
様々なスキル拡張機能を追加します

## 使い方
<HP消費: 100>  
=> 現在の HP -100

<HP割合消費: 10%>  
=> 現在の HP -10%

<MP割合消費: 100%>  
=> マダンテ

<MaxHP割合消費: 100%>  
=> MHP -100%

<MaxMP割合消費: 10%>  
=> MMP -10%

<所持金消費: 10000>  
=> 通貨単位は不要

<アイテム消費: アイテムID,消費数>  
<武器消費: 武器ID,消費数>  
<防具消費: 防具ID,消費数>  
<アイテム名消費: アイテム名,消費数>

@param FixSkillCostSize
@type boolean
@text スキルコストサイズバグ修正
@desc 消費MPが4桁かつ、名前が長いスキルの
表示がおかしくなる問題修正(3桁 => 4桁に修正)
@on 修正する
@off 修正しない
@default true

@param ItemCostName
@text アイテムコスト個数名
@desc アイテムコストの個数名
デフォルトは 個
@default 個

@param HpCostColor
@type number
@text 消費HP文字色
@desc 消費HPの文字色(0 ～ 31)を指定します
@default 21
@min 0
@max 31

@param GoldCostColor
@type number
@text 消費所持金文字色
@desc 消費所持金の文字色(0 ～ 31)を指定します
@default 14
@min 0
@max 31

@param ItemCostColor
@type number
@text 消費アイテム文字色
@desc 消費アイテムの文字色(0 ～ 31)を指定します
@default 0
@min 0
@max 31

@param HpCostMetaName
@text HP消費タグ
@desc HP消費に使うメモ欄タグの名称
デフォルトは HP消費
@default HP消費

@param GoldCostMetaName
@text 所持金消費タグ
@desc 所持金消費に使うメモ欄タグの名称
デフォルトは 所持金消費
@default 所持金消費

@param ItemCostMetaName
@text アイテム消費タグ
@desc アイテム消費に使うメモ欄タグの名称
デフォルトは アイテム消費
@default アイテム消費

@param WeaponCostMetaName
@text 武器消費タグ
@desc 武器消費に使うメモ欄タグの名称
デフォルトは 武器消費
@default 武器消費

@param ArmorCostMetaName
@text 防具消費タグ
@desc 防具消費に使うメモ欄タグの名称
デフォルトは 防具消費
@default 防具消費

@param ItemNameCostMetaName
@text アイテム名消費タグ
@desc アイテム名消費に使うメモ欄タグの名称
デフォルトは アイテム名消費
@default アイテム名消費

@param ItemRateCostMetaName
@text アイテム割合消費タグ
@desc アイテム割合消費に使うメモ欄タグの名称
デフォルトは アイテム割合消費
@default アイテム割合消費

@param WeaponRateCostMetaName
@text 武器割合消費タグ
@desc 武器割合消費に使うメモ欄タグの名称
デフォルトは 武器割合消費
@default 武器割合消費

@param ArmorRateCostMetaName
@text 防具割合消費タグ
@desc 防具割合消費に使うメモ欄タグの名称
デフォルトは 防具割合消費
@default 防具割合消費

@param ItemNameRateCostMetaName
@text アイテム名割合消費タグ
@desc アイテム名割合消費に使うメモ欄タグの名称
デフォルトは アイテム名割合消費
@default アイテム名割合消費

@param HpRateCostMetaName
@text HP割合消費タグ
@desc HP割合消費に使うメモ欄タグの名称
デフォルトは HP割合消費
@default HP割合消費

@param MpRateCostMetaName
@text MP割合消費タグ
@desc MP割合消費に使うメモ欄タグの名称
デフォルトは MP割合消費
@default MP割合消費

@param GoldRateCostMetaName
@text 所持金割合消費タグ
@desc 所持金割合消費に使うメモ欄タグの名称
デフォルトは 所持金割合消費
@default 所持金割合消費

@param MaxHpRateCostMetaName
@text MaxHP割合消費タグ
@desc MaxHP割合消費に使うメモ欄タグの名称
デフォルトは MaxHP割合消費
@default MaxHP割合消費

@param MaxMpRateCostMetaName
@text MaxMP割合消費タグ
@desc MaxMP割合消費に使うメモ欄タグの名称
デフォルトは MaxMP割合消費
@default MaxMP割合消費
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
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) {
                return data.map(datum => datum.trim());
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
    function Potadra_itemSearch(name, column = false, search_column = "name", val = false, initial = 1) {
        const item = Potadra_search($dataItems, name, column, search_column, val, initial);
        if (item) {
            return item;
        }
        const weapon = Potadra_search($dataWeapons, name, column, search_column, val, initial);
        if (weapon) {
            return weapon;
        }
        const armor = Potadra_search($dataArmors, name, column, search_column, val, initial);
        if (armor) {
            return armor;
        }
        return false;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const FixSkillCostSize         = Potadra_convertBool(params.FixSkillCostSize);
    const ItemCostName             = String(params.ItemCostName) || '個';
    const HpCostColor              = Number(params.HpCostColor || 21);
    const GoldCostColor            = Number(params.GoldCostColor || 14);
    const ItemCostColor            = Number(params.ItemCostColor || 0);
    const HpCostMetaName           = String(params.HpCostMetaName) || 'HP消費';
    const GoldCostMetaName         = String(params.GoldCostMetaName) || '所持金消費';
    const ItemCostMetaName         = String(params.ItemCostMetaName) || 'アイテム消費';
    const WeaponCostMetaName       = String(params.WeaponCostMetaName) || '武器消費';
    const ArmorCostMetaName        = String(params.ArmorItemCostMetaName) || '防具消費';
    const ItemNameCostMetaName     = String(params.ItemNameCostMetaName) || 'アイテム名消費';
    const HpRateCostMetaName       = String(params.HpRateCostMetaName) || 'HP割合消費';
    const MpRateCostMetaName       = String(params.MpRateCostMetaName) || 'MP割合消費';
    const GoldRateCostMetaName     = String(params.GoldRateCostMetaName) || '所持金割合消費';
    const ItemRateCostMetaName     = String(params.ItemRateCostMetaName) || 'アイテム割合消費';
    const WeaponRateCostMetaName   = String(params.WeaponRateCostMetaName) || '武器割合消費';
    const ArmorRateCostMetaName    = String(params.ArmorItemRateCostMetaName) || '防具割合消費';
    const ItemNameRateCostMetaName = String(params.ItemNameRateCostMetaName) || 'アイテム名割合消費';
    const MaxHpRateCostMetaName    = String(params.MaxHpRateCostMetaName) || 'MaxHP割合消費';
    const MaxMpRateCostMetaName    = String(params.MaxMpRateCostMetaName) || 'MaxMP割合消費';

    // スキルコストサイズバグ修正
    if (FixSkillCostSize) {
        /**
         * 
         *
         * @returns {} 
         */
        Window_SkillList.prototype.costWidth = function() {
            return this.textWidth("0000");
        };
    }

    /**
     * 消費HP文字色の取得
     *
     * @returns {} 
     */
    ColorManager.hpCostColor = function() {
        return this.textColor(HpCostColor);
    };

    /**
     * 消費所持金文字色の取得
     *
     * @returns {} 
     */
    ColorManager.goldCostColor = function() {
        return this.textColor(GoldCostColor);
    };

    /**
     * 消費アイテム文字色の取得
     *
     * @returns {} 
     */
    ColorManager.itemCostColor = function() {
        return this.textColor(ItemCostColor);
    };

    // 割合消費が 0 のときに 1 に切り上げ
    function ceilZeroCost(value, rate_cost, now_cost) {
        let cost = value * (parseFloat(rate_cost) / 100);

        // 現在のコストと割合消費のコストが 1 未満のときは、消費を 1 にする(無限に使用できないようにする)
        if (now_cost < 1 && cost < 1) {
            return 1;
        }

        return Math.floor(cost);
    }


    //==============================================================================
    // Game_BattlerBase
    //==============================================================================

    /**
     * 
     */
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.apply(this, arguments);
        this._item = null;
    };

    /**
     * スキルの消費 HP 計算
     *
     * @param {} skill - 
     * @returns {} 
     */
    Game_BattlerBase.prototype.skillHpCost = function(skill) {
        let cost = 0;
        const hp_cost          = Potadra_meta(skill.meta, HpCostMetaName);
        const hp_rate_cost     = Potadra_meta(skill.meta, HpRateCostMetaName);
        const max_hp_rate_cost = Potadra_meta(skill.meta, MaxHpRateCostMetaName);
        if (hp_cost) { // HP消費
            cost += Number(hp_cost || 0);
        }
        if (hp_rate_cost) { // HP割合消費
            cost += ceilZeroCost(this.hp, hp_rate_cost, cost);
        }
        if (max_hp_rate_cost) { // MaxHP割合消費
            cost += ceilZeroCost(this.mhp, max_hp_rate_cost, cost);
        }
        return Math.floor(cost);
    };

    /**
     * スキルの消費 MP 計算
     *
     * @param {} skill - 
     * @returns {} 
     */
    const _Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        let cost = _Game_BattlerBase_skillMpCost.apply(this, arguments);
        const mp_rate_cost     = Potadra_meta(skill.meta, MpRateCostMetaName);
        const max_mp_rate_cost = Potadra_meta(skill.meta, MaxMpRateCostMetaName);
        if (mp_rate_cost) { // MP割合消費
            cost += ceilZeroCost(this.mp, mp_rate_cost, cost);
        }
        if (max_mp_rate_cost) { // MaxMP割合消費
            cost += ceilZeroCost(this.mmp, max_mp_rate_cost, cost);
        }
        return Math.floor(cost);
    };

    /**
     * スキルの消費 所持金 計算
     *
     * @param {} skill - 
     * @returns {} 
     */
    Game_BattlerBase.prototype.skillGoldCost = function(skill) {
        let cost = 0;
        const gold_cost      = Potadra_meta(skill.meta, GoldCostMetaName);
        const gold_rate_cost = Potadra_meta(skill.meta, GoldRateCostMetaName);
        if (gold_cost) { // 所持金消費
            cost += Number(gold_cost || 0);
        }
        if (gold_rate_cost) { // 所持金割合消費
            cost += ceilZeroCost($gameParty.gold(), gold_rate_cost, cost);
        }
        return Math.floor(cost);
    };

    /**
     * スキルの消費 アイテム 計算
     *
     * @param {} skill - 
     * @returns {} 
     */
    Game_BattlerBase.prototype.skillItemCost = function(skill) {
        let cost = 0;
        const item_cost           = Potadra_metaData(skill.meta[ItemCostMetaName], ',');
        const weapon_cost         = Potadra_metaData(skill.meta[WeaponCostMetaName], ',');
        const armor_cost          = Potadra_metaData(skill.meta[ArmorCostMetaName], ',');
        const item_name_cost      = Potadra_metaData(skill.meta[ItemNameCostMetaName], ',');
        const item_rate_cost      = Potadra_metaData(skill.meta[ItemRateCostMetaName], ',');
        const weapon_rate_cost    = Potadra_metaData(skill.meta[WeaponRateCostMetaName], ',');
        const armor_rate_cost     = Potadra_metaData(skill.meta[ArmorRateCostMetaName], ',');
        const item_name_rate_cost = Potadra_metaData(skill.meta[ItemNameRateCostMetaName], ',');
        if (item_cost) { // アイテム消費
            this._item = $dataItems[Number(item_cost[0])];
            cost += Number(item_cost[1] || 0);
        }
        if (weapon_cost) { // 武器消費
            this._item = $dataWeapons[Number(weapon_cost[0])];
            cost += Number(weapon_cost[1] || 0);
        }
        if (armor_cost) { // 防具消費
            this._item = $dataArmors[Number(armor_cost[0])];
            cost += Number(armor_cost[1] || 0);
        }
        if (item_name_cost) { // アイテム名消費
            this._item = Potadra_itemSearch(item_name_cost[0].trim());
            cost += Number(item_name_cost[1] || 0);
        }
        if (item_rate_cost) { // アイテム割合消費
            this._item = $dataItems[Number(item_rate_cost[0])];
            cost += ceilZeroCost($gameParty.numItems(this._item), item_rate_cost[1], cost);
        }
        if (weapon_rate_cost) { // 武器割合消費
            this._item = $dataWeapons[Number(weapon_rate_cost[0])];
            cost += ceilZeroCost($gameParty.numItems(this._item), weapon_rate_cost[1], cost);
        }
        if (armor_rate_cost) { // 防具割合消費
            this._item = $dataArmors[Number(armor_rate_cost[0])];
            cost += ceilZeroCost($gameParty.numItems(this._item), armor_rate_cost[1], cost);
        }
        if (item_name_rate_cost) { // アイテム名割合消費
            this._item = Potadra_itemSearch(item_name_rate_cost[0].trim());
            cost += ceilZeroCost($gameParty.numItems(this._item), item_rate_cost[1], cost);
        }
        return Math.floor(cost);
    };

    /**
     * スキル使用コストの支払い
     *
     * @param {} skill - 
     */
    const _Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        _Game_BattlerBase_paySkillCost.apply(this, arguments);
        this._hp -= this.skillHpCost(skill);
        $gameParty.loseGold(this.skillGoldCost(skill));
        if (this._item) {
            $gameParty.loseItem(this._item, this.skillItemCost(skill), false);
        }
    };

    /**
     * スキル使用コストの支払い可能判定
     *
     * @param {} skill - 
     */
    const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        const value = _Game_BattlerBase_canPaySkillCost.apply(this, arguments);
        return (
            value &&
            this.canPaySkillCommonCost(skill, this._mp, this.skillMpCost(skill), null, MpRateCostMetaName, MaxMpRateCostMetaName) &&
            this.canPaySkillCommonCost(skill, this._hp, this.skillHpCost(skill), HpCostMetaName, HpRateCostMetaName, MaxHpRateCostMetaName) &&
            this.canPaySkillCommonCost(skill, $gameParty.gold(), this.skillGoldCost(skill), GoldCostMetaName, GoldRateCostMetaName, null) &&
            this.canPaySkillItemCost(skill)
        );
    };

    /**
     * スキル使用共通コストの支払い可能判定
     *
     * @param {} skill - 
     * @param {number} param - 
     * @param {number} cost - 
     * @param {string} meta_name - 
     * @param {string} rate_meta_name - 
     * @param {string} max_meta_name - 
     */
    Game_BattlerBase.prototype.canPaySkillCommonCost = function(skill, param, cost, meta_name, rate_meta_name, max_meta_name) {
        const normal_cost = Potadra_meta(skill.meta, meta_name);
        const rate_cost   = Potadra_meta(skill.meta, rate_meta_name);
        const max_cost    = Potadra_meta(skill.meta, max_meta_name);
        if (rate_cost) {
            return param > 0 && param >= cost;
        } else if (normal_cost || max_cost) {
            return param >= cost;
        } else {
            return true;
        }
    };

    /**
     * スキル使用アイテムコストの支払い可能判定
     *
     * @param {} skill - 
     */
    Game_BattlerBase.prototype.canPaySkillItemCost = function(skill) {
        const cost                = this.skillItemCost(skill);
        const item_cost           = Potadra_metaData(skill.meta[ItemCostMetaName], ',');
        const weapon_cost         = Potadra_metaData(skill.meta[WeaponCostMetaName], ',');
        const armor_cost          = Potadra_metaData(skill.meta[ArmorCostMetaName], ',');
        const item_name_cost      = Potadra_metaData(skill.meta[ItemNameCostMetaName], ',');
        const item_rate_cost      = Potadra_metaData(skill.meta[ItemRateCostMetaName], ',');
        const weapon_rate_cost    = Potadra_metaData(skill.meta[WeaponRateCostMetaName], ',');
        const armor_rate_cost     = Potadra_metaData(skill.meta[ArmorRateCostMetaName], ',');
        const item_name_rate_cost = Potadra_metaData(skill.meta[ItemNameRateCostMetaName], ',');
        if (item_rate_cost || weapon_rate_cost || armor_rate_cost || item_name_rate_cost) {
            return $gameParty.numItems(this._item) > 0 && $gameParty.numItems(this._item) >= cost;
        } else if (item_cost || weapon_cost || armor_cost || item_name_cost) {
            return $gameParty.numItems(this._item) >= cost;
        } else {
            return true;
        }
    };


    //==============================================================================
    // Window_SkillList
    //==============================================================================

    /**
     * 項目の描画
     *
     * @param {} index - 
     */
    Window_SkillList.prototype.drawItem = function(index) {
        const skill = this.itemAt(index);
        if (skill) {
            const costWidth = this.costSkillWidth(skill);
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    /**
     * スキルの使用コストを描画
     *
     * @param {} skill - 
     * @param {} x - 
     * @param {} y - 
     * @param {} width - 
     */
    Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
        if (this._actor.skillTpCost(skill) > 0) {
            this.changeTextColor(ColorManager.tpCostColor());
            this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
        } else if (this._actor.skillMpCost(skill) > 0) {
            this.changeTextColor(ColorManager.mpCostColor());
            this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
        } else if (this._actor.skillHpCost(skill) > 0) {
            this.changeTextColor(ColorManager.hpCostColor());
            this.drawText(this._actor.skillHpCost(skill), x, y, width, "right");
        } else if (this._actor.skillGoldCost(skill) > 0) {
            this.changeTextColor(ColorManager.goldCostColor());
            this.drawText(this._actor.skillGoldCost(skill) + '/' + $gameParty.gold() + TextManager.currencyUnit, x, y, width, "right");
        } else if (this._actor.skillItemCost(skill) > 0) {
            this.changeTextColor(ColorManager.itemCostColor());
            this.drawText(this._actor.skillItemCost(skill) + '/' + $gameParty.numItems(this._actor._item) + ItemCostName, x, y, width, "right");
        }
    };

    /**
     * 
     *
     * @returns {} 
     */
    Window_SkillList.prototype.costSkillWidth = function(skill) {
        let cost = "000";

        // スキルコストサイズバグ修正
        if (FixSkillCostSize) {
            cost = "0000";
        }

        if (this._actor.skillTpCost(skill) > 0) {
            cost = this._actor.skillTpCost(skill);
        } else if (this._actor.skillMpCost(skill) > 0) {
            cost = this._actor.skillMpCost(skill);
        } else if (this._actor.skillHpCost(skill) > 0) {
            cost = this._actor.skillHpCost(skill);
        } else if (this._actor.skillGoldCost(skill) > 0) {
            cost = this._actor.skillGoldCost(skill) + '/' + $gameParty.gold() + TextManager.currencyUnit;
        } else if (this._actor.skillItemCost(skill) > 0) {
            cost = this._actor.skillItemCost(skill) + '/' + $gameParty.numItems(this._actor._item) + ItemCostName;
        }
        return this.textWidth(cost);
    };
})();
