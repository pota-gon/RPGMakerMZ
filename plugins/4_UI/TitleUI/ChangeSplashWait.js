/*:
@plugindesc
スプラッシュ画面ウェイト時間変更 Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/TitleUI/ChangeSplashWait.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
スプラッシュ画面のウェイト時間を変更可能にします

## 使い方
1. RPGツクールMZを1.8.0以降にアップデート
2. コアスクリプトを1.8.0以降に更新
3. img/system/Splash.png に表示したいスプラッシュ画像を配置
4. システム1の「スプラッシュ画面を表示」にチェックを入れる
5. パラメータのウェイト時間を変更する
6. ゲームを起動すると指定したウェイトの時間だけロゴを表示するようになります

### パラメータ説明

#### ウェイト時間(Wait)
ロゴを表示する時間(1フレーム: 1/60秒)  
デフォルト(120フレーム: 2秒)

#### スキップ有効(EnableSkip)
決定キーやクリックによるスキップを有効にするか  
デフォルト(スキップ有効)

@param Wait
@type number
@text ウェイト時間
@desc ロゴを表示する時間(1フレーム: 1/60秒)
デフォルト(120フレーム: 2秒)
@default 120
@min 1
@max 999999999999999

@param EnableSkip
@type boolean
@text スキップ有効
@desc 決定キーやクリックによるスキップを有効にするか
@on 有効にする(デフォルト)
@off 無効にする
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
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const Wait       = Number(params.Wait || 120);
    const EnableSkip = Potadra_convertBool(params.EnableSkip);

    Scene_Splash.prototype.initWaitCount = function() {
        if (this.isEnabled()) {
            this._waitCount = Wait;
        } else {
            this._waitCount = 0;
        }
    };

    Scene_Splash.prototype.checkSkip = function() {
        if (!EnableSkip) return false;

        if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
            this._waitCount = 0;
        }
    };
})();
