/*:
@plugindesc
セーブ後装備タイプ増加可能 Ver1.0.0(2023/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Save/IncreaseEquipType.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 公開

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
セーブ後に装備タイプを増やすとエラーになる問題を解決します。

## 使い方
初期設定は必要ありません。  
プラグイン導入だけで動作します。
*/
(() => {
    'use strict';

    /**
     * ロード後の処理
     */
    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad; 
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);

        for (const actor of $gameActors._data) {
            if (actor) {
                const slots = actor.equipSlots();
                const maxSlots = slots.length;
                for (let i = 0; i < maxSlots; i++) {
                    if (!actor._equips[i]) actor._equips[i] = new Game_Item();
                }
            }
        }
    };
})();
