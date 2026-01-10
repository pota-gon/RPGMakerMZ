/*:
@plugindesc
怒りステート Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/State/AngryState.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
特定のキャラクターが倒れた時に指定したステートにかけます

## 使い方
1. 怒り状態時に付加するステートを作成
   このとき、「戦闘終了時に解除」にチェックを入れてください
2. プラグインパラメータの「怒りステート」に 1. で作成したステートを設定
3. プラグインパラメータの「怒りアクター」でアクターの怒り設定を追加
4. プラグインパラメータの「怒り敵キャラ」で敵キャラの怒り設定を追加
5. 戦闘で設定した内容に従って、怒りステートが付与されます

@param AngryState
@type state
@text 怒りステート
@desc 怒り状態時に付加するステート
@default 0

@param AngryActors
@type struct<FriendActors>[]
@text 怒りアクター
@desc アクターの怒り設定
@default []

@param AngryEnemies
@type struct<FriendEnemies>[]
@text 怒り敵キャラ
@desc 敵キャラの怒り設定
@default []
*/

/*~struct~FriendActors:
@param angry_actor
@type actor
@text 怒りアクター
@desc 怒りの設定をするアクターを指定します
@default 1

@param friend_actors
@type actor[]
@text 友好アクター
@desc 指定したアクターが倒されたときに怒り状態となります
@default []
*/

/*~struct~FriendEnemies:
@param angry_enemy
@type enemy
@text 怒り敵キャラ
@desc 怒りの設定をする敵キャラを指定します
@default 1

@param friend_enemies
@type enemy[]
@text 友好敵キャラ
@desc 指定した敵キャラが倒されたときに怒り状態となります
@default []
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_numberArray(data) {
        return data ? JSON.parse(data).map(Number) : [];
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const AngryState = Number(params.AngryState || 0);

    let AngryActors, AngryEnemies;
    if (params.AngryActors) AngryActors = JSON.parse(params.AngryActors);
    if (params.AngryEnemies) AngryEnemies = JSON.parse(params.AngryEnemies);

    // 怒り判定: アクター
    function angryActors() {
        if (!AngryActors) return true;

        for (const a of AngryActors) {
            const actor = JSON.parse(a);

            const angry_actor_id = Number(actor.angry_actor || 1);
            const angry_actor = $gameActors.actor(angry_actor_id);

            // 怒るアクターが存在する & 戦闘に参加しているか
            if (angry_actor && angry_actor.isBattleMember()) {
                const friend_actors = Potadra_numberArray(actor.friend_actors);

                // 怒りステート付与確認
                for (const friend_actor_id of friend_actors) {
                    const friend_actor = $gameActors.actor(friend_actor_id);

                    // 友好アクターが存在するか & 戦闘に参加しているか & 死んでいるか
                    if (friend_actor && friend_actor.isBattleMember() && friend_actor.isDead()) {
                        // 怒りステートを付与してループ終了
                        if (!angry_actor.isStateAffected(AngryState)) angry_actor.addState(AngryState);
                        break;
                    }

                    // 怒りの判定を満たさなかったら、怒りを解除
                    angry_actor.eraseState(AngryState);
                }
            }
        }
    }

    // 怒り判定: 敵キャラ
    function angryEnemies() {
        if (!AngryEnemies) return true;

        for (const e of AngryEnemies) {
            const enemy = JSON.parse(e);

            const angry_enemy_id = Number(enemy.angry_enemy || 1);
            for (const angry_enemy of $gameTroop.members()) {
                // 怒る敵キャラが戦闘に参加しているか
                if (angry_enemy.enemyId() === angry_enemy_id) {

                    const friend_enemies = Potadra_numberArray(enemy.friend_enemies);
                    const angry = angryEnemy(friend_enemies);
                    if (angry) {
                        // 怒りステートを付与
                        if (!angry_enemy.isStateAffected(AngryState)) angry_enemy.addState(AngryState);
                    } else {
                        // 怒りの判定を満たさなかったら、怒りを解除
                        angry_enemy.eraseState(AngryState);
                    }
                }
            }
        }
    }

    function angryEnemy(friend_enemies) {
        // 怒りステート付与確認
        for (const friend_enemy_id of friend_enemies) {
            for (const friend_enemy of $gameTroop.members()) {
                // 友好敵キャラが存在するか & 死んでいるか
                if (friend_enemy.enemyId() === friend_enemy_id && friend_enemy.isDead()) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * アクション実行
     *
     * @param {} target - 
     */
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);

        // 怒り判定: アクター
        angryActors();

        // 怒り判定: 敵キャラ
        angryEnemies();
    };
})();
