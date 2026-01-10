/*:
@plugindesc
名前スイッチ Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Name/NameSwitch.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 名前検索用のパラメータ追加

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
名前でスイッチをON・OFFできるプラグインコマンド「名前スイッチ」を追加します

## 使い方
1. イベントコマンドから、プラグインコマンドを選択
2. プラグイン名に「NameSwitch」を指定  
※ コマンド名は「名前スイッチ」が自動で選択されます
3. 引数の「スイッチ名(SwitchName)」にスイッチ名を記載
4. 引数の「操作(Operation)」でON・OFFを選択

### プラグインコマンド説明

#### 名前スイッチ
名前でスイッチをON・OFFに出来るプラグインコマンド

##### スイッチ名(SwitchName)
スイッチ名を記載

##### 操作(Operation)
ON・OFFを選択

@command switch_name
@text 名前スイッチ
@desc 名前を指定してスイッチを呼び出す

    @arg SwitchName
    @type string
    @text スイッチ名
    @desc スイッチを名前で指定

        @arg switch
        @parent SwitchName
        @type switch
        @text スイッチ名検索用
        @desc このパラメータはデータとしては使用しません

    @arg Operation
    @type boolean
    @text 操作
    @desc スイッチをON・OFF設定
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

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();

    function switchSearch (name, value) {
        for (let i = 0; i < $dataSystem.switches.length; i++) {
            if ($dataSystem.switches[i] === name) {
                $gameSwitches.setValue(i, value);
                return true;
            }
        }
        console.warn('スイッチ「' + name + '」が見つかりません。');
    }

    // プラグインコマンド(名前スイッチ)
    PluginManager.registerCommand(plugin_name, "switch_name", args => {
        const SwitchName = String(args.SwitchName);
        const Operation = Potadra_convertBool(args.Operation);
        switchSearch(SwitchName, Operation);
    });
})();
