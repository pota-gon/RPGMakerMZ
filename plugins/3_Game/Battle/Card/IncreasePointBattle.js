/*:
@plugindesc
戦闘中ポイント増加 Ver1.0.1(2026/1/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Card/IncreasePointBattle.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: ターン順に定義することで動くように仕様変更
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
ターンごとにMPかTPの最大値を上昇する機能を導入します

## 使い方
上昇量などを、必要に応じてプラグインパラメータを変更してください

@param MpUp
@type boolean
@text ターンMP増加
@desc ターン開始時にMPを増加するか
@on 増加する
@off 増加しない
@default true

    @param MaxMpUp
    @parent MpUp
    @type boolean
    @text 最大MP上昇
    @desc 最大MPを上昇するかどうか
    @on 上昇する
    @off 上昇しない
    @default true

    @param IncreaseMp
    @parent MpUp
    @type number
    @text 増加MP
    @desc ターンごとに増加するMPの値
    @default 1
    @min 0
    @max 999999999999999

        @param TurnIncreasesMp
        @parent IncreaseMp
        @type struct<TurnIncreases>[]
        @text 増加MP（詳細設定）
        @desc ターンごとに増加するMPの値（詳細設定）

    @param StopIncreaseMp
    @parent MpUp
    @type number
    @text MP最大値増加停止
    @desc MPの最大値がこの値になったら、上昇を止めます
    @default 10
    @min 0
    @max 999999999999999

    @param RecoverMaxMp
    @parent MpUp
    @type boolean
    @text 最大MP回復
    @desc 最大MPまで回復するかどうか
    回復しない場合、増加値のみ回復します
    @on 回復する
    @off 回復しない
    @default true

    @param ActorAwakeSwitch
    @parent MpUp
    @type switch
    @text アクター覚醒スイッチ
    @desc このスイッチがON のときに覚醒状態にします
    0(なし)の場合は、覚醒状態にはなりません
    @default 0

        @param ActorAwakeMp
        @parent ActorAwakeSwitch
        @type number
        @text アクター覚醒MP
        @desc 覚醒状態にするMPの値
        @default 7
        @min 0
        @max 999999999999999

    @param EnemyAwakeSwitch
    @parent MpUp
    @type switch
    @text 敵キャラ覚醒スイッチ
    @desc このスイッチがON のときに覚醒状態にします
    0(なし)の場合は、覚醒状態にはなりません
    @default 0

        @param EnemyAwakeMp
        @parent EnemyAwakeSwitch
        @type number
        @text 敵キャラ覚醒MP
        @desc 覚醒状態にするMPの値
        @default 7
        @min 0
        @max 999999999999999

@param TpUp
@type boolean
@text ターンTP増加
@desc ターン開始時にTPを増加するか
@on 増加する
@off 増加しない
@default false

    @param IncreaseTp
    @parent TpUp
    @type number
    @text 増加TP
    @desc ターンごとに増加するTPの値
    @default 1
    @min 0
    @max 999999999999999

        @param TurnIncreasesTp
        @parent IncreaseTp
        @type struct<TurnIncreases>[]
        @text 増加TP（詳細設定）
        @desc ターンごとに増加するTPの値（詳細設定）

    @param StopIncreaseTp
    @parent TpUp
    @type number
    @text TP最大値増加停止
    @desc TPの最大値がこの値になったら、上昇を止めます
    @default 10
    @min 0
    @max 999999999999999

    @param RecoverMaxTp
    @parent TpUp
    @type boolean
    @text 最大TP回復
    @desc 最大TPまで回復するかどうか
    回復しない場合、増加値のみ回復します
    @on 回復する
    @off 回復しない
    @default false

    @param ActorAwakeTpSwitch
    @parent TpUp
    @type switch
    @text アクター覚醒TPスイッチ
    @desc このスイッチがON のときに覚醒状態にします
    0(なし)の場合は、覚醒状態にはなりません
    @default 0

        @param ActorAwakeTp
        @parent ActorAwakeTpSwitch
        @type number
        @text アクター覚醒TP
        @desc 覚醒状態にするTPの値
        @default 7
        @min 0
        @max 999999999999999

    @param EnemyAwakeTpSwitch
    @parent TpUp
    @type switch
    @text 敵キャラ覚醒TPスイッチ
    @desc このスイッチがON のときに覚醒状態にします
    0(なし)の場合は、覚醒状態にはなりません
    @default 0

        @param EnemyAwakeTp
        @parent EnemyAwakeTpSwitch
        @type number
        @text 敵キャラ覚醒TP
        @desc 覚醒状態にするTPの値
        @default 7
        @min 0
        @max 999999999999999
*/

