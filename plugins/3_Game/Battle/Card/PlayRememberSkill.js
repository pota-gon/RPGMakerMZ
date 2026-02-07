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
