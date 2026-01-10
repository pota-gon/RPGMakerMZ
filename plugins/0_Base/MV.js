/*:
@plugindesc
MVベース Ver1.0.0(2025/10/19)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/0_Base/MV.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
MVベースプラグインです  
ある程度MVのプラグインをそのまま動かせるようになります  
※ コアスクリプトを変更・機能追加しているため、競合が起きる可能性が高めです

## 使い方
1. 使用したいMVのプラグインより上に配置してください

上記以外に設定は必要ありません  
開発途中のプラグインであるため、動作するMVプラグインは少ないです

また、本プラグインはMZのプラグインへの影響が少なくなるように作られています  
そのため、プラグインが完成したとしても  
どうしても動かないMVプラグインが発生する場合があります

@param RectFix
@type boolean
@text Rect対応
@desc MZから追加されたWindowsのRectに対応
@on 対応する
@off 対応しない
@default true
*/

/**
 * RPGツクールMZのコアスクリプトに変更を加えます
 *
 * @class
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

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const RectFix = Potadra_convertBool(params.RectFix);

    // Argument must be a Rectangle を解決するオプション
    if (RectFix) {
        const _Window_Base_initialize = Window_Base.prototype.initialize;
        Window_Base.prototype.initialize = function(x, y, width, height) {
            if (typeof x === 'object') { // MZ用
                _Window_Base_initialize.call(this, x);
            } else { // MV用
                const rect = new Rectangle(x, y, width, height);
                _Window_Base_initialize.call(this, rect);
            }
        };
    }

    //==============================================================================
    // DataManager
    //------------------------------------------------------------------------------
    // データベースとゲームオブジェクトを管理する静的クラスです。
    // ゲームで使用するほぼ全てのグローバル変数はこのクラスで初期化されます。
    //==============================================================================
    DataManager.isThisGameFile = function(savefileId) {
        return this.savefileExists(savefileId);
    };
    DataManager.loadSavefileInfo = function(savefileId) {
        return this.savefileInfo(savefileId);
    };

    //==============================================================================
    // ImageManager
    //------------------------------------------------------------------------------
    // 各種グラフィックを読み込み、Bitmap オブジェクトを作成、
    // 保持する静的クラスです。
    // 読み込みの高速化とメモリ節約のため、
    // 作成した Bitmap オブジェクトを内部のハッシュに保存し、
    // 同じビットマップが再度要求されたときに
    // 既存のオブジェクトを返すようになっています。
    //==============================================================================
    Sprite_StateIcon._iconWidth = ImageManager.iconWidth;
    Sprite_StateIcon._iconHeight = ImageManager.iconHeight;

    //==============================================================================
    // BattleManager
    //------------------------------------------------------------------------------
    // 戦闘の進行を管理するモジュールです。
    //==============================================================================

    /**
     * コマンド入力中のアクターをクリア
     */
    BattleManager.clearActor = function() {
        this.changeActor(-1, '');
    };

    BattleManager.changeActor = function(newActorIndex, lastActorActionState) {
        var lastActor = this.actor();
        this._actorIndex = newActorIndex;
        var newActor = this.actor();
        if (lastActor) {
            lastActor.setActionState(lastActorActionState);
        }
        if (newActor) {
            newActor.setActionState('inputting');
        }
    };

    //==============================================================================



    // 色

    /**
     * 文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.outlineColor = function() {
        return ColorManager.outlineColor();
    };

    /**
     * 文字色取得
     *
     * @param {number} n - 文字色番号（0..31）
     * @returns {}
     */
    Window_Base.prototype.textColor = function(n) {
        return ColorManager.textColor(n);
    };

    /**
     * 通常文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.normalColor = function() {
        return ColorManager.normalColor();
    };

    /**
     * システム文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.systemColor = function() {
        return ColorManager.systemColor();
    };

    /**
     * ピンチ文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.crisisColor = function() {
        return ColorManager.crisisColor();
    };

    /**
     * 戦闘不能文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.deathColor = function() {
        return ColorManager.deathColor();
    };

    /**
     * ゲージ背景色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.gaugeBackColor = function() {
        return ColorManager.gaugeBackColor();
    };

    /**
     * HP ゲージ 1色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.hpGaugeColor1 = function() {
        return ColorManager.hpGaugeColor1();
    };

    /**
     * HP ゲージ 2色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.hpGaugeColor2 = function() {
        return ColorManager.hpGaugeColor2();
    };

    /**
     * MP ゲージ 1色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.mpGaugeColor1 = function() {
        return ColorManager.mpGaugeColor1();
    };

    /**
     * MP ゲージ 2色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.mpGaugeColor2 = function() {
        return ColorManager.mpGaugeColor2();
    };

    /**
     * 消費 MP文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.mpCostColor = function() {
        return ColorManager.mpCostColor();
    };

    /**
     * 装備 パワーアップ文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.powerUpColor = function() {
        return ColorManager.powerUpColor();
    };

    /**
     * 装備 パワーダウン文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.powerDownColor = function() {
        return ColorManager.powerDownColor();
    };

    /**
     * TP ゲージ 1色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.tpGaugeColor1 = function() {
        return ColorManager.tpGaugeColor1();
    };

    /**
     * TP ゲージ 2色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.tpGaugeColor2 = function() {
        return ColorManager.tpGaugeColor2();
    };

    /**
     * 消費 TP文字色の取得
     *
     * @returns {}
     */
    Window_Base.prototype.tpCostColor = function() {
        return ColorManager.tpCostColor();
    };

    /**
     * 保留項目の背景色を取得
     *
     * @returns {}
     */
    Window_Base.prototype.pendingColor = function() {
        return ColorManager.pendingColor();
    };

    /**
     * HP の文字色を取得
     *
     * @returns {}
     */
    Window_Base.prototype.hpColor = function(actor) {
        return ColorManager.hpColor(actor);
    };

    /**
     * MP の文字色を取得
     *
     * @returns {}
     */
    Window_Base.prototype.mpColor = function(actor) {
        return ColorManager.mpColor();
    };

    /**
     * TP の文字色を取得
     *
     * @returns {}
     */
    Window_Base.prototype.tpColor = function(actor) {
        return ColorManager.tpColor();
    };


    /**
     *
     *
     * @returns {number}
     */
    Window_Base.prototype.standardFontSize = function() {
        return 28;
    };
    /*Game_System.prototype.mainFontSize = function() {
        return $dataSystem.advanced.fontSize; // 26
    };*/

    /**
     * 標準パディングサイズの取得
     *
     * @returns {number} 標準パディングサイズ
     */
    Window_Base.prototype.standardPadding = function() {
        return 18;
    };

    Window_Base.prototype.textPadding = function() {
        return 6;
    };


    /**
     * ゲージの描画
     *
     * @param {number} x -
     * @param {number} y -
     * @param {number} width -
     * @param {} rate - 割合（1.0 で満タン）
     * @param {} color1 - グラデーション 左端
     * @param {} color2 - グラデーション 右端
     */
    Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
        var fillW = Math.floor(width * rate);
        var gaugeY = y + this.lineHeight() - 8;
        this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
        this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
    };

    /**
     * 現在値／最大値を分数形式で描画
     *
     * @param {} current - 現在値
     * @param {} max     - 最大値
     * @param {number} x -
     * @param {number} y -
     * @param {number} width -
     * @param {} color1  - 現在値の色
     * @param {} color2  - 最大値の色
     */
    Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                    width, color1, color2) {
        var labelWidth = this.textWidth('HP');
        var valueWidth = this.textWidth('0000');
        var slashWidth = this.textWidth('/');
        var x1 = x + width - valueWidth;
        var x2 = x1 - slashWidth;
        var x3 = x2 - valueWidth;
        if (x3 >= x + labelWidth) {
            this.changeTextColor(color1);
            this.drawText(current, x3, y, valueWidth, 'right');
            this.changeTextColor(color2);
            this.drawText('/', x2, y, slashWidth, 'right');
            this.drawText(max, x1, y, valueWidth, 'right');
        } else {
            this.changeTextColor(color1);
            this.drawText(current, x1, y, valueWidth, 'right');
        }
    };

    /**
     * HP の描画
     */
    Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
        width = width || 186;
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                            this.hpColor(actor), this.normalColor());
    };

    /**
     * MP の描画
     */
    Window_Base.prototype.drawActorMp = function(actor, x, y, width) {
        width = width || 186;
        var color1 = this.mpGaugeColor1();
        var color2 = this.mpGaugeColor2();
        this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.mpA, x, y, 44);
        this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                            this.mpColor(actor), this.normalColor());
    };

    /**
     * TP の描画
     */
    Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
        width = width || 96;
        var color1 = this.tpGaugeColor1();
        var color2 = this.tpGaugeColor2();
        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.tpA, x, y, 44);
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp, x + width - 64, y, 64, 'right');
    };


    /**
     * 項目を描画する矩形の取得（テキスト用）
     */
    Window_Selectable.prototype.itemRectForText = function(index) {
        const rect = this.itemRect(index);
        rect.x += this.textPadding();
        rect.width -= this.textPadding() * 2;
        return rect;
    };

    Window_Selectable.prototype.resetScroll = function() {
        this.setTopRow(0);
    };


    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the window layer
     * @param {Number} y The y coordinate of the window layer
     * @param {Number} width The width of the window layer
     * @param {Number} height The height of the window layer
     */
    WindowLayer.prototype.move = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

    // MZ では、windowWidth が以下以外ないので追加
    // Window_NameBox(名前ウィンドウはMZの追加機能なので、MVにはなし)
    // Window_ChoiceList
    // Window_NumberInput

    /*
     * ウィンドウ幅の取得
     */
    Window_Command.prototype.windowWidth = function() {
        return 240;
    };
    Window_Gold.prototype.windowWidth = function() {
        return 240;
    };
    Window_MenuCommand.prototype.windowWidth = function() {
        return 240;
    };
    Window_MenuStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth - 240;
    };
    Window_ItemCategory.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
    Window_SkillType.prototype.windowWidth = function() {
        return 240;
    };
    Window_EquipStatus.prototype.windowWidth = function() {
        return 312;
    };
    Window_EquipCommand.prototype.windowWidth = function() {
        return this._windowWidth;
    };
    Window_Options.prototype.windowWidth = function() {
        return 400;
    };
    Window_ShopCommand.prototype.windowWidth = function() {
        return this._windowWidth;
    };
    Window_ShopBuy.prototype.windowWidth = function() {
        return 456;
    };
    Window_ShopNumber.prototype.windowWidth = function() {
        return 456;
    };
    Window_NameEdit.prototype.windowWidth = function() {
        return 480;
    };
    // MZで定義されているのでコメントアウト(作りはかなり違う)
    // Window_ChoiceList.prototype.windowWidth = function() {
    //     var width = this.maxChoiceWidth() + this.padding * 2;
    //     return Math.min(width, Graphics.boxWidth);
    // };
    // Window_NumberInput.prototype.windowWidth = function() {
    //    return this.maxCols() * this.itemWidth() + this.padding * 2;
    // };
    Window_Message.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
    Window_MapName.prototype.windowWidth = function() {
        return 360;
    };
    Window_BattleLog.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
    Window_PartyCommand.prototype.windowWidth = function() {
        return 192;
    };
    Window_ActorCommand.prototype.windowWidth = function() {
        return 192;
    };
    Window_BattleStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth - 192;
    };
    Window_BattleEnemy.prototype.windowWidth = function() {
        return Graphics.boxWidth - 192;
    };
    Window_TitleCommand.prototype.windowWidth = function() {
        return 240;
    };
    Window_GameEnd.prototype.windowWidth = function() {
        return 240;
    };
    Window_DebugRange.prototype.windowWidth = function() {
        return 246;
    };

    // MZ では、windowHeight が以下以外ないので追加
    // Window_NameBox(名前ウィンドウはMZの追加機能なので、MVにはなし)
    // Window_ChoiceList(MVには定義なし)
    // Window_NumberInput

    /*
     * ウィンドウ高さの取得
     */
    Window_Command.prototype.windowHeight = function() {
        return this.fittingHeight(this.numVisibleRows());
    };
    Window_Gold.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };
    Window_MenuStatus.prototype.windowHeight = function() {
        return Graphics.boxHeight;
    };
    Window_EquipStatus.prototype.windowHeight = function() {
        return this.fittingHeight(this.numVisibleRows());
    };
    Window_Options.prototype.windowHeight = function() {
        return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
    };
    Window_NameEdit.prototype.windowHeight = function() {
        return this.fittingHeight(4);
    };
    Window_NameInput.prototype.windowHeight = function() {
        return this.fittingHeight(9);
    };
    Window_MapName.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };
    // MZで定義されているのでコメントアウト(作りはかなり違う)
    // Window_NumberInput.prototype.windowHeight = function() {
    //     return this.fittingHeight(1);
    // };
    Window_EventItem.prototype.windowHeight = function() {
        return this.fittingHeight(this.numVisibleRows());
    };
    Window_Message.prototype.windowHeight = function() {
        return this.fittingHeight(this.numVisibleRows());
    };
    Window_MapName.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };
    Window_BattleLog.prototype.windowHeight = function() {
        return this.fittingHeight(this.maxLines());
    };
    Window_BattleStatus.prototype.windowHeight = function() {
        return this.fittingHeight(this.numVisibleRows());
    };
    Window_BattleEnemy.prototype.windowHeight = function() {
        return this.fittingHeight(this.numVisibleRows());
    };
    Window_DebugRange.prototype.windowHeight = function() {
        return Graphics.boxHeight;
    };

    // drawHorzLine
    // Window_ShopNumber(MVには定義なし)
    // MZ では、windowHeight が以下以外ないので追加
    /**
     * 水平線の描画
     */
    Window_Status.prototype.drawHorzLine = function(y) {
        var lineY = y + this.lineHeight() / 2 - 1;
        this.contents.paintOpacity = 48;
        this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
        this.contents.paintOpacity = 255;
    };

    /**
     * 水平線の色を取得
     *
     * @returns {}
     */
    Window_Status.prototype.lineColor = function() {
        return this.normalColor();
    };
    Window_Status.prototype.maxEquipmentLines = function() {
        return 6;
    };
    
    /**
     * ブロック 4 の描画
     */
    Window_Status.prototype.drawBlock4 = function(y) {
        this.drawProfile(6, y);
    };
    Window_Status.prototype.drawProfile = function(x, y) {
        this.drawTextEx(this._actor.profile(), x, y);
    };

    /**
     * 装備スロットの名前を取得
     */
    Window_EquipSlot.prototype.slotName = function(index) {
        var slots = this._actor.equipSlots();
        return this._actor ? $dataSystem.equipTypes[slots[index]] : '';
    };

    // MZ では、numVisibleRows が以下以外ないので追加
    // Window_MenuStatus(MVと同じ)
    // Window_SavefileList(MVには定義なし)
    // Window_ChoiceList
    /**
     * 表示行数の取得
     *
     * @returns {}
     */
    Window_Command.prototype.numVisibleRows = function() {
        return Math.ceil(this.maxItems() / this.maxCols());
    };
    Window_HorzCommand.prototype.numVisibleRows = function() {
        return 1;
    };
    Window_MenuCommand.prototype.numVisibleRows = function() {
        return this.maxItems();
    };
    // MZと同じなので定義しない
    // Window_MenuStatus.prototype.numVisibleRows = function() {
    //     return 4;
    // };
    Window_SkillType.prototype.numVisibleRows = function() {
        return 4;
    };
    Window_EquipStatus.prototype.numVisibleRows = function() {
        return 7;
    };
    // MZと全く違うのでコメントアウト
    /* Window_ChoiceList.prototype.numVisibleRows = function() {
        var messageY = this._messageWindow.y;
        var messageHeight = this._messageWindow.height;
        var centerY = Graphics.boxHeight / 2;
        var choices = $gameMessage.choices();
        var numLines = choices.length;
        var maxLines = 8;
        if (messageY < centerY && messageY + messageHeight > centerY) {
            maxLines = 4;
        }
        if (numLines > maxLines) {
            numLines = maxLines;
        }
        return numLines;
    };*/
    Window_EventItem.prototype.numVisibleRows = function() {
        return 4;
    };
    Window_Message.prototype.numVisibleRows = function() {
        return 4;
    };
    Window_PartyCommand.prototype.numVisibleRows = function() {
        return 4;
    };
    Window_ActorCommand.prototype.numVisibleRows = function() {
        return 4;
    };
    Window_BattleStatus.prototype.numVisibleRows = function() {
        return 4;
    };

    /**
     * アクターの歩行グラフィック描画
     *
     * @param {} actor - 
     * @param {} x - 
     * @param {} y - 
     */
    Window_Base.prototype.drawActorCharacter = function(actor, x, y) {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    };

    /**
     * アクターの顔グラフィック描画
     *
     * @param {} actor - 
     * @param {} x - 
     * @param {} y - 
     * @param {} width - 
     * @param {} height - 
     */
    Window_Base.prototype.drawActorFace = function(actor, x, y, width, height) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    };

    /**
     * 名前の描画
     *
     * @param {} actor - 
     * @param {} x - 
     * @param {} y - 
     * @param {} width - 
     */
    Window_Base.prototype.drawActorName = function(actor, x, y, width) {
        width = width || 168;
        this.changeTextColor(this.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    };

    /**
     * 職業の描画
     *
     * @param {} actor - 
     * @param {} x - 
     * @param {} y - 
     * @param {} width - 
     */
    Window_Base.prototype.drawActorClass = function(actor, x, y, width) {
        width = width || 168;
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    };

    /**
     * 二つ名の描画
     *
     * @param {} actor - 
     * @param {} x - 
     * @param {} y - 
     * @param {} width - 
     */
    Window_Base.prototype.drawActorNickname = function(actor, x, y, width) {
        width = width || 270;
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    };

    /**
     * レベルの描画
     *
     * @param {} actor - 
     * @param {} x - 
     * @param {} y - 
     */
    Window_Base.prototype.drawActorLevel = function(actor, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 84, y, 36, 'right');
    };

    /**
     * ステートおよび強化／弱体のアイコンを描画
     */
    Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
        width = width || 144;
        var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
        for (var i = 0; i < icons.length; i++) {
            this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
        }
    };

    /**
     * Checks whether the browser can play ogg files.
     *
     * @static
     * @method canPlayOgg
     * @return {Boolean} True if the browser can play ogg files
     */
    WebAudio.canPlayOgg = function() {
        if (!this._initialized) {
            this.initialize();
        }
        return !!this._canPlayOgg;
    };

    /**
     * Checks whether the browser can play m4a files.
     *
     * @static
     * @method canPlayM4a
     * @return {Boolean} True if the browser can play m4a files
     */
    WebAudio.canPlayM4a = function() {
        if (!this._initialized) {
            this.initialize();
        }
        return !!this._canPlayM4a;
    };
})();

