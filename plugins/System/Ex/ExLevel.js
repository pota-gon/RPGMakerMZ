/*:
@plugindesc
Lv参照制御文字 Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/System/Ex/ExLevel.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 公開

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
レベルを参照する制御文字 \Lv を追加します

## 使い方
\Lv[アクターID] のようにアクターIDを記載すると  
該当するアクター のレベルを参照できるようになります
*/
(() => {
    'use strict';

    /**
     * 制御文字の事前変換
     *    実際の描画を始める前に、原則として文字列に変わるものだけを置き換える。
     *    文字「\」はエスケープ文字（\e）に変換。
     *
     * @param {} text - 
     * @returns {} 
     */
    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        let tmp_text = _Window_Base_convertEscapeCharacters.apply(this, arguments);
        tmp_text = tmp_text.replace(/\x1bLv\[(.+?)\]/gi, (_, p1) =>
            this.potadraActorLevel(parseInt(p1))
        );
        return tmp_text;
    };

    /**
     * アクター n 番のレベルを取得
     *
     * @param {} n - 
     * @returns {} 
     */
    Window_Base.prototype.potadraActorLevel = function(n) {
        const actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor._level : "";
    };
})();
