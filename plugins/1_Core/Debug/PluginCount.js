/*:
@plugindesc
プラグイン数カウント Ver1.0.3(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/1_Core/Debug/PluginCount.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.3: プラグイン名表示(ShowPlayName)のログレベルを情報に変更
* Ver1.0.2: プラグイン名表示機能を追加
* Ver1.0.1: コンソールログの出力方法を修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
プラグインの総数とONになっているプラグイン数を表示します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

@param PlayTest
@type boolean
@text テスト時のみ有効
@desc テスト時のみ有効にするか
@on 有効にする
@off 常に有効
@default true

@param ShowPlayName
@type boolean
@text プラグイン名表示
@desc プラグイン名を表示するか
@on 表示する
@off 表示しない
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
    function Potadra_getDirPath(dir) {
        if (StorageManager.isLocalMode()) {
            const path = require("path");
            const base = path.dirname(process.mainModule.filename);
            return path.join(base, dir + '/');
        } else {
            return dir + '/';
        }
    }
    function Potadra_isTest(play_test = true) {
        return !play_test || Utils.isOptionValid("test");
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const PlayTest     = Potadra_convertBool(params.PlayTest);
    const ShowPlayName = Potadra_convertBool(params.ShowPlayName);

    function countPlugins() {
        const pluginPath = Potadra_getDirPath('js') + 'plugins.js';
        const lines = StorageManager.fsReadFile(pluginPath).split('\n');
        let line_count = 0;
        let on_count   = 0;
        for (let line of lines) {
            if (line.includes('name')) {
                line = JSON.parse(line.replace(/,$/, ''));
                if (ShowPlayName) console.info(line.name);
                line_count++;
                if (line.status) on_count++;
            }
        }
        console.info('総プラグイン数:' + line_count);
        console.info('ONになっているプラグイン数:' + on_count);
    }

    if (Potadra_isTest(PlayTest)) countPlugins();
})();