// ImageCache 復活

function ImageCache(){
    this.initialize.apply(this, arguments);
}

ImageCache.limit = 10 * 1000 * 1000;

ImageCache.prototype.initialize = function(){
    this._items = {};
};

ImageCache.prototype.add = function(key, value){
    this._items[key] = {
        bitmap: value,
        touch: Date.now(),
        key: key
    };

    this._truncateCache();
};

ImageCache.prototype.get = function(key){
    if (this._items[key]){
        var item = this._items[key];
        item.touch = Date.now();
        return item.bitmap;
    }

    return null;
};

ImageCache.prototype.reserve = function(key, value, reservationId){
    if (!this._items[key]){
        this._items[key] = {
            bitmap: value,
            touch: Date.now(),
            key: key
        };
    }

    this._items[key].reservationId = reservationId;
};

ImageCache.prototype.releaseReservation = function(reservationId){
    var items = this._items;

    Object.keys(items)
        .map(function(key){return items[key];})
        .forEach(function(item){
            if (item.reservationId === reservationId){
                delete item.reservationId;
            }
        });
};

ImageCache.prototype._truncateCache = function(){
    var items = this._items;
    var sizeLeft = ImageCache.limit;

    Object.keys(items).map(function(key){
        return items[key];
    }).sort(function(a, b){
        return b.touch - a.touch;
    }).forEach(function(item){
        if (sizeLeft > 0 || this._mustBeHeld(item)){
            var bitmap = item.bitmap;
            sizeLeft -= bitmap.width * bitmap.height;
        } else {
            delete items[item.key];
        }
    }.bind(this));
};

