/*:
@plugindesc
アクター専用装備 Ver1.0.1(2026/1/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Equip/Actor/ActorSpecialEquip.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: 検索にキャッシュ追加
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
アクターの専用装備をメモから設定できます

## 使い方
アクター分、装備タイプを用意すると大変なので  
メモから設定できるようにしたプラグインです

1. アクター専用にしたい武器または防具を作成します
2. メモ欄に <アクター: ID OR 名前> のように設定します
   ※ 複数指定したい場合は、以下のように改行してください
   <アクター: 1
   2
リード>
3. 装備の判定をするときに指定したアクター以外は装備できなくなります

@param ActorMetaName
@text アクター専用タグ
@desc アクター専用に使うメモ欄タグの名称
デフォルトは アクター
@default アクター
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
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
    function Potadra_checkName(data, name, val = false) {
        if (isNaN(name)) {
            return Potadra_nameSearch(data, name.trim(), "id", "name", val);
        }
        return Number(name || val);
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const ActorMetaName = String(params.ActorMetaName || 'アクター');

    // アクター専用装備判定
    function actorSpecialEquip(meta, actor) {
        const actors = Potadra_metaData(meta[ActorMetaName]);
        if (!actors) return true;

        for (const actor_name of actors) {
            const actor_id = Potadra_checkName($dataActors, actor_name);
            if (actor_id === actor.actorId()) {
                return true;
            }
        }
        return false;
    }

    /**
     * 武器装備可能判定
     *
     * @param {} item - 
     */
    const _Game_BattlerBase_canEquipWeapon = Game_BattlerBase.prototype.canEquipWeapon;
    Game_BattlerBase.prototype.canEquipWeapon = function(item) {
        let value = _Game_BattlerBase_canEquipWeapon.apply(this, arguments);
        if (!value) return false;

        // アクター専用装備判定
        return actorSpecialEquip(item.meta, this);
    };

    /**
     * 防具装備可能判定
     *
     * @param {} item - 
     */
    const _Game_BattlerBase_canEquipArmor = Game_BattlerBase.prototype.canEquipArmor;
    Game_BattlerBase.prototype.canEquipArmor = function(item) {
        let value = _Game_BattlerBase_canEquipArmor.apply(this, arguments);
        if (!value) return false;

        // アクター専用装備判定
        return actorSpecialEquip(item.meta, this);
    };
})();
