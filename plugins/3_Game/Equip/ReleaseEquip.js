/*:
@plugindesc
装備解放 Ver1.0.3(2025/5/29)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Equip/ReleaseEquip.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.3: リファクタリング(共通処理 Potadra_checkSystem を使うように修正)
* Ver1.0.2: リファクタリング(_stateSteps を states を使うように修正)
* Ver1.0.1: meta データの取得処理を修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
装備封印よりも強力な装備解放機能を追加します

## 使い方
アクター・職業・武器・防具・ステートのメモ欄に  
ID指定の場合 <装備解放: 2> や <装備解放: 盾> などを記載します  
すると、装備封印で封印されている装備も装備出来るようになります

例: 大剣を片手で持つ大男などを実現できるようになります

@param ReleaseEquipMetaName
@text 装備解放タグ
@desc 装備解放に使うメモ欄タグの名称
デフォルトは 装備解放
@default 装備解放
*/
(() => {
    'use strict';

    // ベースプラグインの処理
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
    const ReleaseEquipMetaName = String(params.ReleaseEquipMetaName || '装備解放');

    // 装備解放の有無判定
    function isReleaseEquip(etypeId, meta) {
        const etype = Potadra_meta(meta, ReleaseEquipMetaName);
        return Potadra_checkSystem($dataSystem.equipTypes, etype) === etypeId;
    }

    /**
     * 装備封印の判定
     *
     * @param {} etypeId - 
     * @returns {} 
     */
    Game_Actor.prototype.isEquipTypeSealed = function(etypeId) {
        // 装備解放の判定(アクター)
        if (isReleaseEquip(etypeId, this.actor().meta)) return false;

        // 装備解放の判定(職業)
        if (isReleaseEquip(etypeId, this.currentClass().meta)) return false;

        // 装備解放の判定(武器・防具)
        for (const item of this.equips()) {
            if (item && isReleaseEquip(etypeId, item.meta)) return false;
        }

        // 装備解放の判定(ステート)
        for (const state of this.states()) {
            if (state && isReleaseEquip(etypeId, state.meta)) return false;
        }

        // 装備封印の判定
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).includes(etypeId);
    };
})();