ImageCache.prototype._mustBeHeld = function(item){
    // request only is weak so It's purgeable
    if (item.bitmap.isRequestOnly()) return false;
    // reserved item must be held
    if (item.reservationId) return true;
    // not ready bitmap must be held (because of checking isReady())
    if (!item.bitmap.isReady()) return true;
    // then the item may purgeable
    return false;
};

ImageCache.prototype.isReady = function(){
    var items = this._items;
    return !Object.keys(items).some(function(key){
        return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
    });
};

ImageCache.prototype.getErrorBitmap = function(){
    var items = this._items;
    var bitmap = null;
    if (Object.keys(items).some(function(key){
            if (items[key].bitmap.isError()){
                bitmap = items[key].bitmap;
                return true;
            }
            return false;
        })) {
        return bitmap;
    }

    return null;
};

// Sprite_Base 復活

/**
 * アニメーションの表示処理を追加したスプライトのクラスです。
 *
 * @class
 */
function Sprite_Base() {
    this.initialize.apply(this, arguments);
}

Sprite_Base.prototype = Object.create(Sprite.prototype);
Sprite_Base.prototype.constructor = Sprite_Base;

/**
 * オブジェクト初期化
 */
Sprite_Base.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._animationSprites = [];
    this._effectTarget = this;
    this._hiding = false;
};

