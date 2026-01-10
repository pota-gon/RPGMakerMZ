/*:
@plugindesc
コアスクリプト Ver1.0.0(2025/10/19)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/1_Core/CoreScript.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
RPGツクールMZに標準で搭載されていても良さそうな機能を設定できます

## 使い方
使いたいパラメータを設定して機能を有効にしてください

@param SetGold
@type boolean
@text 所持金設定
@desc ゲーム開始時の所持金を設定するか
@on 設定する
@off 設定しない
@default false

    @param StartGold
    @parent SetGold
    @type number
    @text ゲーム開始所持金
    @desc ゲーム開始時の所持金
    @default 1000
    @min 0

@param StepAnime
@type boolean
@text 初期足踏みアニメ
@desc ニューゲームで開始したときにアクターが
足踏みをするようになります
@on 足踏みする
@off 足踏みしない
@default false

@param Items
@type struct<ItemList>[]
@text 初期所持アイテム
@desc 初期に所持するアイテム
@default []

@param isTopHelpMode
@type boolean
@text ヘルプ上部表示モード
@desc ヘルプを上部に表示するように変更します
変更すると画面系プラグインの表示が崩れる場合があります
@default false

@param isBottomButtonMode
@type boolean
@text ボタン下部表示モード
@desc ボタンを下部に表示するように変更します
変更すると画面系プラグインの表示が崩れる場合があります
@default false

@param ChangeHitFormula
@type boolean
@text 命中計算式変更
@desc 命中計算式を一般的な計算式に変更するか
@on 変更する
@off 変更しない
@default false

@param EnableLukState
@type boolean
@text 運ステート付加影響
@desc 運をステート付加に影響させるか
@on 影響する
@off 影響しない
@default true

@param ExpRate
@type number
@text 経験値獲得率
@desc 控えメンバーの経験獲得率
@decimals 2
@default 1.0
@min 0

@param UseDisableMaxTp
@type boolean
@text TP最大時TP増加アイテム禁止
@desc TP最大時にTP増加アイテムの使用を禁止するか
@on 禁止する
@off 禁止しない
@default false
*/

