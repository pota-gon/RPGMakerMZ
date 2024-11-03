/*:
@plugindesc
名前ショップ Ver1.3.7(2024/11/3)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Name/NameShop.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.3.7: 名前検索用のパラメータ追加
* Ver1.3.6
- 検索時のバグ修正
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

・TODO
- ヘルプ更新

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
名前を指定してショップの処理を呼び出します。

## 使い方


@command name_shop_item
@text 名前ショップ
@desc 名前を指定してショップの処理を呼び出す

    @arg goods
    @type struct<GoodsList>[]
    @text 商品リスト
    @desc ショップの商品リスト

    @arg buyOnly
    @type boolean
    @text 購入のみ
    @desc 購入するのみにするか
    @on 購入のみ
    @off 購入と売却
    @default false
*/

/*~struct~GoodsList:
@param name
@type string
@text 商品名
@desc 商品名(アイテム)を名前で指定

    @param item
    @parent name
    @type item
    @text アイテム名検索用
    @desc このパラメータはデータとしては使用しません

    @param weapon
    @parent name
    @type weapon
    @text 武器名検索用
    @desc このパラメータはデータとしては使用しません

    @param armor
    @parent name
    @type armor
    @text 防具名検索用
    @desc このパラメータはデータとしては使用しません

@param price
@type number
@text 価格
@desc 価格を指定。0: データベースの価格を適用
@default 0
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
    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) {
            return val;
        }
        for (let i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column) {
                if (data[i][search_column] == id) {
                    if (column) {
                        val = data[i][column];
                    } else {
                        val = data[i];
                    }
                    break;
                }
            } else if (i == id) {
                val = data[i];
                break;
            }
        }
        return val;
    }
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();

    // プラグインコマンド(名前ショップ)
    PluginManager.registerCommand(plugin_name, "name_shop_item", args => {
        const goods = [];
        const buy_only = Potadra_convertBool(args.buyOnly);
        if (args.goods) {
            const good_lists = JSON.parse(args.goods);
            let type, val;

            for (const good_list of good_lists) {
                const good_data = JSON.parse(good_list);
                const name      = good_data.name;
                const price     = good_data.price;

                // アイテム
                type = 0;
                val  = Potadra_nameSearch($dataItems, name);

                if (!val) {
                    // 武器
                    type = 1;
                    val  = Potadra_nameSearch($dataWeapons, name);
                    if (!val) {
                        // 防具
                        type = 2;
                        val  = Potadra_nameSearch($dataArmors, name);
                    }
                }

                if (val) {
                    let set = 0;
                    if (price > 0) {
                        set = 1;
                    }
                    goods.push([type, val, set, price]);
                }
            }
        }

        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, buy_only);
    });
})();
