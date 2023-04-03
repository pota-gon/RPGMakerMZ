/*:
@plugindesc
タイトル処理 Ver1.3.5(2023/4/3)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Title/Title.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- タイトルの文字色を変更できる機能追加
- バージョンID表示をデフォルト表示しないように修正

・TODO
- ヘルプ更新

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
タイトルの表示を色々変更します。

## 使い方


@param TitleColor
@type color
@text タイトル文字色
@desc タイトルの文字色
@default 0

@param SelectOnlyNewGame
@type boolean
@text 常にニューゲーム
@desc 常にニューゲームを選択するかの設定
@on 選択する
@off 選択しない
@default false

@param FixedTitle
@type boolean
@text タイトル固定表示
@desc タイトルの固定表示を使用するかの設定
@on 表示する
@off 表示しない
@default false

    @param FixedTitleName
    @parent FixedTitle
    @text 固定タイトル
    @desc 固定タイトルの表示内容

@param SubTitle
@type boolean
@text サブタイトル表示
@desc サブタイトルを表示するかの設定
@on 表示する
@off 表示しない
@default false

    @param SubTitleName
    @parent SubTitle
    @text サブタイトル
    @desc サブタイトルの表示内容

@param Version
@type boolean
@text バージョン表示
@desc バージョンを表示するかの設定
@on 表示する
@off 表示しない
@default true

    @param VersionName
    @parent Version
    @text バージョン名
    @desc この文字列以降のタイトルをバージョンとして扱います
    @default ver

    @param VersionPos
    @parent Version
    @type number
    @text バージョン分割位置
    @desc バージョン名で分割したタイトルの
    どこをバージョンとして使うかの設定
    @default 1

    @param VersionId
    @parent Version
    @type boolean
    @text バージョンID表示
    @desc $dataSystem["versionId"]を表示するかの設定
    @on 表示する
    @off 表示しない
    @default false

    @param VersionIdName
    @parent Version
    @text バージョンID区切り文字
    @desc バージョンIDの区切りとして使う文字
    @default .
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
    const TitleColor        = Number(params.TitleColor || 0);
    const SelectOnlyNewGame = Potadra_convertBool(params.SelectOnlyNewGame);
    const FixedTitle        = Potadra_convertBool(params.FixedTitle);
    const FixedTitleName    = String(params.FixedTitleName) || '';
    const SubTitle          = Potadra_convertBool(params.SubTitle);
    const SubTitleName      = String(params.SubTitleName) || '';
    const Version           = Potadra_convertBool(params.Version);
    const VersionName       = String(params.VersionName) || 'ver';
    const VersionPos        = Number(params.VersionPos || 1);
    const VersionId         = Potadra_convertBool(params.VersionId);
    const VersionIdName     = String(params.VersionIdName);

    /**
     * タイトル画面で、ニューゲーム／コンティニューを選択するウィンドウです。
     *
     * @class
     */
    if(SelectOnlyNewGame) {
        Window_TitleCommand.prototype.selectLast = function() {
            this.selectSymbol('newGame');
        };
    }


    /**
     * タイトル画面の処理を行うクラスです。
     *
     * @class
     */
    if(FixedTitle) {
        /**
         * ゲームタイトルの描画
         */
        Scene_Title.prototype.drawGameTitle = function() {
            const x = 20;
            const y = Graphics.height / 4;
            const maxWidth = Graphics.width - x * 2;
            const text = FixedTitleName;
            const bitmap = this._gameTitleSprite.bitmap;
            bitmap.fontFace = $gameSystem.mainFontFace();
            bitmap.outlineColor = "black";
            bitmap.outlineWidth = 8;
            bitmap.fontSize = 72;

            if (TitleColor !== 0) {
                bitmap.textColor = ColorManager.textColor(TitleColor);
            }

            bitmap.drawText(text, x, y, maxWidth, 48, "center");
        };
    }

    /**
     * 前景の作成
     */
    const _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
    Scene_Title.prototype.createForeground = function() {
        _Scene_Title_createForeground.apply(this, arguments);

        // サブタイトルの描画
        if (SubTitle) {
            this.drawSubTitle();
        }

        // バージョンの描画
        if (Version) {
            this.drawVersion();
        }
    };

    /**
     * サブタイトルの描画
     */
    Scene_Title.prototype.drawSubTitle = function() {
        const x = 20;
        const y = Graphics.height / 4 + 70;
        const maxWidth = Graphics.width - x * 2;
        const text = SubTitleName;
        const bitmap = this._gameTitleSprite.bitmap;
        bitmap.outlineColor = 'black';
        bitmap.outlineWidth = 8;
        bitmap.fontSize = 36;
        bitmap.textColor = ColorManager.normalColor();
        bitmap.drawText(text, x, y, maxWidth, 48, 'center');
    };

    /**
     * バージョンの描画
     */
    Scene_Title.prototype.drawVersion = function() {
        const x = 12;
        const y = Graphics.height - 48;
        const maxWidth = Graphics.width - x * 2;
        let text = VersionName;

        if($dataSystem.gameTitle.includes(VersionName)) {
        text += $dataSystem.gameTitle.split(VersionName)[VersionPos];
        if (VersionId) {
            text += VersionIdName + $dataSystem.versionId;
        }
        } else {
        text += VersionIdName + $dataSystem.versionId;
        }
        const bitmap = this._gameTitleSprite.bitmap;
        bitmap.outlineColor = 'black';
        bitmap.outlineWidth = 8;
        bitmap.fontSize = 24;
        bitmap.textColor = ColorManager.normalColor();
        bitmap.drawText(text, x, y, maxWidth, 48);
    };
})();
