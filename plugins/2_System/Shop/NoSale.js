/*:
@plugindesc
売却不可 Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Shop/NoSale.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
価格が指定されているものも、売却不可にするメモタグを追加します

## 使い方
1. アイテム・武器・防具のメモ欄に<売却不可>または、<売却非表示>と記載します  
2. ショップで売却するときに売却不可になります

### メモタグ説明
アイテム・武器・防具のメモ欄に以下のいずれかのタグを記載してください

<売却不可>  
売却できないようになります。一覧には表示されます

<売却非表示>  
売却の一覧に表示されないようになります

※ タグの名称はプラグインパラメータから変更することも可能です

### パラメータ説明

#### 売却不可タグ(NoSaleMetaName)
<売却不可>タグの名称を指定します

#### 売却非表示タグ(NoViewMetaName)
<売却非表示>タグの名称を指定します

@param NoSaleMetaName
@text 売却不可タグ
@desc 売却不可に使うメモ欄タグの名称
デフォルトは 売却不可
@default 売却不可

@param NoViewMetaName
@text 売却非表示タグ
@desc 売却非表示に使うメモ欄タグの名称
デフォルトは 売却非表示
@default 売却非表示
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    const window_shop_shell_no_sale_params = Potadra_getPluginParams('NoSale');
    const Window_ShopSell_NoSaleMetaName   = String(window_shop_shell_no_sale_params.NoSaleMetaName || '売却不可');
    const window_shop_shell_max_price_params = Potadra_getPluginParams('MaxPrice');
    const Window_ShopSell_PriceMetaName      = String(window_shop_shell_max_price_params.PriceMetaName || '価格');
    const window_shop_shell_shop_rate_params = Potadra_getPluginParams('ShopRate');
    const Window_ShopSell_BuyRate            = window_shop_shell_shop_rate_params ? Number(window_shop_shell_shop_rate_params.BuyRate || 1) : 1;
    if (window_shop_shell_no_sale_params || window_shop_shell_max_price_params) {
        Window_ShopSell.prototype.isEnabled = function(item) {
            if (!item) return false;
            if (window_shop_shell_no_sale_params && Potadra_meta(item.meta, Window_ShopSell_NoSaleMetaName)) {
                return false;
            }
            if (window_shop_shell_max_price_params) {
                return Potadra_MetaPrice(item, Window_ShopSell_PriceMetaName, Window_ShopSell_BuyRate) > 0;
            } else {
                return item && item.price > 0;
            }
        };
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


    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const NoViewMetaName = String(params.NoViewMetaName || '売却非表示');

    /**
     * アイテムをリストに含めるかどうか
     *
     * @param {} item - 
     * @returns {} 
     */
    const _Window_ItemList_includes = Window_ItemList.prototype.includes;
    Window_ShopSell.prototype.includes = function(item) {
        let value = _Window_ItemList_includes.apply(this, arguments);
        if (item && Potadra_meta(item.meta, NoViewMetaName)) value = false;
        return value;
    };
})();