/**
 * フレーム更新
 */
Sprite_Base.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updateAnimationSprites();
};

Sprite_Base.prototype.hide = function() {
    this._hiding = true;
    this.updateVisibility();
};

Sprite_Base.prototype.show = function() {
    this._hiding = false;
    this.updateVisibility();
};

Sprite_Base.prototype.updateVisibility = function() {
    this.visible = !this._hiding;
};

Sprite_Base.prototype.updateAnimationSprites = function() {
    if (this._animationSprites.length > 0) {
        var sprites = this._animationSprites.clone();
        this._animationSprites = [];
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.isPlaying()) {
                this._animationSprites.push(sprite);
            } else {
                sprite.remove();
            }
        }
    }
};

/**
 * アニメーションの開始
 */
Sprite_Base.prototype.startAnimation = function(animation, mirror, delay) {
    var sprite = new Sprite_Animation();
    sprite.setup(this._effectTarget, animation, mirror, delay);
    this.parent.addChild(sprite);
    this._animationSprites.push(sprite);
};

Sprite_Base.prototype.isAnimationPlaying = function() {
    return this._animationSprites.length > 0;
};




// ShaderTilemap 復活

/**
 * The tilemap which displays 2D tile-based game map using shaders
 *
 * @class Tilemap
 * @constructor
 */
 function ShaderTilemap() {
    Tilemap.apply(this, arguments);
    this.roundPixels = true;
}

