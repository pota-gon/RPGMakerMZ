/*:
@plugindesc
クリティカルスキル Ver1.1.0(2026/1/23)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Skill/Add/CriticalSkill.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.1.0: 追加能力値の会心率を反映するように修正
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

### 追加能力値の会心率との組み合わせ
スキルで指定した会心率に、アクター・職業・装備・ステートの
追加能力値「会心率」が加算されます。

例: スキルの会心率が50%、装備やステートで会心率+20%の場合
    → 実際の会心率は70%になります

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
     * @param {Game_Battler} target - ターゲット
     */
    const _Game_Action_itemCri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function(target) {
        // クリティカルスキル判定
        const critical = Potadra_meta(this.item().meta, CriticalMetaName);
        if (critical) {
            // 基本会心率
            let criticalRate = Number(critical);
            
            // 使用者の追加能力値「会心率」を加算
            const subject = this.subject();
            if (subject) {
                // cri は会心率(0.0～1.0の値なので100倍してパーセントに変換)
                criticalRate += subject.cri * 100;
            }
            
            // 0～100%の範囲に制限
            criticalRate = Math.max(0, Math.min(100, criticalRate));
            
            return Potadra_random(criticalRate);
        }

        return _Game_Action_itemCri.apply(this, arguments);
    };
})();
