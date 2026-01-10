/*:
@plugindesc
敵グループ報酬 Ver1.0.1(2026/1/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Troop/TroopRewards.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: リファクタリング
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
敵グループに経験値と所持金を設定できるタグ
<EXP:経験値> と <GOLD:所持金> を追加します

## 使い方
1. 任意の敵グループを選択します  
2. 敵グループ名に<EXP:経験値> または <GOLD:所持金>を記載します

・敵グループの名前設定例(経験値を100入手する)  
スライム<EXP:100>

・敵グループの名前設定例(所持金を100入手する)  
スライム<GOLD:100>

・敵グループの名前設定例(経験値を100入手し、所持金を100入手する)  
スライム<EXP:100><GOLD:100>
*/
(() => {
   'use strict';

   /**
    * 経験値の合計計算
    *
    * @returns {number} 経験値
    */
   Game_Troop.prototype.expTotal = function() {
      let exp = $gameTroop.deadMembers().reduce((r, enemy) => r + enemy.exp(), 0);
      const exp_match = $gameTroop.troop().name.match(/<exp:\s*(\d+)>/i);
      if (exp_match) exp += Number(exp_match[1]);
      return exp;
   };

   /**
    * 所持金の合計計算
    *
    * @returns {number} 所持金
    */
   Game_Troop.prototype.goldTotal = function() {
      const members = $gameTroop.deadMembers();
      let gold = members.reduce((r, enemy) => r + enemy.gold(), 0) * $gameTroop.goldRate();
      const gold_match = $gameTroop.troop().name.match(/<gold:\s*(\d+)>/i);
      if (gold_match) gold += Number(gold_match[1]);
      return gold;
   };
})();
