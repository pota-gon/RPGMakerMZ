/*:
@plugindesc
プレスキル Ver1.1.2(2026/2/8)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Skill/Extend/PreSkills.js
@orderAfter Game_Action_Result
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.1.2
- スキル消費を0にする設定が正しく動いていないバグ修正
- ランダム処理のアルゴリズム変更
* Ver1.1.1: プラグインの有無でエラーになる問題を修正
* Ver1.1.0: 発動確率を設定出来る機能を追加
* Ver1.0.5: 敵キャラなどアクションが1つも設定されていないとエラーになるバグ修正
* Ver1.0.4: 元のスキルのコストが足りていない時もプレスキルが追加されるバグ修正
* Ver1.0.3: 単体対象のターゲットがおかしくなるバグ修正
* Ver1.0.2: 通常スキルが2回実行されるバグ修正
* Ver1.0.1: 競合対策を実施
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
スキル使用前に複数の準備スキルを発動する機能を提供します

## 使い方
1. データベースでスキルを作成します
2. スキルのメモ欄に、後述するタグを使って事前発動するスキルを設定します
   例1(単体): <プレスキル: 構え>
   例2(複数): <プレスキル: 
   構え
   集中
   気合い>
3. 戦闘中にそのスキルを使用すると、指定したスキルが先に順番に発動します
※ プレスキルも通常のスキルと同様の判定をするため
   無条件で発動するにはMPを0にしてください

## メモ欄タグ

### スキル用のタグ
スキルのメモ欄に記述して使用します

#### プレスキル
<プレスキル: スキルIDまたは名前>
または
<プレスキル: 
スキルIDまたは名前
スキルIDまたは名前
...>

このタグが設定されたスキルを使用する前に、
指定したスキルを同じ行動者が順番に先に使用します
スキル発動前に複数の準備動作を入れるような使い方ができます

例1(単体):
<プレスキル: 10> // ID10のスキルを先に発動

例2(複数):
<プレスキル: 
10
構え
集中> // ID10、構え、集中の順に先に発動

##### 発動確率の設定方法
スキルのメモ欄に以下の形式で記述します:

<プレスキル: 
スキル名, 確率(%)
スキル名, 確率(%)
...>

例:
<プレスキル: 
構え, 80
集中, 50>

確率を省略した場合は100%で発動:
<プレスキル: 構え>

## プラグインパラメータ

### プレスキルタグ
プレスキルを指定するためのメモ欄タグ名を指定します
デフォルト: プレスキル

### スキル消費を0にする設定
プラグインパラメータで以下を有効にすると、プレスキルの
消費(MP、TP、HP、所持金、アイテム)が0になります:

- プレスキル消費0: プレスキルの消費を0にする

@param PreSkillMetaName
@text プレスキルタグ
@desc プレスキルに使うメモ欄タグの名称
デフォルトは プレスキル
@default プレスキル

@param PreSkillCostZero
@type boolean
@text プレスキル消費0
@desc プレスキルのスキル消費を0にする
@on 0にする
@off 消費する
@default true
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    BattleManager.potadraSet = function (subject, action, targets, phase = false) {
        this._subject = subject;
        this._action = action;
        this._targets = targets;
        if (phase) this._phase = phase;
    }
    BattleManager.potadraSetPhase = function (phase) {
        this._phase = phase;
    }
    BattleManager.potadraSetSubject = function (subject) {
        this._subject = subject;
    };
    BattleManager.potadraSetAction = function (action) {
        this._action = action;
    };
    BattleManager.potadraSetTargets = function (targets) {
        this._targets = targets;
    };
    BattleManager.potadraInvokeAction = function(subject, target) {
        ExBattleManager.showLog("pushBaseLine");
        if (Math.random() < this._action.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        } else if (Math.random() < this._action.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        } else {
            this.potadraInvokeNormalAction(subject, target);
        }
        subject.setLastTarget(target);
        ExBattleManager.showLog("popBaseLine");
    };
    BattleManager.potadraInvokeNormalAction = function(subject, target) {
        const realTarget = this.applySubstitute(target);
        this._action.apply(realTarget);
        this._logWindow.potadraDisplayActionResults(subject, realTarget);
    };
    Game_Action.prototype.potadraMakeTargets = function(original_action, original_targets) {
        if (!this._forcing && this.subject().isConfused()) {
            return this.repeatTargets([this.confusionTarget()]);
        }
        const scope          = this.item().scope;
        const original_scope = original_action.item().scope;
        const sameSingleTarget =
            (scope === 1 && original_scope === 1) || // 敵単体
            (scope === 7 && original_scope === 7) || // 味方単体
            (scope === 9 && original_scope === 9);   // 味方単体(戦闘不能)
        if (sameSingleTarget) {
            return this.repeatTargets(original_targets);
        }
        if (this.isForEveryone()) {
            return this.repeatTargets(this.targetsForEveryone());
        }
        if (this.isForOpponent()) {
            return this.repeatTargets(this.targetsForOpponents());
        }
        if (this.isForFriend()) {
            return this.repeatTargets(this.targetsForFriends());
        }
        return [];
    };
    const StartTurn_Game_Action_Result = Potadra_isPlugin('Game_Action_Result');
    const start_turn_pre_skills_params = Potadra_getPluginParams('PreSkills');
    const StartTurnPreSkillMetaName = String(start_turn_pre_skills_params.PreSkillMetaName || "プレスキル");
    const StartTurnPreSkillCostZero = Potadra_convertBool(start_turn_pre_skills_params.PreSkillCostZero);
    const start_turn_sub_skills_params = Potadra_getPluginParams('SubSkills');
    const StartTurnSubSkillMetaName = String(start_turn_sub_skills_params.SubSkillMetaName || "サブスキル");
    const StartTurnSubSkillCostZero = Potadra_convertBool(start_turn_sub_skills_params.SubSkillCostZero);
    const start_turn_combo_skills_params = Potadra_getPluginParams('ComboSkills');
    const StartTurnComboSkillMetaName = String(start_turn_combo_skills_params.ComboSkillMetaName || "コンボスキル");
    const StartTurnComboSkillCostZero = Potadra_convertBool(start_turn_combo_skills_params.ComboSkillCostZero);
    const start_turn_play_remember_skill_params = Potadra_getPluginParams('PlayRememberSkill');
    const StartTurnActorTurnPlayVariable = Number(start_turn_play_remember_skill_params.ActorTurnPlayVariable || 0);
    const StartTurnEnemyTurnPlayVariable = Number(start_turn_play_remember_skill_params.EnemyTurnPlayVariable || 0);
    if (start_turn_pre_skills_params || start_turn_sub_skills_params || start_turn_combo_skills_params || start_turn_play_remember_skill_params) {
        function isSkillCostZero(meta_name) {
            if (meta_name === StartTurnPreSkillMetaName) {
                return StartTurnPreSkillCostZero;
            } else if (meta_name === StartTurnSubSkillMetaName) {
                return StartTurnSubSkillCostZero;
            } else if (meta_name === StartTurnComboSkillMetaName) {
                return StartTurnComboSkillCostZero;
            }
            return false;
        }
        function set_skill_name(skill_str) {
            if (!skill_str) return false;
            const skill_datum = skill_str.split(",");
            const skill_name = skill_datum[0].trim();
            const probability = skill_datum[1] ? Number(skill_datum[1]) : 100;
            if (!Potadra_random(probability)) return false;
            return skill_name;
        }
        function set_actions(battler, original_action, item, meta_name, prefix) {
            let add_actions = [];
            const skill_data = Potadra_metaData(item.meta[meta_name]);
            if (skill_data && skill_data.length > 0) {
                const original_targets = original_action.makeTargets();
                for (const skill_str of skill_data) {
                    const skill_name = set_skill_name(skill_str);
                    if (!skill_name) continue;
                    const skill_id = Potadra_checkName($dataSkills, skill_name);
                    if (skill_id) {
                        const action = set_action(battler, skill_id, original_action, original_targets, meta_name, prefix);
                        add_actions.push(action);
                    }
                }
            }
            return add_actions;
        }
        function set_combo_actions(battler, original_action, item, meta_name, prefix) {
            let add_actions = [];
            const skill_data = Potadra_metaData(item.meta[meta_name]);
            if (skill_data && skill_data.length > 0) {
                const original_targets = original_action.makeTargets();
                for (const skill_str of skill_data) {
                    if (!skill_str) continue;
                    const skill_name = set_skill_name(skill_str);
                    if (!skill_name) break;
                    const skill_id = Potadra_checkName($dataSkills, skill_name);
                    if (skill_id) {
                        const action = set_action(battler, skill_id, original_action, original_targets, meta_name, prefix);
                        add_actions.push(action);
                    } else {
                        break;
                    }
                }
            }
            return add_actions;
        }
        function set_action(battler, skill_id, original_action, original_targets, meta_name, prefix) {
            const action = new Game_Action(battler);
            action.setSkill(skill_id);
            if (isSkillCostZero(meta_name)) {
                $gameTemp._potadraCostZero[prefix + battler.id].push({id: skill_id, pay: false});
            }
            const targets = action.potadraMakeTargets(original_action, original_targets);
            if (targets.length === 1) {
                const target = targets[0];
                action.setTarget(target);
                if (StartTurn_Game_Action_Result) action.applyResult(target);
            }
            return action;
        }
        function set_prefix(battler) {
            let prefix = 'E';
            if (battler.isActor()) prefix = 'A';
            return prefix;
        }
        if (!BattleManager._potadraStartTurn) {
            const _BattleManager_startTurn = BattleManager.startTurn;
            BattleManager.startTurn = function() {
                _BattleManager_startTurn.apply(this, arguments);
                if (start_turn_pre_skills_params || start_turn_sub_skills_params || start_turn_combo_skills_params) {
                    PreSubComboSkills();
                }
                if (start_turn_play_remember_skill_params) {
                    if (Potadra_checkVariable(StartTurnActorTurnPlayVariable)) {
                        $gameVariables.setValue(StartTurnActorTurnPlayVariable, 0);
                    }
                    if (Potadra_checkVariable(StartTurnEnemyTurnPlayVariable)) {
                        $gameVariables.setValue(StartTurnEnemyTurnPlayVariable, 0);
                    }
                }
            };
            BattleManager._potadraStartTurn = true;
        }
        function PreSubComboSkills() {
            const members = $gameParty.movableMembers().concat($gameTroop.movableMembers());
            for (const battler of members) {
                let add_actions = [];
                let tp = battler._tp;
                let mp = battler._mp;
                let prefix = set_prefix(battler);
                $gameTemp._potadraCostZero[prefix + battler.id] = [];
                for (const original_action of battler._actions) {
                    const item = original_action.item();
                    if (!item) continue;
                    if (!battler.canPaySimulateSkillCost(item, tp, mp)) {
                        add_actions.push(original_action);
                        continue;
                    }
                    tp -= battler.skillTpCost(item);
                    mp -= battler.skillMpCost(item);
                    let pre_actions = [];
                    let sub_actions = [];
                    let combo_actions = [];
                    if (start_turn_pre_skills_params) {
                        pre_actions = set_actions(battler, original_action, item, StartTurnPreSkillMetaName, prefix);
                    }
                    $gameTemp._potadraCostZero[prefix + battler.id].push({id: item.id, pay: true});
                    if (start_turn_sub_skills_params) {
                        sub_actions = set_actions(battler, original_action, item, StartTurnSubSkillMetaName, prefix);
                    }
                    if (start_turn_combo_skills_params) {
                        combo_actions = set_combo_actions(battler, original_action, item, StartTurnComboSkillMetaName, prefix);
                    }
                    add_actions = add_actions.concat(pre_actions).concat([original_action]).concat(sub_actions).concat(combo_actions);
                }
                battler._actions = add_actions;
            }
        }
        const _Game_Temp_initialize = Game_Temp.prototype.initialize;
        Game_Temp.prototype.initialize = function() {
            _Game_Temp_initialize.apply(this, arguments);
            this._potadraCostZero = [];
        };
        Game_BattlerBase.prototype.canPaySimulateSkillCost = function(skill, tp, mp) {
            return (
                tp >= this.skillTpCost(skill) &&
                mp >= this.skillMpCost(skill)
            );
        };
        const _Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
        Game_BattlerBase.prototype.paySkillCost = function(skill) {
            if (check_pay_cost_zero(this, skill)) return;
            _Game_BattlerBase_paySkillCost.apply(this, arguments);
        };
        const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
        Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
            if (check_cost_zero(this, skill)) return true;
            return _Game_BattlerBase_canPaySkillCost.apply(this, arguments);
        };
        function check_cost_zero(battler, skill) {
            const list = $gameTemp._potadraCostZero[set_prefix(battler) + battler.id];
            if (!Array.isArray(list)) return false;
            const entry = list.find(e => e.id === skill.id);
            if (!entry) return false;
            return entry.pay === false;
        }
        function check_pay_cost_zero(battler, skill) {
            const list = $gameTemp._potadraCostZero[set_prefix(battler) + battler.id];
            if (!Array.isArray(list)) return false;
            const index = list.findIndex(e => e.id === skill.id);
            if (index === -1) return false;
            const entry = list[index];
            list.splice(index, 1);
            return entry.pay === false;
        }
    }
    function Potadra_checkVariable(variable_no) {
        return variable_no > 0 && variable_no <= 5000;
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
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
        }
        return false;
    }
    function Potadra_random(probability, rate = 1) {
        const p = Math.floor(probability * rate);
        if (p >= 100) return true;
        if (p <= 0) return false;
        const hitCount = p;
        const missCount = 100 - p;
        const useHitList = hitCount <= missCount;
        const count = useHitList ? hitCount : missCount;
        const set = new Set();
        while (set.size < count) {
            set.add(Math.floor(Math.random() * 100) + 1);
        }
        const roll = Math.floor(Math.random() * 100) + 1;
        if (useHitList) {
            return set.has(roll);
        } else {
            return !set.has(roll);
        }
    }
    function Potadra_convertBool(bool) {
        if (bool === "false" || bool === '' || bool === undefined) {
            return false;
        } else {
            return true;
        }
    }
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }

})();
