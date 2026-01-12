/*:
@plugindesc
クリティカルスキル Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Skill/Add/CriticalSkill.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
会心率を指定できるスキルを作成します

## 使い方
1. クリティカルスキルにしたいスキルを作成  
2. ダメージの会心をありに変更  
3. メモに <会心: 50> のように記載。(会心率が50%のスキルになる。)  
※ アイテムも同じように設定できます

@param CriticalMetaName
@text 会心タグ
@desc 会心に使うメモ欄タグの名称
デフォルトは 会心
@default 会心
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
    function Potadra_random(probability, rate = 1) {
        return Math.random() <= probability / 100 * rate;
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const CriticalMetaName = String(params.CriticalMetaName || '会心');

    /**
     * 会心判定
     *
     * @param {} target - 
     */
    const _Game_Action_itemCri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function(target) {
        // クリティカルスキル判定
        const critical = Potadra_meta(this.item().meta, CriticalMetaName);
        if (critical) return Potadra_random(Number(critical));

        return _Game_Action_itemCri.apply(this, arguments);
    };
})();
