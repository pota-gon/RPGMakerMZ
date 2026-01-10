/*:
@plugindesc
防御スキル Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Skill/GuardSkill.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: コマンド名変更を制御出来る機能追加

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
防御スキルを変更できるメモタグを追加します

## 使い方
1. 防御スキルにしたいスキルを作成  
2. メモに <防御スキル: 回避> のように記載。(防御が回避に変更される。)  
3. 戦闘を開始すると防御が回避に切り替わります
※ アイテムも同じように設定できます

防御スキルは、スキル名 OR スキルIDを指定することが出来ます  
また、おまけとして <攻撃スキル: ファイア> のようにすると  
攻撃スキルを変更することもできます

@param AttackSkillMetaName
@text 攻撃スキルタグ
@desc 攻撃スキルに使うメモ欄タグの名称
デフォルトは 攻撃スキル
@default 攻撃スキル

@param GuardSkillMetaName
@text 防御スキルタグ
@desc 防御スキルに使うメモ欄タグの名称
デフォルトは 防御スキル
@default 防御スキル

@param ChangeAttackCommand
@type boolean
@text 通常攻撃コマンド名変更
@desc 通常攻撃のコマンド名を変更するか
@on 変更する
@off 変更しない
@default true

@param ChangeGuardCommand
@type boolean
@text 防御コマンド名変更
@desc 防御のコマンド名を変更するか
@on 変更する
@off 変更しない
@default true
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



    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (id === null || id === undefined) return val;
        let cache = Potadra__searchCache_get(data);
        if (!cache) {
            cache = {};
            Potadra__searchCache_set(data, cache);
        }
        const key = `${search_column}:${id}`;
        if (key in cache) {
            const entry = cache[key];
            return column ? entry?.[column] ?? val : entry;
        }
        let result = val;
        for (let i = initial; i < data.length; i++) {
            const item = data[i];
            if (!item) continue;
            if (search_column && item[search_column] == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
            if (!search_column && i == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
        }
        cache[key] = val;
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
    function Potadra_checkMeta(meta, tag, data) {
        const name = Potadra_meta(meta, tag);
        return name ? Potadra_checkName(data, name) : false;
    }
    function Potadra_checkMetas(battler, tag, data) {
        const ids = [];
        const b = battler.isActor() ? battler.actor() : battler.enemy();
        let id = Potadra_checkMeta(b.meta, tag, data);
        if (id) ids.push(id);
        if (battler.isActor()) {
            id = Potadra_checkMeta(battler.currentClass().meta, tag, data);
            if (id) ids.push(id);
            for (const item of battler.equips()) {
                if (item) {
                    id = Potadra_checkMeta(item.meta, tag, data);
                    if (id) ids.push(id);
                }
            }
        }
        for (const state of battler.states()) {
            id = Potadra_checkMeta(state.meta, tag, data);
            if (id) ids.push(id);
        }
        if (ids.length === 0) return false;
        return Math.max(...ids);
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const AttackSkillMetaName = String(params.AttackSkillMetaName || '攻撃スキル');
    const GuardSkillMetaName  = String(params.GuardSkillMetaName || '防御スキル');
    const ChangeAttackCommand = Potadra_convertBool(params.ChangeAttackCommand);
    const ChangeGuardCommand  = Potadra_convertBool(params.ChangeGuardCommand);

    /**
     * 通常攻撃のスキル ID を取得
     *
     * @returns {} 
     */
    Game_Actor.prototype.attackSkillId = function() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_SKILL);
        let skill_id = set.length > 0 ? Math.max(...set) : 1;
        return Potadra_checkMetas(this, AttackSkillMetaName, $dataSkills) || skill_id;
    };

    /**
     * 防御のスキル ID を取得
     *
     * @returns {} 
     */
    Game_Actor.prototype.guardSkillId = function() {
        return Potadra_checkMetas(this, GuardSkillMetaName, $dataSkills) || 2;
    };

    /**
     * 攻撃コマンドをリストに追加
     */
    const _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function() {
        if (ChangeAttackCommand) {
            this.addCommand($dataSkills[this._actor.attackSkillId()].name, "attack", this._actor.canAttack());
        } else {
            _Window_ActorCommand_addAttackCommand.apply(this, arguments);
        }
    };

    /**
     * 防御コマンドをリストに追加
     */
    const _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand;
    Window_ActorCommand.prototype.addGuardCommand = function() {
        if (ChangeGuardCommand) {
            this.addCommand($dataSkills[this._actor.guardSkillId()].name, "guard", this._actor.canGuard());
        } else {
            _Window_ActorCommand_addGuardCommand.apply(this, arguments);
        }
    };
})();
