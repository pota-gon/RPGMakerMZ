/*:
@plugindesc
名前コモンイベント呼び出し Ver1.0.5(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/System/Name/NameCommonEvent.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.5
- 名前検索用のパラメータ追加
- ヘルプ更新
* Ver1.0.4: 検索時のバグ修正

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
名前でコモンイベントを呼び出します

## 使い方
1. プラグインコマンド「コモンイベント呼び出し」を選択
2. コモンイベントの名前を設定
3. イベントを呼び出すと、コモンイベントを名前から呼び出すようになります

@command common_event
@text コモンイベント呼び出し
@desc 名前からコモンイベントを呼び出します

    @arg name
    @type string
    @text 名前
    @desc コモンイベントの呼び出しに使う名称

        @arg common_event
        @parent name
        @type common_event
        @text コモンイベント名検索用
        @desc このパラメータはデータとしては使用しません
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) return val;
        for (let i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column && data[i][search_column] == id) {
                val = column ? data[i][column] : data[i];
                break;
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

    // プラグインコマンド(コモンイベント呼び出し)
    PluginManager.registerCommand(plugin_name, "common_event", args => {
        const name = String(args.name);
        const id   = Potadra_nameSearch($dataCommonEvents, name);
        if (id) {
            $gameTemp.reserveCommonEvent(id);
        }
    });
})();