ShaderTilemap.prototype = Object.create(Tilemap.prototype);
ShaderTilemap.prototype.constructor = ShaderTilemap;

// we need this constant for some platforms (Samsung S4, S5, Tab4, HTC One H8)
// PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
// PIXI.tilemap.TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
// PIXI.tilemap.TileRenderer.DO_CLEAR = true;

/**
 * Uploads animation state in renderer
 *
 * @method _hackRenderer
 * @private
 */
ShaderTilemap.prototype._hackRenderer = function(renderer) {
    var af = this.animationFrame % 4;
    if (af==3) af = 1;
    renderer.plugins.tilemap.tileAnim[0] = af * this._tileWidth;
    renderer.plugins.tilemap.tileAnim[1] = (this.animationFrame % 3) * this._tileHeight;
    return renderer;
};

/**
 * PIXI render method
 *
 * @method renderCanvas
 * @param {Object} pixi renderer
 */
ShaderTilemap.prototype.renderCanvas = function(renderer) {
    this._hackRenderer(renderer);
    PIXI.Container.prototype.renderCanvas.call(this, renderer);
};


/**
 * PIXI render method
 *
 * @method renderWebGL
 * @param {Object} pixi renderer
 */
ShaderTilemap.prototype.renderWebGL = function(renderer) {
    this._hackRenderer(renderer);
    PIXI.Container.prototype.renderWebGL.call(this, renderer);
};

