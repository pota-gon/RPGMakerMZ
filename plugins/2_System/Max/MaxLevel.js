/*:
@plugindesc
レベル上限突破 Ver1.0.0(2025/10/19)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Max/MaxLevel.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
レベルの上限を変更します

## 使い方
アクターのメモ欄に以下のいずれかのメモを記載します

### レベル設定
アクターの初期レベルと最大レベルをメモ欄で設定できます  
データベースの設定より、こちらのレベル設定が優先されます  
省略した場合は、データベースの設定が適用されます

<初期レベル:1>
=> 初期レベルを 1 にする

<最大レベル:99>
=> 最大レベルを 99 にする

### 能力値設定
初期値と成長率を設定します。職業の能力値設定は無効になり  
アクター OR 職業のメモ欄で設定するようになります

<初期値:120,120,15,15,15,15,15,15>
=> アクターの初期値を HP,MP,攻撃力,防御力,魔法力,魔法防御,敏捷性,運 
   で指定します

<成長率:120,120,15,15,15,15,15,15>
=> アクターの成長率を HP,MP,攻撃力,防御力,魔法力,魔法防御,敏捷性,運 
   で指定します

<パラメータ名:初期値,成長率>
=> パラメータごとに個別に設定することが出来ます  
   パラメータ名は、用語で指定した名称と同じです  
   最大MPの設定例: <最大MP:120,15>

※ メモ欄未記載の場合
=> アクターの初期値を HP・MP: 100 他の能力値は 10 で指定します  
   レベルごとの成長率は、HP・MPが10、他の能力値は1

<モブ>
=> アクターの初期値を HP・MP: 50 他の能力値は 5 で指定します  
   レベルごとの成長率は、HP・MPが10、他の能力値は1

<ザコ>
=> アクターの初期値を HP・MP: 10 他の能力値は 1 で指定します  
   レベルごとの成長率は、HP・MPが10、他の能力値は1

@param MinLevel
@type number
@text 初期レベル
@desc 最大レベルより大きい値を設定した場合は
最大レベルが初期レベルになります
@default 1
@max 999999999999999
@min 0

    @param MinLevelName
    @parent MinLevel
    @type string
    @text 初期レベル名称
    @desc アクターのメモに記載するメタデータ(<初期レベル>)の名称
          データベースの設定より、こちらのレベル設定が優先されます
    @default 初期レベル

@param MaxLevel
@type number
@text 最大レベル
@desc 0 で無限になるが、MZはループが多いと処理低下や
フリーズするので、9999 以上にすることはおすすめしません
@default 9999
@max 999999999999999
@min 0

    @param MaxLevelName
    @parent MaxLevel
    @type string
    @text 最大レベル名称
    @desc アクターのメモに記載するメタデータ(<最大レベル>)の名称
          データベースの設定より、こちらのレベル設定が優先されます
    @default 最大レベル

@param InitName
@type string
@text 初期値名称
@desc アクターのメモに記載するメタデータ(<初期値>)の名称
@default 初期値

@param GrowName
@type string
@text 成長率名称
@desc アクターのメモに記載するメタデータ(<成長率>)の名称
@default 成長率

@param MobName
@type string
@text モブ名称
@desc アクターのメモに記載するメタデータ(<モブ>)の名称
モブは初期能力が低くなる
@default モブ

@param SmallFishName
@type string
@text ザコ名称
@desc アクターのメモに記載するメタデータ(<ザコ>)の名称
      ザコは初期能力が低くなる
@default ザコ

@param MaxLevelMenu
@type boolean
@text レベル上限突破メニュー
@desc レベル上限突破用のメニューに変更します
@on レベル上限突破メニュー
@off 通常メニュー
@default false

@param Init
@text 初期値
@desc ※ 分類用のパラメータです

    @param NormalInitHp
    @parent Init
    @type number
    @text HP初期値(通常)
    @desc タグを指定しない場合の初期値
    @default 100
    @min 0
    @max 999999999999999

    @param NormalInitMp
    @parent Init
    @type number
    @text MP初期値(通常)
    @desc タグを指定しない場合の初期値
    @default 100
    @min 0
    @max 999999999999999

    @param NormalInitParam
    @parent Init
    @type number
    @text 能力初期値(通常)
    @desc タグを指定しない場合の初期値
    @default 10
    @min 0
    @max 999999999999999

    @param MobInitHp
    @parent Init
    @type number
    @text HP初期値(モブ)
    @desc タグを指定しない場合の初期値
    @default 50
    @min 0
    @max 999999999999999

    @param MobInitMp
    @parent Init
    @type number
    @text MP初期値(モブ)
    @desc タグを指定しない場合の初期値
    @default 50
    @min 0
    @max 999999999999999

    @param MobInitParam
    @parent Init
    @type number
    @text 能力初期値(モブ)
    @desc タグを指定しない場合の初期値
    @default 5
    @min 0
    @max 999999999999999

    @param SmallFishInitHp
    @parent Init
    @type number
    @text HP初期値(ザコ)
    @desc タグを指定しない場合の初期値
    @default 10
    @min 0
    @max 999999999999999

    @param SmallFishInitMp
    @parent Init
    @type number
    @text MP初期値(ザコ)
    @desc タグを指定しない場合の初期値
    @default 10
    @min 0
    @max 999999999999999

    @param SmallFishInitParam
    @parent Init
    @type number
    @text 能力初期値(ザコ)
    @desc タグを指定しない場合の初期値
    @default 1
    @min 0
    @max 999999999999999

@param Increase
@text 成長率
@desc ※ 分類用のパラメータです

    @param NormalIncreaseHp
    @parent Increase
    @type number
    @text HP成長率
    @desc タグを指定しない場合の成長率
    @default 10
    @min 0
    @max 999999999999999

    @param NormalIncreaseMp
    @parent Increase
    @type number
    @text MP成長率
    @desc タグを指定しない場合の成長率
    @default 10
    @min 0
    @max 999999999999999

    @param NormalIncreaseParam
    @parent Increase
    @type number
    @text 能力成長率
    @desc タグを指定しない場合の成長率
    @default 1
    @min 0
    @max 999999999999999

@command change_level
@text レベルの変更
@desc イベントコマンドからの値以上のレベル変更を可能にします

    @arg actorId
    @type actor
    @text アクター
    @desc レベルを変更するアクター
    なしを選択した場合、パーティー全体が対象になります
    @default 0

    @arg level
    @type number
    @text レベル
    @desc 増減するレベル
    マイナス値でレベルを下げることができます
    @default 1
    @max 999999999999999
    @min -999999999999999

    @arg show
    @type boolean
    @text レベルアップ表示
    @desc レベルアップを表示するかの設定
    @on 表示する
    @off 表示しない
    @default false
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
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MinLevel            = Number(params.MinLevel || 1);
    const MaxLevel            = Number(params.MaxLevel || 9999);
    const MinLevelName        = String(params.MinLevelName || '初期レベル');
    const MaxLevelName        = String(params.MaxLevelName || '最大レベル');
    const InitName            = String(params.InitName || '初期値');
    const GrowName            = String(params.GrowName || '成長率');
    const MobName             = String(params.MobName || 'モブ');
    const SmallFishName       = String(params.SmallFishName || 'ザコ');
    const MaxLevelMenu        = Potadra_convertBool(params.MaxLevelMenu);
    const NormalInitHp        = Number(params.NormalInitHp || 0);
    const NormalInitMp        = Number(params.NormalInitMp || 0);
    const NormalInitParam     = Number(params.NormalInitParam || 0);
    const MobInitHp           = Number(params.MobInitHp || 0);
    const MobInitMp           = Number(params.MobInitMp || 0);
    const MobInitParam        = Number(params.MobInitParam || 0);
    const SmallFishInitHp     = Number(params.SmallFishInitHp || 0);
    const SmallFishInitMp     = Number(params.SmallFishInitMp || 0);
    const SmallFishInitParam  = Number(params.SmallFishInitParam || 0);
    const NormalIncreaseHp    = Number(params.NormalIncreaseHp || 0);
    const NormalIncreaseMp    = Number(params.NormalIncreaseMp || 0);
    const NormalIncreaseParam = Number(params.NormalIncreaseParam || 0);

    // 他プラグイン連携(プラグインの導入有無)
    const NameDatabase = Potadra_isPlugin('NameDatabase');

    // プラグインコマンド(レベルの変更)
    PluginManager.registerCommand(plugin_name, "change_level", args => {
        const actorId = Number(args.actorId || 0);
        const level   = Number(args.level || 1);
        const show    = Potadra_convertBool(args.show);

        if (actorId === 0) {
            $gameParty.members().forEach(actor => {
                actor.changeLevel(actor.level + level, show);
            });
        } else {
            const actor = $gameActors.actor(actorId);
            actor.changeLevel(actor.level + level, show);
        }
    });

    /**
     * アクターを扱うクラスです。
     * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
     * Game_Party クラス（$gameParty）からも参照されます。
     *
     * @class
     */

    /**
     * セットアップ
     *
     * @param {number} actorId - アクターID
     */
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.apply(this, arguments);
        const actor = this.actor(); // $dataActors[actorId];
        const min_level_str = Potadra_meta(actor.meta, MinLevelName);
        const max_level_str = Potadra_meta(actor.meta, MaxLevelName);
        let min_level = min_level_str ? Number(min_level_str) : MinLevel;
        let max_level = max_level_str ? Number(max_level_str) : MaxLevel;
        if (min_level > max_level) min_level = max_level;
        this._level = min_level > actor.initialLevel ? min_level : actor.initialLevel;
        this.initImages();
        this.initExp();
        this.initSkills();
        this.initEquips(actor.equips);
        this.clearParamPlus();
        this.recoverAll();
    };

    /**
     * 最大レベル
     *
     * @returns {}
     */
    Game_Actor.prototype.maxLevel = function() {
        const max_level_str = Potadra_meta(this.actor().meta, MaxLevelName);
        let max_level = max_level_str ? Number(max_level_str) : MaxLevel;
        if (max_level === 0) {
            max_level = Infinity;
        }
        return max_level;
    };

    /**
     * 最大レベル判定
     *
     * @returns {boolean} 最大レベルに到達しているか
     */
    Game_Actor.prototype.isMaxLevel = function() {
        const max_level = this.maxLevel();
        if (max_level === Infinity) {
            return false;
        } else {
            return this._level >= this.maxLevel();
        }
    };

    /**
     * 通常能力値の基本値取得
     *
     * @param {} paramId -
     * @returns {}
     */
    Game_Actor.prototype.paramBase = function(paramId) {
        const actor = this.actor();

        let class_data = Potadra_metaData(this.currentClass().meta[TextManager.param(paramId)], ',');
        let actor_data = Potadra_metaData(actor.meta[TextManager.param(paramId)], ',');
        let data = actor_data ? actor_data : class_data;
        let init_param, param; // 初期値, 成長率

        if (paramId === 0 && !data) {
            data = Potadra_metaData(actor.meta[TextManager.hp], ',');
            if (!data) data = Potadra_metaData(actor.meta[TextManager.hpA], ',');
        } else if (paramId === 1 && !data) {
            data = Potadra_metaData(actor.meta[TextManager.mp], ',');
            if (!data) data = Potadra_metaData(actor.meta[TextManager.mpA], ',');
        }

        if (data) {
            init_param = Number(data[0]);
            param      = Number(data[1]);
        } else {
            const init_params = Potadra_metaData(actor.meta[InitName], ',');
            const params      = Potadra_metaData(actor.meta[GrowName], ',');
            const small_fish  = Potadra_meta(actor.meta, SmallFishName);
            const mob         = Potadra_meta(actor.meta, MobName);
            if (paramId === 0) {
                param = NormalIncreaseHp;
                if (small_fish) {
                    init_param = SmallFishInitHp;
                } else if (mob) {
                    init_param = MobInitHp;
                } else {
                    init_param = NormalInitHp;
                }
            } else if (paramId == 1) {
                param = NormalIncreaseMp;
                if (small_fish) {
                    init_param = SmallFishInitMp;
                } else if (mob) {
                    init_param = MobInitMp;
                } else {
                    init_param = NormalInitMp;
                }
            } else {
                param = NormalIncreaseParam;
                if (small_fish) {
                    init_param = MobInitParam;
                } else if (mob) {
                    init_param = SmallFishInitParam;
                } else {
                    init_param = NormalInitParam;
                }
            }

            if (init_params) init_param = Number(init_params[paramId]);
            if (params) param = Number(params[paramId]);
        }

        return init_param + (param * (this._level - 1));
    };

    /**
     * 経験値の変更
     *
     * @param {number} exp - 経験値
     * @param {boolean} show - レベルアップ表示をするか
     */
    Game_Actor.prototype.changeExp = function(exp, show) {
        this._exp[this._classId] = Math.max(exp, 0);
        const lastLevel = this._level;
        const lastSkills = this.skills();

        let low_level  = 1;
        let high_level = this.maxLevel();
        let count = 0;

        if (high_level === Infinity) {
            // 無限の場合は、最大レベルをフリーザ様の戦闘力で探す
            // 1. フリーザ様の戦闘力53万でループを減らす
            // this._exp[this._classId] = Math.min(exp, 999999999999999); // 無限の場合、一度に入手出来る経験値に制限を入れる
            while (this.currentExp() >= this.nextLevelExp()) {
                low_level = this._level;
                this._level += 530000;
                high_level = this._level;
                count++;
            }
            // if (high_level === Infinity) high_level = 999999999999999;
        } else {
            // 2. 二分探索で「最高にハイってやつだ」になったDIO様のテンションを下げる
            let diff = high_level - low_level;
            while (count < 1000 && diff > 10) {
                if (this.currentExp() < this.currentLevelExp()) {
                    high_level = this._level;
                    this._level = Math.floor(high_level / 2);
                    low_level = this._level;
                } else {
                    diff = high_level - low_level;
                    this._level = low_level + Math.floor(diff / 2);
                }

                if (this.currentExp() >= this.nextLevelExp()) {
                    low_level = this._level;
                }
                count++;
            }
            // console.log('diff: ' + diff);
        }
        // console.log('Count: ' + count);
        // console.log('Low: ' + low_level);
        // console.log('High: ' + high_level);

        // 3. 春休みの終わりでローテーションになっている学生のテンションを上げる
        this._level = low_level;
        while (high_level > this._level && this.currentExp() >= this.nextLevelExp()) {
            this._level++;
        }

        // 処理速度が遅いのでデフォルトの処理を改変
        for (const learning of this.currentClass().learnings) {
            if (lastLevel < learning.level && learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }

        // 名前メモデータベース対応
        if (NameDatabase) {
            const learnings = Potadra_learnings(this);
            for (const learning of learnings) {
                if (lastLevel < learning.level && learning.level <= this._level) {
                    this.learnSkill(learning.skillId);
                }
            }
        }

        while (this.currentExp() < this.currentLevelExp()) {
            this.levelDown();
        }
        if (show && this._level > lastLevel) {
            this.displayLevelUp(this.findNewSkills(lastSkills));
        }
        // console.log('Level: ' + this._level);

        this.refresh();
    };

    // レベル上限突破メニュー
    if (MaxLevelMenu) {
        /**
         *
         *
         * @param {} actor -
         * @param {number} x - X座標
         * @param {number} y - Y座標
         */
        Window_StatusBase.prototype.drawActorSimpleStatus = function(actor, x, y) {
            const lineHeight = this.lineHeight() - 6;
            const x2 = x + 140;
            this.contents.fontSize = 20;
            this.drawActorName(actor, x, y);
            this.drawActorLevel(actor, x, y + lineHeight * 1);
            this.drawActorIcons(actor, x, y + lineHeight * 2);
            this.drawActorClass(actor, x2, y);
            this.placeBasicGauges(actor, x2, y + lineHeight);
            this.resetFontSettings();
        };

        /**
         *
         *
         * @param {} actor -
         * @param {number} x - X座標
         * @param {number} y - Y座標
         */
        Window_StatusBase.prototype.drawActorLevel = function(actor, x, y) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.levelA, x, y, 48);
            this.resetTextColor();
            this.drawText(actor.level, x + 30, y, 90, "right");
        };

        /**
         *
         *
         * @param {} actor -
         * @param {} type -
         * @param {number} x - X座標
         * @param {number} y - Y座標
         */
        Window_MenuStatus.prototype.placeGauge = function(actor, type, x, y) {
            const key = "actor%1-gauge-%2".format(actor.actorId(), type);
            const sprite = this.createInnerSprite(key, Sprite_StatusGauge);
            sprite.setup(actor, type);
            sprite.move(x, y);
            sprite.show();
        };
        Window_SkillStatus.prototype.placeGauge = function(actor, type, x, y) {
            const key = "actor%1-gauge-%2".format(actor.actorId(), type);
            const sprite = this.createInnerSprite(key, Sprite_StatusGauge);
            sprite.setup(actor, type);
            sprite.move(x, y);
            sprite.show();
        };
        Window_Status.prototype.placeGauge = function(actor, type, x, y) {
            const key = "actor%1-gauge-%2".format(actor.actorId(), type);
            const sprite = this.createInnerSprite(key, Sprite_StatusGauge);
            sprite.setup(actor, type);
            sprite.move(x, y);
            sprite.show();
        };

        class Sprite_StatusGauge extends Sprite_Gauge {
            constructor() {
                super();
            }
            bitmapWidth() {
                return 192;
            }
            labelFontSize() {
                return $gameSystem.mainFontSize() - 8;
            }
            valueFontFace() {
                return $gameSystem.numberFontFace() - 6;
            }
            valueFontSize() {
                return $gameSystem.mainFontSize() - 8;
            }
        }
    }
})();
