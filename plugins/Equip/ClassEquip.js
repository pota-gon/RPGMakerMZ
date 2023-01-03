/*:
@plugindesc
職業装備 Ver0.5.1(2022/12/2)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Equip/ClassEquip.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- ヘルプ更新

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
装備のメモ欄に職業を装備できる機能を追加します。

## 使い方
初期設定は必要ありません。  
プラグイン導入だけで動作します。

@param NoneClassName
@type string
@text 職業なし名
@desc 職業なしの時の名称
@default 職業なし
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

    // 各パラメータ用定数
    const NoneClassName = String(params.NoneClassName) || '職業なし';

    /**
     * 職業の描画
     *
     * @param {} actor - 
     * @param {} x - 
     * @param {} y - 
     * @param {} width - 
     * @returns {} 
     */
    Window_StatusBase.prototype.drawActorClass = function(actor, x, y, width) {
        width = width || 168;
        this.resetTextColor();
        let name = NoneClassName;
        for (var index = 4; index <= 5; index++) {
            const equips = actor.equips();
            const item   = equips[index];

            if (item) {
                name = item.name;
                break;
            }
        }
        this.drawText(name, x, y, width);
    };
})();
