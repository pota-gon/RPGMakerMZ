/*:
@plugindesc
隠しアイテム表示 Ver1.0.6(2024/11/20)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Item/ShowSecret.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.6: テスト時のみ有効（PlayTest）の説明修正
* Ver1.0.5
- isPlayTest が正しく機能していなかったのを修正
- 一部パラメータの名前変更
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
メニュー画面のアイテムに隠しアイテムを表示します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

@param PlayTest
@type boolean
@text テスト時のみ有効
@desc テスト時のみ有効にするか
@on 有効にする
@off 常に有効
@default true

@param SecretItemA
@type string
@text 隠しアイテムＡ表示名
@desc 隠しアイテムＡの表示名
@default 隠しアイテムＡ

@param SecretItemB
@type string
@text 隠しアイテムＢ表示名
@desc 隠しアイテムＢの表示名
@default 隠しアイテムＢ
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
    function Potadra_isTest(play_test = true) {
        return !play_test || Utils.isOptionValid("test");
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const PlayTest    = Potadra_convertBool(params.PlayTest);
    const SecretItemA = String(params.SecretItemA);
    const SecretItemB = String(params.SecretItemB);

    if (Potadra_isTest(PlayTest)) {
        /**
         * アイテム画面で、所持アイテムの一覧を表示するウィンドウです。
         *
         * @class
         */

        /**
         * アイテムをリストに含めるかどうか
         *
         * @param {} item - 
         * @returns {} 
         */
        Window_ItemList.prototype.includes = function(item) {
            switch (this._category) {
                case "item":
                    return DataManager.isItem(item) && item.itypeId === 1;
                case "weapon":
                    return DataManager.isWeapon(item);
                case "armor":
                    return DataManager.isArmor(item);
                case "keyItem":
                    return DataManager.isItem(item) && item.itypeId === 2;
                case 'SecretItemA':
                    return DataManager.isItem(item) && item.itypeId === 3;
                case 'SecretItemB':
                    return DataManager.isItem(item) && item.itypeId === 4;
                default:
                    return false;
            }
        };


        /**
         * アイテム画面またはショップ画面で、
         * 通常アイテムや装備品の分類を選択するウィンドウです。
         *
         * @class
         */

        /**
         * 桁数の取得
         *
         * @returns {} 
         */
        Window_ItemCategory.prototype.maxCols = function() {
            let max_cols = 2;
            if (this.needsCommand("item")) max_cols++;
            if (this.needsCommand("weapon")) max_cols++;
            if (this.needsCommand("armor")) max_cols++;
            if (this.needsCommand("keyItem")) max_cols++;
            return max_cols;
        };

        /**
         * コマンドリストの作成
         */
        Window_ItemCategory.prototype.makeCommandList = function() {
            if (this.needsCommand("item")) {
                this.addCommand(TextManager.item, "item");
            }
            if (this.needsCommand("weapon")) {
                this.addCommand(TextManager.weapon, "weapon");
            }
            if (this.needsCommand("armor")) {
                this.addCommand(TextManager.armor, "armor");
            }
            if (this.needsCommand("keyItem")) {
                this.addCommand(TextManager.keyItem, "keyItem");
            }
            this.addCommand(SecretItemA, 'SecretItemA');
            this.addCommand(SecretItemB, 'SecretItemB');
        };
    }
})();
