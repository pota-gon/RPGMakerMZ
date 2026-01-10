/*:
@plugindesc
移動速度変更 Ver1.0.0(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/MoveSpeed.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: リファクタリング(_stateSteps を states を使うように修正)

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
歩行速度とダッシュ速度を変更できる機能を追加します

## 使い方

### 共通設定
プラグインパラメータの歩行速度倍率 OR ダッシュ速度倍率を変更してください  
変更した倍率の速度で移動するようになります

### メモタグ設定
アクター・職業・武器・防具・ステートに移動速度を変更できるメモを追加します  
<移動速度: 歩行速度倍率, ダッシュ速度倍率, 優先度>

例: <移動速度: 1.8, 1,8, 0>  
=> 歩行速度: 1.8倍、ダッシュ速度: 1.8倍、優先度: 0 となる

#### 歩行速度倍率
通常の歩行速度を 1 とした倍率を指定します

#### ダッシュ速度倍率
通常のダッシュ速度を 1 とした倍率を指定します

#### 優先度
他の設定との優先度を指定します  
速度変更設定が複数ある場合、この優先度が高い速度となります

優先度が同じ場合は、一番倍率の低い(一番遅い)設定が適用されます

@param Walk
@type number
@text 歩行速度倍率
@desc 歩行の速度倍率
通常の歩行速度を 1 とした倍率。デフォルト値は 1.5
@default 1.5
@decimals 2

@param Dash
@type number
@text ダッシュ速度倍率
@desc ダッシュの速度倍率
通常のダッシュ速度を 1 とした倍率。デフォルト値は 1.5
@default 1.5
@decimals 2

@param MoveSpeedMetaName
@text 移動速度タグ
@desc 移動速度に使うメモ欄タグの名称
デフォルトは 移動速度
@default 移動速度
*/
(() => {
    'use strict';

    // ベースプラグインの処理
    function Potadra_getPluginName(extension = 'js') {
        const reg = new RegExp(".+\/(.+)\." + extension);
        return decodeURIComponent(document.currentScript.src).replace(reg, '$1');
    }
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
        }
        return false;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const Walk              = Number(params.Walk || 1.5);
    const Dash              = Number(params.Dash || 1.5);
    const MoveSpeedMetaName = String(params.MoveSpeedMetaName || '移動速度');

    function convert(data) {
        let walk     = Number(data[0]);
        let dash     = Number(data[1]);
        let priority = Number(data[2]);
        return [walk, dash, priority];
    }

    // 移動速度タグチェック
    function checkSpeed(walk, dash, priority, data) {
        if (!data) return false;

        const [new_walk, new_dash, new_priority] = convert(data);

        // 優先度が高い場合、無条件で置き換え
        // 優先度が同じの場合、歩行速度 OR ダッシュ速度が遅いものを置き換え
        const value = new_priority > priority || (new_priority === priority && (new_walk < walk || new_dash < dash));
        return value ? [new_walk, new_dash, new_priority] : false;
    }

    /**
     * 1 フレームあたりの移動距離を計算
     *
     * @returns {} 
     */
    const _Game_CharacterBase_distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
    Game_CharacterBase.prototype.distancePerFrame = function() {
        let walk     = Walk;
        let dash     = Dash;
        let priority = -999999999999999;
        let new_data = [];

        for (const actor of $gameParty.allMembers()) {
            // 移動速度(アクター)
            let data = Potadra_metaData(actor.actor().meta[MoveSpeedMetaName], ',');
            if (data) [walk, dash, priority] = convert(data);

            // 移動速度(職業)
            data = Potadra_metaData(actor.currentClass().meta[MoveSpeedMetaName], ',');
            new_data = checkSpeed(walk, dash, priority, data);
            if (new_data) [walk, dash, priority] = new_data;

            // 移動速度(武器・防具)
            for (const item of actor.equips()) {
                if (item) {
                    data = Potadra_metaData(item.meta[MoveSpeedMetaName], ',');
                    new_data = checkSpeed(walk, dash, priority, data);
                    if (new_data) [walk, dash, priority] = new_data;
                }
            }

            // 移動速度(ステート)
            for (const state of actor.states()) {
                data = Potadra_metaData(state.meta[MoveSpeedMetaName], ',');
                new_data = checkSpeed(walk, dash, priority, data);
                if (new_data) [walk, dash, priority] = new_data;
            }
        }

        let rate = this.isDashing() ? dash : walk;
        const value = _Game_CharacterBase_distancePerFrame.apply(this, arguments);
        return value * rate;
    };
})();
