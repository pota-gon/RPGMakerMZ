/*:
@plugindesc
スキル実行回数記憶 Ver1.0.2(2026/1/12)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Card/PlayRememberSkill.js
@orderAfter Game_Action_Result
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.2: 単体対象のターゲットがおかしくなるバグ修正
* Ver1.0.1: 競合対策を実施
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
スキルの実行回数を変数に記録できるようにします

## 使い方
プラグインパラメータから、スキルの実行回数を記憶する変数を選択します
設定後、指定した変数にスキルの実行回数が記憶されるようになります

@param ActorPlayVariable
@type variable
@text アクタースキル総実行回数記憶変数
@desc アクターのスキル総実行回数を記憶する変数
0 の場合は、スキル総実行回数は記憶しません
@default 0

@param ActorTurnPlayVariable
@type variable
@text アクターターン毎スキル実行回数記憶変数
@desc アクターのターン毎スキル実行回数を記憶する変数
0 の場合は、ターン毎スキル実行回数は記憶しません
@default 0

@param EnemyPlayVariable
@type variable
@text 敵キャラスキル総実行回数記憶変数
@desc 敵キャラのスキル総実行回数を記憶する変数
0 の場合は、スキル総実行回数は記憶しません
@default 0

@param EnemyTurnPlayVariable
@type variable
@text 敵キャラターン毎スキル実行回数記憶変数
@desc 敵キャラのターン毎スキル実行回数を記憶する変数
0 の場合は、ターン毎スキル実行回数は記憶しません
@default 0
*/
(() => {
    'use strict';

    // ベースプラグインの処理
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
    Game_BattlerBase.prototype.canPaySimulateSkillCost = function(skill, tp, mp) {
        return (
            tp >= this.skillTpCost(skill) &&
            mp >= this.skillMpCost(skill)
        );
    };
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
    if (start_turn_pre_skills_params || start_turn_sub_skills_params || start_turn_combo_skills_params || start_turn_play_remember_skill_params) {
        function set_actions(member, original_action, item, meta_name) {
            let add_actions = [];
            const skill_data = Potadra_metaData(item.meta[meta_name]);
            const cost_zero = isSkillCostZero(meta_name);
            if (skill_data && skill_data.length > 0) {
                const original_targets = original_action.makeTargets();
                for (const skill_str of skill_data) {
                    if (!skill_str) continue;
                    const skill_datum = skill_str.split(",");
                    const skill_name = skill_datum[0].trim();
                    const probability = skill_datum[1] ? Number(skill_datum[1]) : 100;
                    if (Math.random() * 100 >= probability) continue;
                    const skill_id = Potadra_checkName($dataSkills, skill_name);
                    if (skill_id) {
                        const action = new Game_Action(member);
                        action.setSkill(skill_id);
                        if (cost_zero) {
                            action._potadraCostZero = true;
                        }
                        const targets = action.potadraMakeTargets(original_action, original_targets);
                        if (targets.length === 1) {
                            const target = targets[0];
                            action.setTarget(target);
                            if (StartTurn_Game_Action_Result) action.applyResult(target);
                        }
                        add_actions.push(action);
                    }
                }
            }
            return add_actions;
        }
        function set_combo_actions(member, original_action, item, meta_name) {
            let add_actions = [];
            const skill_data = Potadra_metaData(item.meta[meta_name]);
            const cost_zero = isSkillCostZero(meta_name);
            if (skill_data && skill_data.length > 0) {
                const original_targets = original_action.makeTargets();
                for (const skill_str of skill_data) {
                    if (!skill_str) continue;
                    const skill_datum = skill_str.split(",");
                    const skill_name = skill_datum[0].trim();
                    const probability = skill_datum[1] ? Number(skill_datum[1]) : 100;
                    if (Math.random() * 100 >= probability) break;
                    const skill_id = Potadra_checkName($dataSkills, skill_name);
                    if (skill_id) {
                        const action = new Game_Action(member);
                        action.setSkill(skill_id);
                        if (cost_zero) {
                            action._potadraCostZero = true;
                        }
                        const targets = action.potadraMakeTargets(original_action, original_targets);
                        if (targets.length === 1) {
                            const target = targets[0];
                            action.setTarget(target);
                            if (StartTurn_Game_Action_Result) action.applyResult(target);
                        }
                        add_actions.push(action);
                    } else {
                        break;
                    }
                }
            }
            return add_actions;
        }
        function PreSubComboSkills() {
            const members = $gameParty.movableMembers().concat($gameTroop.movableMembers());
            for (const member of members) {
                let add_actions = [];
                let tp = member._tp;
                let mp = member._mp;
                for (const original_action of member._actions) {
                    const item = original_action.item();
                    if (!item) continue;
                    if (!member.canPaySimulateSkillCost(item, tp, mp)) {
                        add_actions.push(original_action);
                        continue;
                    }
                    tp -= member.skillTpCost(item);
                    mp -= member.skillMpCost(item);
                    let pre_actions = [];
                    let sub_actions = [];
                    let combo_actions = [];
                    if (start_turn_pre_skills_params) {
                        pre_actions = set_actions(member, original_action, item, StartTurnPreSkillMetaName);
                    }
                    if (start_turn_sub_skills_params) {
                        sub_actions = set_actions(member, original_action, item, StartTurnSubSkillMetaName);
                    }
                    if (start_turn_combo_skills_params) {
                        combo_actions = set_combo_actions(member, original_action, item, StartTurnComboSkillMetaName);
                    }
                    add_actions = add_actions.concat(pre_actions).concat([original_action]).concat(sub_actions).concat(combo_actions);
                }
                member._actions = add_actions;
            }
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
        const _Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
        Game_BattlerBase.prototype.paySkillCost = function(skill) {
            const action = BattleManager._action;
            if (action && action._potadraCostZero) {
                return;
            }
            _Game_BattlerBase_paySkillCost.apply(this, arguments);
        };
        const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
        Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
            const action = BattleManager._action;
            if (action && action._potadraCostZero) {
                const currentSkill = action.item();
                if (currentSkill && currentSkill === skill) {
                    return true;
                }
            }
            return _Game_BattlerBase_canPaySkillCost.apply(this, arguments);
        };
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
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_checkVariable(variable_no) {
        return variable_no > 0 && variable_no <= 5000;
    }


    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const ActorPlayVariable     = Number(params.ActorPlayVariable || 0);
    const ActorTurnPlayVariable = Number(params.ActorTurnPlayVariable || 0);
    const EnemyPlayVariable     = Number(params.EnemyPlayVariable || 0);
    const EnemyTurnPlayVariable = Number(params.EnemyTurnPlayVariable || 0);

    // 戦闘終了時の処理
    function endBattle() {
        // 実行回数をリセット
        if (Potadra_checkVariable(ActorPlayVariable)) $gameVariables.setValue(ActorPlayVariable, 0);
        if (Potadra_checkVariable(EnemyPlayVariable)) $gameVariables.setValue(EnemyPlayVariable, 0);
        if (Potadra_checkVariable(ActorTurnPlayVariable)) $gameVariables.setValue(ActorTurnPlayVariable, 0);
        if (Potadra_checkVariable(EnemyTurnPlayVariable)) $gameVariables.setValue(EnemyTurnPlayVariable, 0);
    }

    /**
     * アクション実行
     *
     * @param {} target - 
     */
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);

        // 戦闘不能スキルはカウントしない
        if (this._faint_actor || this._faint_enemy) {
            return false;
        }

        // 実行回数をカウント
        if (this.subject().isActor()) {
            if (Potadra_checkVariable(ActorPlayVariable)) {
                const count = $gameVariables.value(ActorPlayVariable);
                $gameVariables.setValue(ActorPlayVariable, count + 1);
            }
            if (Potadra_checkVariable(ActorTurnPlayVariable)) {
                const count = $gameVariables.value(ActorTurnPlayVariable);
                $gameVariables.setValue(ActorTurnPlayVariable, count + 1);
            }
        } else {
            if (Potadra_checkVariable(EnemyPlayVariable)) {
                const count = $gameVariables.value(EnemyPlayVariable);
                $gameVariables.setValue(EnemyPlayVariable, count + 1);
            }
            if (Potadra_checkVariable(EnemyTurnPlayVariable)) {
                const count = $gameVariables.value(EnemyTurnPlayVariable);
                $gameVariables.setValue(EnemyTurnPlayVariable, count + 1);
            }
        }
    };

    /**
     * 勝利の処理
     */
    const _BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        // 戦闘終了時の処理
        endBattle();
        _BattleManager_processVictory.apply(this, arguments);
    };

    /**
     * 中断の処理
     */
    const _BattleManager_processAbort = BattleManager.processAbort;
    BattleManager.processAbort = function() {
        // 戦闘終了時の処理
        endBattle();
        _BattleManager_processAbort.apply(this, arguments);
    };

    /**
     * 敗北の処理
     */
    const _BattleManager_processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function() {
        // 戦闘終了時の処理
        endBattle();
        _BattleManager_processDefeat.apply(this, arguments);
    };
})();
