/*:
@plugindesc
タイトル処理 Ver1.4.1(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/TitleUI/Title.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.4.1
- バージョンIDの非表示設定が正しく動作していないバグ修正
- ヘルプ更新
* Ver1.4.0
- 固定タイトルとサブタイトルの設定を簡易化
- タイトルの文字色がタイトル固定表示しか有効になっていなかったのを修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
タイトルの表示を色々変更します

## 使い方
プラグインのパラメータを変更することで、タイトルの機能を制御できます

### パラメータ説明

#### タイトル文字色(TitleColor)
タイトルの文字色を変更できます

#### 常にニューゲーム(SelectOnlyNewGame)
セーブデータの有無にかかわらず、常にニューゲームから開始するようになります

#### 固定タイトル(FixedTitle)
システム1のゲームタイトルではなく、こちらのタイトルを表示するようにします  
ゲームタイトルにバージョンを入れたときに  
タイトルにはバージョンを表示しないための機能です

#### サブタイトル(SubTitle)
タイトルの直下に表示できるサブタイトルを追加します  
空文字でサブタイトルは表示しません

#### バージョン表示(Version)
バージョン番号をタイトル左下に表示します

##### バージョン名(VersionName)
ゲームタイトルに Project ver1.0.0 のように記載したとき  
ここに記載した文字以降をバージョン番号とするか

##### バージョン分割位置(VersionPos)
ゲームタイトルのどこをバージョンとして扱うか  
Project ver1.0.0 の場合、指定する数値は以下のようになる

* 0: Project
* 1: ver1.0.0

##### バージョンID表示(VersionId)
保存するたびに変更される $dataSystem["versionId"] を表示するか

###### バージョンID区切り文字(VersionIdName)
$dataSystem["versionId"]とバージョンIDの区切り文字  
デフォルトは .

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
@text 固定タイトル
@desc 固定タイトルの表示内容
空文字で固定タイトルは使用しません

@param SubTitle
@text サブタイトル
@desc サブタイトルの表示内容
空文字でサブタイトルは表示しません

@param Version
@type boolean
@text バージョン表示
@desc バージョン番号をタイトル左下に表示するか
@on 表示する
@off 表示しない
@default true

    @param VersionName
    @parent Version
    @text バージョン名
    @desc この文字以降のタイトルをバージョンとして扱います
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
        @parent VersionId
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
    const FixedTitle        = String(params.FixedTitle);
    const SubTitle          = String(params.SubTitle);
    const Version           = Potadra_convertBool(params.Version);
    const VersionName       = String(params.VersionName || 'ver');
    const VersionIdName     = String(params.VersionIdName);
    const VersionPos        = Number(params.VersionPos || 1);
    const VersionId         = Potadra_convertBool(params.VersionId);

    /**
     * タイトル画面で、ニューゲーム／コンティニューを選択するウィンドウです。
     *
     * @class
     */
    if (SelectOnlyNewGame) {
        Window_TitleCommand.prototype.selectLast = function() {
            this.selectSymbol('newGame');
        };
    }


    /**
     * タイトル画面の処理を行うクラスです。
     *
     * @class
     */
    if (FixedTitle) {
        /**
         * ゲームタイトルの描画
         */
        Scene_Title.prototype.drawGameTitle = function() {
            const x = 20;
            const y = Graphics.height / 4;
            const maxWidth = Graphics.width - x * 2;
            const text = FixedTitle;
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
    } else {
        /**
         * ゲームタイトルの描画
         */
        Scene_Title.prototype.drawGameTitle = function() {
            const x = 20;
            const y = Graphics.height / 4;
            const maxWidth = Graphics.width - x * 2;
            const text = $dataSystem.gameTitle;
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
        const text = SubTitle;
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
        if ($dataSystem.gameTitle.includes(VersionName)) {
            text += $dataSystem.gameTitle.split(VersionName)[VersionPos];
        }
        if (VersionId) {
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
