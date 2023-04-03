/*:
@plugindesc
デバッグ用のプラグイン Ver1.4.5(2022/12/2)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Debug/Debug.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- URLを修正

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
開発中に便利な機能を追加します。

## 使い方
以下の機能を提供します。
使いたい機能のパラメータを変更してください。

1. プラグインロードエラースキップ
2. プラグインで画面サイズ(解像度)変更
3. プラグインでフォント変更
4. アイテム全入手
5. 常に逃走可能

@param PlayTest
@type boolean
@text テスト時のみ有効
@desc テスト時のみ有効にするか
@on 有効にする
@off 常に有効
@default true

@param SkipPluginLoadError
@type boolean
@text プラグインロードエラースキップ
@desc プラグインのロードエラーをスキップするか
ONのプラグインがない状態で、ゲームを起動可能になります
@on スキップする
@off スキップしない
@default true

@param EnableResolution
@type boolean
@text 画面サイズ(解像度)変更
@desc プラグインで画面サイズ(解像度)変更するか
@on 変更する
@off 変更しない
@default false

    @param ResolutionWidth
    @parent EnableResolution
    @type number
    @text 画面サイズ(解像度)の幅
    @desc 画面の横の長さ
    @default 816
    @min 0
    @max 2000

    @param ResolutionHeight
    @parent EnableResolution
    @type number
    @text 画面サイズ(解像度)の高さ
    @desc 画面の縦の長さ
    @default 624
    @min 0
    @max 2000

@param EnableFont
@type boolean
@text プラグインでフォント変更
@desc フォントをプラグインで切り替えるように変更します
@default false

    @param mainFontFilename
    @parent EnableFont
    @type string
    @text メインフォント
    @desc メインフォントのファイル名
    @default mplus-1m-regular.woff

    @param numberFontFilename
    @parent EnableFont
    @type string
    @text 数字フォント
    @desc 数字フォントのファイル名
    @default mplus-2p-bold-sub.woff

@param AllItem
@type boolean
@text アイテム全入手
@desc アイテムを全入手するか
@on 入手する
@off 入手しない
@default false

    @param ExceptItemName
    @parent AllItem
    @type string
    @text 入手しないアイテムの文字列
    @desc この文字が含まれている場合は、アイテムを入手しません。
    @default -

    @param GetItem
    @parent AllItem
    @type boolean
    @text アイテム入手
    @desc アイテムを入手するか
    @on 入手する
    @off 入手しない
    @default true

    @param GetWeapon
    @parent AllItem
    @type boolean
    @text 武器入手
    @desc 武器を入手するか
    @on 入手する
    @off 入手しない
    @default true

    @param GetArmor
    @parent AllItem
    @type boolean
    @text 防具入手
    @desc 防具を入手するか
    @on 入手する
    @off 入手しない
    @default true

@param AlwaysCanEscape
@type boolean
@text 常に逃走可能
@desc 常に逃走を可能にするか
@on 常に逃走可能
@off 通常通り
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
    function Potadra_isTest(play_test = true) {
        return !play_test || Utils.isOptionValid("test");
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const PlayTest            = Potadra_convertBool(params.PlayTest);
    const SkipPluginLoadError = Potadra_convertBool(params.SkipPluginLoadError);
    const EnableResolution    = Potadra_convertBool(params.EnableResolution);
    const ResolutionWidth     = Number(params.ResolutionWidth || 816);
    const ResolutionHeight    = Number(params.ResolutionHeight || 624);
    const EnableFont          = Potadra_convertBool(params.EnableFont);
    const mainFontFilename    = String(params.mainFontFilename) || 'mplus-1m-regular.woff';
    const numberFontFilename  = String(params.numberFontFilename) || 'mplus-2p-bold-sub.woff';
    const AllItem             = Potadra_convertBool(params.AllItem);
    const ExceptItemName      = String(params.ExceptItemName);
    const GetItem             = Potadra_convertBool(params.GetItem);
    const GetWeapon           = Potadra_convertBool(params.GetWeapon);
    const GetArmor            = Potadra_convertBool(params.GetArmor);
    const AlwaysCanEscape     = Potadra_convertBool(params.AlwaysCanEscape);

    // 他プラグイン連携(プラグインの導入有無)
    const MaxItem = Potadra_isPlugin('MaxItem');
    const NameItem = Potadra_isPlugin('NameItem');

    if (Potadra_isTest(PlayTest)) {
        // マップ読み込み前アイテム入手バグ修正

        // アイテムの最大所持数変更が有効なときは自動売却があるので、こちらの設定は無効
        if (!MaxItem && !NameItem) {
            /**
             * アイテムの増加（減少）
             *     include_equip : 装備品も含める
             *
             * @param {} item - 
             * @param {} amount - 
             * @param {} includeEquip - 
             */
            Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
                const container = this.itemContainer(item);
                if (container) {
                    const lastNumber = this.numItems(item);
                    const newNumber = lastNumber + amount;
                    container[item.id] = newNumber.clamp(0, this.maxItems(item));
                    if (container[item.id] === 0) {
                        delete container[item.id];
                    }
                    if (includeEquip && newNumber < 0) {
                        this.discardMembersEquip(item, -newNumber);
                    }
                    if ($gameMap) $gameMap.requestRefresh();
                }
            };
        }

        // プラグインロードエラースキップ
        if (SkipPluginLoadError) {
            PluginManager.checkErrors = function() {};
        }

        // フォントの読み込み
        if (EnableFont) {
            Scene_Boot.prototype.loadGameFonts = function() {
                FontManager.load("rmmz-mainfont", mainFontFilename);
                FontManager.load("rmmz-numberfont", numberFontFilename);
            };
        }

        // 画面サイズ(解像度)の変更
        if (EnableResolution) {
            /**
             * 画面の幅・高さ
             */
            Scene_Boot.prototype.resizeScreen = function() {
                const screenWidth = ResolutionWidth;
                const screenHeight = ResolutionHeight;
                Graphics.resize(screenWidth, screenHeight);
                this.adjustBoxSize();
                this.adjustWindow();
            };

            /**
             * UIエリアの幅・高さ
             */
            Scene_Boot.prototype.adjustBoxSize = function() {
                const uiAreaWidth = ResolutionWidth;
                const uiAreaHeight = ResolutionHeight;
                const boxMargin = 4;
                Graphics.boxWidth = uiAreaWidth - boxMargin * 2;
                Graphics.boxHeight = uiAreaHeight - boxMargin * 2;
            };
        }

        // アイテム全入手
        if (AllItem) {
            /**
             * オブジェクト初期化
             */
            const _Game_Party_initialize = Game_Party.prototype.initialize;
            Game_Party.prototype.initialize = function() {
                _Game_Party_initialize.apply(this, arguments);            
                if (GetItem) this.setupAllItems($dataItems);
                if (GetWeapon) this.setupAllItems($dataWeapons);
                if (GetArmor) this.setupAllItems($dataArmors);
            };

            /**
             * テスト用に全アイテム取得
             */
            Game_Party.prototype.setupAllItems = function(data) {
                for (const item of data) {
                    if (item && item.name.length > 0 && (!ExceptItemName || !item.name.includes(ExceptItemName))) {
                        this.gainItem(item, this.maxItems(item));
                    }
                }
            };
        }

        // 常に逃走可能
        if (AlwaysCanEscape) {
            /**
             * 逃走許可の取得
             *
             * @returns {} 
             */
            BattleManager.canEscape = function() {
                return true;
            };
        }
    }
})();
