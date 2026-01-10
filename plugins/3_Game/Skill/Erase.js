/*:
@plugindesc
ニフラム Ver1.0.0(2022/4/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Skill/Erase.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0
- MITライセンスに変更
- 1.5.0 用にパラメータの一部上限解除

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
ドラクエのニフラムと同様の機能を追加します

## 使い方
下記、説明を参考にニフラムの設定をしてください

### スキルの設定
1. ニフラムとするスキルを作成する
2. スキルのメモに <ニフラム> と記載する

### 属性の設定(任意)
1. ニフラム用の属性を作成する
2. プラグインパラメータの属性IDに 1. で作成したニフラム用の属性IDを指定する

#### 敵キャラの設定(任意)
1. 設定したニフラム用の属性有効度を 0 ～ 100% で設定します
2. 0 で完全にニフラム無効(ボスなどに指定)  
   100% 以上の場合は、命中判定だけ行われます

@param ElementId
@type number
@text 属性ID
@desc ニフラムの有効度を判定する属性ID
@default 0
@min 0

@param EraseMessage
@type multiline_string
@text ニフラム成功メッセージ
@desc ニフラム成功時のメッセージ。空文字の場合、表示しません
%1: 敵キャラ名
@default %1を
ひかりのなかへ けしさった！

@param ActionFailureMessage
@type multiline_string
@text ニフラム失敗メッセージ
@desc ニフラム失敗時のメッセージ。空文字の場合、表示しません
%1: 敵キャラ名
@default %1には効かなかった！
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
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const ElementId            = Number(params.ElementId || 0);
    const EraseMessage         = String(params.EraseMessage);
    const ActionFailureMessage = String(params.ActionFailureMessage);

    // ニフラム実行処理
    function Erase(target) {
        if ($gameParty.inBattle()) {
            target.hide();
            target.clearActions();
            target.clearStates();
        }
    }

    // ニフラム判定処理
    function isErase(target, item) {
        return target.result().isHit() && item.meta['ニフラム'] && Math.random() < EraseRate(target);
    }

    // ニフラム有効度取得
    function EraseRate(target) {
        if (ElementId === 0) {
            return 1;
        } else {
            return target.elementRate(ElementId);
        }
    }

    /**
     * アクション実行
     *
     * @param {} target - 
     */
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);
        const result = target.result();
        result.Erase = isErase(target, this.item());
        if (result.Erase) {
            Erase(target);
        }
    };

    /**
     * 通常アクションの呼び出し
     *
     * @param {} subject - 
     * @param {} target - 
     */
    const _BattleManager_invokeNormalAction = BattleManager.invokeNormalAction;
    BattleManager.invokeNormalAction = function(subject, target) {
        _BattleManager_invokeNormalAction.apply(this, arguments);
        if (this._action.item().meta['ニフラム']) {
            this._logWindow.displayErase(this.applySubstitute(target));
        }
    };

    /**
     * 行動結果の表示(ニフラム)
     *
     * @param {} subject - 
     * @param {} target - 
     */
    Window_BattleLog.prototype.displayErase = function(target) {
        const result = target.result();
        if (result.used && EraseMessage && result.Erase) {
            this.push("addText", EraseMessage.format(target.name()));
        } else if (ActionFailureMessage) {
            this.push("addText", ActionFailureMessage.format(target.name()));
        }
    };
})();
