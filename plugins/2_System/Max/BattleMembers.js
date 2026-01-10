/*:
@plugindesc
バトルメンバーの最大数変更 Ver2.0.3(2025/1/20)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Max/BattleMembers.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver2.0.3: バトルメンバーの最大数を変数で管理する機能追加
* Ver2.0.2: ヘルプ更新
* Ver2.0.1: 他メニュー系のプラグインとの競合対策を追加
- Sprite_Gauge を変更するのではなく、Sprite_BattleStatusGaugeクラスを作成し継承するように変更
* Ver2.0.0: リニューアル(プラグインパラメータの再設定が必要になります)
- 6人以上のメニューを設定できるように修正
* Ver1.3.6
- 戦闘時バトルメンバー最大数変更時に戦闘に参加しないメンバーも参加してしまう問題修正(前回の修正とは別条件)
- バグの元になるため、バトルメンバー最大数の最小値を 0 => 1 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
バトルメンバーの最大数を変更します

## 使い方
1. プラグインパラメータ「バトルメンバー最大数」を設定
2. ゲームを始めるとバトルメンバー最大数が変更されます

@param MaxBattleMembers
@type number
@text バトルメンバー最大数
@desc バトルメンバーの最大数
@default 5
@max 999999999999999
@min 1

    @param MaxBattleVariable
    @parent MaxBattleMembers
    @type variable
    @text バトルメンバー最大数変数
    @desc バトルメンバー最大数を管理する変数
    @default 0

@param MaxInBattleMember
@type boolean
@text 戦闘時バトルメンバー最大数変更
@desc 戦闘時のバトルメンバー数を変更するか
※ 戦闘時のみ、バトルメンバーを増減することができます
@on 変更する
@off 変更しない
@default false

    @param MaxInBattleMembers
    @parent MaxInBattleMember
    @type number
    @text 戦闘中バトルメンバー最大数
    @desc 戦闘中のバトルメンバーの最大数
    @default 5
    @max 999999999999999
    @min 1

    @param MaxInBattleVariable
    @parent MaxInBattleMember
    @type variable
    @text 戦闘中バトルメンバー最大数変数
    @desc 戦闘中バトルメンバー最大数を管理する変数
    @default 0

@param EnableBattleMenu
@type boolean
@text バトルメニュー拡張
@desc バトルメニューの表示を人数で拡張するかどうか
@on 拡張する
@off 拡張しない
@default true

@param FiveParty
@type boolean
@text 5人用メニュー
@desc メニューの表示を5人用に変更する
@on 変更する
@off 変更しない
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
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }
    function Potadra_checkVariable(variable_no) {
        return variable_no > 0 && variable_no <= 5000;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MaxBattleMembers    = Number(params.MaxBattleMembers || 5);
    const MaxBattleVariable   = Number(params.MaxBattleVariable || 0);
    const MaxInBattleMember   = Potadra_convertBool(params.MaxInBattleMember);
    const MaxInBattleMembers  = Number(params.MaxInBattleMembers || 5);
    const MaxInBattleVariable = Number(params.MaxBattleVariable || 0);
    const EnableBattleMenu    = Potadra_convertBool(params.EnableBattleMenu);
    const FiveParty           = Potadra_convertBool(params.FiveParty);

    // 他プラグイン連携(パラメータ取得)
    const max_level_params = Potadra_getPluginParams('MaxLevel');
    const MaxLevelMenu     = max_level_params ? Potadra_convertBool(max_level_params.MaxLevelMenu) : false;

    // バトルメンバー最大数
    function maxBattleMembers() {
        if (!Potadra_checkVariable(MaxBattleVariable)) return MaxBattleMembers;

        let max_battle_members = $gameVariables.value(MaxBattleVariable);
        if (max_battle_members === 0) max_battle_members = MaxBattleMembers;
        return max_battle_members;
    }

    // 戦闘中バトルメンバー最大数
    function maxInBattleMembers() {
        if (!Potadra_checkVariable(MaxInBattleVariable)) return MaxInBattleMembers;

        let max_in_battle_members = $gameVariables.value(axInBattleVariable);
        if (max_in_battle_members === 0) max_battle_members = MaxInBattleMembers;
        return max_in_battle_members;
    }

    //------------------------------------------------------------------------------
    // Game_Party
    //------------------------------------------------------------------------------
    // パーティを扱うクラスです。
    // 所持金やアイテムなどの情報が含まれます。
    // このクラスのインスタンスは $gameParty で参照されます。
    //------------------------------------------------------------------------------

    /**
     * バトルメンバーの最大数を取得
     *
     * @returns {}
     */
    Game_Party.prototype.maxBattleMembers = function() {
        if (MaxInBattleMember && this.inBattle()) {
            return maxInBattleMembers();
        } else {
            return maxBattleMembers();
        }
    };

    //------------------------------------------------------------------------------
    // BattleManager
    //------------------------------------------------------------------------------
    // 戦闘の進行を管理する静的クラスです。
    //------------------------------------------------------------------------------

    // 戦闘時のメンバーが違うときは、一時的にアクターを追加・削除する
    if (MaxInBattleMember) {
        /**
         * 戦闘開始
         */
        const _BattleManager_startBattle = BattleManager.startBattle;
        BattleManager.startBattle = function() {
            _BattleManager_startBattle.apply(this, arguments);

            let i = 1;
            $gameTemp._p_actorIds = [];
            for (const actor of $gameParty.allMembers()) {
                if (i > maxBattleMembers()) {
                    $gameTemp._p_actorIds.push(actor.actorId());
                    $gameParty.removeActor(actor.actorId());
                }
                i++;
            }
        };
    
        /**
         * 戦闘終了: シーン移動
         */
        const _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
        BattleManager.updateBattleEnd = function() {
            _BattleManager_updateBattleEnd.apply(this, arguments);

            for (const actorId of $gameTemp._p_actorIds) {
                $gameParty.addActor(actorId);
            }
        };
    }

    // 5人用パーティー表示
    if (FiveParty) {
        /**
         * 表示行数の取得
         *
         * @returns {number}
         */
        Window_MenuStatus.prototype.numVisibleRows = function() {
            switch (maxBattleMembers()) {
                case 4:
                    return 4;
                default:
                    return 5;
            }
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

            // ここを変更
            // const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
            const dx = Math.floor(x + Math.max(width - pw, 0) / 4); 

            // ここを変更
            // const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
            const dy = Math.floor(y + Math.max(height - ph, 0) / 4);

            const sx = (faceIndex % 4) * pw + (pw - sw) / 2;
            const sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
            this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
        };

        /**
         *
         *
         * @param {} actor -
         * @param {number} x - X座標
         * 
         * @param {number} y - Y座標
         */
        Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y) {
            // ここを変更
            // const lineHeight = this.lineHeight();
            const lineHeight = this.lineHeight() - 6;

            // ここを変更
            // const x2 = x + 180;
            const x2 = x + 140;

            // ここを追加
            this.contents.fontSize = 20;

            this.drawActorName(actor, x, y);
            this.drawActorLevel(actor, x, y + lineHeight * 1);
            this.drawActorIcons(actor, x, y + lineHeight * 2);
            this.drawActorClass(actor, x2, y);
            this.placeBasicGauges(actor, x2, y + lineHeight);

            // ここを追加
            this.resetFontSettings();
        };

        /**
         * 
         *
         * @param {} actor - 
         * @param {number} x - X座標
         * @param {number} y - Y座標
         */
        Window_StatusBase.prototype.drawActorSimpleStatus = function(actor, x, y) {
            const lineHeight = this.lineHeight();
            const x2 = x + 180;
            this.drawActorName(actor, x, y);
            this.drawActorLevel(actor, x, y + lineHeight * 1);
            this.drawActorIcons(actor, x, y + lineHeight * 2);
            this.drawActorClass(actor, x2, y);
            this.placeBasicGauges(actor, x2, y + lineHeight);
        };

        // レベル上限突破メニュー
        if (MaxLevelMenu) {
            /**
             *
             *
             * @param {} actor -
             * @param {number} x - X座標
             * @param {number} y - Y座標
             */
            Window_StatusBase.prototype.drawActorSimpleStatus = function(actor, x, y) {
                // ここを変更
                // const lineHeight = this.lineHeight();
                const lineHeight = this.lineHeight() - 6;

                // ここを変更
                // const x2 = x + 180;
                const x2 = x + 140;

                // ここを追加
                this.contents.fontSize = 20;

                this.drawActorName(actor, x, y);
                this.drawActorLevel(actor, x, y + lineHeight * 1);
                this.drawActorIcons(actor, x, y + lineHeight * 2);
                this.drawActorClass(actor, x2, y);
                this.placeBasicGauges(actor, x2, y + lineHeight);

                // ここを追加
                this.resetFontSettings();
            };
        }
    }

    if (EnableBattleMenu) {
        function battleMembers() {
            return MaxInBattleMember ? maxInBattleMembers() : maxBattleMembers();
        }

        /**
         * 
         *
         * @returns {number} 
         */
        Window_BattleStatus.prototype.maxCols = function() {
            return battleMembers();
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
            // this.drawText(actor.name(), x, y, width);
        };

        function getWidth() {
            /*const members = battleMembers();
            if (members < 4) {
                return 128 + (50 * (3 ** (3 - members)));
            } else if (members > 4) {
                return 128 - (10 + (20 * (members - 4)));
            } else {
                return 128;
            }*/

            const members = battleMembers();
            const widths = [128, 578, 278, 178, 128, 98, 78, 65, 56, 49, 38, 27, 16];
            let width = widths[members];
            width ||= 0;
            return width;
        }

        /**
         * 
         *
         * @returns {} 
         */
        Sprite_Name.prototype.bitmapWidth = function() {
            return getWidth();

            const members = battleMembers();
            switch (members) {
                case 1:
                    return 128 + (50 * (3 ** (3 - members))) // 128 * 4 + 64 + 2;     // 512 + 64 + 2 = 578      // + 450(50 * 9) 3 ** 2
                case 2:
                    return 128 + (50 * (3 ** (3 - members))) // 128 * 2 + 16 + 4 + 2; // 256 + 16 + 4 + 2 = 278  // + 150(50 * 3) 3 ** 1
                case 3:
                    return 128 + (50 * (3 ** (3 - members))) // 128 + 32 + 18 + 2;    // 128 + 32 + 18 + 2 = 178 // +  50(50 * 1) 3 ** 0
                case 4:
                    return 128;
                case 5:
                    return 64 + 32 + 2; // 64 + 32 + 2 = 98 // -30
                case 6:
                    return 64 + 12 + 2; // 64 + 12 + 2 = 78 // -50
                case 7:
                    return 64 + 4;      // 64 + 4      = 68 // -60  
                case 8:
                    return 64 - 8;      // 64 - 8      = 58 // -70
                case 9:
                    return 64 - 16;     // 64 - 16     = 48 // -80
                case 10:
                    return 64 - 26;     // 64 - 26     = 38 // -90
                default:
                    return 128 - (32 * (battleMembers()- 4));
            }
        };

        /**
         * 
         *
         * @param {} actor - 
         * @param {} type - 
         * @param {} x - 
         * @param {} y - 
         */
        Window_BattleStatus.prototype.placeGauge = function(actor, type, x, y) {
            const key = "actor%1-gauge-%2".format(actor.actorId(), type);
            const sprite = this.createInnerSprite(key, Sprite_BattleStatusGauge);
            sprite.setup(actor, type);
            sprite.move(x, y);
            sprite.show();
        };

        class Sprite_BattleStatusGauge extends Sprite_Gauge {
            constructor() {
                super();
            }
            bitmapWidth() {
                return getWidth();
            }
            /*labelFontSize() {
                return $gameSystem.mainFontSize() - 8;
            }
            valueFontFace() {
                return $gameSystem.numberFontFace() - 6;
            }
            valueFontSize() {
                return $gameSystem.mainFontSize() - 8;
            }*/
        }

        /**
         * 
         *
         * @returns {number} 
         */
        /*Sprite_Gauge.prototype.bitmapWidth = function() {
            const members = battleMembers();
            switch (members) {
                case 1:
                    return 128 + (50 * (3 ** (3 - members))) // 128 * 4 + 64 + 2;     // 512 + 64 + 2 = 578      // + 450(50 * 9) 3 ** 2
                case 2:
                    return 128 + (50 * (3 ** (3 - members))) // 128 * 2 + 16 + 4 + 2; // 256 + 16 + 4 + 2 = 278  // + 150(50 * 3) 3 ** 1
                case 3:
                    return 128 + (50 * (3 ** (3 - members))) // 128 + 32 + 18 + 2;    // 128 + 32 + 18 + 2 = 178 // +  50(50 * 1) 3 ** 0
                case 4:
                    return 128;
                case 5:
                    // 128 / 5 = 25 + 3
                    return 128 - 30 = 98(-30); // 30 / 3 = 10
                case 6:
                    // 128 / 6 = 21 + 2
                    return 128 - 50 = 78(-20); // 50 / 3 = 16 + 2
                case 7:
                    // 128 / 7 = 18 + 2
                    return 128 - 63 = 65(-13); // 63 / 3 = 21
                case 8:
                    // 128 / 8 = 16
                    return 128 - 72 = 56( -9); // 72 / 3 = 24
                case 9:
                    // 128 / 9 = 14 + 2
                    return 128 - 81 = 47( -9); // 81 / 3 = 27
                    return 128 - 78 = 50( -6); // 78 / 3 = 26
                    return 128 - 75 = 53( -3); // 75 / 3 = 25
                case 10:
                    // 128 / 10 = 12 + 8
                    return 128 -  ? = 38( -?); //  ? / 3 =  ?
                default:
                    return 128 - (32 * (battleMembers()- 4));
            }

            const members = battleMembers();
            if (members < 4) {
                return 128 + (50 * (3 ** (3 - members)));
            } else if (members > 4) {
                return 128 - (10 + (20 * (members - 4)));
            } else {
                return 128;
            }
        };*/
    }
})();
