/*:
@plugindesc
バトルメンバーの最大数変更 Ver1.3.4(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Max/BattleMembers.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 戦闘中のバトルメンバーの最大数を指定できる機能追加
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

・TODO
- ヘルプ更新

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
バトルメンバーの最大数を変更します。

## 使い方


@param MaxBattleMembers
@type number
@text バトルメンバー最大数
@desc バトルメンバーの最大数
@default 5
@max 999999999999999
@min 0

@param InBattleMaxBattleMember
@type boolean
@text 戦闘時バトルメンバー最大数変更
@desc 戦闘時のバトルメンバー数を変更するか
※ 戦闘時のみ、バトルメンバーを増減することができます
@on 変更する
@off 変更しない
@default false

@param InBattleMaxBattleMembers
@parent InBattleMaxBattleMember
@type number
@text 戦闘中バトルメンバー最大数
@desc 戦闘中のバトルメンバーの最大数
@default 5
@max 999999999999999
@min 0

@param FiveParty
@type boolean
@text 5人用メニュー
@desc メニューの表示を5人用に変更する
@default false
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MaxBattleMembers         = Number(params.MaxBattleMembers || 5);
    const InBattleMaxBattleMember  = Potadra_convertBool(params.InBattleMaxBattleMember);
    const InBattleMaxBattleMembers = Number(params.InBattleMaxBattleMembers || 5);
    const FiveParty                = Potadra_convertBool(params.FiveParty);

    /**
     * パーティを扱うクラスです。所持金やアイテムなどの情報が含まれます。
     * このクラスのインスタンスは $gameParty で参照されます。
     *
     * @class
     */

    /**
     * バトルメンバーの最大数を取得
     *
     * @returns {}
     */
    Game_Party.prototype.maxBattleMembers = function() {
        if (InBattleMaxBattleMember && this.inBattle()) {
            return InBattleMaxBattleMembers;
        } else {
            return MaxBattleMembers;
        }
    };

    // 5人用パーティー表示
    if (FiveParty) {
        /**
         *
         *
         * @returns {number}
         */
        Window_MenuStatus.prototype.numVisibleRows = function() {
            return MaxBattleMembers;
        };

        /**
         * 顔グラフィックの描画
         */
        Window_MenuStatus.prototype.drawFace = function(
            faceName, faceIndex, x, y, width, height
        ) {
            width = width || ImageManager.faceWidth;
            height = height || ImageManager.faceHeight;
            const bitmap = ImageManager.loadFace(faceName);
            const pw = ImageManager.faceWidth;
            const ph = ImageManager.faceHeight;
            const sw = Math.min(width, pw);
            const sh = Math.min(height, ph);
            const dx = Math.floor(x + Math.max(width - pw, 0) / 4); // ここ変更
            const dy = Math.floor(y + Math.max(height - ph, 0) / 4); // ここ変更
            const sx = (faceIndex % 4) * pw + (pw - sw) / 2;
            const sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
            this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
        };

        /**
         *
         *
         * @param {} actor -
         * @param {number} x - X座標
         * @param {number} y - Y座標
         */
        Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y) {
            const lineHeight = this.lineHeight() - 6;
            const x2 = x + 140;
            this.contents.fontSize = 20;
            this.drawActorName(actor, x, y);
            this.drawActorLevel(actor, x, y + lineHeight * 1);
            this.drawActorIcons(actor, x, y + lineHeight * 2);
            this.drawActorClass(actor, x2, y);
            this.placeBasicGauges(actor, x2, y + lineHeight);
            this.resetFontSettings();
        };

        /**
         * 
         *
         * @returns {number} 
         */
        Window_BattleStatus.prototype.maxCols = function() {
            return MaxBattleMembers;
        };

        /**
         * 
         *
         * @param {} actor - 
         * @param {} x - 
         * @param {} y - 
         * @param {} width - 
         */
        Window_BattleStatus.prototype.drawActorName = function(actor, x, y, width) {
            width = 64;
            this.changeTextColor(ColorManager.hpColor(actor));
            //this.drawText(actor.name(), x, y, width);
        };

        /**
         * 
         *
         * @returns {} 
         */
        Sprite_Name.prototype.bitmapWidth = function() {
            return 128 - (32 * (MaxBattleMembers- 4));
        };

        /**
         * 
         *
         * @returns {number} 
         */
        Sprite_Gauge.prototype.bitmapWidth = function() {
            return 128 - (32 * (MaxBattleMembers- 4));
        };
    }
})();
