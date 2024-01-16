/*:
@plugindesc
決定キー押下時メッセージウェイト有効 Ver1.0.0(2024/1/16)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Patch/EnterMessageWait.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 作成開始

・TODO
- ヘルプ更新

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
RPGツクールMZ 1.8.0のコアスクリプトで導入された  
以下機能を無効にするパッチです。

決定キーを押している間のイベントの倍速処理の実行中に、  
メッセージのウェイトを無効化するように改善しました。

## 使い方
初期設定は必要ありません。  
プラグイン導入だけで動作します。
*/
(() => {
    'use strict';

    Scene_Map.prototype.updateMainMultiply = function() {
        if (this.isFastForward()) {
            this.updateMain();
        }
        this.updateMain();
    };
})();
