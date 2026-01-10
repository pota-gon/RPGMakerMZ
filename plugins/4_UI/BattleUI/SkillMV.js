/*:
@plugindesc
戦闘スキル・アイテム選択MV風 Ver1.0.4(2024/9/22)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/BattleUI/SkillMV.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.4: 敵キャラ選択キャンセル時にアクターのステータスウィンドウが表示されなくなるバグ修正
* Ver1.0.3: 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
戦闘中のスキルとアイテム選択をMV風に変更します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

@param CancelButtonPosition
@type boolean
@text キャンセルボタン位置
@desc キャンセルボタンの位置
@on 左揃え
@off 右揃え
@default false

@param CommandAndStatusShow
@type boolean
@text コマンド・ステータス表示可否
@desc コマンド・ステータスの表示可否
@on 表示する
@off 表示しない
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const CancelButtonPosition = Potadra_convertBool(params.CancelButtonPosition);
    const CommandAndStatusShow = Potadra_convertBool(params.CommandAndStatusShow);

    /**
     * スキルウィンドウのサイズ指定(アイテムウィンドウもデフォルトはこちらで設定)
     *
     * @returns {} 
     */
    Scene_Battle.prototype.skillWindowRect = function() {
        const ww = Graphics.boxWidth;
        let skill_height = Graphics.height - (this.helpAreaTop() + this._helpWindow.height);
        // コマンド・ステータスを表示する場合、その分だけスキルウィンドウのサイズを小さくする
        if (CommandAndStatusShow) {
            skill_height -= Math.max(this._statusWindow.height, this._actorCommandWindow.height);
        }
        const calc = Math.floor(skill_height / 48);
        const wh = this.calcWindowHeight(calc, true);
        const wx = 0;
        const wy = this.helpAreaTop() + this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ヘルプ位置
     *
     * @returns {} 
     */
    Scene_Battle.prototype.helpAreaTop = function() {
        return 48;
    };

    /**
     * キャンセルボタン作成
     */
    Scene_Battle.prototype.createCancelButton = function() {
        this._cancelButton = new Sprite_Button("cancel");
        if (CancelButtonPosition) {
            this._cancelButton.x = 4;
        } else {
            this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        }
        this._cancelButton.y = 0;
        this.addWindow(this._cancelButton);
    };

    /**
     * コマンド［スキル］
     */
    Scene_Battle.prototype.commandSkill = function() {
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
        if (!CommandAndStatusShow) {
            this._statusWindow.hide();
            this._actorCommandWindow.hide();
        }
    };

    /**
     * コマンド［アイテム］
     */
    Scene_Battle.prototype.commandItem = function() {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
        if (!CommandAndStatusShow) {
            this._statusWindow.hide();
            this._actorCommandWindow.hide();
        }
    };

    /**
     * 
     */
    const _Scene_Battle_onSelectAction = Scene_Battle.prototype.onSelectAction;
    Scene_Battle.prototype.onSelectAction = function() {
        this._skillWindow.hide();
        this._itemWindow.hide();
        _Scene_Battle_onSelectAction.apply(this, arguments);
    };

    /**
     * 敵キャラ［キャンセル］
     */
    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function() {
        this._statusWindow.show();
        _Scene_Battle_onEnemyCancel.apply(this, arguments);
    };
})();