/*~struct~TurnIncreases:
@param turn
@type number
@text ターン
@desc 判定に使うターン数
@default 1
@min 1

@param increase
@type number
@text 増加数
@desc ポイントの増加数
@default 1

@param operator
@type combo
@text 不等号
@desc ターンの判定に使う不等号
デフォルトは、>=(Xターン以上)
@option >
@option >=
@option <
@option <=
@option =
@option !=
@default >=
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
    function Potadra_operators(a, b, operator) {
        switch (operator) {
            case '>':  return a > b;
            case '>=': return a >= b;
            case '<':  return a < b;
            case '<=': return a <= b;
            case '=': return a == b;
            case '!=': return a != b;
            default: return true;
        }
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const MpUp               = Potadra_convertBool(params.MpUp);
    const MaxMpUp            = Potadra_convertBool(params.MaxMpUp);
    const IncreaseMp         = Number(params.IncreaseMp || 1);
    let TurnIncreasesMp;
    if (params.TurnIncreasesMp) {
        TurnIncreasesMp = JSON.parse(params.TurnIncreasesMp);
    }
    const StopIncreaseMp     = Number(params.StopIncreaseMp || 10);
    const RecoverMaxMp       = Potadra_convertBool(params.RecoverMaxMp);
    const ActorAwakeSwitch   = Number(params.ActorAwakeSwitch || 0);
    const ActorAwakeMp       = Number(params.ActorAwakeMp || 7);
    const EnemyAwakeSwitch   = Number(params.EnemyAwakeSwitch || 0);
    const EnemyAwakeMp       = Number(params.EnemyAwakeMp || 7);
    const TpUp               = Potadra_convertBool(params.TpUp);
    const IncreaseTp         = Number(params.IncreaseTp || 1);
    let TurnIncreasesTp;
    if (params.TurnIncreasesTp) {
        TurnIncreasesTp = JSON.parse(params.TurnIncreasesTp);
    }
    const StopIncreaseTp     = Number(params.StopIncreaseTp || 10);
    const RecoverMaxTp       = Potadra_convertBool(params.RecoverMaxTp);
    const ActorAwakeTpSwitch = Number(params.ActorAwakeTpSwitch || 0);
    const ActorAwakeTp       = Number(params.ActorAwakeTp || 7);
    const EnemyAwakeTpSwitch = Number(params.EnemyAwakeTpSwitch || 0);
    const EnemyAwakeTp       = Number(params.EnemyAwakeTp || 7);

    // 覚醒判定
    function awake(awake_switch, awake_mp, mmp) {
        if (awake_switch === 0) return true; // スイッチが指定されていない場合は終了

        const value = awake_mp && mmp >= awake_mp;
        $gameSwitches.setValue(awake_switch, value);
    }
    function awakeTp(awake_switch, awake_tp, tp) {
        if (awake_switch === 0) return true; // スイッチが指定されていない場合は終了

        const value = awake_tp && tp >= awake_tp;
        $gameSwitches.setValue(awake_switch, value);
    }

    if (MpUp) {
        /**
         * MP の増加
         *
         * @param {} mp - 
         */
        Game_BattlerBase.prototype.potadraIncreaseMp = function(mp) {
            if (MaxMpUp && this.mp < StopIncreaseMp) {
                this.addParam(1, mp);
            }
            if (RecoverMaxMp) {
                this._mp = this.mmp;
            } else {
                this._mp += mp;
            }

            // 覚醒判定
            awake(ActorAwakeSwitch, ActorAwakeMp, MaxMpUp ? this._mp : this.mmp);
            awake(EnemyAwakeSwitch, EnemyAwakeMp, MaxMpUp ? this._mp : this.mmp);

            this.refresh();
        };

        /**
         * 最大MP の変更
         *
         * @param {} mp - 
         */
        Game_BattlerBase.prototype.potadraSetMMp = function(mp) {
            this._paramPlus[1] = mp;
            this._mp = mp;
            this.refresh();
        };
    }

    if (TpUp) {
        /**
         * TP の増加
         *
         * @param {} tp - 
         */
        Game_BattlerBase.prototype.potadraIncreaseTp = function(tp) {
            if (RecoverMaxTp) {
                this._tp = this.turnCount();
            } else {
                this._tp += tp;
            }

            // 覚醒判定
            awakeTp(ActorAwakeTpSwitch, ActorAwakeTp, this._tp);
            awakeTp(EnemyAwakeTpSwitch, EnemyAwakeTp, this._tp);

            this.refresh();
        };
    }

    /**
     * 
     */
    const _BattleManager_startInput = BattleManager.startInput;
    BattleManager.startInput = function() {
        if (MpUp) {
            let increase_mp = IncreaseMp;
            if (TurnIncreasesMp) {
                // 逆順でループして、より大きなターン数の条件を優先する
                for (let i = TurnIncreasesMp.length - 1; i >= 0; i--) {
                    const turn_increases_mp = JSON.parse(TurnIncreasesMp[i]);

                    const turn     = Number(turn_increases_mp.turn || 1);
                    const increase = Number(turn_increases_mp.increase || 1);
                    const operator = String(turn_increases_mp.operator || '>=');
                    if (Potadra_operators($gameTroop._turnCount, turn - 1, operator)) {
                        increase_mp = increase;
                        break;
                    }
                }
            }

            // アクター
            for (const actor of $gameParty.battleMembers()) {
                actor.potadraIncreaseMp(increase_mp);
            }

            // 敵キャラ
            for (const enemy of $gameTroop.members()) {
                enemy.potadraIncreaseMp(increase_mp);
            }
        }

        if (TpUp) {
            let increase_tp = IncreaseTp;
            if (TurnIncreasesTp) {
                for (let i = 0; i < TurnIncreasesTp.length; i++) {
                    const turn_increases_tp = JSON.parse(TurnIncreasesTp[i]);

                    const turn     = Number(turn_increases_tp.turn || 1);
                    const increase = Number(turn_increases_tp.increase || 1);
                    const operator = String(turn_increases_tp.operator || '>=');

                    if (Potadra_operators($gameTroop._turnCount, turn - 1, operator)) {
                        increase_tp = increase;
                        break;
                    }
                }
            }

            // アクター
            for (const actor of $gameParty.battleMembers()) {
                if (actor.tp < StopIncreaseTp) actor.potadraIncreaseTp(increase_tp);
            }

            // 敵キャラ
            for (const enemy of $gameTroop.members()) {
                if (enemy.tp < StopIncreaseTp) enemy.potadraIncreaseTp(increase_tp);
            }
        }

        _BattleManager_startInput.apply(this, arguments);
    };

    /**
     * 戦闘終了
     *
     * @param {} result - 結果（0:勝利 1:逃走 2:敗北）
     */
    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        if (MpUp && MaxMpUp) {
            // アクター
            for (const actor of $gameParty.battleMembers()) {
                actor.potadraSetMMp(0);
            }
        }

        if (TpUp) {
            // アクター
            for (const actor of $gameParty.battleMembers()) {
                actor.setTp(0);
            }
        }

        // 覚醒OFF
        if (ActorAwakeSwitch !== 0) $gameSwitches.setValue(ActorAwakeSwitch, false);
        if (EnemyAwakeSwitch !== 0) $gameSwitches.setValue(EnemyAwakeSwitch, false);
        if (ActorAwakeTpSwitch !== 0) $gameSwitches.setValue(ActorAwakeTpSwitch, false);
        if (EnemyAwakeTpSwitch !== 0) $gameSwitches.setValue(EnemyAwakeTpSwitch, false);

        _BattleManager_endBattle.apply(this, arguments);
    };
})();
