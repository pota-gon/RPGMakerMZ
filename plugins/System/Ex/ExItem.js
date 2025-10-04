/*:
@plugindesc
アイテム名参照制御文字 Ver1.2.6(2025/10/4)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/System/Ex/ExItem.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.2.6: 2つ以上同時に使用出来ないバグ修正
* Ver1.2.5: ヘルプ更新

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
アイテム名を参照する制御文字 \II を追加します

## 使い方
\II[ポーション] のようにアイテム名を記載すると  
[アイコン]ポーション のようにアイコンとアイテム名が表示されるようになります

アイテム名には、武器や防具も指定することが出来ます  
同じアイテム名がある場合は、最初に見つけたアイテム名が表示されます
*/
(() => {
    'use strict';

    // ベースプラグインの処理
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
    function Potadra_itemSearch(name, column = false, search_column = "name", val = false, initial = 1) {
        const item = Potadra_search($dataItems, name, column, search_column, val, initial);
        if (item) return item;
        const weapon = Potadra_search($dataWeapons, name, column, search_column, val, initial);
        if (weapon) return weapon;
        const armor = Potadra_search($dataArmors, name, column, search_column, val, initial);
        if (armor) return armor;
        return false;
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
        tmp_text = tmp_text.replace(/\x1bII\[(.+?)\]/gi, (_, p1) =>
            "\x1bI[" + Potadra_itemSearch(p1, 'iconIndex') + "]" + p1
        );
        return tmp_text;
    };
})();
