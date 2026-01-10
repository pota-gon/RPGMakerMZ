/*:
@plugindesc
メニューコマンドカーソル移動追加 Ver1.4.5(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/MenuUI/CursorCommand.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.4.5: 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
メニューコマンドに ←→ または、QWキーで同様の処理を追加します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

@param MenuOk
@type boolean
@text メニュー←キー決定
@desc メニューで←キーで決定と同じ動作にする
※ 左メニュー(LeftMenu.js)導入時は→キー
@default false

@param MenuStatusCancel
@type boolean
@text メニューステータス→キーキャンセル
@desc メニューステータスで→キーでキャンセルと同じ動作にする
※ 左メニュー(LeftMenu.js)導入時は←キー
@default true

@param ItemCategoryQW
@type boolean
@text アイテムカテゴリQW操作
@desc アイテムカテゴリでQRでも←→キーと同じ動作にする
@default true

@param SkillTypeCursor
@type boolean
@text スキルタイプ←→操作
@desc スキルタイプで←→でもQRキーと同じ動作にする
@default true

@param StatusTypeCursor
@type boolean
@text ステータス←→操作
@desc ステータスで←→でもQRキーと同じ動作にする
@default true
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MenuOk           = Potadra_convertBool(params.MenuOk);
    const MenuStatusCancel = Potadra_convertBool(params.MenuStatusCancel);
    const ItemCategoryQW   = Potadra_convertBool(params.ItemCategoryQW);
    const SkillTypeCursor  = Potadra_convertBool(params.SkillTypeCursor);
    const StatusTypeCursor = Potadra_convertBool(params.StatusTypeCursor);

    // 他プラグイン連携(プラグインの導入有無)
    const LeftMenu = Potadra_isPlugin('LeftMenu');

    // メニューで←キーで決定と同じ動作にする
    if (MenuOk) {
        /**
         * メニュー画面で表示するコマンドウィンドウです。
         *
         * @class
         */

        /**
         * フレーム更新
         */
        const _Window_MenuCommand_update = Window_MenuCommand.prototype.update;
        Window_MenuCommand.prototype.update = function() {
            _Window_MenuCommand_update.apply(this, arguments);
            this.addProcessHandling();
        };

        /**
         * 決定やキャンセルなどのハンドリング処理（追加）
         *
         * @returns {}
         */
        Window_MenuCommand.prototype.addProcessHandling = function() {
            if (this.isOpenAndActive()) {
                if (LeftMenu) {
                    if (Input.isRepeated("right") && Input.isTriggered("right")) {
                        return this.processOk();
                    }
                } else {
                    if (Input.isRepeated("left") && Input.isTriggered("left")) {
                        return this.processOk();
                    }
                }
            }
        };
    }

    // メニューステータスで→キーでキャンセルと同じ動作にする
    if (MenuStatusCancel) {
        /**
         * メニュー画面でパーティメンバーのステータスを表示するウィンドウです。
         *
         * @class
         */

        /**
         * フレーム更新
         */
        const _Window_MenuStatus_update = Window_MenuStatus.prototype.update;
        Window_MenuStatus.prototype.update = function() {
            _Window_MenuStatus_update.apply(this, arguments);
            this.addProcessHandling();
        };

        /**
         * 決定やキャンセルなどのハンドリング処理（追加）
         *
         * @returns {}
         */
        Window_MenuStatus.prototype.addProcessHandling = function() {
            if (this.isOpenAndActive()) {
                if (LeftMenu) {
                    if (Input.isRepeated("left") && Input.isTriggered("left")) {
                        return this.processCancel();
                    }
                } else {
                    if (Input.isRepeated("right") && Input.isTriggered("right")) {
                        return this.processCancel();
                    }
                }
            }
        };
    }

    // アイテムカテゴリでQRでも←→キーと同じ動作にする
    if (ItemCategoryQW) {
        /**
         * アイテム画面またはショップ画面で、
         * 通常アイテムや装備品の分類を選択するウィンドウです。
         *
         * @class
         */

        /**
         * フレーム更新
         */
        const _Window_ItemCategory_update = Window_ItemCategory.prototype.update;
        Window_ItemCategory.prototype.update = function() {
            _Window_ItemCategory_update.apply(this, arguments);
            this.addProcessCursorMove();
        };

        /**
         * カーソルの移動処理（追加）
         */
        Window_ItemCategory.prototype.addProcessCursorMove = function() {
            if (this.isCursorMovable()) {
                const lastIndex = this.index();
                if (Input.isRepeated("pagedown")) {
                    this.cursorRight(Input.isTriggered("pagedown"));
                }
                if (Input.isRepeated("pageup")) {
                    this.cursorLeft(Input.isTriggered("pageup"));
                }
                if (this.index() !== lastIndex) {
                    this.playCursorSound();
                }
            }
        };
    }

    // スキルタイプで←→でもQRキーと同じ動作にする
    if (SkillTypeCursor) {
        /**
         *
         * @class
         */

        /**
         * フレーム更新
         */
        const _Window_SkillType_update = Window_SkillType.prototype.update;
        Window_SkillType.prototype.update = function() {
            _Window_SkillType_update.apply(this, arguments);
            this.addProcessHandling();
        };

        /**
         * 決定やキャンセルなどのハンドリング処理（追加）
         *
         * @returns {}
         */
        Window_SkillType.prototype.addProcessHandling = function() {
            if (this.isOpenAndActive()) {
                if (Input.isRepeated("right") && Input.isTriggered("right")) {
                    return this.processPagedown();
                }
                if (Input.isRepeated("left") && Input.isTriggered("left")) {
                    return this.processPageup();
                }
            }
        };

        /**
         * カーソルの移動処理（追加）
         */
        Window_SkillType.prototype.addProcessCursorMove = function() {
            if (this.isCursorMovable()) {
                const lastIndex = this.index();
                if (!this.isHandled("right") && Input.isTriggered("right")) {
                    this.cursorPagedown();
                }
                if (!this.isHandled("left") && Input.isTriggered("left")) {
                    this.cursorPageup();
                }
                if (this.index() !== lastIndex) {
                    this.playCursorSound();
                }
            }
        };
    }

    // ステータスで←→でもQRキーと同じ動作にする
    if (StatusTypeCursor) {
        /**
         * ステータス画面で表示する、フル仕様のステータスウィンドウです。
         *
         * @class
         */

        /**
         * フレーム更新
         */
        const _Window_Status_update = Window_Status.prototype.update;
        Window_Status.prototype.update = function() {
            _Window_Status_update.apply(this, arguments);
            this.addProcessHandling();
        };

        /**
         * 決定やキャンセルなどのハンドリング処理（追加）
         *
         * @returns {}
         */
        Window_Status.prototype.addProcessHandling = function() {
            if (this.isOpenAndActive()) {
                if (Input.isRepeated("right") && Input.isTriggered("right")) {
                    return this.processPagedown();
                }
                if (Input.isRepeated("left") && Input.isTriggered("left")) {
                    return this.processPageup();
                }
            }
        };
    }
})();
