/*:
@plugindesc
常時マップ名表示 Ver1.4.4(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/Game/Map/EternalName.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.4.4: 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

・TODO
- ヘルプ更新

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
マップ名を常に表示します

## 使い方


@param DisableMapNameSwitch
@type switch
@text 非表示スイッチ
@desc ONのときマップ名を非表示にするスイッチ
@default 0

@param EnableMapName
@type boolean
@text マップ名前表示
@desc 表示名がないとき、マップの名前を表示するか
@default false
@on 表示する
@off 表示しない

@param FloorVariable
@type variable
@text 階層変数
@desc 階層を管理する変数
@default 0

@param PrefixUnderground
@text 地下名称
@desc 地下表示の文字
@default B

@param SuffixFloor
@text 階層名称
@desc 階層の後ろに表記する文字
@default F
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const DisableMapNameSwitch = Number(params.DisableMapNameSwitch || 0);
    const EnableMapName        = Potadra_convertBool(params.EnableMapName);
    const FloorVariable        = Number(params.FloorVariable || 0);
    const PrefixUnderground    = String(params.PrefixUnderground || 'B');
    const SuffixFloor          = String(params.SuffixFloor || 'F');

    /**
     * マップ名を表示するウィンドウです。
     *
     * @class
     */

    /**
     * オブジェクト初期化
     *
     * @param {} rect -
     */
    Window_MapName.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0;
        this.contentsOpacity = 0;

        // 削除
        // this._showCount = 0;

        this.refresh();
    };

    /**
     * フレーム更新
     */
    Window_MapName.prototype.update = function() {
        Window_Base.prototype.update.call(this);

        // 変更
        // if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
        if ($gameMap.isNameDisplayEnabled()) {
            this.updateFadeIn();

            // 削除
            // this._showCount--;
        } else {
            this.updateFadeOut();
        }
    };

    /**
     * ウィンドウを開く
     */
    Window_MapName.prototype.open = function() {
        this.refresh();

        // 削除
        // this._showCount = 150;
    };

    /**
     * ウィンドウを閉じる
     */
    Window_MapName.prototype.close = function() {
        // 削除
        // this._showCount = 0;
    };

    /**
     * リフレッシュ
     *
     * @returns {}
     */
    Window_MapName.prototype.refresh = function() {
        const MapInfo = $dataMapInfos[$gameMap._mapId];
        this.contents.clear();
        if (!MapInfo) {
            return false;
        }

        // 表示名を格納
        let MapName = $gameMap.displayName();

        // 表示名がなく、名前表示が有効のとき名前を格納
        if (EnableMapName && !MapName) {
            MapName = String(MapInfo.name);
        }

        if (MapName && (DisableMapNameSwitch === 0 || $gameSwitches.value(DisableMapNameSwitch) === false)) {
            const width = this.contentsWidth();
            this.drawBackground(0, 0, width, this.lineHeight());
            if (FloorVariable !== 0 && $gameVariables.value(FloorVariable) >= 1) {
                this.drawText(MapName + $gameVariables.value(FloorVariable) + SuffixFloor, 0, 0, width, 'center');
            } else if (FloorVariable !== 0 && $gameVariables.value(FloorVariable) <= -1) {
                this.drawText(MapName + PrefixUnderground + -$gameVariables.value(FloorVariable) + SuffixFloor, 0, 0, width, 'center');
            } else {
                this.drawText(MapName, 0, 0, width, 'center');
            }
        }
    };
})();
