/*:
@plugindesc
セーブ暗号化解除 Ver1.2.6(2024/11/20)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Save/NoEncrypt.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.2.6: テスト時のみ有効（PlayTest）の説明修正
* Ver1.2.5
- isPlayTest が正しく機能していなかったのを修正
- 一部パラメータの名前変更
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
セーブ内容の暗号化と圧縮をしないように変更します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

このプラグイン導入前のセーブは、読み書き不可能になるので、一度削除するか  
セーブを実施し、上書きしてください

また、圧縮をしないため、ゲームを公開する前にプラグインをOFFもしくは  
削除することをおすすめします

@param PlayTest
@type boolean
@text テスト時のみ有効
@desc テスト時のみ有効にするか
@on 有効にする
@off 常に有効
@default true

@param JsonFormat
@type boolean
@text JSON整形
@desc セーブしたときのJSONを整形するか
@on 整形する
@off 整形しない
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
    function Potadra_isTest(play_test = true) {
        return !play_test || Utils.isOptionValid("test");
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const PlayTest   = Potadra_convertBool(params.PlayTest);
    const JsonFormat = Potadra_convertBool(params.JsonFormat);

    if (Potadra_isTest(PlayTest)) {
        if (JsonFormat) {
            /**
             * 
             *
             * @param {} object - 
             */
            StorageManager.objectToJson = function(object) {
                return new Promise((resolve, reject) => {
                    try {
                        const json = JSON.stringify(JsonEx._encode(object, 0), null, 4);
                        resolve(json);
                    } catch (e) {
                        reject(e);
                    }
                });
            };
        }

        /**
         * 
         *
         * @param {} saveName - 
         * @param {} object - 
         */
        StorageManager.saveObject = function(saveName, object) {
            return this.objectToJson(object)
                .then(zip => this.saveZip(saveName, zip));
        };

        /**
         * 
         *
         * @param {} saveName - 
         */
        StorageManager.loadObject = function(saveName) {
            return this.loadZip(saveName)
                .then(json => this.jsonToObject(json));
        };
    }
})();