/**
 * Forces to repaint the entire tilemap AND update bitmaps list if needed
 *
 * @method refresh
 */
ShaderTilemap.prototype.refresh = function() {
    if (this._lastBitmapLength !== this.bitmaps.length) {
        this._lastBitmapLength = this.bitmaps.length;
        this.refreshTileset();
    }
    this._needsRepaint = true;
};

/**
 * Call after you update tileset
 *
 * @method updateBitmaps
 */
ShaderTilemap.prototype.refreshTileset = function() {
    var bitmaps = this.bitmaps.map(function(x) { return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x; } );
    this.lowerLayer.setBitmaps(bitmaps);
    this.upperLayer.setBitmaps(bitmaps);
};

/**
 * @method updateTransform
 * @private
 */
ShaderTilemap.prototype.updateTransform = function() {
    let ox, oy;
    if (this.roundPixels) {
        ox = Math.floor(this.origin.x);
        oy = Math.floor(this.origin.y);
    } else {
        ox = this.origin.x;
        oy = this.origin.y;
    }
    var startX = Math.floor((ox - this._margin) / this._tileWidth);
    var startY = Math.floor((oy - this._margin) / this._tileHeight);
    this._updateLayerPositions(startX, startY);
    if (this._needsRepaint ||
        this._lastStartX !== startX || this._lastStartY !== startY) {
        this._lastStartX = startX;
        this._lastStartY = startY;
        this._paintAllTiles(startX, startY);
        this._needsRepaint = false;
    }
    this._sortChildren();
    PIXI.Container.prototype.updateTransform.call(this);
};

/**
 * @method _createLayers
 * @private
 */
