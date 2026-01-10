/*:
@plugindesc
色変更 Ver1.0.0(2025/10/4)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Color.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
デフォルトで設定されている色の設定を変更します

## 使い方
1. 変更したい色のプラグインパラメータを変更
2. ゲームを起動すると指定した色がプラグインで指定した色に変更されます

@param NormalColor
@type color
@text 通常文字色
@default 0

@param SystemColor
@type color
@text システム文字色
@default 16

@param CrisisColor
@type color
@text ピンチ文字色
@default 17

@param DeathColor
@type color
@text 戦闘不能文字色
@default 18

@param GaugeBackColor
@type color
@text ゲージ背景色
@default 19

@param HpGaugeColor1
@type color
@text HP ゲージ 1色
@default 20

@param HpGaugeColor2
@type color
@text HP ゲージ 2色
@default 21

@param MpGaugeColor1
@type color
@text MP ゲージ 1色
@default 22

@param MpGaugeColor2
@type color
@text MP ゲージ 2色
@default 23

@param MpCostColor
@type color
@text 消費 MP文字色
@default 23

@param PowerUpColor
@type color
@text 装備 パワーアップ文字色
@default 24

@param PowerDownColor
@type color
@text 装備 パワーアップ文字色
@default 25

@param CtGaugeColor1
@type color
@text CT ゲージ色1
@default 26

@param CtGaugeColor2
@type color
@text CT ゲージ色2
@default 27

@param tpGaugeColor1
@type color
@text TP ゲージ 1色
@default 28

@param tpGaugeColor2
@type color
@text TP ゲージ 2色
@default 29

@param tpCostColor
@type color
@text 消費 TP文字色
@default 29
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
    const NormalColor    = Number(params.NormalColor || 0);
    const SystemColor    = Number(params.SystemColor || 16);
    const CrisisColor    = Number(params.CrisisColor || 17);
    const DeathColor     = Number(params.DeathColor || 18);
    const GaugeBackColor = Number(params.GaugeBackColor || 19);
    const HpGaugeColor1  = Number(params.HpGaugeColor1 || 20);
    const HpGaugeColor2  = Number(params.HpGaugeColor2 || 21);
    const MpGaugeColor1  = Number(params.MpGaugeColor1 || 22);
    const MpGaugeColor2  = Number(params.MpGaugeColor2 || 23);
    const MpCostColor    = Number(params.MpCostColor || 23);
    const PowerUpColor   = Number(params.PowerUpColor || 24);
    const PowerDownColor = Number(params.PowerDownColor || 25);
    const CtGaugeColor1  = Number(params.CtGaugeColor1 || 26);
    const CtGaugeColor2  = Number(params.CtGaugeColor2 || 27);
    const tpGaugeColor1  = Number(params.tpGaugeColor1 || 28);
    const tpGaugeColor2  = Number(params.tpGaugeColor1 || 29);
    const tpCostColor    = Number(params.tpCostColor || 29);

    /**
     * 通常文字色の取得
     *
     * @returns {} 
     */
    ColorManager.normalColor = function() {
        return this.textColor(NormalColor);
    };

    /**
     * システム文字色の取得
     *
     * @returns {} 
     */
    ColorManager.systemColor = function() {
        return this.textColor(SystemColor);
    };

    /**
     * ピンチ文字色の取得
     *
     * @returns {} 
     */
    ColorManager.crisisColor = function() {
        return this.textColor(CrisisColor);
    };

    /**
     * 戦闘不能文字色の取得
     *
     * @returns {} 
     */
    ColorManager.deathColor = function() {
        return this.textColor(DeathColor);
    };

    /**
     * ゲージ背景色の取得
     *
     * @returns {} 
     */
    ColorManager.gaugeBackColor = function() {
        return this.textColor(GaugeBackColor);
    };

    /**
     * HP ゲージ 1色の取得
     *
     * @returns {} 
     */
    ColorManager.hpGaugeColor1 = function() {
        return this.textColor(HpGaugeColor1);
    };

    /**
     * HP ゲージ 2色の取得
     *
     * @returns {} 
     */
    ColorManager.hpGaugeColor2 = function() {
        return this.textColor(HpGaugeColor2);
    };

    /**
     * MP ゲージ 1色の取得
     *
     * @returns {} 
     */
    ColorManager.mpGaugeColor1 = function() {
        return this.textColor(MpGaugeColor1);
    };

    /**
     * MP ゲージ 2色の取得
     *
     * @returns {} 
     */
    ColorManager.mpGaugeColor2 = function() {
        return this.textColor(MpGaugeColor2);
    };

    /**
     * 消費 MP文字色の取得
     *
     * @returns {} 
     */
    ColorManager.mpCostColor = function() {
        return this.textColor(MpCostColor);
    };

    /**
     * 装備 パワーアップ文字色の取得
     *
     * @returns {} 
     */
    ColorManager.powerUpColor = function() {
        return this.textColor(PowerUpColor);
    };

    /**
     * 装備 パワーダウン文字色の取得
     *
     * @returns {} 
     */
    ColorManager.powerDownColor = function() {
        return this.textColor(PowerDownColor);
    };

    /**
     * CT ゲージ色1
     *
     * @returns {} 
     */
    ColorManager.ctGaugeColor1 = function() {
        return this.textColor(CtGaugeColor1);
    };

    /**
     * CT ゲージ色2
     *
     * @returns {} 
     */
    ColorManager.ctGaugeColor2 = function() {
        return this.textColor(CtGaugeColor2);
    };

    /**
     * TP ゲージ 1色の取得
     *
     * @returns {} 
     */
    ColorManager.tpGaugeColor1 = function() {
        return this.textColor(tpGaugeColor1);
    };

    /**
     * TP ゲージ 2色の取得
     *
     * @returns {} 
     */
    ColorManager.tpGaugeColor2 = function() {
        return this.textColor(tpGaugeColor2);
    };

    /**
     * 消費 TP文字色の取得
     *
     * @returns {} 
     */
    ColorManager.tpCostColor = function() {
        return this.textColor(tpCostColor);
    };
})();
