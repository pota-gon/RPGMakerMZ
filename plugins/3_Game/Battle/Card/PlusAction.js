/*:
@plugindesc
敵キャラMP・TP枯渇行動 Ver1.0.0(2025/10/4)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Card/PlusAction.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
敵キャラのMPとTPが尽きるまで、行動させます

## 使い方
プラグインを導入すると  
敵キャラのMPとTPが尽きるまで、行動するようになります  
※ ただし、行動回数以上は行動できません

メモ欄に<行動回数無制限>を記載すると  
行動回数を超えて行動できるようになります

また、プラグインパラメータで  
最大行動回数ターン数を ターン数にする(true) にすると  
行動回数と合わせてターン数で行動を制御できるようになります

@param InfiniteMetaName
@text 行動回数無制限タグ
@desc 行動回数無制限に使うメモ欄タグの名称
デフォルトは 行動回数無制限
@default 行動回数無制限

@param MaxTurn
@type boolean
@text 最大行動回数ターン数
@desc 最大行動回数をターン数にするか
@on ターン数にする
@off ターン数にしない
@default false
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

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const InfiniteMetaName = String(params.InfiniteMetaName || "行動回数無制限");
    const MaxTurn          = Potadra_convertBool(params.MaxTurn);

    /**
     * 
     *
     * @param {} actionList - 
     */
    Game_Enemy.prototype.selectAllActions = function(actionList) {
        const ratingMax = Math.max(...actionList.map(a => a.rating));
        const ratingZero = ratingMax - 3;
        actionList = actionList.filter(a => a.rating > ratingZero);

        // スキルチェック
        let actions = [];
        const end_actions = [];
        for (const action of actionList) {
            const skill = $dataSkills[action.skillId];
            if (skill.mpCost === 0 && skill.tpCost === 0) {
                end_actions.push(action);
            } else {
                actions.push(action);
            }
        }

        // 通常スキルチェック
        let mpCost = 0;
        let tpCost = 0;
        let tmp_actions = [];
        let normal_actions = [];
        let i = this.numActions();

        // ターン数より行動回数が多い場合の制御
        if (MaxTurn && i > $gameTroop.turnCount()) {
            i = $gameTroop.turnCount();
        }

        const infinite = Potadra_meta(this.enemy().meta, InfiniteMetaName);
        while (actions.length > 0) {
            const action = this.selectAction(actions, ratingZero);
            const skill  = $dataSkills[action.skillId];
            normal_actions.push(action);

            mpCost += skill.mpCost;
            tpCost += skill.tpCost;

            tmp_actions = [];
            for (const a of actions) {
                const s = $dataSkills[a.skillId];
                const nextMpCost = mpCost + s.mpCost;
                const nextTpCost = tpCost + s.tpCost;
                if (this.mp >= nextMpCost && this.tp >= nextTpCost) {
                    tmp_actions.push(a);
                }
                actions = tmp_actions;
            }
            i--;
            if (!infinite && i <= 0) break;
        }

        let j = 0;
        for (const a of normal_actions) {
            let action = this.action(j);
            if (!action) {
                this._actions[j] = new Game_Action(this);
                action = this.action(j);
            }
            action.setEnemyAction(a);
            j++;
        }

        if (!infinite && i <= 0) return true;

        // 終了スキルチェック
        if (end_actions.length > 0) {
            let action = this.action(j);
            if (!action) {
                this._actions[j] = new Game_Action(this);
                action = this.action(j);
            }
            action.setEnemyAction(
                this.selectAction(end_actions, ratingZero)
            );
        }
    };
})();
