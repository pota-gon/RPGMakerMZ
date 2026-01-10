/*:
@plugindesc
クイズ Ver1.0.3(2022/4/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/EventUI/Quiz.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.3: コピーライト更新

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
イベントコマンド「選択肢の表示」をクイズ形式っぽくします

## 使い方
1. プラグインコマンド「クイズ選択肢」を選択
2. イベントコマンド「文章の表示」で、問題を記載
3. イベントコマンド「選択肢の表示」で、選択肢を作成
4. 選択肢の正解かどうかで後続処理を自由に実装してください
5. プラグインコマンド「クイズ終了」を選択

@command quiz_choices
@text クイズ選択肢
@desc イベントコマンド「選択肢の表示」をクイズ形式に変更します
「選択肢の表示」を実施した次の「選択肢の表示」は通常になります

@command quiz_end
@text クイズ終了
@desc イベントコマンド「選択肢の表示」を通常に戻します
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

    // クイズ選択肢の実行有無
    let QuizChoices = false;

    // プラグインコマンド(クイズ選択肢)
    PluginManager.registerCommand(plugin_name, "quiz_choices", args => {
        QuizChoices = true;
    });

    // プラグインコマンド(クイズ終了)
    PluginManager.registerCommand(plugin_name, "quiz_end", args => {
        QuizChoices = false;
    });

    /**
     * 選択肢の表示
     *
     * @param {} params - 
     * @returns {} 
     */
    const _Game_Interpreter_command102 = Game_Interpreter.prototype.command102;
    Game_Interpreter.prototype.command102 = function(params) {
        const bool = _Game_Interpreter_command102.apply(this, arguments);
        QuizChoices = false;
        return bool;
    };

    /**
     * 
     */
    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        if (QuizChoices) {
            const goldWindow = this._goldWindow;
            this._positionType = $gameMessage.positionType();
            if (this._positionType == 0) {
                this.y = 0;
            } else if (this._positionType == 1) {
                this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
            } else {
                this.y = Graphics.boxHeight - (this.height + this.fittingHeight($gameMessage.choices().length / 2) + 16);
            }
            if (goldWindow) {
                goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
            }
        } else {
            _Window_Message_updatePlacement.apply(this, arguments);
        }
    };

    /**
     * ウィンドウ幅の取得
     *
     * @returns {} 
     */
    const _Window_ChoiceList_windowWidth = Window_ChoiceList.prototype.windowWidth;
    Window_ChoiceList.prototype.windowWidth = function() {
        if (QuizChoices) {
            return Graphics.boxWidth;
        } else {
            return _Window_ChoiceList_windowWidth.apply(this, arguments);
        }
    };

    /**
     * 表示行数の取得
     *
     * @returns {} 
     */
    const _Window_ChoiceList_numVisibleRows = Window_ChoiceList.prototype.numVisibleRows;
    Window_ChoiceList.prototype.numVisibleRows = function() {
        if (QuizChoices) {
            const choices = $gameMessage.choices();
            return Math.min(choices.length / 2, this.maxLines());
        } else {
            return _Window_ChoiceList_numVisibleRows.apply(this, arguments);
        }
    };

    /**
     * 
     *
     * @returns {} 
     */
    const _Window_ChoiceList_maxLines = Window_ChoiceList.prototype.maxLines;
    Window_ChoiceList.prototype.maxLines = function() {
        if (QuizChoices) {
            const messageWindow = this._messageWindow;
            const messageY = messageWindow ? messageWindow.y : 0;
            const messageHeight = messageWindow ? messageWindow.height : 0;
            const centerY = Graphics.boxHeight / 2;
            if (messageY < centerY && messageY + messageHeight > centerY) {
                return 2;
            } else {
                return 4;
            }
        } else {
            return _Window_ChoiceList_maxLines.apply(this, arguments);
        }
    };

    /**
     * 
     *
     * @returns {} 
     */
    const _Window_ChoiceList_windowY = Window_ChoiceList.prototype.windowY;
    Window_ChoiceList.prototype.windowY = function() {
        if (QuizChoices) {
            return Graphics.boxHeight - this.windowHeight();
        } else {
            return _Window_ChoiceList_windowY.apply(this, arguments);
        }
    };

    /**
     * 桁数の取得
     *
     * @returns {number} 桁数
     */
    const _Window_ChoiceList_maxCols = Window_ChoiceList.prototype.maxCols;
    Window_ChoiceList.prototype.maxCols = function() {
        if (QuizChoices) {
            return 2;
        } else {
            return _Window_ChoiceList_maxCols.apply(this, arguments);
        }
    };
})();
