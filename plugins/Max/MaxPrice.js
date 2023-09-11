/*:
@plugindesc
価格の最大値変更 Ver1.1.5(2023/9/11)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Max/MaxPrice.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- ヘルプ追加
- ShopRate.js と CurrencyUnit.js の競合を解消

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
価格が 999999 を超えるアイテム・武器・防具のメモ設定を追加します。

## 使い方
1. アイテム・武器・防具のメモに以下のようにタグを指定します。  
<価格:1000000>

2. ショップの処理で呼び出すとそのアイテムが価格タグで指定した金額になります。

@param PriceMetaName
@text 価格タグ
@desc メモ欄のタグ名
空文字の場合は、 "価格" になります
@default 価格
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    const common_max_price_params = Potadra_getPluginParams('MaxPrice');
    const CommonPriceMetaName = common_max_price_params ? String(common_max_price_params.PriceMetaName) || '価格' : false;
    const common_shop_rate_params = Potadra_getPluginParams('ShopRate');
    let CommonBuyRate  = common_shop_rate_params ? Number(common_shop_rate_params.BuyRate || 1) : 1;
    let CommonSellRate = common_shop_rate_params ? Number(common_shop_rate_params.SellRate || 0.5) : 0.5;
    const common_currency_unit_params = Potadra_getPluginParams('CurrencyUnit');
    const CommonCurrencyUnitSwitch = Number(common_currency_unit_params.CurrencyUnitSwitch || 25);
    const CommonSecondBuyRate  = Number(common_currency_unit_params.SecondBuyRate || 1);
    const CommonSecondSellRate = Number(common_currency_unit_params.SecondSellRate || 0.5);
    if (common_currency_unit_params) {
        CommonBuyRate  = Number(common_currency_unit_params.BuyRate || 1);
        CommonSellRate = Number(common_currency_unit_params.SellRate || 0.5);
    }
    Window_ShopBuy.prototype.makeItemList = function() {
        this._data = [];
        this._price = [];
        for (const goods of this._shopGoods) {
            const item = this.goodsToItem(goods);
            if (item) {
                this._data.push(item);
                if (common_currency_unit_params && Potadra_isSecound(CommonCurrencyUnitSwitch)) {
                    this._price.push(goods[2] === 0 ? Potadra_MetaPrice(item, CommonPriceMetaName, CommonSecondBuyRate) : goods[3]);
                } else {
                    this._price.push(goods[2] === 0 ? Potadra_MetaPrice(item, CommonPriceMetaName, CommonBuyRate) : goods[3]);
                }
            }
        }
    };
    Scene_Shop.prototype.sellingPrice = function() {
        if (common_currency_unit_params && Potadra_isSecound(CommonCurrencyUnitSwitch)) {
            return Math.floor(Potadra_MetaPrice(this._item, CommonPriceMetaName, CommonSecondSellRate));
        } else {
            return Math.floor(Potadra_MetaPrice(this._item, CommonPriceMetaName, CommonSellRate));
        }
    };
    function Potadra_isSecound(switch_no) {
        return $gameSwitches && $gameSwitches.value(switch_no) === true;
    }
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_getPluginParams(plugin_name) {
        let params = false;
        if (Potadra_isPlugin(plugin_name)) {
            params = PluginManager.parameters(plugin_name);
        }
        return params;
    }
    function Potadra_meta(meta, tag) {
        if (meta) {
            const data = meta[tag];
            if (data) {
                if (data !== true) {
                    return data.trim();
                } else {
                    return true;
                }
            }
        }
        return false;
    }
    function Potadra_MetaPrice(item, price_meta_name, rate = 1) {
        const meta_price = Potadra_meta(item.meta, price_meta_name);
        if (meta_price) {
            return Number(meta_price) * rate;
        } else {
            return item.price * rate;
        }
    }


    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const PriceMetaName = String(params.PriceMetaName) || '価格';

    // 他プラグイン連携(パラメータ取得)
    const shop_rate_params = Potadra_getPluginParams('ShopRate');
    const BuyRate = shop_rate_params ? Number(shop_rate_params.BuyRate || 1) : 1;

    /**
     * アイテムを許可状態で表示するかどうか
     *
     * @param {} item - 
     * @returns {} 
     */
    Window_ShopSell.prototype.isEnabled = function(item) {
        return item && Potadra_MetaPrice(item, PriceMetaName, BuyRate) > 0;
    };
})();
