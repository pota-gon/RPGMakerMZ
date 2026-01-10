/*:
@plugindesc
ゲーム開始時のプレイヤー位置を固定 Ver1.1.1(2025/5/29)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/1_Core/Start/StartPosition.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.1.1: 初期マップを指定しなかったとき、プレイヤーの向きだけ設定出来るように修正
* Ver1.1.0: MZ1.9.0アップデートにて追加された「@type location」で設定するように変更(再設定が必要になります)
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
本番用のゲーム開始時のプレイヤー位置を固定します

## 使い方
本番時のみ、こちらのプラグインの初期位置を参照することで  
テストプレイ時に初期位置を変更したときに  
いきなりラスボスから始まるのを防ぐためのプラグインです

1. プラグインパラメータにて、マップの座標を設定します
2. テストプレイを実施し、マップの初期位置が正しくなっているかチェックします
3. プラグインパラメータの 本番時のみ有効（PlayProd）を
　「有効にする(true)」に変更します

こうすることで、テストプレイ時はマップに指定した初期位置から  
公開時には、プラグインで指定した初期位置からプレイすることが出来ます

@param PlayProd
@type boolean
@text 本番時のみ有効
@desc 本番時のみ有効にするか
@on 有効にする
@off 常に有効
@default false

@param map
@type location
@text 初期マップ
@desc 初期マップ情報
@default {"mapId":"0","x":"0","y":"0"}

@param StartDirection
@type select
@text プレイヤー初期向き
@desc プレイヤーの初期向き
@default 2
@option 下
@value 2
@option 左
@value 4
@option 右
@value 6
@option 上
@value 8
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
    function Potadra_convertMap(struct_map, cast = false) {
        if (!struct_map) return false;
        let map;
        try {
            map = JSON.parse(struct_map);
        } catch(e){
            return false;
        }
        let map_id = map.mapId;
        if (cast) map_id = Number(map_id || 0);
        const x = Number(map.x || 0);
        const y = Number(map.y || 0);
        return {"mapId": map_id, "x": x, "y": y};
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
    const PlayProd       = Potadra_convertBool(params.PlayProd);
    const map            = Potadra_convertMap(params.map);
    const StartDirection = Number(params.StartDirection || 2);

    if (Potadra_isProd(PlayProd)) {
        /**
         * ゲーム開始時のプレイヤー位置
         */
        Game_Player.prototype.setupForNewGame = function() {
            const map_id = Potadra_checkName($dataMapInfos, map.mapId, 0);
            if (map_id !== 0) {
                this.reserveTransfer(map_id, map.x, map.y, StartDirection, 0);
            } else {
                const mapId = $dataSystem.startMapId;
                const x = $dataSystem.startX;
                const y = $dataSystem.startY;
                this.reserveTransfer(mapId, x, y, StartDirection, 0);
            }
        };
    }
})();
