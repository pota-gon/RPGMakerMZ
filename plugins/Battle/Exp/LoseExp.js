/*:
@plugindesc
敗北経験値 Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/Battle/Exp/LoseExp.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 公開

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
敗北時に通常の経験値の半分を獲得できるようにします

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します
*/
(() => {
   'use strict';

   /**
    * 敗北の処理
    */
   const _BattleManager_processDefeat = BattleManager.processDefeat;
   BattleManager.processDefeat = function() {
      _BattleManager_processDefeat.apply(this, arguments);
      this.potadraLoseMakeRewards();
      this.displayRewards();
      this.potadraLoseGainExp();
   };

   /**
    * 敗北経験値の作成
    */
   BattleManager.potadraLoseMakeRewards = function() {
      this._rewards = {
         gold: 0,
         exp: $gameTroop.expTotal() / 2,
         items: []
      };
   };

   /**
    * 経験値の獲得とレベルアップの表示
    */
   BattleManager.potadraLoseGainExp = function() {
      const exp = this._rewards.exp;
      for (const actor of $gameParty.allMembers()) {
         actor.potadraGainExp(exp);
      }
   };

   /**
    * 経験値の獲得（経験獲得率を考慮）
    *
    * @param {number} exp - 経験値
    */
   Game_Actor.prototype.potadraGainExp = function(exp) {
      const newExp = this.currentExp() + Math.round(exp * this.potadraFinalExpRate());
      this.changeExp(newExp, this.shouldDisplayLevelUp());
   };

   /**
    * 最終的な経験獲得率の計算
    * 戦闘に出ているか控えかで変わる
    *
    * @returns {number} 最終的な経験獲得率
    */
   Game_Actor.prototype.potadraFinalExpRate = function() {
      return this.isBattleMember() ? 1 : this.benchMembersExpRate();
   };
})();
