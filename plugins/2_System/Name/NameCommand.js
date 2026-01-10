/*:
@plugindesc
名前コマンド Ver1.0.0(2025/10/19)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Name/NameCommand.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
名前で参照するプラグインコマンドを提供します

## 使い方

### メンバーの入れ替え
1. プラグインコマンドを呼び出します
2. コマンド名『メンバーの入れ替え』を選択します
3. 引数の『名前』に「アクターの名前」を入力します
4. 引数の『操作(加える OR 外す)』で、「加える」か「外す」を選択します
5. 引数の『初期化』で、「メンバーを加えるときに初期化するか」を選択します

@command swap_actor
@text メンバーの入れ替え
@desc 名前でメンバーの入れ替えをします

    @arg name
    @type string
    @text 名前
    @desc 入れ替えたいメンバーの名称

        @arg actor
        @parent name
        @type actor
        @text アクター名検索用
        @desc このパラメータはデータとしては使用しません

    @arg operation
    @type boolean
    @text 操作(加える OR 外す)
    @desc メンバーの入れ替えの操作(加える OR 外す)
    @on 加える
    @off 外す
    @default true

        @arg init
        @parent operation
        @type boolean
        @text 初期化
        @desc メンバーの加入時に初期化するか
        @on 初期化する
        @off 初期化しない
        @default false
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
        if (id === null || id === undefined) return val;
        let cache = Potadra__searchCache_get(data);
        if (!cache) {
            cache = {};
            Potadra__searchCache_set(data, cache);
        }
        const key = `${search_column}:${id}`;
        if (key in cache) {
            const entry = cache[key];
            return column ? entry?.[column] ?? val : entry;
        }
        let result = val;
        for (let i = initial; i < data.length; i++) {
            const item = data[i];
            if (!item) continue;
            if (search_column && item[search_column] == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
            if (!search_column && i == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
        }
        cache[key] = val;
        return val;
    }
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();

    // プラグインコマンド(メンバーの入れ替え)
    PluginManager.registerCommand(plugin_name, 'swap_actor', function(args) {
        const name      = String(args.name);
        const operation = Potadra_convertBool(args.operation) ? 0 : 1;
        const init      = Potadra_convertBool(args.operation);
        this.command129([Potadra_nameSearch($dataActors, name), operation, init]);
    });
})();
