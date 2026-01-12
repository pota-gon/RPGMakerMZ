/*:
@plugindesc
アクター・敵キャラ召喚 Ver1.0.2(2026/1/12)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Skill/SummonBattler.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.2: プレスキル・サブスキル機能を別プラグインに分離
* Ver1.0.1: プレスキル機能追加、検索にキャッシュ追加
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
アクターと敵キャラを戦闘中に召喚できる機能を追加します

## 使い方
1. データベースで、召喚したいアクターや敵キャラを作成します
2. 召喚用のスキルを作成します
3. スキルのメモ欄に、後述するタグを使って召喚する対象などを設定します
   例: <アクター召喚: 1>
4. 戦闘中にそのスキルを使用すると、アクターや敵キャラが召喚されます

## メモ欄タグ

### スキル用のタグ
スキルのメモ欄に記述して使用します

#### アクター召喚
<アクター召喚: アクターIDまたは名前, ...>
指定したアクターを戦闘に参加させます
カンマ(,)で区切ることで、一度に複数体を召喚できます
戦闘メンバーが上限に達している場合は召喚できません
召喚されたアクターは戦闘終了後にパーティから離脱します

例:
<アクター召喚: 5> // ID5のアクターを召喚
<アクター召喚: ハロルド, マーシャ> // ハロルドとマーシャを召喚

#### 敵キャラ召喚
<敵キャラ召喚: 敵キャラIDまたは名前, ...>
指定した敵キャラを戦闘に出現させます
カンマ(,)で区切ることで、一度に複数体を召喚できます
出現している敵味方の合計数が、味方の最大戦闘人数を超える場合は召喚できません

例:
<敵キャラ召喚: 2> // ID2の敵キャラを召喚
<敵キャラ召喚: ゴブリン, スライム> // ゴブリンとスライムを召喚

#### 消滅
<消滅>
このタグが設定されたスキルで戦闘不能になったキャラクターは
「戦闘不能スキル」が発動しなくなります
一撃で消し去るような演出のスキルに使用します

#### 再配置しない
<再配置しない>
このタグが設定されたスキルで敵を召喚した際、
既存の敵キャラクターの再配置を行いません。

### アクター・敵キャラ用のタグ
アクター、または敵キャラのメモ欄に記述して使用します

#### 戦闘不能スキル
<戦闘不能スキル: スキルIDまたは名前
スキルIDまたは名前
...>
このタグが設定されたキャラクターが戦闘不能になったとき
指定したスキルを使用します
改行で区切ることで、一度に複数のスキルを発動できます
行動主体は戦闘不能になったキャラクター自身です
「最後の力」「リベンジブラスト」のような効果を実装できます

例:
<戦闘不能スキル: 20> // ID20のスキルを発動
<戦闘不能スキル: 自爆> // 自爆スキルを発動
<戦闘不能スキル: 自爆
20> // 自爆とID20のスキルを順番に発動

## プラグインパラメータ

#### アクター召喚タグ
アクターを召喚するためのメモ欄タグ名を指定します
デフォルト: アクター召喚

#### 敵キャラ召喚タグ
敵キャラを召喚するためのメモ欄タグ名を指定します
デフォルト: 敵キャラ召喚

#### ダミーアクター開始ID
召喚されたアクターに割り振られる、一時的なアクターIDの開始番号です
既存のアクターIDと重複しないように、十分に大きな値を設定してください
デフォルト: 10000

#### 召喚アクター経験値獲得
ONにすると、召喚されたアクターも戦闘終了時に経験値を獲得するようになります
デフォルト: OFF (獲得しない)

#### 戦闘不能スキルタグ
戦闘不能時スキルを指定するためのメモ欄タグ名を指定します
デフォルト: 戦闘不能スキル

#### 戦闘不能時にアクターを外す
ONにすると、召喚されたアクターが戦闘不能になった際、パーティから離脱します
OFFの場合、戦闘不能状態のまま戦闘終了まで残ります
デフォルト: ON (外す)

#### アクター戦闘不能記憶変数
指定した番号のゲーム内変数に、戦闘不能になった召喚アクターの数を記録します
0を指定すると、この機能は無効になります
デフォルト: 0

#### 敵キャラ戦闘不能記憶変数
指定した番号のゲーム内変数に、戦闘不能になった敵キャラの数を記録します
0を指定すると、この機能は無効になります
デフォルト: 0

#### 消滅タグ
戦闘不能スキルを無効化する「消滅」効果のメモ欄タグ名を指定します
デフォルト: 消滅

@param SummonActorMetaName
@text アクター召喚タグ
@desc アクター召喚に使うメモ欄タグの名称
デフォルトは アクター召喚
@default アクター召喚

@param SummonEnemyMetaName
@text 敵キャラ召喚タグ
@desc 敵キャラ召喚に使うメモ欄タグの名称
デフォルトは 敵キャラ召喚
@default 敵キャラ召喚

@param DummyActorId
@type number
@text ダミーアクター開始ID
@desc 召喚用のダミーアクター開始ID
召喚されたアクターは、このダミーアクターの連番となります
@default 10000
@min 1
@max 999999999999999

@param SummonActorGainExp
@type boolean
@text 召喚アクター経験値獲得
@desc 召喚したアクターに経験値を獲得させるか
@on 獲得する
@off 獲得しない
@default false

@param FaintMetaName
@text 戦闘不能スキルタグ
@desc 戦闘不能スキルに使うメモ欄タグの名称
デフォルトは 戦闘不能スキル
@default 戦闘不能スキル

@param FaintRemoveActor
@type boolean
@text 戦闘不能時にアクターを外す
@desc 戦闘不能時にアクターを外すか
@on 外す
@off 外さない
@default true

@param ActorFaintVariable
@type variable
@text アクター戦闘不能記憶変数
@desc アクターの戦闘不能を記憶する変数
0 の場合は、戦闘不能は記憶しません
@default 0

@param EnemyFaintVariable
@type variable
@text 敵キャラ戦闘不能記憶変数
@desc 敵キャラの戦闘不能を記憶する変数
0 の場合は、戦闘不能は記憶しません
@default 0

@param LostMetaName
@text 消滅タグ
@desc 消滅スキルに使うメモ欄タグの名称
デフォルトは 消滅
@default 消滅

@param NoRepositionMetaName
@text 再配置しないタグ
@desc 敵キャラ召喚時に再配置しないを使うメモ欄タグの名称
デフォルトは 再配置しない
@default 再配置しない
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
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
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
    function Potadra_checkVariable(variable_no) {
        return variable_no > 0 && variable_no <= 5000;
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const SummonActorMetaName = String(params.SummonActorMetaName || "アクター召喚");
    const SummonEnemyMetaName = String(params.SummonEnemyMetaName || "敵キャラ召喚");
    let DummyActorId = Number(params.DummyActorId || 0);
    const StartDummyActorId = DummyActorId;
    const SummonActorGainExp = Potadra_convertBool(params.SummonActorGainExp);
    const FaintMetaName = String(params.FaintMetaName || '戦闘不能スキル');
    const FaintRemoveActor = Potadra_convertBool(params.FaintRemoveActor);
    const ActorFaintVariable = Number(params.ActorFaintVariable || 0);
    const EnemyFaintVariable = Number(params.EnemyFaintVariable || 0);
    const LostMetaName = String(params.LostMetaName || "消滅");
    const NoRepositionMetaName = String(params.NoRepositionMetaName || "再配置しない");

    // 他プラグイン連携(パラメータ取得)
    const debug_params = Potadra_getPluginParams('Debug');
    const EnableResolution = Potadra_convertBool(debug_params.EnableResolution);
    const ResolutionWidth = debug_params ? Number(debug_params.ResolutionWidth || 816) : 816;
    const ResolutionHeight = debug_params ? Number(debug_params.ResolutionHeight || 624) : 624;

    /**
     * アクター召喚
     *
     * @param {} item - 
     * @param {} subject - 
     * @param {} target - 
     */
    function summonActor(item, subject, target) {
        // 戦闘人数を超えていた場合は、アクターを召喚しない
        if ($gameParty.battleMembers().length > $gameParty.maxBattleMembers()) {
            return false;
        }

        const actorNames = Potadra_metaData(item.meta[SummonActorMetaName], ',');
        const summon_actor_ids = [];
        if (actorNames) {
            for (const actorName of actorNames) {
                let actorId = target && target.isActor() ? target.actorId() : subject;
                if (isNaN(actorName)) { // 文字列
                    actorId = Potadra_nameSearch($dataActors, actorName.trim());
                } else if (Number(actorName) !== 0) {
                    actorId = Number(actorName || 1);
                }

                // アクター召喚(ダミーアクター)追加
                const data_actor = $dataActors[actorId];
                if (data_actor && $gameParty.maxBattleMembers() > $gameParty.battleMembers().length) {
                    // $dataActors作成
                    const dummy_data_actor = JSON.parse(JSON.stringify(data_actor));
                    dummy_data_actor.id = DummyActorId;
                    $dataActors[DummyActorId] = dummy_data_actor;

                    // $gameActors作成
                    $gameActors.potadraDummyActor(DummyActorId);
                    $gameParty.addActor(DummyActorId);
                    DummyActorId++;

                    if (!summon_actor_ids.includes(actorId)) summon_actor_ids.push(actorId);
                }
            }
        }

        return summon_actor_ids;
    }

    /**
     * 敵キャラ召喚
     *
     * @param {} item - 
     * @param {} spriteset - 
     */
    function summonEnemy(item, spriteset) {
        let alive_length = $gameTroop.aliveMembers().length;
        if ($gameParty.maxBattleMembers() > alive_length) {
            const enemyNames = Potadra_metaData(item.meta[SummonEnemyMetaName], ',');
            if (enemyNames) {
                const noReposition = Potadra_meta(item.meta, NoRepositionMetaName);

                const size = screen_size();
                const width = size[0];
                const height = size[1];
                const totalEnemies = alive_length + enemyNames.length;
                const maxEnemies = Math.min($gameParty.maxBattleMembers(), totalEnemies);
                const baseY = height - 180 - 8; // 180 はメニューサイズ、 8 は余白

                // 最小間隔を設定（敵キャラが重ならない最小距離）
                const minSpacing = 80;
                const margin = 40; // 画面端からの余白
                const availableWidth = width - (margin * 2);
                const rowSpacing = 60; // 行間の間隔
                
                // 1行に配置できる最大数を計算
                const maxPerRow = Math.floor(availableWidth / minSpacing);
                const enemiesPerRow = Math.min(maxPerRow, maxEnemies);
                
                // 理想的な間隔と最小間隔のどちらか大きい方を使用
                const idealSpacing = availableWidth / (enemiesPerRow + 1);
                const spacing = Math.max(minSpacing, idealSpacing);
                
                // 実際に使用する幅を計算
                const actualWidth = spacing * enemiesPerRow;
                const startX = (width - actualWidth) / 2 + spacing / 2;
                
                let x = 0;
                let y = 0;
                let i = 0;
                let j = 0;
                
                if (!noReposition) {
                    // 既存の敵キャラを再配置
                    for (const enemy of $gameTroop.members()) {
                        if (enemy.isAlive()) {
                            const row = Math.floor(i / enemiesPerRow);
                            const col = i % enemiesPerRow;
                            x = startX + (spacing * col);
                            y = baseY - (rowSpacing * row);
                            // 画面外に出ないように制限
                            x = Math.max(margin, Math.min(width - margin, x));
                            y = Math.max(50, y); // 上端制限
                            spriteset._enemySprites[j].setHome(x, y);
                            i++;
                        }
                        j++;
                    }
                } else {
                    // 再配置しない場合は、既存の敵数分インデックスを進める
                    i = alive_length;
                }

                for (const enemyName of enemyNames) {
                    const enemyId = Potadra_nameSearch($dataEnemies, enemyName.trim());
                    const data_enemy = $dataEnemies[enemyId];

                    // 敵キャラ召喚
                    if (data_enemy && $gameParty.maxBattleMembers() > alive_length) {
                        const row = Math.floor(i / enemiesPerRow);
                        const col = i % enemiesPerRow;
                        
                        if (noReposition) {
                            // 再配置しない場合は、既存の敵の配置を考慮して新しい敵を配置
                            x = startX + (spacing * col);
                            y = baseY - (rowSpacing * row);
                        } else {
                            // 再配置する場合は、全体のレイアウトに合わせて配置
                            x = startX + (spacing * col);
                            y = baseY - (rowSpacing * row);
                        }
                        
                        // 画面外に出ないように制限
                        x = Math.max(margin, Math.min(width - margin, x));
                        y = Math.max(50, y); // 上端制限
                        i++;

                        const enemy = new Game_Enemy(enemyId, x, y);
                        enemy.onBattleStart();
                        $gameTroop._enemies.push(enemy);

                        // 画像の追加処理
                        const sprite_enemy = new Sprite_Enemy(enemy);
                        sprite_enemy.updateBitmap();
                        sprite_enemy.bitmap.addLoadListener(() => {
                            spriteset._enemySprites.push(sprite_enemy);
                            spriteset._battleField.addChild(sprite_enemy);
                        });

                        alive_length = $gameTroop.aliveMembers().length;
                    }
                }

                // 同名の敵キャラに ABC などの文字を付加
                $gameTroop.makeUniqueNames();
            }
        }
        return spriteset;
    }

    // 敵キャラ配置用サイズ取得
    function screen_size() {
        let width = Graphics.width;
        let height = Graphics.height;
        if (debug_params && EnableResolution) {
            if (!width) width = ResolutionWidth;
            if (!height) height = ResolutionHeight;
        } else {
            if (!width) width = $dataSystem.advanced.screenWidth;
            if (!height) height = $dataSystem.advanced.screenHeight;
        }
        return [width, height];
    }

    // 戦闘終了時の処理
    function endBattle() {
        // ダミーアクターを外す
        removeDummyActors();

        // 墓地の数をリセット
        if (Potadra_checkVariable(ActorFaintVariable)) $gameVariables.setValue(ActorFaintVariable, 0);
        if (Potadra_checkVariable(EnemyFaintVariable)) $gameVariables.setValue(EnemyFaintVariable, 0);
    }

    // ダミーアクターを外す
    function removeDummyActors() {
        // $gameActor の削除
        for (let actor_id = DummyActorId; actor_id >= StartDummyActorId; actor_id--) {
            removeDummyActor(actor_id);
        }
        while ($gameActors._data[$gameActors._data.length - 1] === undefined) {
            $gameActors._data.pop();
        }
    }
    function removeDummyActor(actor_id) {
        $gameParty.removeActor(actor_id);
        $gameActors._data.splice(actor_id, 1);
    }

    //------------------------------------------------------------------------------
    // Spriteset_Map
    //------------------------------------------------------------------------------
    // マップ画面のスプライトやタイルマップなどをまとめたクラスです。
    // このクラスは Scene_Map クラスの内部で使用されます。
    //------------------------------------------------------------------------------

    /**
     * タイルマップの作成
     */
    const _Spriteset_Map_createTilemap = Spriteset_Map.prototype.createTilemap;
    Spriteset_Map.prototype.createTilemap = function () {
        _Spriteset_Map_createTilemap.apply(this, arguments);

        // 戦闘終了時の処理
        endBattle();

        // $dataActor の削除(Spriteset_Map.prototype.createTilemap の後に呼ぶこと)
        for (let actor_id = DummyActorId; actor_id >= StartDummyActorId; actor_id--) {
            if ($dataActors[actor_id]) $dataActors.pop();
        }
        while ($dataActors.length > 0 && ($dataActors[$dataActors.length - 1] === undefined || $dataActors[$dataActors.length - 1] === null || $dataActors[$dataActors.length - 1] === "")) {
            $dataActors.pop();
        }
        DummyActorId = Number(params.DummyActorId || 0);
    };

    //------------------------------------------------------------------------------
    // BattleManager
    //------------------------------------------------------------------------------
    // 戦闘の進行を管理する静的クラスです。
    //------------------------------------------------------------------------------

    /**
     * 勝利の処理
     */
    const _BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function () {
        // 戦闘終了時の処理
        endBattle();
        _BattleManager_processVictory.apply(this, arguments);
    };

    /**
     * 中断の処理
     */
    const _BattleManager_processAbort = BattleManager.processAbort;
    BattleManager.processAbort = function () {
        // 戦闘終了時の処理
        endBattle();
        _BattleManager_processAbort.apply(this, arguments);
    };

    /**
     * 敗北の処理
     */
    const _BattleManager_processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function () {
        // 戦闘終了時の処理
        endBattle();
        _BattleManager_processDefeat.apply(this, arguments);
    };

    /**
     * アクション開始
     */
    const BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        const targets = this._subject.currentAction().makeTargets();
        if (targets.length === 0) {
            BattleManager_startAction.apply(this, arguments);
            this.potadraAction(this._action.item(), this._subject, targets[0]);
        } else {
            BattleManager_startAction.apply(this, arguments);
        }
    };

    /**
     * 通常アクションの呼び出し
     *
     * @param {} subject - 
     * @param {} target - 
     */
    BattleManager.invokeNormalAction = function (subject, target) {
        const item = this._action.item();
        this.potadraAction(item, subject, target);
    };

    /**
     * BattleManager.startAction と BattleManager.invokeNormalAction の共通処理
     *
     * @param {} subject - 
     * @param {} target - 
     */
    BattleManager.potadraAction = function (item, subject, target) {
        // アクター召喚
        const summon_actor_ids = summonActor(item, target, subject);
        this._summon_actor_ids = this._summon_actor_ids.concat(summon_actor_ids);

        // 敵キャラ召喚
        this._spriteset = summonEnemy(item, this._spriteset);

        if (target) {
            const realTarget = this.applySubstitute(target);
            this._action.apply(realTarget);
            this._logWindow.displayActionResults(subject, realTarget);
        }
    };

    /**
     * 
     *
     * @param {} subject - 
     */
    BattleManager.potadraSetSubject = function (subject) {
        this._subject = subject;
    };

    /**
     * メンバ変数の初期化
     */
    const _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function () {
        _BattleManager_initMembers.apply(this, arguments);

        this._faint_enemy = false;
        this._faint_actor = false;
        this._lost = false;
        this._summon_actor_ids = [];
    };

    const _BattleManager_updateStart = BattleManager.updateStart;
    BattleManager.updateStart = function () {
        _BattleManager_updateStart.apply(this, arguments);

        this._faint_enemy = false;
        this._faint_actor = false;
    };

    BattleManager.setFaintEnemy = function (faint) {
        this._faint_enemy = faint;
    };

    BattleManager.setFaintActor = function (faint) {
        this._faint_actor = faint;
    };

    /**
     * 経験値の獲得とレベルアップの表示
     */
    const _BattleManager_gainExp = BattleManager.gainExp;
    BattleManager.gainExp = function () {
        _BattleManager_gainExp.apply(this, arguments);

        if (!SummonActorGainExp) return true;

        const exp = this._rewards.exp;
        for (const actor_id of this._summon_actor_ids) {
            const actor = $gameActors.actor(actor_id);
            if ($gameParty.members().includes(actor)) {
                actor.gainExp(exp);
            } else {
                $gameParty.addActor(actor_id);
                actor.gainExp(exp);
                $gameParty.removeActor(actor_id);
            }
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actors
    //------------------------------------------------------------------------------
    // アクターの配列のラッパーです。
    // このクラスのインスタンスは $gameActors で参照されます。
    //------------------------------------------------------------------------------

    /**
     * ダミーアクターの取得
     *
     * @param {} actorId - 
     */
    Game_Actors.prototype.potadraDummyActor = function (actorId) {
        if ($dataActors[actorId]) {
            this._data[actorId] = new Game_Actor(actorId);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    //------------------------------------------------------------------------------
    // アクターを扱うクラスです。
    // このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
    // Game_Party クラス（$gameParty）からも参照されます。
    //------------------------------------------------------------------------------

    /**
     * コラプス効果の実行
     */
    const _Game_Actor_performCollapse = Game_Actor.prototype.performCollapse;
    Game_Actor.prototype.performCollapse = function () {
        _Game_Actor_performCollapse.apply(this, arguments);

        const actor_id = this.actorId();
        if (actor_id >= StartDummyActorId) {
            // 戦闘不能スキル
            if (!BattleManager._lost) {
                const skill_names = Potadra_metaData(this.actor().meta[FaintMetaName]);
                if (skill_names) {
                    for (const skill_name of skill_names) {
                        let skill_id;
                        if (isNaN(skill_name)) { // 文字列
                            skill_id = Potadra_nameSearch($dataSkills, skill_name.trim());
                        } else if (Number(skill_name) !== 0) {
                            skill_id = Number(skill_name);
                        }

                        if (skill_id && $dataSkills[skill_id]) {
                            BattleManager.setFaintActor(true);
                            const action = new Game_Action(this);
                            action.setSkill(skill_id);
                            this.setAction(0, action);
                            BattleManager.potadraSetSubject(this);
                            BattleManager.startAction();
                            this.removeCurrentAction();
                        }
                    }
                }
            }

            if (FaintRemoveActor) {
                $gameParty.removeActor(actor_id);
            }
            if (Potadra_checkVariable(ActorFaintVariable)) {
                const count = $gameVariables.value(ActorFaintVariable);
                $gameVariables.setValue(ActorFaintVariable, count + 1);
            }
        }
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    //------------------------------------------------------------------------------
    // 敵キャラを扱うクラスです。
    // このクラスは Game_Troop クラス（$gameTroop）の内部で使用されます。
    //------------------------------------------------------------------------------

    /**
     * コラプス効果の実行
     */
    const _Game_Enemy_performCollapse = Game_Enemy.prototype.performCollapse;
    Game_Enemy.prototype.performCollapse = function () {
        _Game_Enemy_performCollapse.apply(this, arguments);

        // 戦闘不能スキル
        if (!BattleManager._lost) {
            const skill_names = Potadra_metaData(this.enemy().meta[FaintMetaName]);
            if (skill_names) {
                for (const skill_name of skill_names) {
                    let skill_id;
                    if (isNaN(skill_name)) { // 文字列
                        skill_id = Potadra_nameSearch($dataSkills, skill_name.trim());
                    } else if (Number(skill_name) !== 0) {
                        skill_id = Number(skill_name);
                    }

                    if (skill_id && $dataSkills[skill_id]) {
                        BattleManager.setFaintEnemy(true);
                        const action = new Game_Action(this);
                        action.setSkill(skill_id);
                        this.setAction(0, action);
                        BattleManager.potadraSetSubject(this);
                        BattleManager.startAction();
                        this.removeCurrentAction();
                    }
                }
            }
        }

        if (Potadra_checkVariable(EnemyFaintVariable)) {
            const count = $gameVariables.value(EnemyFaintVariable);
            $gameVariables.setValue(EnemyFaintVariable, count + 1);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Action
    //------------------------------------------------------------------------------
    // 戦闘行動を扱うクラスです。
    // このクラスは Game_Battler クラスの内部で使用されます。
    //------------------------------------------------------------------------------

    /**
     * アクション実行
     *
     * @param {} target - 
     */
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _Game_Action_apply.apply(this, arguments);

        // 消滅
        const item = this.item();
        const lost = Potadra_meta(item.meta, LostMetaName);
        BattleManager._lost = lost;
    };
})();
