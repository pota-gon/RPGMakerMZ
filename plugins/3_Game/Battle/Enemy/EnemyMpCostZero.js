/*:
@plugindesc
敵消費MPコスト0 Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Enemy/EnemyMpCostZero.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
敵キャラがMP消費スキルを使用するときにコストが0になります

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します
*/
(() => {
    'use strict';

    /**
     * スキルの消費 MP 計算
     *
     * @param {} skill - 
     * @returns {} 
     */
    Game_Enemy.prototype.skillMpCost = function(skill) {
        return 0;
    };
})();
