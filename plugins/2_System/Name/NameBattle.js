/*:
@plugindesc
名前戦闘呼び出し Ver1.0.1(2026/1/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Name/NameBattle.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: 検索にキャッシュ追加
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
戦闘で敵グループを名前で参照するプラグインコマンドを提供します

## 使い方
1. プラグインコマンドを呼び出します
2. コマンド名『戦闘の処理』を選択します
3. 引数の『敵グループ名』に「敵グループの名前」を入力します
4. 引数の『敗北時の処理』で、「敗北時の処理」を選択します
5. 引数の『逃走可能』で、「逃走可能かどうか」を選択します

@command battle_processing
@text 戦闘の処理
@desc 名前で敵グループを指定して戦闘を開始します

    @arg troop_name
    @type string
    @text 敵グループ名
    @desc 戦闘する敵グループの名前

        @arg troop
        @parent troop_name
        @type troop
        @text 敵グループ検索用
        @desc このパラメータはデータとしては使用しません

    @arg defeat_process
    @type boolean
    @text 敗北時の処理
    @desc 敗北時の処理を続行するか
    @on 続行する
    @off 続行しない
    @default false

    @arg can_escape
    @type boolean
    @text 逃走可能
    @desc 戦闘から逃走可能かどうか
    @on 逃走可能
    @off 逃走不可
    @default true
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

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();

    // プラグインコマンド(戦闘の処理)
    PluginManager.registerCommand(plugin_name, 'battle_processing', function (args) {
        const troop_name     = String(args.troop_name);
        const defeat_process = Potadra_convertBool(args.defeat_process);
        const can_escape     = Potadra_convertBool(args.can_escape);

        const troop_id = Potadra_nameSearch($dataTroops, troop_name);
        if (troop_id) this.command301([0, troop_id, can_escape, defeat_process]);
    });
})();
