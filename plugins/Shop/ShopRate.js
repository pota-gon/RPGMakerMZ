/*:
@plugindesc
ショップレート Ver1.3.4(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Shop/ShopRate.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- TODO追加

・TODO
- ヘルプ更新

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
ショップの購入時と売却時のレートを設定します。

## 使い方


@param BuyRate
@type number
@text 購入レート
@desc 購入倍率
@min 0
@decimals 2
@default 1.00

@param SellRate
@type number
@text 売却レート
@desc 売却倍率
@min 0
@decimals 2
@default 0.50
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const BuyRate  = Number(params.BuyRate || 1);
    const SellRate = Number(params.SellRate || 0.5);

    /**
     * ショップ画面の処理を行うクラスです。
     *
     * @class
     */

    /**
     * 売値の取得
     *
     * @returns {}
     */
    Scene_Shop.prototype.sellingPrice = function() {
        return Math.floor(this._item.price * SellRate);
    };

    /**
     * アイテムリストの作成
     */
    Window_ShopBuy.prototype.makeItemList = function() {
        this._data = [];
        this._price = [];
        for (const goods of this._shopGoods) {
            const item = this.goodsToItem(goods);
            if (item) {
                this._data.push(item);
                this._price.push(goods[2] === 0 ? item.price * BuyRate : goods[3]);
            }
        }
    };
})();
