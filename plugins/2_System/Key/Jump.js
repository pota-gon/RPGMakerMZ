/*:
@plugindesc
ジャンプ Ver1.0.1(2023/6/26)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Key/Jump.js
@orderAfter wasdKeyMZ
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: ロンチプラグインの wasdKeyMZ.js と競合するため、順番をエラー表示するように修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
Jキーを押すことでその場でジャンプします

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    Input.keyMapper[74] = 'J';

    const _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function() {
        const value = _Game_Player_triggerButtonAction.apply(this, arguments);
        if (Input.isTriggered("J")) {
            this.jump(0, 0);
        }
        return value;
    };
})();
