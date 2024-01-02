/*:
@plugindesc
スキル複数追加 Ver1.3.8(2023/12/29)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Skill/MultiSkill.js
@orderAfter NameSkill
@target MZ
@author ポテトードラゴン

・アップデート情報
- プラグインパラメータのスキルタイプIDに0を指定したときに、スキルタイプ制御を無効にするように修正

・TODO
- ヘルプ更新
- クールタイム・オーバーヒートの実装

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
スキルを複数覚えることを可能にします。

## 使い方


@param SkillTypeId
@type number
@text スキルタイプID
@desc 複数覚えることが出来るスキルタイプID
0 の場合は、全てのスキルタイプで有効になります
@default 0

@param ExcludeSkills
@type string[]
@text 除外スキル名
@desc 除外するスキル名

@param CompositeSkills
@type struct<CompositeSkills>[]
@text 複合スキル名
@desc 複合するスキルの情報

@param HideSkills
@type struct<HideSkills>[]
@text 隠すスキル名
@desc 特定のスキルを覚えているときスキルを非表示にする
下位互換のスキルを表示しない機能
*/

/*~struct~CompositeSkills:
@param before_name
@type string
@text 複合前元スキル名
@desc 複合前スキル名を名前で指定

@param composite_name
@type string
@text 複合スキル名
@desc 複合スキル名を名前で指定

@param count
@type number
@text 複合必要個数
@desc 複合に必要な個数
@default 2
*/

/*~struct~HideSkills:
@param name
@type string
@text 上位互換スキル名
@desc 上位互換スキル名を名前で指定

@param hide_skills
@type string[]
@text 隠すスキル名
@desc 隠すスキル名
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_stringArray(data) {
        const arr = [];
        if (data) {
            for (const value of JSON.parse(data)) {
                arr.push(String(value));
            }
        }
        return arr;
    }
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) {
            return val;
        }
        for (let i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column) {
                if (data[i][search_column] == id) {
                    if (column) {
                        val = data[i][column];
                    } else {
                        val = data[i];
                    }
                    break;
                }
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const SkillTypeId   = Number(params.SkillTypeId || 0);
    const ExcludeSkills = Potadra_stringArray(params.ExcludeSkills);
    let CompositeSkills = [];
    let HideSkills      = [];
    if (params.CompositeSkills) {
        CompositeSkills = JSON.parse(params.CompositeSkills);
    }
    if (params.HideSkills) {
        HideSkills = JSON.parse(params.HideSkills);
    }

    // 他プラグイン連携(プラグインの導入有無)
    const NameSkill = Potadra_isPlugin('NameSkill');

    /**
     * This section contains some methods that will be added to the standard
     * Javascript objects.
     *
     * @namespace JsExtensions
     */

    /**
     * Removes a given element from the array (in place).
     *
     * @memberof JsExtensions
     * @param {any} element - The element to remove.
     * @returns {array} The array after remove.
     */
    Array.prototype.destroy = function(element) {
        const index = this.indexOf(element);
        if (index >= 0) {
            this.splice(index, 1);
        } else {
            return this;
        }
    };

    /**
     * アクターを扱うクラスです。
     * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
     * Game_Party クラス（$gameParty）からも参照されます。
     *
     * @class
     */

    /**
     * スキルの習得済み判定
     *
     * @param {} skillId -
     * @returns {}
     */
    Game_Actor.prototype.isLearnedSkill = function(skillId) {
        const skill = $dataSkills[skillId];
        if ((SkillTypeId !== 0 && skill.stypeId !== SkillTypeId) || ExcludeSkills.includes(skill.name)) {
            if (NameSkill) {
                const name = Potadra_search($dataSkills, skillId, 'name');
                return this._skills.includes(name);
            } else {
                return this._skills.includes(skillId);
            }
        } else {
            return false;
        }
    };

    /**
     * スキルを覚える
     *
     * @param {number} skillId - スキルID
     */
    Game_Actor.prototype.learnSkill = function(skillId) {
        if (!this.isLearnedSkill(skillId)) {
            let skills;
            if (NameSkill) {
                const name = Potadra_search($dataSkills, skillId, 'name');
                this._skills.push(name);
                skills = this.skillIds();
            } else {
                this._skills.push(skillId);
                skills = this._skills;
            }
            // ここで複合スキル判定
            for (const composite_skill of CompositeSkills) {
                const composite_data = JSON.parse(composite_skill);
                const before_name    = composite_data.before_name;
                const composite_name = composite_data.composite_name;
                const count          = Number(composite_data.count || 2);
                let skill_count = 0;

                for (const id of skills) {
                    let skill = $dataSkills[id];

                    // 複合前のスキルがあったら、複合判定
                    if (skill.name === before_name) {
                        skill_count++;
                        // 複合条件を満たしたとき
                        if (skill_count === count) {
                            const skill_id = Potadra_nameSearch($dataSkills, composite_name);
                            // 複合スキルが見つかったら
                            if (skill_id) {
                                // 複合するスキルを忘れる
                                for (let i = 0; i < skill_count; i++) {
                                    this.forgetSkill(id);
                                }
                                if (NameSkill) {
                                    const skill_name = Potadra_search($dataSkills, skill_id, 'name');
                                    this._skills.push(skill_name);
                                } else {
                                    // 複合スキルを覚える
                                    this._skills.push(skill_id);
                                }
                            }
                        }
                    }
                }
            }
            this._skills.sort((a, b) => a - b);
        }
    };

    /**
     * スキルを忘れる
     *
     * @param {} skillId -
     */
    Game_Actor.prototype.forgetSkill = function(skillId) {
        if (NameSkill) {
            const name = Potadra_search($dataSkills, skillId, 'name');
            this._skills.destroy(name);
        } else {
            this._skills.destroy(skillId);
        }
    };

    /**
     * スキルオブジェクトの配列取得
     *
     * @returns {}
     */
    Game_Actor.prototype.skills = function() {
        const list = [];
        let all_skills;
        if (NameSkill) {
            all_skills = this.skillIds().concat(this.addedSkills());
        } else {
            all_skills = this._skills.concat(this.addedSkills());
        }

        // 隠しスキル判定
        for (const HideSkill of HideSkills) {
            const hide_data   = JSON.parse(HideSkill);
            const name        = hide_data.name; // 上位互換スキル名
            const hide_skills = Potadra_stringArray(hide_data.hide_skills);
            const skill       = Potadra_nameSearch($dataSkills, name, false);

            // 上位互換スキルがあったら
            if (all_skills.includes(skill.id)) {
                for (const hide_skill_name of hide_skills) {
                    const hide_skill = Potadra_nameSearch($dataSkills, hide_skill_name, false);
                    // 隠しスキルがあったら
                    if (all_skills.includes(hide_skill.id)) {
                        all_skills.remove(hide_skill.id);
                    }
                }
            }
        }

        for (const id of all_skills) {
            const skill = $dataSkills[id];
            if (ExcludeSkills.includes(skill.name)) {
                if (!list.includes(skill)) {
                    list.push(skill);
                }
            } else if (SkillTypeId === 0 || skill.stypeId === SkillTypeId || !list.includes(skill)) {
                list.push(skill);
            }
        }
        return list;
    };
})();
