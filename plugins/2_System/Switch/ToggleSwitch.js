/*:
@plugindesc
トグルスイッチ Ver1.2.5(2022/12/2)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Switch/ToggleSwitch.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.2.5: URLを修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
指定したスイッチのON・OFFを交互に切り替えるプラグインコマンドを提供します

## 使い方
1. プラグインコマンドを呼び出します
2. プラグインコマンドからON・OFFを交互に切り替えたいスイッチを指定します
3. プラグインコマンドを指定したイベントが呼び出されると  
   指定したスイッチのON・OFFが切り替わります

@command toggle_switch
@text トグルスイッチ
@desc 指定したスイッチのON・OFFを交互に切り替えます

    @arg ToggleSwitch
    @type switch
    @text トグルスイッチ
    @desc ON・OFFを交互に切り替えるスイッチ
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();

    // プラグインコマンド(トグルスイッチ)
    PluginManager.registerCommand(plugin_name, "toggle_switch", args => {
        const ToggleSwitch = Number(args.ToggleSwitch);
        $gameSwitches.setValue(ToggleSwitch, !$gameSwitches.value(ToggleSwitch));
    });
})();
