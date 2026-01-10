/*:
@plugindesc
ゲーム開始時の初期パーティを固定 Ver1.0.1(2026/1/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/1_Core/Start/StartMembers.js
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
本番用のゲーム開始時の初期パーティを固定します

## 使い方
本番時のみ、こちらのプラグインの初期パーティを参照することで  
テストプレイ時に初期パーティを変更したときに  
いきなり最強キャラが加入するのを防ぐためのプラグインです

1. プラグインパラメータに初期パーティを設定します
2. テストプレイを実施し、初期パーティが正しくなっているかチェックします
3. プラグインパラメータの 本番時のみ有効（PlayProd）を
　「有効にする(true)」に変更します

こうすることで、テストプレイ時はデータベースに指定した初期パーティから  
公開時には、プラグインで設定した初期パーティでプレイすることが出来ます

@param PlayProd
@type boolean
@text 本番時のみ有効
@desc 本番時のみ有効にするか
@on 有効にする
@off 常に有効
@default false

@param Actors
@type actor[]
@text 初期パーティ
@desc 初期パーティの アクターID OR アクター名を指定します
@default ["1"]
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
    function Potadra_stringArray(data) {
        return data ? JSON.parse(data).map(String) : [];
    }
    function Potadra_isProd(production = true) {
        return !production || !Utils.isOptionValid("test");
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
    function Potadra_checkName(data, name, val = false) {
        if (isNaN(name)) {
            return Potadra_nameSearch(data, name.trim(), "id", "name", val);
        }
        return Number(name || val);
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const PlayProd = Potadra_convertBool(params.PlayProd);
    const Actors   = Potadra_stringArray(params.Actors);

    if (Potadra_isProd(PlayProd)) {
        /**
         * 初期パーティのセットアップ
         */
        Game_Party.prototype.setupStartingMembers = function() {
            this._actors = [];
            for (const actorName of Actors) {
                const actorId = Potadra_checkName($dataActors, actorName);
                if ($gameActors.actor(actorId)) this._actors.push(actorId);
            }
        };
    }
})();
