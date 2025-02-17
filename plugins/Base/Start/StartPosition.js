/*:
@plugindesc
ゲーム開始時のプレイヤー位置を固定 Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/Base/Start/StartPosition.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 公開

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
本番用のゲーム開始時のプレイヤー位置を固定します

## 使い方
本番時のみ、こちらのプラグインの初期位置を参照することで  
テストプレイ時に初期位置を変更したときに  
いきなりラスボスから始まるのを防ぐためのプラグインです

1. プラグインパラメータにマップの座標を記載します
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

@param mapId
@type number
@text 初期マップID
@desc 初期マップ名を指定した場合は、こちらの設定は不要です
@default 0
@min 0

    @param mapName
    @parent mapId
    @type string
    @text 初期マップ名
    @desc 初期マップIDを指定した場合は、こちらの設定は不要です

    @param x
    @parent mapId
    @type number
    @text X座標
    @desc 初期のマップX座標
    @default 0
    @min 0

    @param y
    @parent mapId
    @type number
    @text Y座標
    @desc 初期のマップY座標
    @default 0
    @min 0

    @param StartDirection
    @parent mapId
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
    function Potadra_isProd(production = true) {
        return !production || !Utils.isOptionValid("test");
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

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const PlayProd       = Potadra_convertBool(params.PlayProd);
    let mapId            = Number(params.mapId || 0);
    const mapName        = String(params.mapName);
    const x              = Number(params.x || 0);
    const y              = Number(params.y || 0);
    const StartDirection = Number(params.StartDirection || 2);

    if (Potadra_isProd(PlayProd)) {
        /**
         * ゲーム開始時のプレイヤー位置
         */
        Game_Player.prototype.setupForNewGame = function() {
            if (mapId === 0 && mapName) {
                mapId = Potadra_nameSearch($dataMapInfos, mapName, 'id', 'name', 1);
            }
            this.reserveTransfer(mapId, x, y, StartDirection, 0);
        };
    }
})();
