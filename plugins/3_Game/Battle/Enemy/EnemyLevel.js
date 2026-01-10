/*:
@plugindesc
敵キャラレベル追加 Ver1.0.0(2025/10/19)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Enemy/EnemyLevel.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
敵キャラにレベルの概念を追加し、レベルに応じて能力値、経験値
所持金、ドロップアイテム、行動パターンを動的に変更できます

## 使い方
### 1. 敵レベルを管理する変数を設定
プラグインパラメータ「敵キャラレベル変数」を開き
敵グループのメンバー1～8番目に対応する変数をそれぞれ設定します

### 2. イベントで敵レベルを操作
イベントコマンド「変数の操作」などを使って、STEP1で設定した変数に
数値を代入します。この値が戦闘時の敵のレベルになります

### 3. メモ欄で詳細設定（任意）
敵キャラのメモ欄にタグを記述することで、レベルごとの挙動を
細かくカスタマイズできます

#### 能力値・経験値・所持金
レベルに応じて、各値を変動させることができます

**書式:**
`<タグ名:Lv,値>`

**タグ名:** HP, MP, 攻撃力, 防御力, 魔法力, 魔法防御, 敏捷性, 運,
        経験値, 所持金 (経験値と所持金のタグ名はパラメータで変更可)
**Lv:**
  - `0`: レベルごとの **上昇値** を指定します
  - `1`以上: 特定レベルでの **基礎値** または **固定値** を指定します

**値の決まり方:**
1. 現在のレベルと一致する `<タグ名:Lv,値>` があれば、その値が **固定値** と
   して使われます
2. ない場合、`基礎値 + (上昇値 * (現在のレベル - 1))` で計算されます
  - **基礎値:** 現在のレベル未満で設定された `<タグ名:Lv,値>` のうち
    最もLvが大きいものが使用します。設定がなければデータベースの値を使用
  - **上昇値:** `<タグ名:0,値>` で設定された値が使われます

**設定例:**
・Lv1のHPが100で、1レベルごとに50ずつ上昇
`<HP:1,100>`
`<HP:0,50>`

・Lv10のときだけHPを1000に固定する
`<HP:10,1000>`

#### ドロップアイテム
指定したレベル以上の場合に、追加でアイテムをドロップさせます

**書式:**
`<ドロップ:Lv,アイテム名,個数,確率,レベル毎の確率上昇>`

**設定例:**
・Lv5以上のとき、薬草を1個、50%の確率でドロップ
`<ドロップ:5,薬草,1,50,0>`

#### 行動パターン
指定したレベル範囲のときだけ、行動パターンを追加します

**書式:**
`<行動:最小Lv,最大Lv,スキル名,レーティング,...>`
※ `最大Lv` を `0` にすると上限なしになります。

**設定例:**
・Lv10～20のとき、レーティング5で「ファイア」を使用する
`<行動:10,20,ファイア,5>`

@param FixBattleEnemyDrawItem
@type boolean
@text 敵キャラ選択ウィンドウバグ修正
@desc 敵キャラを選択するウィンドウで制御文字が使えないバグ修正
@on 修正する
@off 修正しない
@default true

@param ExpMetaName
@text 経験値タグ
@desc 経験値に使うメモ欄タグの名称
デフォルトは 経験値
@default 経験値

@param GoldMetaName
@text 所持金タグ
@desc 所持金に使うメモ欄タグの名称
デフォルトは 所持金
@default 所持金

@param EnemyLevelVariables
@type variable[]
@text 敵キャラレベル変数
@desc 敵キャラのレベルを管理する変数
@default ["53", "54", "55", "56", "57", "58", "59", "60"]
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
    function Potadra_numberArray(data) {
        return data ? JSON.parse(data).map(Number) : [];
    }
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
        }
        return false;
    }
    function Potadra_checkSystem(data, name, val = false) {
        if (isNaN(name)) {
            for (let i = 1; i < data.length; i++) {
                if (name === data[i]) {
                    return i;
                }
            }
            return val;
        }
        return Number(name || val);
    }
    function Potadra_random(probability, rate = 1) {
        return Math.random() <= probability / 100 * rate;
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
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const FixBattleEnemyDrawItem = Potadra_convertBool(params.FixBattleEnemyDrawItem);
    const ExpMetaName            = String(params.ExpMetaName  || '経験値');
    const GoldMetaName           = String(params.GoldMetaName || '所持金');
    const EnemyLevelVariables    = Potadra_numberArray(params.EnemyLevelVariables);

    // 敵キャラ選択ウィンドウバグ修正
    if (FixBattleEnemyDrawItem) {
        /**
         * 項目の描画
         *
         * @param {number} index -
         */
        Window_BattleEnemy.prototype.drawItem = function(index) {
            this.resetTextColor();
            const name = this._enemies[index].name();
            const rect = this.itemLineRect(index);
            this.drawTextEx(name, rect.x, rect.y, rect.width);
        };
    }

    /**
     * レベルごとの値を設定
     *
     * @param {number} level - 現在のレベル
     * @param {} meta - メタデータ
     * @param {number} base_val - 基礎値
     * @param {number} val - レベルごとの上昇値
     * @returns {}
     */
    function setVal(level, meta, base_val, val) {
        const meta_data = Potadra_metaData(meta);
        if (meta_data) {
            let before_level = 0;

            for (const meta_value of meta_data) {
                if (meta_value) {
                    const data = meta_value.split(',');
                    const lv = Number(data[0]);
                    const va = Number(data[1]);
                    if (lv === level) { // レベルが一致したらその値を返す
                        return [va, 0];
                    } else if (lv === 0) { // 0 は上昇値として使用
                        val = va;
                    } else if (lv < level && lv > before_level) { // 現在のレベルより低い設定があった場合
                        before_level = lv;
                        base_val = va;
                    }
                }
            }
        }

        return [base_val, val];
    }

    /**
     * 敵キャラを扱うクラスです。
     * このクラスは Game_Troop クラス（$gameTroop）の内部で使用されます。
     *
     * @class
     */

    /**
     * 通常能力値の基本値取得
     *
     * @param {} paramId -
     * @returns {}
     */
    Game_Enemy.prototype.paramBase = function(paramId) {
        const level      = this.level();
        const enemy      = this.enemy();
        const base_param = enemy.params[paramId];

        if (level >= 1) {
            let param;

            if (paramId == 0 || paramId == 1) {
                param = 10;
            } else {
                param = 1;
            }
            const params = setVal(level, enemy.meta[TextManager.param(paramId)], base_param, param);
            return params[0] + (params[1] * (level - 1));
        } else {
            return base_param;
        }
    };

    /**
     * レベルの取得
     *
     * @returns {number} レベル
     */
    Game_Enemy.prototype.level = function() {
        const variable_id = Potadra_checkSystem($dataSystem.variables, EnemyLevelVariables[this.index()]);
        return $gameVariables.value(variable_id);
    };

    /**
     * 経験値の取得
     *
     * @returns {number} 経験値
     */
    Game_Enemy.prototype.exp = function() {
        const enemy    = this.enemy();
        const level    = this.level();
        const base_exp = enemy.exp;
        if (level >= 1) {
            const exp  = Math.floor(enemy.exp / 10);
            const exps = setVal(level, enemy.meta[ExpMetaName], base_exp, exp);
            return exps[0] + (exps[1] * (level - 1));
        } else {
            return base_exp;
        }
    };

    /**
     * 所持金の取得
     *
     * @returns {number} 所持金
     */
    Game_Enemy.prototype.gold = function() {
        const enemy     = this.enemy();
        const level     = this.level();
        const base_gold = enemy.gold;
        if (level >= 1) {
            const gold  = Math.floor(enemy.gold / 10);
            const golds = setVal(level, enemy.meta[GoldMetaName], base_gold, gold);
            return golds[0] + (golds[1] * (level - 1));
        } else {
            return base_gold;
        }
    };

    /**
     * ドロップアイテムの配列作成
     *
     * @example <ドロップ:0,薬草,10,50,0
     *                    1,ポーション,50,50,0>
     * @returns {}
     */
    Game_Enemy.prototype.makeDropItems = function() {
        const rate       = this.dropItemRate();
        const drop_items = this.enemy().dropItems.reduce((r, di) => {
            if (Potadra_random(di.denominator, rate)) {
                return r.concat(this.itemObject(di.kind, di.dataId));
            } else {
                return r;
            }
        }, []);

        const data = Potadra_metaData(this.enemy().meta['ドロップ']);
        if (data) {
            for (const value of data) {
                if (value) {
                    const drops = value.split(',');
                    const level = this.level();

                    // 設定されているレベル以上なら該当アイテム判定
                    if ( level >= Number(drops[0]) ) {
                        let percent       = Number(drops[3]);
                        let level_percent = (Number(drops[4]) * level);
                        if (Potadra_random(percent + (level_percent * level), rate)) {
                            const item  = Potadra_itemSearch(drops[1].trim());
                            const count = Number(drops[2]);
                            for (let j = 0; j < count; j++) {
                                drop_items.push(item);
                            }
                        }
                    }
                }
            }
        }

        return drop_items;
    };

    /**
     * 表示名の取得
     *
     * @returns {}
     */
    Game_Enemy.prototype.name = function() {
        let name = this.originalName() + (this._plural ? this._letter : "");
        const level = this.level();
        if (level > 0) {
            name = name + 'Lv.' + level;
        }
        return name;
    };

    /**
     * 行動条件合致判定
     *     action : RPG::Enemy::Action
     *
     * @param {} action - 
     * @returns {} 
     */
    function meetsCondition(conditionType) {
        switch (conditionType) {
            case 'ターン':
                return 1;
            case 'HP':
                return 2;
            case 'MP':
                return 3;
            case 'ステート':
                return 4;
            case 'パーティーLV':
                return 5;
            case 'スイッチ':
                return 6;
            default:
                return 0;
        }
    }

    /**
     * 戦闘行動の作成
     *
     * @example <行動:0,0,攻撃
     *                1,10,ファイア>
     */
    Game_Enemy.prototype.makeActions = function() {
        Game_Battler.prototype.makeActions.call(this);
        if (this.numActions() > 0) {
            // 割り込み
            const data = Potadra_metaData(this.enemy().meta['行動']);

            const actions = [];
            if (data) {
                for (const value of data) {
                    if (value) {
                        const action    = value.split(',');
                        const level     = this.level();
                        const min_level = Number(action[0]);
                        const max_level = Number(action[1]);
                        let use         = false;

                        // レベルによる条件判定
                        if (min_level === 0 && max_level === 0) {
                            // 条件が設定されていない場合、無条件で使用
                            use = true;
                        } else if (min_level <= level && (level === 0 || level <= max_level)) {
                            // 設定されているレベル範囲内なら該当行動パターン判定(上限はレベル0なら無視される)
                            use = true;
                        }

                        if (use) {
                            actions.push(
                                {
                                    skillId: Potadra_nameSearch($dataSkills, action[2].trim()),
                                    rating: Number(action[3] || 5),
                                    conditionType: meetsCondition(action[4]),
                                    conditionParam1: Number(action[5] || 0),
                                    conditionParam2: Number(action[6] || 0)
                                }
                            );
                        }
                    }
                }
            }

            let actionList = this.enemy().actions.concat(actions).filter(a =>
                this.isActionValid(a)
            );
            if (actionList.length > 0) {
                this.selectAllActions(actionList);
            }
        }
        this.setActionState("waiting");
    };


    /**
     * 敵グループおよび戦闘に関するデータを扱うクラスです。
     * バトルイベントの処理も行います。
     * このクラスのインスタンスは $gameTroop で参照されます。
     *
     * @class
     */

    /**
     * 敵キャラ名の配列取得
     *    戦闘開始時の表示用。重複は除去する。
     *
     * @returns {}
     */
    Game_Troop.prototype.enemyNames = function() {
        const names = [];
        for (const enemy of this.members()) {
            let name = enemy.originalName();
            const level = enemy.level();
            if (level > 0) {
                name = name + 'Lv.' + level;
            }
            if (enemy.isAlive() && !names.includes(name)) {
                names.push(name);
            }
        }
        return names;
    };

    /**
     * セットアップ
     *
     * @param {} troopId -
     */
    const _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.apply(this, arguments);

        // 能力値の参照が使うときだけなので、ターン0 のとき全回復
        if (this._turnCount === 0) {
            this.members().forEach(function(enemy){
                enemy.recoverAll();
            });
        }
    };
})();
