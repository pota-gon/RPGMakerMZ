/*:
@plugindesc
通貨単位切り替え Ver1.3.7(2023/9/11)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Shop/CurrencyUnit.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.3.7
- MaxPrice.js と ShopRate.js の競合を解消
- レート系のプラグインパラメータの桁数を変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
2つの通貨単位をプラグインコマンドで切り替えます  
プラグインコマンドで 通貨切り替え を行った場合に通貨単位が切り替わります

## 使い方

### 使用例1（景品交換所）

導入時はこちらの処理を想定しています  
イベントの実行内容を以下のように設定することで  
景品交換所を実現出来ます

◆プラグインコマンド：CurrencyUnit, 通貨切り替え
◆ショップの処理：ポーション
◆プラグインコマンド：CurrencyUnit, 通貨切り替え

景品の内容はショップの処理で変更してください  
また、ショップの処理を購入のみとすることで、景品交換所らしさが出ます

### 使用例2（2つ目の通貨）

パラメータを以下のように変更し  
イベントの実行内容を以下のように設定することで  
円などの2つ目の世界の通貨を設定出来ます

場所移動を設定していますが、なしでも大丈夫です  
プラグインを呼び出す時に通貨が切り替わります

パラメータ  
  購入コマンド名 購入する  
  2つ目の通貨名 円

● G → 円(イベントの組み方)

◆プラグインコマンド：CurrencyUnit, 通貨切り替え
◆場所移動：日本(0,0)

● 円 → G(イベントの組み方)

◆プラグインコマンド：CurrencyUnit, 通貨切り替え
◆場所移動：ファンタジーの世界(0,0)

@param CurrencyUnitSwitch
@type switch
@text 通貨切り替えスイッチ
@desc ONのとき2つ目の通貨に切り替え
@default 25

@param CurrencyVariable
@type variable
@text 通貨切り替え変数
@desc 一時的に通貨を管理する変数ID
@default 30

@param BuyName
@text 購入コマンド名
@desc 2つ目の通貨の購入コマンド名
@default 交換する

@param SecondCurrencyUnitName
@text 2つ目の通貨名
@desc 2つ目の通貨名
@default 枚

@param BuyRate
@type number
@text 購入レート
@desc 購入倍率
@min 0
@decimals 2
@default 1.00

@param SecondBuyRate
@type number
@text 2つ目の通貨購入レート
@desc 2つ目の通貨購入倍率
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

@param SecondSellRate
@type number
@text 2つ目の通貨売却レート
@desc 2つ目の通貨売却倍率
@min 0
@decimals 2
@default 0.50

@command change_currency_unit
@text 通貨切り替え
@desc 通貨単位を切り替え
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
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_isSecound(switch_no) {
        return $gameSwitches && $gameSwitches.value(switch_no) === true;
    }


    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const CurrencyUnitSwitch     = Number(params.CurrencyUnitSwitch || 25);
    const CurrencyVariable       = Number(params.CurrencyVariable || 30);
    const BuyName                = String(params.BuyName || '交換する');
    const SecondCurrencyUnitName = String(params.SecondCurrencyUnitName || '枚');

    /**
     * 所持金の設定
     *
     * @param {number} amount - 所持金
     */
    function setGold(amount) {
        $gameParty._gold = amount;
    }

    // プラグインコマンド(通貨切り替え)
    PluginManager.registerCommand(plugin_name, "change_currency_unit", args => {
        $gameVariables.setValue(CurrencyVariable, $gameParty.gold());
        setGold($gameVariables.value(CurrencyVariable));

        if (Potadra_isSecound(CurrencyUnitSwitch)) {
            $gameSwitches.setValue(CurrencyUnitSwitch, false);
        } else {
            $gameSwitches.setValue(CurrencyUnitSwitch, true);
        }
    });

    // 通貨の表示切り替え
    Object.defineProperty(TextManager, 'currencyUnit', {
        get: function() {
            if (Potadra_isSecound(CurrencyUnitSwitch)) {
                return SecondCurrencyUnitName;
            } else {
                return $dataSystem.currencyUnit;
            }
        },
        configurable: true
    });


    /**
     * ショップ画面で、購入／売却を選択するウィンドウです。
     *
     * @class
     */

    /**
     * コマンドリストの作成
     */
    const _Window_ShopCommand_makeCommandList = Window_ShopCommand.prototype.makeCommandList;
    Window_ShopCommand.prototype.makeCommandList = function() {
        if ($gameSwitches.value(CurrencyUnitSwitch) === true) {
            this.addCommand(BuyName, "buy");
            this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
            this.addCommand(TextManager.cancel, "cancel");
        } else {
            _Window_ShopCommand_makeCommandList.apply(this, arguments);
        }
    };
})();
