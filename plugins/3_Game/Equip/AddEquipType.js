/*:
@plugindesc
装備タイプ追加 Ver1.0.0(2025/10/4)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Equip/AddEquipType.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
疑似的な装備タイプを任意に追加できます

## 使い方
このプラグインはメモの設定で、装備タイプを追加できます  
通常の装備タイプとは別なので、装備タイプの肥大化を防ぐことができます

1. 装備タイプを追加したい武器または防具を作成します

2. メモ欄に <装備タイプ判定: 名前> のように設定します
   複数指定したい場合は、以下のように改行してください
   <装備タイプ判定: 戦士
魔法戦士>
   ※ 複数指定したときは、装備タイプのどれかを持っていると装備できます
   上記例では、 <装備タイプ追加: 戦士> <装備タイプ追加: 魔法戦士> の
   どちらかが装備可能になります

3. アクター・職業・武器・防具・ステートのメモ欄に
   <装備タイプ追加: 名前> を追加します
   複数指定したい場合は、以下のように改行してください
   <装備タイプ追加: 僧侶
賢者>
   ※ 上記例では、"僧侶" と "賢者" の装備タイプが追加されます

4. <装備タイプ追加: 名前> で追加されてた状態のときのみ
   <装備タイプ判定: 名前> の装備が可能になります

@param AddEquipTypeMetaName
@text 装備タイプ追加タグ
@desc 装備タイプ追加に使うメモ欄タグの名称
デフォルトは 装備タイプ追加
@default 装備タイプ追加

@param CheckEquipTypeMetaName
@text 装備タイプ判定タグ
@desc 装備タイプ判定に使うメモ欄タグの名称
デフォルトは 装備タイプ判定
@default 装備タイプ判定
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

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const AddEquipTypeMetaName   = String(params.AddEquipTypeMetaName || '装備タイプ追加');
    const CheckEquipTypeMetaName = String(params.CheckEquipTypeMetaName || '装備タイプ判定');

    /**
     * 防具装備可能判定
     *
     * @param {} item - 
     */
    const _Game_BattlerBase_canEquipArmor = Game_BattlerBase.prototype.canEquipArmor;
    Game_BattlerBase.prototype.canEquipArmor = function(item) {
        let value = _Game_BattlerBase_canEquipArmor.apply(this, arguments);
        if (!value) return false;

        // 装備タイプ判定がある装備のみ判定
        const check_equip_types = Potadra_metaData(item.meta[CheckEquipTypeMetaName]);
        if (!check_equip_types) return value;

        let equip_types = [];

        // アクター
        const actor_equip_types = Potadra_metaData(this.actor().meta[AddEquipTypeMetaName]);
        if (actor_equip_types) {
            equip_types.push.apply(equip_types, actor_equip_types);
        }

        // 職業
        const klass = this.currentClass();
        const class_equip_types = Potadra_metaData(klass.meta[AddEquipTypeMetaName]);
        if (class_equip_types) {
            equip_types.push.apply(equip_types, class_equip_types);
        }

        // 武器・防具
        for (const equip of this.equips()) {
            if (equip) {
                const equip_equip_types = Potadra_metaData(equip.meta[AddEquipTypeMetaName]);
                if (equip_equip_types) {
                    equip_types.push.apply(equip_types, equip_equip_types);
                }
            }
        }

        // ステート
        for (const state of this.states()) {
            const state_equip_types = Potadra_metaData(state.meta[AddEquipTypeMetaName]);
            if (state_equip_types) {
                equip_types.push.apply(equip_types, state_equip_types);
            }
        }

        // 装備タイプ判定
        for (const check_equip_type of check_equip_types) {
            if (equip_types.includes(check_equip_type)) {
                return true;
            }
        }

        return false;
    };
})();
