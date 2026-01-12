/*:
@plugindesc
スキル実行回数記憶 Ver1.0.1(2026/1/12)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Card/PlayRememberSkill.js
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
                        if (meta_name === SubSkillMetaName) add_actions.push(original_action);
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
                        if (meta_name === PreSkillMetaName) add_actions.push(original_action);
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
