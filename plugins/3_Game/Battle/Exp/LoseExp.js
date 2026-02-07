/*:
@plugindesc
敗北経験値 Ver1.0.2(2026/2/8)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Exp/LoseExp.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.2: 敗北経験値の有効/無効を切り替えるスイッチパラメータを追加
* Ver1.0.1: 小数点は切り捨てるように修正
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
敗北時に通常の経験値の半分を獲得できるようにします

## 仕様
- 敗北時の経験値 = 通常経験値 ÷ 2
- 小数点以下は全て切り捨てされます

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

スイッチで敗北経験値の有効/無効を切り替える場合は、
プラグインパラメータで「敗北経験値スイッチ」を設定してください

## 例
- 通常経験値100 → 敗北経験値50
- 通常経験値1 → 敗北経験値0（0.5を切り捨て）
- 通常経験値3 → 敗北経験値1（1.5を切り捨て）
- 通常経験値5 → 敗北経験値2（2.5を切り捨て）

@param LoseExpSwitch
@type switch
@text 敗北経験値スイッチ
@desc 敗北経験値を有効にするスイッチ
0の場合は常に有効
@default 0
*/
(() => {
   'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_checkSwitch(switch_no, bool = true) {
        return switch_no === 0 || $gameSwitches.value(switch_no) === bool;
    }

   // パラメータ用定数
   const plugin_name = Potadra_getPluginName();
   const params      = PluginManager.parameters(plugin_name);

   // 各パラメータ用定数
   const LoseExpSwitch = Number(params.LoseExpSwitch || 0);

   /**
    * 敗北の処理
    */
   const _BattleManager_processDefeat = BattleManager.processDefeat;
   BattleManager.processDefeat = function () {
      _BattleManager_processDefeat.apply(this, arguments);

      if (Potadra_checkSwitch(LoseExpSwitch)) {
         this.potadraLoseMakeRewards();
         this.displayRewards();
         this.potadraLoseGainExp();
      }
   };

   /**
    * 敗北経験値の作成
    */
   BattleManager.potadraLoseMakeRewards = function () {
      this._rewards = {
         gold: 0,
         exp: Math.floor($gameTroop.expTotal() / 2), // 小数点以下は全て切り捨て
         items: []
      };
   };

   /**
    * 経験値の獲得とレベルアップの表示
    */
   BattleManager.potadraLoseGainExp = function () {
      const exp = this._rewards.exp;
      for (const actor of $gameParty.allMembers()) {
         actor.potadraGainExp(exp);
      }
   };

   /**
    * 経験値の獲得(経験獲得率を考慮)
    *
    * @param {number} exp - 経験値
    */
   Game_Actor.prototype.potadraGainExp = function (exp) {
      const newExp = this.currentExp() + Math.round(exp * this.potadraFinalExpRate());
      this.changeExp(newExp, this.shouldDisplayLevelUp());
   };

   /**
    * 最終的な経験獲得率の計算
    * 戦闘に出ているか控えかで変わる
    *
    * @returns {number} 最終的な経験獲得率
    */
   Game_Actor.prototype.potadraFinalExpRate = function () {
      return this.isBattleMember() ? 1 : this.benchMembersExpRate();
   };
})();
