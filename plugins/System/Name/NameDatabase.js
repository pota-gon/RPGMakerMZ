/*:
@plugindesc
名前データベース Ver1.0.0(2025/10/19)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/System/Name/NameDatabase.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
データベースの様々な項目を、IDではなく「名前」で指定できるようにします

これにより、データベースの項目を並び替えたり、追加・削除したりしても
設定をやり直す手間が省けます

## 使い方
使いたい機能のプラグインパラメータをONにし
対応するデータベース項目のメモ欄に指定の形式でタグを記述します

### アクターの初期装備
アクターのメモ欄に記述することで、初期装備を名前で指定できます

**書式:**
`<装備タイプ名: 装備名>`
`<装備タイプ名(番号): 装備名>`

**設定例:**
・武器に「銅の剣」を装備
`<武器: 銅の剣>`

・1番目の装飾品スロットに「指輪」を装備
`<装飾品1: 指輪>`

### スキル追加（特徴）
アクター、職業、武器、防具、ステートのメモ欄に記述することで
特徴の「スキル追加」を名前で指定できます

**書式:** `<スキル追加: スキル名>`

### 習得するスキル（職業）
職業のメモ欄に記述することで、習得スキルを名前で指定できます

**書式:** `<習得スキル: レベル, スキル名>`

### ステート関連（特徴）
アクター、職業、武器、防具、ステートのメモ欄に記述します

**ステート有効度:** `<ステート有効度: ステート名, 確率(%)>`
**ステート無効化:** `<ステート無効化: ステート名>`
**攻撃時ステート:** `<攻撃時ステート: ステート名, 確率(%)>`

### ステート関連（使用効果）
スキル、アイテムのメモ欄に記述します

**ステート付加:** `<ステート付加: ステート名, 確率(%)>`
**ステート解除:** `<ステート解除: ステート名, 確率(%)>`

### 注意事項
このプラグインは名前でデータを検索します
同じ名前の項目が複数ある場合、データベースの上にあるものが優先されます
（例: 同名のアイテムと武器がある場合、アイテムが参照されます）
意図しない動作を避けるため、名前はユニークにすることをおすすめします

@param ActorEquip
@type boolean
@text アクター初期装備
@desc アクター初期装備に対応するかの設定
@on 対応する
@off 対応しない
@default true

    @param ActorEquipMetaName
    @parent ActorEquip
    @text アクター初期装備タグ
    @desc アクターの初期装備に使うメモ欄タグの名称
    デフォルトは 装備
    @default 装備

@param AddSkill
@type boolean
@text スキル追加(特徴)
@desc スキル追加(特徴)に対応するかの設定
@on 対応する
@off 対応しない
@default true

    @param AddSkillMetaName
    @parent AddSkill
    @text スキル追加タグ
    @desc スキル追加に使うメモ欄タグの名称
    デフォルトは スキル追加
    @default スキル追加

@param Learning
@type boolean
@text 習得するスキル(職業)
@desc 習得するスキル(職業)に対応するかの設定
@on 対応する
@off 対応しない
@default true

@param StateRate
@type boolean
@text ステート有効度(特徴)
@desc ステート有効度(特徴)に対応するかの設定
@on 対応する
@off 対応しない
@default true

    @param StateRateMetaName
    @parent StateRate
    @text ステート有効度タグ
    @desc ステート有効度に使うメモ欄タグの名称
    デフォルトは ステート有効度
    @default ステート有効度

@param StateResist
@type boolean
@text ステート無効化(特徴)
@desc ステート無効化(特徴)に対応するかの設定
@on 対応する
@off 対応しない
@default true

    @param StateResistMetaName
    @parent StateResist
    @text ステート無効化タグ
    @desc ステート無効化に使うメモ欄タグの名称
    デフォルトは ステート無効化
    @default ステート無効化

@param AttackStates
@type boolean
@text 攻撃時ステート(特徴)
@desc 攻撃時ステート(特徴)に対応するかの設定
@on 対応する
@off 対応しない
@default true

    @param AttackStatesMetaName
    @parent AttackStates
    @text 攻撃時ステートタグ
    @desc 攻撃時ステートに使うメモ欄タグの名称
    デフォルトは 攻撃時ステート
    @default 攻撃時ステート

@param AddState
@type boolean
@text ステート付加(使用効果)
@desc ステート付加(使用効果)に対応するかの設定
@on 対応する
@off 対応しない
@default true

    @param AddStateMetaName
    @parent AddState
    @text ステート付加タグ
    @desc ステート付加に使うメモ欄タグの名称
    デフォルトは ステート付加
    @default ステート付加

@param RemoveState
@type boolean
@text ステート解除(使用効果)
@desc ステート解除(使用効果)に対応するかの設定
@on 対応する
@off 対応しない
@default true

    @param RemoveStateMetaName
    @parent RemoveState
    @text ステート解除タグ
    @desc ステート解除に使うメモ欄タグの名称
    デフォルトは ステート解除
    @default ステート解除
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    const init_skills_debug_params = Potadra_getPluginParams('Debug');
    const InitSkillsDebugSkill     = Potadra_convertBool(init_skills_debug_params.DebugSkill);
    const InitSkillsDebugSkills    = Potadra_stringArray(init_skills_debug_params.DebugSkills);
    const init_skills_name_database_params = Potadra_getPluginParams('NameDatabase');
    const InitSkillsLearning               = Potadra_convertBool(init_skills_name_database_params.Learning);
    if (init_skills_debug_params || init_skills_name_database_params) {
        const _Game_Actor_initSkills = Game_Actor.prototype.initSkills;
        Game_Actor.prototype.initSkills = function() {
            _Game_Actor_initSkills.apply(this, arguments);
            if (InitSkillsDebugSkill && InitSkillsDebugSkills.length > 0) {
                for (const debug_skill of InitSkillsDebugSkills) {
                    const skill_id = Potadra_checkName($dataSkills, debug_skill);
                    if (skill_id) this.learnSkill(skill_id);
                }
            }
            if (InitSkillsLearning) {
                const learnings = Potadra_learnings(this);
                for (const learning of learnings) {
                    if (learning.level <= this._level) {
                        this.learnSkill(learning.skillId);
                    }
                }
            }
        };
    }
    function Potadra_stringArray(data) {
        return data ? JSON.parse(data).map(String) : [];
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
    function Potadra_convertBool(bool) {
        if (bool === "false" || bool === '' || bool === undefined) {
            return false;
        } else {
            return true;
        }
    }
    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) return val;
        for (let i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column && data[i][search_column] == id) {
                val = column ? data[i][column] : data[i];
                break;
            } else if (i == id) {
                val = data[i];
                break;
            }
        }
        return val;
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
    function Potadra_ids(names, data) {
        const ids = [];
        if (names) {
            for (const name of names) {
                if (name) {
                    const id = Potadra_checkName(data, name);
                    if (id) ids.push(id);
                }
            }
        }
        return ids;
    }
    function Potadra_checkMetaIds(battler, tag, data) {
        const b = battler.isActor() ? battler.actor() : battler.enemy();
        let names = Potadra_metaData(b.meta[tag]);
        const battler_ids = Potadra_ids(names, data);
        let class_ids = [];
        let equip_ids = [];
        if (battler.isActor()) {
            names = Potadra_metaData(battler.currentClass().meta[tag]);
            class_ids = Potadra_ids(names, data);
            equip_ids = battler.equips()
                .filter(equip => equip)
                .flatMap(equip => {
                    return Potadra_ids(Potadra_metaData(equip.meta[tag]), data);
                });
        }
        let state_ids = [];
        for (const state of battler.states()) {
            names = Potadra_metaData(state.meta[tag]);
            const tmp_ids = Potadra_ids(names, data);
            for (let i = 0; i < tmp_ids.length; i++) {
                state_ids.push(tmp_ids[i]);
            }
        }
        return battler_ids.concat(class_ids).concat(equip_ids).concat(state_ids);
    }
    function Potadra_checkMetaData(battler, tag, data) {
        let values = [];
        const b = battler.isActor() ? battler.actor() : battler.enemy();
        let tmp_values = Potadra_metaData(b.meta[tag]);
        if (tmp_values) values = values.concat(tmp_values);
        if (battler.isActor()) {
            tmp_values = Potadra_metaData(battler.currentClass().meta[tag]);
            if (tmp_values) values = values.concat(tmp_values);
            tmp_values = battler.equips()
                .filter(equip => equip)
                .flatMap(equip => {
                    return Potadra_ids(Potadra_metaData(equip.meta[tag]), data);
                });
            if (tmp_values) values = values.concat(tmp_values);
        }
        for (const state of battler.states()) {
            tmp_values = Potadra_metaData(state.meta[tag]);
            if (tmp_values) values = values.concat(tmp_values);
        }
        return values;
    }
    function Potadra_learning(data) {
        const learnings = [];
        if (data) {
            for (const value of data) {
                if (value) {
                    const learning_data = value.split(',');
                    learnings.push({
                        level: Number(learning_data[0]),
                        skillId: Potadra_nameSearch($dataSkills, learning_data[1].trim())
                    });
                }
            }
        }
        return learnings;
    }
    function Potadra_learnings(actor) {
        const actor_data = Potadra_metaData(actor.actor().meta['スキル']);
        const class_data = Potadra_metaData(actor.currentClass().meta['スキル']);
        return Potadra_learning(actor_data).concat(Potadra_learning(class_data));
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
    const ActorEquip           = Potadra_convertBool(params.ActorEquip);
    const ActorEquipMetaName   = String(params.ActorEquipMetaName || '装備');
    const AddSkill             = Potadra_convertBool(params.AddSkill);
    const AddSkillMetaName     = String(params.AddSkillMetaName || 'スキル追加');
    const StateRate            = Potadra_convertBool(params.StateRate);
    const StateRateMetaName    = String(params.StateRateMetaName || 'ステート有効度');
    const StateResist          = Potadra_convertBool(params.StateResist);
    const StateResistMetaName  = String(params.StateResistMetaName || 'ステート無効化');
    const AttackStates         = Potadra_convertBool(params.AttackStates);
    const AttackStatesMetaName = String(params.AttackStatesMetaName || '攻撃時ステート');
    const AddState             = Potadra_convertBool(params.AddState);
    const AddStateMetaName     = String(params.AddStateMetaName || 'ステート付加');
    const RemoveState          = Potadra_convertBool(params.RemoveState);
    const RemoveStateMetaName  = String(params.RemoveStateMetaName || 'ステート解除');
    const Learning             = Potadra_convertBool(params.Learning);

    // アクターの初期装備
    if (ActorEquip && !Utils.isOptionValid("btest")) {
        /**
         * 装備判定
         *
         * @param {} actor -
         * @returns {}
         */
        function initEquip(actor) {
            const slots   = actor.equipSlots();
            const _equips = actor._equips;
            const meta    = actor.actor().meta;
            const dual    = actor.isDualWield();

            const tmpType = {};
            const equipTypes = [];

            // 装備
            for (let i = 0; i < slots.length; i++) {
                const slot = slots[i];
                const meta_datum = meta[ActorEquipMetaName + (i + 1)];
                if (meta_datum) {
                    const data = equipData(slot, dual);
                    _equips[i].setEquip(slot === 1 || (slot === 2 && dual), Potadra_nameSearch(data, meta_datum.trim()));
                }
                if (tmpType[slot]) {
                    tmpType[slot]++;
                    equipTypes[i] = tmpType[slot];
                } else {
                    tmpType[slot] = 1;
                    equipTypes[i] = 1;
                }
            }

            // 装備タイプ名
            for (let i = 0; i < slots.length; i++) {
                const slot = slots[i];
                const meta_datum = meta[ActorEquipMetaName + (i + 1)];
                const data = equipData(slot, dual);
                if (meta_datum) {
                    _equips[i].setEquip(slot === 1 || (slot === 2 && dual), Potadra_nameSearch(data, meta_datum.trim()));
                }

                let equip_meta = meta[$dataSystem.equipTypes[slot] + equipTypes[i]];
                if (equip_meta) {
                    _equips[i].setEquip(slot === 1 || (slot === 2 && dual), Potadra_nameSearch(data, equip_meta.trim()));
                } else if (equipTypes[i] === 1) {
                    equip_meta = meta[$dataSystem.equipTypes[slot]];
                    if (equip_meta) {
                        _equips[i].setEquip(slot === 1 || (slot === 2 && dual), Potadra_nameSearch(data, equip_meta.trim()));
                    }
                }
            }
        }

        /**
         * 武器・防具判定
         *
         * @param {} slot -
         * @returns {}
         */
        function equipData(slot, dual) {
            if (slot === 1 || (slot === 2 && dual)) {
                return $dataWeapons;
            } else {
                return $dataArmors;
            }
        }

        /**
         * アクターを扱うクラスです。
         * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
         * Game_Party クラス（$gameParty）からも参照されます。
         *
         * @class
         */

        /**
         * 装備品の初期化
         *
         * @param {array} equips - 初期装備の配列
         */
        const _Game_Actor_initEquips = Game_Actor.prototype.initEquips;
        Game_Actor.prototype.initEquips = function(equips) {
            _Game_Actor_initEquips.apply(this, arguments);

            initEquip(this);
            this.refresh();

            // 二刀流を可能にする装備判定・武器・防具タイプ用
            initEquip(this);
            this.releaseUnequippableItems(true);
            this.refresh();
        };
    }

    // スキル追加(特徴)
    if (AddSkill) {
        /**
         * アクターを扱うクラスです。
         * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
         * Game_Party クラス（$gameParty）からも参照されます。
         *
         * @class
         */

        /**
         * 追加スキルの取得
         *
         * @returns {}
         */
        Game_Actor.prototype.addedSkills = function() {
            const skill_ids = Potadra_checkMetaIds(this, AddSkillMetaName, $dataSkills);
            return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD).concat(skill_ids);
        };
    }

    // ステート有効度(特徴)
    if (StateRate) {
        /**
         * ステート有効度の取得
         *
         * @param {} stateId - 
         * @returns {} 
         */
        Game_BattlerBase.prototype.stateRate = function(stateId) {
            const state_data = Potadra_checkMetaData(this, StateRateMetaName, $dataStates);
            const traits = [];
            if (state_data) {
                for (const state_str of state_data) {
                    const state_datum = state_str.split(",");
                    const state_name  = state_datum[0];
                    const state_id    = Potadra_nameSearch($dataStates, state_name);
                    if (state_id === stateId) {
                        const state_value = Number(state_datum[1]) / 100;
                        let trait = {};
                        trait.code   = Game_BattlerBase.TRAIT_STATE_RATE;
                        trait.dataId = stateId;
                        trait.value  = state_value;
                        traits.push(trait);
                    }
                }
            }
            return this.traitsWithId(Game_BattlerBase.TRAIT_STATE_RATE, stateId).concat(traits).reduce((r, trait) => r * trait.value, 1);
        };
    }

    // ステート無効化(特徴)
    if (StateResist) {
        /**
         * 無効化するステートの配列を取得
         *
         * @returns {} 
         */
        Game_BattlerBase.prototype.stateResistSet = function() {
            const state_ids = Potadra_checkMetaIds(this, StateResistMetaName, $dataStates);
            return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST).concat(state_ids);
        };
    }

    // 攻撃時ステート(特徴)
    if (AttackStates) {
        /**
         * 攻撃時ステートの取得
         *
         * @returns {} 
         */
        Game_BattlerBase.prototype.attackStates = function() {
            const state_ids = Potadra_checkMetaIds(this, AttackStatesMetaName, $dataStates);
            return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE).concat(state_ids);
        };

        /**
         * 攻撃時ステートの発動率取得
         *
         * @param {} stateId - 
         * @returns {} 
         */
        Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
            const state_data = Potadra_checkMetaData(this, AttackStatesMetaName, $dataStates);
            const traits = [];
            if (state_data) {
                for (const state_str of state_data) {
                    const state_datum = state_str.split(",");
                    const state_name  = state_datum[0];
                    const state_id    = Potadra_nameSearch($dataStates, state_name);
                    if (state_id === stateId) {
                        const state_value = Number(state_datum[1]) / 100;
                        let trait = {};
                        trait.code   = Game_BattlerBase.TRAIT_STATE_RATE;
                        trait.dataId = stateId;
                        trait.value  = state_value;
                        traits.push(trait);
                    }
                }
            }
            return this.traitsWithId(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId).concat(traits).reduce((r, trait) => r + trait.value, 0);
        };
    }

    // 習得するスキル(職業)
    if (Learning) {
        /**
         * アクターを扱うクラスです。
         * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
         * Game_Party クラス（$gameParty）からも参照されます。
         *
         * @class
         */

        /**
         * レベルアップ
         */
        const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
        Game_Actor.prototype.levelUp = function() {
            _Game_Actor_levelUp.apply(this, arguments);
            const learnings = Potadra_learnings(this);
            for (const learning of learnings) {
                if (learning.level === this._level) {
                    this.learnSkill(learning.skillId);
                }
            }
        };
    }

    // ステート付加(使用効果)
    if (AddState || RemoveState) {
        /**
         * アクション実行
         *
         * @param {} target - 
         */
        const _Game_Action_apply = Game_Action.prototype.apply;
        Game_Action.prototype.apply = function(target) {
            _Game_Action_apply.apply(this, arguments);
            const result = target.result();
            if (result.isHit()) {
                const effects = [];

                // ステート付加(使用効果)
                if (AddState) {
                    const state_data = Potadra_metaData(this.item().meta[AddStateMetaName]);
                    if (state_data) {
                        for (const state_str of state_data) {
                            const state_datum = state_str.split(",");
                            const state_name  = state_datum[0];
                            const state_id    = state_name === '通常攻撃' ? 0 : Potadra_nameSearch($dataStates, state_name);
                            const state_value = Number(state_datum[1]) / 100;

                            let effect = {};
                            effect.code   = Game_Action.EFFECT_ADD_STATE;
                            effect.dataId = state_id;
                            effect.value1 = state_value;
                            effect.value2 = 0;
                            effects.push(effect);
                        }
                    }
                }

                // ステート解除(使用効果)
                if (RemoveState) {
                    const state_data = Potadra_metaData(this.item().meta[RemoveStateMetaName]);
                    if (state_data) {
                        for (const state_str of state_data) {
                            const state_datum = state_str.split(",");
                            const state_name  = state_datum[0];
                            const state_id    = Potadra_nameSearch($dataStates, state_name);
                            const state_value = Number(state_datum[1]) / 100;

                            let effect = {};
                            effect.code   = Game_Action.EFFECT_REMOVE_STATE;
                            effect.dataId = state_id;
                            effect.value1 = state_value;
                            effect.value2 = 0;
                            effects.push(effect);
                        }
                    }
                }

                for (const effect of effects) {
                    this.applyItemEffect(target, effect);
                }
            }
        };
    }
})();