ShaderTilemap.prototype._createLayers = function() {
    var width = this._width;
    var height = this._height;
    var margin = this._margin;
    var tileCols = Math.ceil(width / this._tileWidth) + 1;
    var tileRows = Math.ceil(height / this._tileHeight) + 1;
    var layerWidth = this._layerWidth = tileCols * this._tileWidth;
    var layerHeight = this._layerHeight = tileRows * this._tileHeight;
    this._needsRepaint = true;

    if (!this.lowerZLayer) {
        //@hackerham: create layers only in initialization. Doesn't depend on width/height
        this.addChild(this.lowerZLayer = new PIXI.tilemap.ZLayer(this, 0));
        this.addChild(this.upperZLayer = new PIXI.tilemap.ZLayer(this, 4));

        var parameters = PluginManager.parameters('ShaderTilemap');
        var useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters.squareShader : 0);

        this.lowerZLayer.addChild(this.lowerLayer = new PIXI.tilemap.CompositeRectTileLayer(0, [], useSquareShader));
        this.lowerLayer.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
        this.upperZLayer.addChild(this.upperLayer = new PIXI.tilemap.CompositeRectTileLayer(4, [], useSquareShader));
    }
};

/**
 * @method _updateLayerPositions
 * @param {Number} startX
 * @param {Number} startY
 * @private
 */
ShaderTilemap.prototype._updateLayerPositions = function(startX, startY) {
    let ox, oy;
    if (this.roundPixels) {
        ox = Math.floor(this.origin.x);
        oy = Math.floor(this.origin.y);
    } else {
        ox = this.origin.x;
        oy = this.origin.y;
    }
    this.lowerZLayer.position.x = startX * this._tileWidth - ox;
    this.lowerZLayer.position.y = startY * this._tileHeight - oy;
    this.upperZLayer.position.x = startX * this._tileWidth - ox;
    this.upperZLayer.position.y = startY * this._tileHeight - oy;
};

/**
 * @method _paintAllTiles
 * @param {Number} startX
 * @param {Number} startY
 * @private
 */
ShaderTilemap.prototype._paintAllTiles = function(startX, startY) {
    this.lowerZLayer.clear();
    this.upperZLayer.clear();
    var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
    var tileRows = Math.ceil(this._height / this._tileHeight) + 1;
    for (var y = 0; y < tileRows; y++) {
        for (var x = 0; x < tileCols; x++) {
            this._paintTiles(startX, startY, x, y);
        }
    }
};

/**
 * @method _paintTiles
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} x
 * @param {Number} y
 * @private
 */
ShaderTilemap.prototype._paintTiles = function(startX, startY, x, y) {
    var mx = startX + x;
    var my = startY + y;
    var dx = x * this._tileWidth, dy = y * this._tileHeight;
    var tileId0 = this._readMapData(mx, my, 0);
    var tileId1 = this._readMapData(mx, my, 1);
    var tileId2 = this._readMapData(mx, my, 2);
    var tileId3 = this._readMapData(mx, my, 3);
    var shadowBits = this._readMapData(mx, my, 4);
    var upperTileId1 = this._readMapData(mx, my - 1, 1);
    var lowerLayer = this.lowerLayer.children[0];
    var upperLayer = this.upperLayer.children[0];

    if (this._isHigherTile(tileId0)) {
        this._drawTile(upperLayer, tileId0, dx, dy);
    } else {
        this._drawTile(lowerLayer, tileId0, dx, dy);
    }
    if (this._isHigherTile(tileId1)) {
        this._drawTile(upperLayer, tileId1, dx, dy);
    } else {
        this._drawTile(lowerLayer, tileId1, dx, dy);
    }

    this._drawShadow(lowerLayer, shadowBits, dx, dy);
    if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
        if (!Tilemap.isShadowingTile(tileId0)) {
            this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
        }
    }

    if (this._isOverpassPosition(mx, my)) {
        this._drawTile(upperLayer, tileId2, dx, dy);
        this._drawTile(upperLayer, tileId3, dx, dy);
    } else {
        if (this._isHigherTile(tileId2)) {
            this._drawTile(upperLayer, tileId2, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId2, dx, dy);
        }
        if (this._isHigherTile(tileId3)) {
            this._drawTile(upperLayer, tileId3, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId3, dx, dy);
        }
    }
};

