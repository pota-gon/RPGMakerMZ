/*:
@plugindesc
大事なもの売却禁止 Ver1.0.2(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Shop/KeyItem.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.2: リファクタリング(class記法に修正)
* Ver1.0.1: コピーライト更新

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
ショップで大事なものを一覧に表示しないようにします

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します
*/
(() => {
    'use strict';

    //------------------------------------------------------------------------------
    // Window_ShopItemCategory
    //------------------------------------------------------------------------------
    // ショップ画面で、通常アイテムや装備品の分類を選択するウィンドウです。
    //------------------------------------------------------------------------------
    class Window_ShopItemCategory extends Window_ItemCategory {
        /**
         * オブジェクト初期化
         *
         * @param {} rect - 
         */
        constructor(rect) {
            super(rect);
        }

        /**
         * 桁数の取得
         *
         * @returns {} 
         */
        maxCols() {
            return 3;
        }

        /**
         * コマンドリストの作成
         */
        makeCommandList() {
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
    }

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
