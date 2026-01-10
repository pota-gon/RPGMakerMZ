/*:
@plugindesc
ショップレート Ver1.3.5(2023/9/11)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Shop/ShopRate.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.3.5
- ヘルプ追加
- MaxPrice.js と CurrencyUnit.js の競合を解消

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
ショップの購入時と売却時のレートを設定します

## 使い方
プラグインパラメータの購入レートもしくは、売却レートを変更します  
デフォルトはプラグイン導入前と同じになっています

・設定例: 購入レートも売却レートも設定方法は一緒です
- 10倍に設定したい場合: 10
- 5倍に設定したい場合 : 5
- 2倍に設定したい場合 : 2
- 価格と同じ          : 1
- 半額にしたい場合    : 0.5
- 1/4にしたい場合     : 0.25
- 1/10にしたい場合    : 0.1

CurrencyUnit.js 導入時は、このプラグインの設定は無効となるため  
CurrencyUnit.js のプラグインパラメータで、レート設定を行ってください

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
    const common_max_price_params = Potadra_getPluginParams('MaxPrice');
    const CommonPriceMetaName = common_max_price_params ? String(common_max_price_params.PriceMetaName || '価格') : false;
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
        return (meta_price ? Number(meta_price) : item.price) * rate;
    }
    function Potadra_isSecound(switch_no) {
        return $gameSwitches && $gameSwitches.value(switch_no) === true;
    }
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }

})();
