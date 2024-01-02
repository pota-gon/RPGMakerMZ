/*:
@plugindesc
アイテム取得 Ver1.4.5(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Name/NameGetItem.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 検索時のバグ修正

・TODO
減らす機能: 装備の場合は装備品も含めるか

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
名前からアイテムを取得する  
プラグインコマンドを提供します。

## 使い方
1. プラグインコマンドを呼び出します
2. プラグインコマンドの名前に『取得したいアイテム名』を入力します
3. プラグインコマンドを指定したイベントが呼び出されると、
アイテムを検索し取得します

検索の順番は、アイテム => 武器 => 防具 の順番となります。  
同じ名称のアイテムが複数ある場合は、最初に検索したアイテムを入手します。

セーブデータ上のアイテムは、IDで記録されます。  
ゲーム公開後は、データベースの入れ替えはおすすめしません。

@command get_item
@text アイテム取得
@desc 名前からアイテムを取得します

    @arg name
    @type string
    @text 名前
    @desc 取得したいアイテムの名称

    @arg count
    @type number
    @text 個数
    @desc 取得したいアイテムの個数
    @default 1
    @min -99999

    @arg message
    @type multiline_string
    @text アイテム入手メッセージ
    @desc アイテム獲得時のメッセージ。空文字の場合、表示しません
    %1: アイコン番号 %2: アイテム名 %3: 個数
    @default \I[%1]%2を%3個手に入れた！

    @arg se
    @type file
    @dir audio/se
    @text アイテム入手SE
    @desc アイテム入手時に再生するSE
    指定しない場合、再生しません
    @default Item3

        @arg volume
        @parent se
        @type number
        @text 音量
        @desc 再生するSEの音量
        @default 90
        @max 100
        @min 0

        @arg pitch
        @parent se
        @type number
        @text ピッチ
        @desc 再生するSEのピッチ
        @default 100
        @max 150
        @min 50

        @arg pan
        @parent se
        @type number
        @text 位相
        @desc 再生するSEの位相
        @default 0
        @max 100
        @min -100
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
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
    function Potadra_itemSearch(name, column = false, search_column = "name", val = false, initial = 1) {
        const item = Potadra_search($dataItems, name, column, search_column, val, initial);
        if (item) {
            return item;
        }
        const weapon = Potadra_search($dataWeapons, name, column, search_column, val, initial);
        if (weapon) {
            return weapon;
        }
        const armor = Potadra_search($dataArmors, name, column, search_column, val, initial);
        if (armor) {
            return armor;
        }
        return false;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();

    // プラグインの導入有無
    const GetInformation = Potadra_isPlugin('GetInformation');

    // プラグインコマンド(アイテム取得)
    PluginManager.registerCommand(plugin_name, "get_item", args => {
        const name    = String(args.name);
        const count   = Number(args.count || 1);
        const message = String(args.message);
        const se      = String(args.se);
        const volume  = Number(args.volume || 90);
        const pitch   = Number(args.pitch || 100);
        const pan     = Number(args.pan || 0);
        const item    = Potadra_itemSearch(name);
        if (GetInformation) {
            CommonPopupManager._popEnable = CommonPopupManager.popEnable();
        }
        $gameParty.gainItem(item, count);
        if (GetInformation) {
            CommonPopupManager._popEnable = false;
        }
        if (se) {
            AudioManager.playSe({"name": se, "volume": volume, "pitch": pitch, "pan": pan});
        }
        if (!GetInformation && message) {
            $gameMessage.add(message.format(item.iconIndex, item.name, count));
        }
    });
})();
