/*:
@plugindesc
戦闘スキル画面に顔グラフィック表示 Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/Scene/Battle/SkillFace.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0
- 顔グラフィックのサイズを半分にする機能追加
- メニューのスキルに顔グラフィックを表示する機能追加

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
戦闘スキル画面のヘルプに顔グラフィックを表示できるようにします

## 使い方
1. スキルのメモ欄に <顔グラフィック: Actor3, 0> のように
   グラフィック名とインデックスを指定します
2. <追加説明: 追加の説明> のようにすると、3行目にも説明を追加できます
3. そのまま戦闘に入るとスキルの説明を表示する時に顔グラフィックが
   表示されるようになります

@param ShowSkillMenu
@type boolean
@text メニュースキル顔グラフィック表示
@desc メニューのスキルで顔グラフィックを表示
@on 表示する
@off 表示しない
@default true

@param HalfFace
@type boolean
@text 顔グラフィックハーフサイズ
@desc 顔グラフィックのサイズを半分にするか
半分にしない場合、スキル選択欄が少なくなります
@on 半分にする(50%)
@off 半分にしない(100%)
@default true

@param CancelButton
@type boolean
@text キャンセルボタン表示
@desc キャンセルボタンを表示するか
@on 表示する
@off 表示しない
@default true

    @param CancelButtonPosition
    @parent CancelButton
    @type boolean
    @text キャンセルボタン位置
    @desc キャンセルボタンの位置
    @on 左揃え
    @off 右揃え
    @default false

@param CommandAndStatusShow
@type boolean
@text コマンド・ステータス表示可否
@desc コマンド・ステータスの表示可否
@on 表示する
@off 表示しない
@default true

@param AddDescriptionMetaName
@text 追加説明タグ
@desc 追加説明に使うメモ欄タグの名称
デフォルトは 追加説明
@default 追加説明

@param FaceGraphicMetaName
@text 顔グラフィックタグ
@desc 顔グラフィックに使うメモ欄タグの名称
デフォルトは 顔グラフィック
@default 顔グラフィック
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
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
        }
        return false;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const ShowSkillMenu          = Potadra_convertBool(params.ShowSkillMenu);
    const HalfFace               = Potadra_convertBool(params.HalfFace);
    const CancelButton           = Potadra_convertBool(params.CancelButton);
    const CancelButtonPosition   = Potadra_convertBool(params.CancelButtonPosition);
    const CommandAndStatusShow   = Potadra_convertBool(params.CommandAndStatusShow);
    const AddDescriptionMetaName = String(params.AddDescriptionMetaName || "追加説明");
    const FaceGraphicMetaName    = String(params.FaceGraphicMetaName || "顔グラフィック");

    /**
     * スキル顔グラフィック表示ヘルプ画面の処理を行うクラスです
     *
     * @class
     */
    class Window_SkillFaceHelp extends Window_Help {
        constructor(rect) {
            super(rect);
            this._item       = null;
            this._faceBitmap = null;
        }

        /**
         * アイテム設定
         *     item : スキル、アイテム等
         *
         * @param {} item - 
         */
        setItem(item) {
            if (item) {
                this._item = item;

                // 追加説明設定
                this.setAddDescription(item);
            } else {
                this._item = null;
                super.refresh();
            }
            super.setItem(item);
        }

        /**
         * リフレッシュ
         */
        refresh() {
            const item = this._item;
            if (item) {
                // 追加説明設定
                this.setAddDescription(item);

                const face_graphic = Potadra_metaData(item.meta[FaceGraphicMetaName], ',');
                if (face_graphic) {
                    const rect = this.baseTextRect();
                    this.contents.clear();

                    this._faceBitmap = ImageManager.loadFace(face_graphic[0]);
                    this._faceBitmap.addLoadListener(() => {
                        if (HalfFace) {
                            this.drawHalfFaceTextEx(face_graphic[0], Number(face_graphic[1] || 0), 4, 4, rect);
                        } else {
                            this.drawFaceTextEx(face_graphic[0], Number(face_graphic[1] || 0), 4, 4, rect);
                        }
                    });
                    return true;
                }
            }
            
            super.refresh();
            this._faceBitmap = null;
        };

        /**
         * 追加説明設定
         *     item : スキル、アイテム等
         *
         * @param {} item - 
         */
        setAddDescription(item) {
            if (item) {
                const add_description = Potadra_metaData(item.meta[AddDescriptionMetaName]);
                if (add_description) this.setText(item.description + '\n' + add_description.join('\n'));
            }
        }

        /**
         * 顔グラフィックと制御文字つきテキストの描画
         */
        drawFaceTextEx(faceName, faceIndex, x, y, rect) {
            let width = rect.width || ImageManager.faceWidth;
            let height = rect.y || ImageManager.faceHeight;
            const bitmap = ImageManager.loadFace(faceName);
            const pw = ImageManager.faceWidth;
            const ph = ImageManager.faceHeight;
            const sw = Math.min(width, pw);
            const sh = Math.min(height, ph);
            const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
            const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2);
            const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2);
            this.contents.blt(bitmap, sx, sy, sw, sh, x, dy);
            this.drawTextEx(this._text, rect.x + pw, rect.y, rect.width);
        };

        /**
         * 顔グラフィックと制御文字つきテキストの描画
         */
        drawHalfFaceTextEx(faceName, faceIndex, x, y, rect) {
            let width = (rect.width || ImageManager.faceWidth) / 2;
            let height = (rect.y || ImageManager.faceHeight) / 2;
            const bitmap = ImageManager.loadFace(faceName);
            const pw = ImageManager.faceWidth;
            const ph = ImageManager.faceHeight;
            const sw = Math.min(width, pw);
            const sh = Math.min(height, ph);
            const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
            const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2);
            const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2);
            this.contents.blt(bitmap, sx, sy, sw, sh, x, dy);
            this.drawTextEx(this._text, rect.x + pw, rect.y, rect.width);
        };
    }

    /**
     * ヘルプウィンドウの作成
     */
    Scene_Battle.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_SkillFaceHelp(rect);
        this._helpWindow.hide();
        this.addWindow(this._helpWindow);
    };

    // メニュースキル顔グラフィック表示
    if (ShowSkillMenu) {
        /**
         * ヘルプウィンドウの作成
         */
        Scene_Skill.prototype.createHelpWindow = function() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_SkillFaceHelp(rect);
            this.addWindow(this._helpWindow);
        };
    }

    /**
     * ヘルプウィンドウの高さ
     *
     * @returns {} 
     */
    Scene_Battle.prototype.helpAreaHeight = function() {
        if (HalfFace) {
            return this.calcWindowHeight(2, false) + 8;
        } else {
            return this.calcWindowHeight(4, false) + 8;
        }
    };

    /**
     * ヘルプウィンドウの高さ
     *
     * @returns {} 
     */
    const _Scene_Skill_helpAreaHeight = Scene_Skill.prototype.helpAreaHeight;
    Scene_Skill.prototype.helpAreaHeight = function() {
        if (HalfFace) {
            return _Scene_Skill_helpAreaHeight.apply(this, arguments);
        } else {
            return this.calcWindowHeight(4, false);
        }
    };

    /**
     * スキルウィンドウのサイズ指定(アイテムウィンドウもデフォルトはこちらで設定)
     *
     * @returns {} 
     */
    Scene_Battle.prototype.skillWindowRect = function() {
        const ww = Graphics.boxWidth;
        let skill_height = Graphics.height - (this.helpAreaTop() + this._helpWindow.height);
        // コマンド・ステータスを表示する場合、その分だけスキルウィンドウのサイズを小さくする
        if (CommandAndStatusShow) {
            skill_height -= Math.max(this._statusWindow.height, this._actorCommandWindow.height);
            skill_height += 4;
        }
        const calc = Math.floor(skill_height / 48);
        const wh = this.calcWindowHeight(calc, true);
        const wx = 0;
        const wy = this.helpAreaTop() + this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ヘルプ位置
     *
     * @returns {} 
     */
    if (CancelButton) {
        Scene_Battle.prototype.helpAreaTop = function() {
            return 48;
        };
    }

    /**
     * ボタン作成
     */
    Scene_Battle.prototype.createButtons = function() {
        if (ConfigManager.touchUI && CancelButton) {
            this.createCancelButton();
        }
    };

    /**
     * キャンセルボタン作成
     */
    Scene_Battle.prototype.createCancelButton = function() {
        this._cancelButton = new Sprite_Button("cancel");
        if (CancelButtonPosition) {
            this._cancelButton.x = 4;
        } else {
            this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        }
        this._cancelButton.y = 0;
        this.addWindow(this._cancelButton);
    };

    /**
     * コマンド［スキル］
     */
    Scene_Battle.prototype.commandSkill = function() {
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
        if (!CommandAndStatusShow) {
            this._statusWindow.hide();
            this._actorCommandWindow.hide();
        }
    };

    /**
     * コマンド［アイテム］
     */
    Scene_Battle.prototype.commandItem = function() {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
        if (!CommandAndStatusShow) {
            this._statusWindow.hide();
            this._actorCommandWindow.hide();
        }
    };

    /**
     * 
     */
    const _Scene_Battle_onSelectAction = Scene_Battle.prototype.onSelectAction;
    Scene_Battle.prototype.onSelectAction = function() {
        this._skillWindow.hide();
        this._itemWindow.hide();
        _Scene_Battle_onSelectAction.apply(this, arguments);
    };

    /**
     * 敵キャラ［キャンセル］
     */
    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function() {
        this._statusWindow.show();
        _Scene_Battle_onEnemyCancel.apply(this, arguments);
    };
})();
