/*:
@plugindesc
Lv参照制御文字 Ver1.0.1(2025/7/22)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Ex/ExLevel.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: アクター名を指定できる機能追加
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
レベルを参照する制御文字 \Lv を追加します

## 使い方
\Lv[アクターID] OR \Lv[アクター名] のように記載すると  
該当するアクター のレベルを参照できるようになります
*/
(() => {
    'use strict';

    // ベースプラグインの処理



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

    /**
     * 制御文字の事前変換
     *    実際の描画を始める前に、原則として文字列に変わるものだけを置き換える。
     *    文字「\」はエスケープ文字（\e）に変換。
     *
     * @param {} text - 
     * @returns {} 
     */
    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        let tmp_text = _Window_Base_convertEscapeCharacters.apply(this, arguments);
        tmp_text = tmp_text.replace(/\x1bLv\[(.+?)\]/gi, (_, p1) =>
            this.potadraActorLevel(p1)
        );
        return tmp_text;
    };

    /**
     * アクター n 番のレベルを取得
     *
     * @param {} n - 
     * @returns {} 
     */
    Window_Base.prototype.potadraActorLevel = function(n) {
        const actor_id = Potadra_checkName($dataActors, n);
        if (!actor_id) return "";

        return $gameActors.actor(actor_id)._level;
    };
})();
