/*:
@plugindesc
メンバーステート Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/State/MemberState.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
メンバーの人数ごとに効果を発揮するメンバーステートを作成します

## 使い方
1. メンバーの人数ごとに効果を発揮するメンバーステートを作成
   このとき、「戦闘終了時に解除」にチェックを入れてください
2. プラグインパラメータにて、メンバーステートの設定を実施
3. 戦闘でメンバーの人数ごとにメンバーステートが付与されます

@param MemberStates
@type struct<MemberStates>[]
@text メンバーステート
@desc メンバーステート設定
@default []
*/

/*~struct~MemberStates:
@param count
@type number
@text 人数
@desc メンバーステートを反映する人数
@default 1
@min 1
@max 999999999999999

@param member_state
@type state
@text メンバーステート
@desc メンバー状態時に付加するステート
@default 0

@param actor
@type boolean
@text アクター有効/無効設定
@desc アクターのメンバーステートの有効/無効設定
@on 有効
@off 無効
@default true

    @param member_state_actors
    @parent actor
    @type actor[]
    @text メンバーステートアクター
    @desc 指定したアクターのみメンバーステートを反映します
    @default []

@param enemy
@type boolean
@text 敵キャラ有効/無効設定
@desc 敵キャラのメンバーステートの有効/無効設定
@on 有効
@off 無効
@default true

    @param member_state_enemies
    @parent enemy
    @type enemy[]
    @text メンバーステート敵キャラ
    @desc 指定した敵キャラのみメンバーステートを反映します
    @default []
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

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    let MemberStates;
    if (params.MemberStates) MemberStates = JSON.parse(params.MemberStates);

    // メンバーステート判定: アクター
    function memberActorState() {
        const alive_members = $gameParty.aliveMembers();
        for (const s of MemberStates) {
            const state = JSON.parse(s);

            const count                = Number(state.count || 1);
            const member_state         = Number(state.member_state || 0);
            const actor                = Potadra_convertBool(state.actor);
            const member_state_actors  = Potadra_numberArray(state.member_state_actors);

            if (!actor) continue;

            // メンバーステート判定: アクター
            if (alive_members.length === count) {
                for (const member of alive_members) {
                    // メンバーステートID指定
                    if (member_state_actors.length >= 1) {
                        const member_id = member.actorId();

                        for (const id of member_state_actors) {
                            if (id === member_id && !member.isStateAffected(member_state)) {
                                member.addState(member_state);
                                return true;
                            }
                        }
                    } else {
                        // メンバーステートを付与
                        if (!member.isStateAffected(member_state)) member.addState(member_state);
                    }
                }
            } else {
                for (const member of alive_members) {
                    // メンバーの判定を満たさなかったら、メンバーを解除
                    member.eraseState(member_state);
                }
            }
        }
    }

    // メンバーステート判定: 敵キャラ
    function memberEnemyState() {
        const alive_members = $gameTroop.aliveMembers();
        for (const s of MemberStates) {
            const state = JSON.parse(s);

            const count                = Number(state.count || 1);
            const member_state         = Number(state.member_state || 0);
            const enemy                = Potadra_convertBool(state.enemy);
            const member_state_enemies = Potadra_numberArray(state.member_state_enemies);

            if (!enemy) continue;

            // メンバーステート判定: 敵キャラ
            if (alive_members.length === count) {
                for (const member of alive_members) {
                    // メンバーステートID指定
                    if (member_state_enemies.length >= 1) {
                        const member_id = member.enemyId();

                        for (const id of member_state_enemies) {
                            if (id === member_id && !member.isStateAffected(member_state)) {
                                member.addState(member_state);
                                return true;
                            }
                        }
                    } else {
                        // メンバーステートを付与
                        if (!member.isStateAffected(member_state)) member.addState(member_state);
                    }
                }
            } else {
                for (const member of alive_members) {
                    // メンバーの判定を満たさなかったら、メンバーを解除
                    member.eraseState(member_state);
                }
            }
        }
    }

    /**
     * 戦闘開始処理
     *
     * @param {} advantageous - 
     */
    const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function(advantageous) {
        // メンバーステート判定: アクター
        memberActorState();

        // メンバーステート判定: 敵キャラ
        memberEnemyState();

        _Game_Battler_onBattleStart.apply(this, arguments);
    };

    /**
     * アクション実行
     *
     * @param {} target - 
     */
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);

        // メンバーステート判定: アクター
        memberActorState();

        // メンバーステート判定: 敵キャラ
        memberEnemyState();
    };
})();
