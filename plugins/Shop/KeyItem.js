/*:
@plugindesc
大事なもの売却禁止 Ver1.0.1(2022/4/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Shop/KeyItem.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: コピーライト更新

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
ショップで大事なものを一覧に表示しないようにします。

## 使い方
初期設定は必要ありません。  
プラグイン導入だけで動作します。
*/
(() => {
    'use strict';

    /**
     * ショップ画面で、
     * 通常アイテムや装備品の分類を選択するウィンドウです。
     *
     * @class
     */
    function Window_ShopItemCategory() {
        this.initialize(...arguments);
    }

    Window_ShopItemCategory.prototype = Object.create(Window_ItemCategory.prototype);
    Window_ShopItemCategory.prototype.constructor = Window_ShopItemCategory;

    /**
     * オブジェクト初期化
     *
     * @param {} rect - 
     */
    Window_ShopItemCategory.prototype.initialize = function(rect) {
        Window_ItemCategory.prototype.initialize.call(this, rect);
    };

    /**
     * 桁数の取得
     *
     * @returns {} 
     */
    Window_ShopItemCategory.prototype.maxCols = function() {
        return 3;
    };

    /**
     * コマンドリストの作成
     */
    Window_ShopItemCategory.prototype.makeCommandList = function() {
        if (this.needsCommand("item")) {
            this.addCommand(TextManager.item, "item");
        }
        if (this.needsCommand("weapon")) {
            this.addCommand(TextManager.weapon, "weapon");
        }
        if (this.needsCommand("armor")) {
            this.addCommand(TextManager.armor, "armor");
        }
    };

    /**
     * カテゴリウィンドウの作成
     */
    Scene_Shop.prototype.createCategoryWindow = function() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ShopItemCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
    };
})();
