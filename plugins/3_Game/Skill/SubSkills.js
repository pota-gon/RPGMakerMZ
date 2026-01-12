/*:
@plugindesc
サブスキル Ver1.0.1(2026/1/12)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Skill/SubSkill.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: 競合対策を実施
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
スキル使用後に追加で複数のスキルを発動する機能を提供します

## 使い方
1. データベースでスキルを作成します
2. スキルのメモ欄に、後述するタグを使って追加発動するスキルを設定します
   例1(単体): <サブスキル: ヘイスト>
   例2(複数): <サブスキル: 
   10
   ヘイスト
   プロテス>
3. 戦闘中にそのスキルを使用すると、指定したスキルが追加で順番に発動します
※ サブスキルも通常のスキルと同様の判定をするため
   無条件で発動するにはMPを0にしてください

## メモ欄タグ

### スキル用のタグ
スキルのメモ欄に記述して使用します

#### サブスキル
<サブスキル: スキルIDまたは名前>
または
<サブスキル: 
スキルIDまたは名前
スキルIDまたは名前
...>

このタグが設定されたスキルを使用した後、
続けて指定したスキルを同じ行動者が順番に使用します
反動用のスキルを作成し、スキルを使った反動といった使い方ができます

例1(単体):
<サブスキル: 10> // ID10のスキルを追加発動

例2(複数):
<サブスキル: 
10
ヘイスト
プロテス> // ID10、ヘイスト、プロテスの順に追加発動

## プラグインパラメータ

#### サブスキルタグ
サブスキルを指定するためのメモ欄タグ名を指定します
デフォルト: サブスキル

@param SubSkillMetaName
@text サブスキルタグ
@desc サブスキルに使うメモ欄タグの名称
デフォルトは サブスキル
@default サブスキル
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
    const start_turn_pre_skills_params = Potadra_getPluginParams('PreSkills');
    const StartTurnPreSkillMetaName = String(start_turn_pre_skills_params.PreSkillMetaName || "プレスキル");
    const start_turn_sub_skills_params = Potadra_getPluginParams('SubSkills');
    const StartTurnSubSkillMetaName = String(start_turn_sub_skills_params.SubSkillMetaName || "サブキル");
    const start_turn_play_remember_skill_params = Potadra_getPluginParams('PlayRememberSkill');
    const StartTurnActorTurnPlayVariable = Number(start_turn_play_remember_skill_params.ActorTurnPlayVariable || 0);
    const StartTurnEnemyTurnPlayVariable = Number(start_turn_play_remember_skill_params.EnemyTurnPlayVariable || 0);
    if (start_turn_pre_skills_params || start_turn_sub_skills_params || start_turn_play_remember_skill_params) {
        function set_actions(meta_names) {
            for (const member of $gameParty.movableMembers()) {
                let add_actions = [];
                for (const original_action of member._actions) {
                    const original_targets = original_action.makeTargets();
                    if (original_targets.length === 1) {
                        const original_target = original_targets[0];
                        original_action.setTarget(original_target);
                        if (!original_action._result) original_action.applyResult(original_target);
                    }
                    for (const meta_name of meta_names) {
                        if (meta_name === StartTurnSubSkillMetaName) add_actions.push(original_action);
                        const item = original_action.item();
                        const skill_names = Potadra_metaData(item.meta[meta_name]);
                        if (skill_names && skill_names.length > 0) {
                            for (const skill_name of skill_names) {
                                if (!skill_name) continue;
                                const skill_id = Potadra_checkName($dataSkills, skill_name);
                                if (skill_id) {
                                    const action = new Game_Action(member);
                                    action.setSkill(skill_id);
                                    const targets = action.potadraMakeTargets(original_action, original_targets);
                                    if (targets.length === 1) {
                                        const target = targets[0];
                                        action.setTarget(target);
                                        if (!action._result) action.applyResult(target);
                                    }
                                    add_actions.push(action);
                                }
                            }
                        }
                        if (meta_name === StartTurnPreSkillMetaName) add_actions.push(original_action);
                    }
                }
                member._actions = add_actions;
            }
        }
        if (!BattleManager._potadraStartTurn) {
            const _BattleManager_startTurn = BattleManager.startTurn;
            BattleManager.startTurn = function() {
                _BattleManager_startTurn.apply(this, arguments);
                if (start_turn_pre_skills_params || start_turn_sub_skills_params) {
                    set_actions([StartTurnPreSkillMetaName, StartTurnSubSkillMetaName]);
                }
                if (start_turn_play_remember_skill_params) {
                    if (Potadra_checkVariable(StartTurnActorTurnPlayVariable)) $gameVariables.setValue(StartTurnActorTurnPlayVariable, 0);
                    if (Potadra_checkVariable(StartTurnEnemyTurnPlayVariable)) $gameVariables.setValue(StartTurnEnemyTurnPlayVariable, 0);
                }
            };
            BattleManager._potadraStartTurn = true;
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
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }

})();