/*~struct~ItemList:
@param name
@type string
@text アイテム名
@desc アイテム名(アイテム)を名前で指定

@param count
@type number
@text 個数
@desc 個数を指定
@default 1
@min 1
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
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
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
    function Potadra_itemSearch(name, column = false, search_column = "name", val = false, initial = 1) {
        const item = Potadra_search($dataItems, name, column, search_column, val, initial);
        if (item) return item;
        const weapon = Potadra_search($dataWeapons, name, column, search_column, val, initial);
        if (weapon) return weapon;
        const armor = Potadra_search($dataArmors, name, column, search_column, val, initial);
        if (armor) return armor;
        return false;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const SetGold        = Potadra_convertBool(params.SetGold);
    const StartGold      = Number(params.StartGold);
    const StepAnime      = Potadra_convertBool(params.StepAnime);
    let Items;
    if (params.Items) {
        Items = JSON.parse(params.Items);
    }
    const isTopHelpMode      = Potadra_convertBool(params.isTopHelpMode);
    const isBottomButtonMode = Potadra_convertBool(params.isBottomButtonMode);
    const ChangeHitFormula   = Potadra_convertBool(params.ChangeHitFormula);
    const EnableLukState     = Potadra_convertBool(params.EnableLukState);
    const ExpRate            = Number(params.ExpRate || 1);
    const UseDisableMaxTp    = Potadra_convertBool(params.UseDisableMaxTp);

    // 他プラグイン連携(プラグインの導入有無)
    const NameItem = Potadra_isPlugin('NameItem');

    // 所持金設定
    if (SetGold) {
        /**
         * パーティを扱うクラスです。所持金やアイテムなどの情報が含まれます。
         * このクラスのインスタンスは $gameParty で参照されます。
         *
         * @class
         */

        /**
         * オブジェクト初期化
         */
        const _Game_Party_initialize = Game_Party.prototype.initialize;
        Game_Party.prototype.initialize = function() {
            _Game_Party_initialize.apply(this, arguments);
            this._gold = StartGold; // 所持金
        };
    }

    // 初期足踏みアニメ
    if (StepAnime) {
        /**
         * キャラクターを扱う基本のクラスです。
         * 全てのキャラクターに共通する、
         * 座標やグラフィックなどの基本的な情報を保持します。
         *
         * @class
         */

        /**
         * オブジェクト初期化
         */
        const _Game_CharacterBase_initialize = Game_CharacterBase.prototype.initialize;
        Game_CharacterBase.prototype.initialize = function() {
            _Game_CharacterBase_initialize.apply(this, arguments);
            this._stepAnime = true;
        };
    }

    /**
     * 全アイテムリストの初期化
     */
    const _Game_Party_initAllItems = Game_Party.prototype.initAllItems;
    Game_Party.prototype.initAllItems = function() {
        _Game_Party_initAllItems.apply(this, arguments);
        if (Items) {
            for (let i = 0; i < Items.length; i++) {
                const tmp_item = JSON.parse(Items[i]);
                const item = Potadra_itemSearch(tmp_item.name.trim());
                const count = Number(tmp_item.count);
                if (item) {
                    const key = NameItem ? item.name : item.id;
                    if (DataManager.isItem(item)) {
                        this._items[key] = count;
                    } else if (DataManager.isWeapon(item)) {
                        this._weapons[key] = count;
                    } else if (DataManager.isArmor(item)) {
                        this._armors[key] = count;
                    }
                }
            }
        }
    };

    /**
     * ヘルプ下部表示モード
     *
     * @returns {} 
     */
    if (isTopHelpMode) {
        Scene_Base.prototype.isBottomHelpMode = function() {
            return false;
        };
    }

    /**
     * ボタン下部表示モード
     *
     * @returns {} 
     */
    if (isBottomButtonMode) {
        Scene_Base.prototype.isBottomButtonMode = function() {
            return true;
        };
    }

    /**
     * 命中率判定
     *
     * @param {} target - 
     * @returns {} 
     */
    if (ChangeHitFormula) {
        Game_Action.prototype.itemHit = function(target) {
            const successRate = this.item().successRate * 0.01;
            if (this.isPhysical()) {
                return successRate * this.subject().hit - target.eva;
            } else if (this.isMagical()) {
                return successRate - target.mev;
            } else { // 必中は相手の回避を無視
                return successRate;
            }
        };

        /**
         * 回避率判定
         *
         * @param {} target - 
         * @returns {} 
         */
        Game_Action.prototype.itemEva = function(target) {
            return 0;
        };
    }

    // 運ステート付加影響
    if (!EnableLukState) {
        /**
         * 
         *
         * @param {} target - 
         * @returns {} 
         */
        Game_Action.prototype.lukEffectRate = function(target) {
            return 1;
        };
    }

    /**
     * 控えメンバーの経験獲得率を取得
     *
     * @returns {number} 控えメンバーの経験獲得率
     */
    Game_Actor.prototype.benchMembersExpRate = function() {
        return $dataSystem.optExtraExp ? ExpRate : 0;
    };

    // TP最大時TP増加アイテム使用可能
    if (UseDisableMaxTp) {
        /**
         * 
         *
         * @param {} target - 
         * @param {} effect - 
         * @returns {} 
         */
        const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
        Game_Action.prototype.testItemEffect = function(target, effect) {
            let value = _Game_Action_testItemEffect.apply(this, arguments);
            if (!value) return false;

            switch (effect.code) {
                case Game_Action.EFFECT_GAIN_TP:
                    value = target.tp < target.maxTp() || effect.value1 < 0
            }
            return value;
        };
    }
})();
