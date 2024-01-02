/*:
@plugindesc
BGMランダム再生 Ver1.4.8(2022/12/2)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Bgm/RandomBgm.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- URLを修正

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
プラグインコマンド指定したBGMの中からランダムにBGMを再生します。

## 使い方
1. プラグインコマンドを呼び出します
2. プラグインコマンドからランダムに再生したいBGMのリストを作成します
3. プラグインコマンドを指定したイベントが呼び出されると、
BGMのリストからランダムにBGMが再生されます。

タイトルと戦闘のランダムBGMは、パラメータから同様の設定を行ってください。

@param TitleRandom
@type boolean
@text タイトルランダム再生
@desc タイトルでランダム再生をするか
@on ランダム再生する
@off ランダム再生しない
@default false

    @param title_bgms
    @parent TitleRandom
    @text タイトルBGM一覧
    @type struct<BgmList>[]
    @desc タイトルでランダム再生するBGMの一覧

@param BattleRandom
@type boolean
@text 戦闘ランダム再生
@desc 戦闘でランダム再生をするか
@on ランダム再生する
@off ランダム再生しない
@default false

    @param battle_bgms
    @parent BattleRandom
    @text 戦闘BGM一覧
    @type struct<BgmList>[]
    @desc 戦闘中にランダム再生するBGMの一覧

@command random_bgm
@text BGMランダム再生
@desc 指定したBGMの中からランダムにBGMを再生します。

    @arg bgms
    @text BGM一覧
    @type struct<BgmList>[]
    @desc ランダムに再生するBGMの一覧
*/

/*~struct~BgmList:
@param bgm
@type file
@dir audio/bgm
@text BGM
@desc 再生するBGM

@param volume
@type number
@text 音量
@desc 再生するBGMの音量
@default 90
@max 100
@min 0

@param pitch
@type number
@text ピッチ
@desc 再生するBGMのピッチ
@default 100
@max 150
@min 50

@param pan
@type number
@text 位相
@desc 再生するBGMの位相
@default 0
@max 100
@min -100
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
    function Potadra_isExist(file_path) {
        if (StorageManager.isLocalMode()) {
            const path = require('path');
            const file = path.dirname(process.mainModule.filename) + file_path;
            const fs = require('fs');
            return fs.existsSync(file);
        } else {
            const xhr = new XMLHttpRequest();
            try {
                xhr.open('GET', file_path, false);
                xhr.send();
                return true;
            } catch (e) {
                return false;
            }
        }
    }

    // パラメータ用変数
    const plugin_name  = Potadra_getPluginName();
    const params       = PluginManager.parameters(plugin_name);
    const TitleRandom  = Potadra_convertBool(params.TitleRandom);
    const BattleRandom = Potadra_convertBool(params.BattleRandom);

    /**
     * BGM の存在判定
     */
    function BgmIsExist(bgm) {
        return Potadra_isExist('audio/bgm/' + bgm + '.ogg');
    }

    function PlayRandomBgm(bgm_lists) {
        const i        = Math.randomInt(bgm_lists.length);
        const bgm_info = JSON.parse(bgm_lists[i]);
        const bgm      = String(bgm_info.bgm);
        const volume   = Number(bgm_info.volume || 90);
        const pitch    = Number(bgm_info.pitch || 100);
        const pan      = Number(bgm_info.pan || 0);

        // bgmが存在するか判定
        if (BgmIsExist(bgm)) {
            // 存在する場合、BGM判定
            AudioManager.playBgm({"name": bgm, "volume": volume, "pitch": pitch, "pan": pan});
        } else {
            // 存在しない場合、再判定
            const exist_bgm_lists = [];

            for (const bgm_list of bgm_lists) {
                const bgm_info = JSON.parse(bgm_list);
                const bgm      = String(bgm_info.bgm);
                if (BgmIsExist(bgm)) {
                    exist_bgm_lists.push(bgm_info);
                }
            }

            // 一つも再生可能なBGMがない場合は、BGMを再生しない。
            if (exist_bgm_lists.length > 0) {
                const i        = Math.randomInt(exist_bgm_lists.length);
                const bgm_info = exist_bgm_lists[i];
                const bgm      = String(bgm_info.bgm);
                const volume   = Number(bgm_info.volume || 90);
                const pitch    = Number(bgm_info.pitch || 100);
                const pan      = Number(bgm_info.pan || 0);
                AudioManager.playBgm({"name": bgm, "volume": volume, "pitch": pitch, "pan": pan});
            }
        }
    }

    // プラグインコマンド(BGMランダム再生)
    PluginManager.registerCommand(plugin_name, "random_bgm", args => {
        const bgm_lists = JSON.parse(args.bgms);
        PlayRandomBgm(bgm_lists);
    });

    /**
     * タイトル画面の処理を行うクラスです。
     *
     * @class
     */

    /**
     * タイトル画面の音楽演奏
     */
    const _Scene_Title_playTitleMusic = Scene_Title.prototype.playTitleMusic;
    Scene_Title.prototype.playTitleMusic = function() {
        if (TitleRandom && params.title_bgms) {
            const title_bgm_lists = JSON.parse(params.title_bgms);
            PlayRandomBgm(title_bgm_lists);
            AudioManager.stopBgs();
            AudioManager.stopMe();
        } else {
            _Scene_Title_playTitleMusic.apply(this, arguments);
        }
    };


    /**
     * 開始処理
     */
    Scene_Battle.prototype.start = function() {
        Scene_Message.prototype.start.call(this);
        // BattleManager.playBattleBgm();
        BattleManager.startBattle();
        this._statusWindow.refresh();
        this.startFadeIn(this.fadeSpeed(), false);
    };

    /**
     * 戦闘の進行を管理する静的クラスです。
     *
     * @namespace
     */

    /**
     * 戦闘 BGM の演奏
     */
    const _BattleManager_playBattleBgm = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function() {
        if (BattleRandom && params.battle_bgms) {
            const battle_bgm_lists = JSON.parse(params.battle_bgms);
            PlayRandomBgm(battle_bgm_lists);
            AudioManager.stopBgs();
        } else {
            _BattleManager_playBattleBgm.apply(this, arguments);
        }
    };
})();
