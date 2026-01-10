/*:
@plugindesc
デバッグ用のプラグイン Ver1.5.1(2025/8/6)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/1_Core/Debug/Debug.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.5.1: デバッグスキル有効パラメータを追加
* Ver1.5.0: 入手しないアイテム名の文字を配列で指定できるように変更
* Ver1.4.9: リファクタリング
* Ver1.4.8: デバッグ時に無条件で使えるデバッグスキルを追加
* Ver1.4.7: 競合対策のため、共通処理を整理

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
開発中に便利な機能を追加します

## 使い方
以下の機能を提供します  
使いたい機能のパラメータを変更してください

1. プラグインロードエラースキップ
2. プラグインで画面サイズ(解像度)変更
3. プラグインでフォント変更
4. アイテム全入手
5. 常に逃走可能

@param PlayTest
@type boolean
@text テスト時のみ有効
@desc テスト時のみ有効にするか
@on 有効にする
@off 常に有効
@default true

@param SkipPluginLoadError
@type boolean
@text プラグインロードエラースキップ
@desc プラグインのロードエラーをスキップするか
ONのプラグインがない状態で、ゲームを起動可能になります
@on スキップする
@off スキップしない
@default true

@param EnableResolution
@type boolean
@text 画面サイズ(解像度)変更
@desc プラグインで画面サイズ(解像度)変更するか
@on 変更する
@off 変更しない
@default false

    @param ResolutionWidth
    @parent EnableResolution
    @type number
    @text 画面サイズ(解像度)の幅
    @desc 画面の横の長さ
    @default 816
    @min 0
    @max 2000

    @param ResolutionHeight
    @parent EnableResolution
    @type number
    @text 画面サイズ(解像度)の高さ
    @desc 画面の縦の長さ
    @default 624
    @min 0
    @max 2000

@param EnableFont
@type boolean
@text プラグインでフォント変更
@desc フォントをプラグインで切り替えるように変更します
@default false

    @param mainFontFilename
    @parent EnableFont
    @type string
    @text メインフォント
    @desc メインフォントのファイル名
    @default mplus-1m-regular.woff

    @param numberFontFilename
    @parent EnableFont
    @type string
    @text 数字フォント
    @desc 数字フォントのファイル名
    @default mplus-2p-bold-sub.woff

@param AllItem
@type boolean
@text アイテム全入手
@desc アイテムを全入手するか
@on 入手する
@off 入手しない
@default false

    @param ExceptItemNames
    @parent AllItem
    @type string[]
    @text 入手しないアイテム名の文字配列（部分一致）
    @desc これらの文字が含まれている場合は、アイテムを入手しません
    @default ["-"]

    @param ExceptItemExactNames
    @parent AllItem
    @type string[]
    @text 入手しないアイテム名の文字配列（完全一致）
    @desc このアイテム名の場合は、アイテムを入手しません
    @default []

    @param GetItem
    @parent AllItem
    @type boolean
    @text アイテム入手
    @desc アイテムを入手するか
    @on 入手する
    @off 入手しない
    @default true

        @param GetItemCount
        @parent GetItem
        @type number
        @text 入手アイテム数
        @desc 入手するアイテム数
              0 で最大数まで入手
        @default 0
        @min 0
        @max 999999999999999

    @param GetWeapon
    @parent AllItem
    @type boolean
    @text 武器入手
    @desc 武器を入手するか
    @on 入手する
    @off 入手しない
    @default true

        @param GetWeaponCount
        @parent GetWeapon
        @type number
        @text 入手武器数
        @desc 入手する武器数
              0 で最大数まで入手
        @default 0
        @min 0
        @max 999999999999999

    @param GetArmor
    @parent AllItem
    @type boolean
    @text 防具入手
    @desc 防具を入手するか
    @on 入手する
    @off 入手しない
    @default true

        @param GetArmorCount
        @parent GetArmor
        @type number
        @text 入手防具数
        @desc 入手する防具数
              0 で最大数まで入手
        @default 0
        @min 0
        @max 999999999999999

@param AlwaysCanEscape
@type boolean
@text 常に逃走可能
@desc 常に逃走を可能にするか
@on 常に逃走可能
@off 通常通り
@default false

@param DebugSkill
@type boolean
@text デバッグスキル有効
@desc デバッグスキルを有効にするか
@on 有効
@off 無効
@default true

    @param DebugSkills
    @parent DebugSkill
    @type skill[]
    @text デバッグスキル
    @desc デバッグ時に無条件で使えるスキル
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    const gain_item_debug_params = Potadra_getPluginParams('Debug');
    const gain_item_max_item_params = Potadra_getPluginParams('MaxItem');
    const GainItemAutoSell          = Potadra_convertBool(gain_item_max_item_params.AutoSell);
    const GainItemSellRate          = Number(gain_item_max_item_params.SellRate || 0.5);
    const gain_item_name_item_params = Potadra_getPluginParams('NameItem');
    if (gain_item_debug_params || gain_item_max_item_params || gain_item_name_item_params) {
        Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
            const container = this.itemContainer(item);
            if (container) {
                const lastNumber = this.numItems(item); // 現在のアイテム所持数
                const newNumber  = lastNumber + amount; // 増減後のアイテム所持数
                const maxNumber  = this.maxItems(item); // アイテムの最大数
                if (GainItemAutoSell) {
                    if (newNumber > maxNumber) { // 増減後のアイテム所持数がアイテムの最大数を超えたら
                        const sellNumber = newNumber - maxNumber; // 売却個数
                        if ($gameParty) $gameParty.gainGold(sellNumber * Math.floor(item.price * GainItemSellRate));
                    }
                }
                if (gain_item_name_item_params) {
                    container[item.name] = newNumber.clamp(0, this.maxItems(item));
                    if (container[item.name] === 0) {
                        delete container[item.name];
                    }
                } else {
                    container[item.id] = newNumber.clamp(0, maxNumber);
                    if (container[item.id] === 0) {
                        delete container[item.id];
                    }
                }
                if (includeEquip && newNumber < 0) {
                    this.discardMembersEquip(item, -newNumber);
                }
                if ($gameMap) $gameMap.requestRefresh();
            }
        };
    }
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
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
        }
        return false;
    }
    function Potadra_learnings(actor) {
        const actor_data = Potadra_metaData(actor.actor().meta['スキル']);
        const class_data = Potadra_metaData(actor.currentClass().meta['スキル']);
        return Potadra_learning(actor_data).concat(Potadra_learning(class_data));
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
    function Potadra_stringArray(data) {
        return data ? JSON.parse(data).map(String) : [];
    }
    function Potadra_isTest(play_test = true) {
        return !play_test || Utils.isOptionValid("test");
    }


    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const PlayTest             = Potadra_convertBool(params.PlayTest);
    const SkipPluginLoadError  = Potadra_convertBool(params.SkipPluginLoadError);
    const EnableResolution     = Potadra_convertBool(params.EnableResolution);
    const ResolutionWidth      = Number(params.ResolutionWidth || 816);
    const ResolutionHeight     = Number(params.ResolutionHeight || 624);
    const EnableFont           = Potadra_convertBool(params.EnableFont);
    const mainFontFilename     = String(params.mainFontFilename || 'mplus-1m-regular.woff');
    const numberFontFilename   = String(params.numberFontFilename || 'mplus-2p-bold-sub.woff');
    const AllItem              = Potadra_convertBool(params.AllItem);
    const ExceptItemNames      = Potadra_stringArray(params.ExceptItemNames);
    const ExceptItemExactNames = Potadra_stringArray(params.ExceptItemExactNames);
    const GetItem              = Potadra_convertBool(params.GetItem);
    const GetWeapon            = Potadra_convertBool(params.GetWeapon);
    const GetArmor             = Potadra_convertBool(params.GetArmor);
    const GetItemCount         = Number(params.GetItemCount || 0);
    const GetWeaponCount       = Number(params.GetWeaponCount || 0);
    const GetArmorCount        = Number(params.GetArmorCount || 0);
    const AlwaysCanEscape      = Potadra_convertBool(params.AlwaysCanEscape);

    if (Potadra_isTest(PlayTest)) {
        // プラグインロードエラースキップ
        if (SkipPluginLoadError) {
            PluginManager.checkErrors = function() {};
        }

        // フォントの読み込み
        if (EnableFont) {
            Scene_Boot.prototype.loadGameFonts = function() {
                FontManager.load("rmmz-mainfont", mainFontFilename);
                FontManager.load("rmmz-numberfont", numberFontFilename);
            };
        }

        // 画面サイズ(解像度)の変更
        if (EnableResolution) {
            /**
             * 画面の幅・高さ
             */
            Scene_Boot.prototype.resizeScreen = function() {
                const screenWidth = ResolutionWidth;
                const screenHeight = ResolutionHeight;
                Graphics.resize(screenWidth, screenHeight);
                this.adjustBoxSize();
                this.adjustWindow();
            };

            /**
             * UIエリアの幅・高さ
             */
            Scene_Boot.prototype.adjustBoxSize = function() {
                const uiAreaWidth = ResolutionWidth;
                const uiAreaHeight = ResolutionHeight;
                const boxMargin = 4;
                Graphics.boxWidth = uiAreaWidth - boxMargin * 2;
                Graphics.boxHeight = uiAreaHeight - boxMargin * 2;
            };
        }

        // アイテム全入手
        if (AllItem) {
            const checkTestItem = function(item) {
                if (!item || item.name.length === 0) return false;

                // 部分一致
                if (ExceptItemNames.length > 0 && ExceptItemNames.some(i => item.name.includes(i))) {
                    return false;
                }

                // 完全一致
                if (ExceptItemExactNames.length > 0 && ExceptItemExactNames.some(i => item.name === i)) {
                    return false;
                }

                return true;
            };

            /**
             * オブジェクト初期化
             */
            const _Game_Party_initialize = Game_Party.prototype.initialize;
            Game_Party.prototype.initialize = function() {
                _Game_Party_initialize.apply(this, arguments);            
                if (GetItem) this.potadraSetupGetItems($dataItems, GetItemCount);
                if (GetWeapon) this.potadraSetupGetItems($dataWeapons, GetWeaponCount);
                if (GetArmor) this.potadraSetupGetItems($dataArmors, GetArmorCount);
            };

            /**
             * テスト用に全アイテム取得
             */
            Game_Party.prototype.potadraSetupGetItems = function(data, count = 0) {
                for (const item of data) {
                    if (checkTestItem(item)) {
                        if (count === 0) {
                            this.gainItem(item, this.maxItems(item));
                        } else {
                            this.gainItem(item, count);
                        }
                    }
                }
            };
        }

        // 常に逃走可能
        if (AlwaysCanEscape) {
            /**
             * 逃走許可の取得
             *
             * @returns {} 
             */
            BattleManager.canEscape = function() {
                return true;
            };
        }
    }
})();