/**
 * @method _drawTile
 * @param {Array} layers
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawTile = function(layer, tileId, dx, dy) {
    if (Tilemap.isVisibleTile(tileId)) {
        if (Tilemap.isAutotile(tileId)) {
            this._drawAutotile(layer, tileId, dx, dy);
        } else {
            this._drawNormalTile(layer, tileId, dx, dy);
        }
    }
};

/**
 * @method _drawNormalTile
 * @param {Array} layers
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawNormalTile = function(layer, tileId, dx, dy) {
    var setNumber = 0;

    if (Tilemap.isTileA5(tileId)) {
        setNumber = 4;
    } else {
        setNumber = 5 + Math.floor(tileId / 256);
    }

    var w = this._tileWidth;
    var h = this._tileHeight;
    var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
    var sy = (Math.floor(tileId % 256 / 8) % 16) * h;

    layer.addRect(setNumber, sx, sy, dx, dy, w, h);
};

/**
 * @method _drawAutotile
 * @param {Array} layers
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawAutotile = function(layer, tileId, dx, dy) {
    var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    var kind = Tilemap.getAutotileKind(tileId);
    var shape = Tilemap.getAutotileShape(tileId);
    var tx = kind % 8;
    var ty = Math.floor(kind / 8);
    var bx = 0;
    var by = 0;
    var setNumber = 0;
    var isTable = false;
    var animX = 0, animY = 0;

    if (Tilemap.isTileA1(tileId)) {
        setNumber = 0;
        if (kind === 0) {
            animX = 2;
            by = 0;
        } else if (kind === 1) {
            animX = 2;
            by = 3;
        } else if (kind === 2) {
            bx = 6;
            by = 0;
        } else if (kind === 3) {
            bx = 6;
            by = 3;
        } else {
            bx = Math.floor(tx / 4) * 8;
            by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
            if (kind % 2 === 0) {
                animX = 2;
            }
            else {
                bx += 6;
                autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                animY = 1;
            }
        }
    } else if (Tilemap.isTileA2(tileId)) {
        setNumber = 1;
        bx = tx * 2;
        by = (ty - 2) * 3;
        isTable = this._isTableTile(tileId);
    } else if (Tilemap.isTileA3(tileId)) {
        setNumber = 2;
        bx = tx * 2;
        by = (ty - 6) * 2;
        autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    } else if (Tilemap.isTileA4(tileId)) {
        setNumber = 3;
        bx = tx * 2;
        by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
        if (ty % 2 === 1) {
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
    }

    var table = autotileTable[shape];
    var w1 = this._tileWidth / 2;
    var h1 = this._tileHeight / 2;
    for (var i = 0; i < 4; i++) {
        var qsx = table[i][0];
        var qsy = table[i][1];
        var sx1 = (bx * 2 + qsx) * w1;
        var sy1 = (by * 2 + qsy) * h1;
        var dx1 = dx + (i % 2) * w1;
        var dy1 = dy + Math.floor(i / 2) * h1;
        if (isTable && (qsy === 1 || qsy === 5)) {
            var qsx2 = qsx;
            var qsy2 = 3;
            if (qsy === 1) {
                //qsx2 = [0, 3, 2, 1][qsx];
                qsx2 = (4-qsx)%4;
            }
            var sx2 = (bx * 2 + qsx2) * w1;
            var sy2 = (by * 2 + qsy2) * h1;
            layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1, animX, animY);
            layer.addRect(setNumber, sx1, sy1, dx1, dy1+h1/2, w1, h1/2, animX, animY);
        } else {
            layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1, animX, animY);
        }
    }
};

/**
 * @method _drawTableEdge
 * @param {Array} layers
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawTableEdge = function(layer, tileId, dx, dy) {
    if (Tilemap.isTileA2(tileId)) {
        var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        var kind = Tilemap.getAutotileKind(tileId);
        var shape = Tilemap.getAutotileShape(tileId);
        var tx = kind % 8;
        var ty = Math.floor(kind / 8);
        var setNumber = 1;
        var bx = tx * 2;
        var by = (ty - 2) * 3;
        var table = autotileTable[shape];
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 2; i++) {
            var qsx = table[2 + i][0];
            var qsy = table[2 + i][1];
            var sx1 = (bx * 2 + qsx) * w1;
            var sy1 = (by * 2 + qsy) * h1 + h1 / 2;
            var dx1 = dx + (i % 2) * w1;
            var dy1 = dy + Math.floor(i / 2) * h1;
            layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1/2);
        }
    }
};

/**
 * @method _drawShadow
 * @param {Number} shadowBits
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
ShaderTilemap.prototype._drawShadow = function(layer, shadowBits, dx, dy) {
    if (shadowBits & 0x0f) {
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 4; i++) {
            if (shadowBits & (1 << i)) {
                var dx1 = dx + (i % 2) * w1;
                var dy1 = dy + Math.floor(i / 2) * h1;
                layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
            }
        }
    }
};
