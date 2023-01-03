/*:
@plugindesc
装備スロット変更 Ver1.4.3(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Equip/ChangeSlot.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 装備スロットの列を変更する機能を追加
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

Copyright (c) 2023 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
装備スロットを複数設定可能にします。

## 使い方
パラメータ(装備スロット)に装備タイプを設定することで、  
装飾品を2つにするなど装備スロットを複数にすることが出来ます。  
※ 導入時の設定は、装飾品が2つになる設定です。

### 装備タイプの設定方法について
データベースの「タイプ」から設定できます。  
以下は、設定を変更していない場合の番号です。

1. 武器
2. 盾
3. 頭
4. 身体
5. 装飾品

@param Slots
@type number[]
@text 装備スロット
@desc 装備スロット(装備タイプ)の番号を指定
装備タイプがデフォルトの場合は、1: 武器 5: 装飾品
@default ["1", "2", "3", "4", "5", "5"]

@param FixStatusEquipOver
@type boolean
@text 装備タイプバグ修正
@desc 装備タイプが7個以上あるときステータスの
装備に表示しきれないバグ修正(スクロールできるように修正)
@on 修正する
@off 修正しない
@default false

@param Slot
@type number
@text スロット列数
@desc スロットの列数
@default 1
@min 1
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_numberArray(data) {
        const arr = [];
        for (const value of JSON.parse(data)) {
            arr.push(Number(value));
        }
        return arr;
    }
    function Potadra_convertBool(bool) {
        if (bool === "false" || bool === '' || bool === undefined) {
            return false;
        } else {
            return true;
        }
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const Slots              = Potadra_numberArray(params.Slots);
    const FixStatusEquipOver = Potadra_convertBool(params.FixStatusEquipOver);
    const Slot               = Number(params.Slot) || 0;

    /**
     * アクターを扱うクラスです。
     * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
     * Game_Party クラス（$gameParty）からも参照されます。
     *
     * @class
     */

    /**
     * 装備スロットの配列を取得
     *
     * @returns {array} 装備スロットの配列
     */
    Game_Actor.prototype.equipSlots = function() {
        if (Slots.length >= 2 && this.isDualWield()) {
            Slots[1] = 1;
        }
        return Slots;
    };

    // 装備タイプバグ修正
    if (FixStatusEquipOver) {
        /**
         * オブジェクト初期化
         *     info_viewport : 情報表示用ビューポート
         *
         * @param {} rect -
         */
        const _Window_StatusEquip_initialize = Window_StatusEquip.prototype.initialize;
        Window_StatusEquip.prototype.initialize = function(rect) {
            _Window_StatusEquip_initialize.apply(this, arguments);
            this.refresh();
            this.select(0);
            this.activate();
        };
    }

    // 装備スロット列変更
    if (Slot > 1) {
        /**
         * 
         *
         * @returns {} 
         */
        Window_EquipSlot.prototype.slotNameWidth = function() {
            return 138 / Slot;
        };

        /**
         * 桁数の取得
         *
         * @returns {} 
         */
        Window_EquipSlot.prototype.maxCols = function() {
            return Slot;
        };
    }
})();
