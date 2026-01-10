/*:
@plugindesc
転生アイテム Ver1.2.1(2023/12/9)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Item/ReincarnationItem.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.2.1
- リファクタリング
- ヘルプ修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
メモ欄のタグで指定したレベルで使用可能になる転生アイテムを追加します

## 使い方
1. 転生用アイテムを作成します  
2. アイテムのメモ欄に以下のメモを記載します  
※ スキルに設定すると転生用スキルを作成することができます

<転生:99,1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1>
=> 転生の設定を
転生可能Lv,転生後Lv,最大HP,最大MP,攻撃力,防御力,魔法力,魔法防御,敏捷性,運
で指定します

・転生可能Lv  
転生可能になるレベルを指定します

・転生後Lv  
転生アイテムを使った後のレベルを指定します

・最大HP  
転生後に加算される最大HPを指定します  
転生後、アクターの最大HP × このパラメータ が加算されます

・最大MP  
転生後に加算される最大MPを指定します  
転生後、アクターの最大MP × このパラメータ が加算されます

・攻撃力  
転生後に加算される攻撃力を指定します  
転生後、アクターの攻撃力 × このパラメータ が加算されます

・防御力  
転生後に加算される防御力を指定します  
転生後、アクターの防御力 × このパラメータ が加算されます

・魔法力  
転生後に加算される魔法力を指定します  
転生後、アクターの魔法力 × このパラメータ が加算されます

・魔法防御  
転生後に加算される魔法防御を指定します  
転生後、アクターの魔法防御 × このパラメータ が加算されます

・敏捷性  
転生後に加算される敏捷性を指定します  
転生後、アクターの敏捷性 × このパラメータ が加算されます

・運  
転生後に加算される運を指定します  
転生後、アクターの運 × このパラメータ が加算されます

転生後の能力値の増加率のレートは、0.1 にすると  
現在の能力の 1/10 が加算されます

@param ReincarnationMetaName
@text 転生タグ
@desc 転生に使うメモ欄タグの名称
デフォルトは 転生
@default 転生
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const ReincarnationMetaName = String(params.ReincarnationMetaName || "転生");

    /**
     * アクション実行
     *
     * @param {} target - 
     */
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);
        applyReincarnation(this, target);
    };

    /**
     * 転生
     *
     * @param {} item - 
     * @param {} target - 
     */
    function applyReincarnation(action, target) {
        const item = action.item();
        const data = Potadra_metaData(item.meta[ReincarnationMetaName], ',');
        if (testApplyReincarnation(target, data)) {
            const LV  = Number(data[1] || 1);
            const MHP = Number(data[2] || 0.1);
            const MMP = Number(data[3] || 0.1);
            const ATK = Number(data[4] || 0.1);
            const DEF = Number(data[5] || 0.1);
            const MAT = Number(data[6] || 0.1);
            const MDF = Number(data[7] || 0.1);
            const AGI = Number(data[8] || 0.1);
            const LUK = Number(data[9] || 0.1);
            target.addParam(0, Math.floor(target.mhp * MHP));
            target.addParam(1, Math.floor(target.mmp * MMP));
            target.addParam(2, Math.floor(target.atk * ATK));
            target.addParam(3, Math.floor(target.def * DEF));
            target.addParam(4, Math.floor(target.mat * MAT));
            target.addParam(5, Math.floor(target.mdf * MDF));
            target.addParam(6, Math.floor(target.agi * AGI));
            target.addParam(7, Math.floor(target.luk * LUK));
            target.changeLevel(LV, false);
        }
        action.makeSuccess(target);
    }

    /**
     * アイテム使用可能判定
     *
     * @param {} target - 
     */
    const _Game_Action_testApply = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        const test_apply = _Game_Action_testApply.apply(this, arguments);
        return test_apply || testApplyReincarnation(target, this.item());
    };

    /**
     * 転生アイテム使用可能判定
     * アクターのレベル >= 転生アイテムのレベル で使用可能
     *
     * @param {} target - 
     * @param {} item - 
     */
    function testApplyReincarnation(target, data) {
        if (data) {
            return target.level >= Number(data[0]);
        } else {
            return false;
        }
    }
})();
