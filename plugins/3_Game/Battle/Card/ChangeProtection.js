/*:
@plugindesc
守護 Ver1.0.1(2026/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Card/ChangeProtection.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: ヘルプに守護無視タグの説明追加
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
身代わりをシャドバの守護相当の機能に変更します

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

### 守護無視タグ  
このタグをスキルのメモ欄に記述すると、  
そのスキルは「守護（身代わり）」による強制ターゲット変更を無視して攻撃できます。

・用途：守護を突破するスキルを作りたい場合に使用  
・設定場所：スキルのメモ欄  
・デフォルトタグ名：<守護無視>

【記述例】
<守護無視>

@param IgnoreProtectionMetaName
@text 守護無視タグ
@desc 守護無視スキルに使うメモ欄タグの名称
デフォルトは 守護無視
@default 守護無視
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_meta(meta, tag) {
        if (meta) {
            const data = meta[tag];
            if (data) {
                if (data !== true) {
                    return data.trim();
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const IgnoreProtectionMetaName = String(params.IgnoreProtectionMetaName || '守護無視');

    /**
     * 身代わり判定
     *
     * @param {} target - 
     * @returns {} 
     */
    BattleManager.checkSubstitute = function(target) {
        const action = this._action;
        const ignore = Potadra_meta(this._action.item().meta, IgnoreProtectionMetaName);
        return action.isForOpponent() && !action.isForAll() && !ignore && !target.isSubstitute();
    };
})();
