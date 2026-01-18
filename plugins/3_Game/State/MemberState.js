/*:
@plugindesc
メンバーステート Ver1.0.1(2026/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/State/MemberState.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1
- 条件によって適用されないバグ修正
- 全アクターと全敵キャラを設定できるパラメータ追加
- リファクタリング
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

    @param all_actors
    @parent actor
    @type boolean
    @text 全アクター
    @desc 全アクターにメンバーステートを反映するか
    @on 全アクター
    @off 指定したアクターのみ
    @default true

    @param member_state_actors
    @parent actor
    @type actor[]
    @text メンバーステートアクター
    @desc 指定したアクターのみメンバーステートを反映します
全アクターがONの場合は無視されます
    @default []

@param enemy
@type boolean
@text 敵キャラ有効/無効設定
@desc 敵キャラのメンバーステートの有効/無効設定
@on 有効
@off 無効
@default true

    @param all_enemies
    @parent enemy
    @type boolean
    @text 全敵キャラ
    @desc 全敵キャラにメンバーステートを反映するか
    @on 全敵キャラ
    @off 指定した敵キャラのみ
    @default true

    @param member_state_enemies
    @parent enemy
    @type enemy[]
    @text メンバーステート敵キャラ
    @desc 指定した敵キャラのみメンバーステートを反映します
全敵キャラがONの場合は無視されます
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

    // メンバーステート判定: 共通処理
    function processMemberState(alive_members, state, is_actor) {
        const count        = Number(state.count || 1);
        const member_state = Number(state.member_state || 0);
        const enabled      = Potadra_convertBool(is_actor ? state.actor : state.enemy);
        const all_targets  = Potadra_convertBool(is_actor ? state.all_actors : state.all_enemies);
        const target_ids   = Potadra_numberArray(is_actor ? state.member_state_actors : state.member_state_enemies);

        if (!enabled) return;

        // 人数が一致する場合
        if (alive_members.length === count) {
            for (const member of alive_members) {
                // 全対象の場合
                if (all_targets) {
                    if (!member.isStateAffected(member_state)) member.addState(member_state);
                } else {
                    // ID指定の場合
                    if (target_ids.length >= 1) {
                        const member_id = is_actor ? member.actorId() : member.enemyId();

                        for (const id of target_ids) {
                            if (id === member_id && !member.isStateAffected(member_state)) {
                                member.addState(member_state);
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            // 人数が一致しない場合はステートを解除
            for (const member of alive_members) {
                member.eraseState(member_state);
            }
        }
    }

    // メンバーステート判定
    function memberState() {
        const actor_alive_members = $gameParty.aliveMembers();
        for (const s of MemberStates) {
            const state = JSON.parse(s);
            processMemberState(actor_alive_members, state, true);
        }

        const enemy_alive_members = $gameTroop.aliveMembers();
        for (const s of MemberStates) {
            const state = JSON.parse(s);
            processMemberState(enemy_alive_members, state, false);
        }
    }

    /**
     * 戦闘開始処理
     *
     * @param {} advantageous - 
     */
    const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function(advantageous) {
        // メンバーステート判定
        memberState();

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

        // メンバーステート判定
        memberState();
    };
})();
