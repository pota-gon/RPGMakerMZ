/*:
@plugindesc
BGMランダム再生 Ver2.0.0(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Bgm/RandomBgm.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver2.0.0
- BGM設定をstructに変更（再設定が必要になります）
- エラーが発生していた問題修正
- URLを修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
プラグインコマンド指定したBGMの中からランダムにBGMを再生します

## 使い方
1. プラグインコマンドを呼び出します
2. プラグインコマンドからランダムに再生したいBGMのリストを作成します
3. プラグインコマンドを指定したイベントが呼び出されると
BGMのリストからランダムにBGMが再生されます

タイトルと戦闘のランダムBGMは、パラメータから同様の設定を行ってください

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
    @type struct<BGM>[]
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
    @type struct<BGM>[]
    @desc 戦闘中にランダム再生するBGMの一覧

@command random_bgm
@text BGMランダム再生
@desc 指定したBGMの中からランダムにBGMを再生します

    @arg bgms
    @text BGM一覧
    @type struct<BGM>[]
    @desc ランダムに再生するBGMの一覧
*/

/*~struct~BGM:
@param name
@type file
@dir audio/bgm
@text ファイル名
@desc 再生するBGMのファイル名

@param volume
@type number
@text 音量
@desc 再生するBGMの音量
@min 0
@max 100
@default 90

@param pitch
@type number
@text ピッチ
@desc 再生するBGMのピッチ
@min 50
@max 150
@default 100

@param pan
@type number
@text 位相
@desc 再生するBGMの位相
@min -100
@max 100
@default 0
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
    function Potadra_convertAudio(struct_audio, audio_name) {
        if (!struct_audio) return false;
        let audio;
        try {
            audio = JSON.parse(struct_audio);
        } catch(e){
            return false;
        }
        const name   = audio_name ? String(audio.name || audio_name) : String(audio.name);
        const volume = Number(audio.volume || 90);
        const pitch  = Number(audio.pitch || 100);
        const pan    = Number(audio.pan || 0);
        return {"name": name, "volume": volume, "pitch": pitch, "pan": pan};
    }

    // パラメータ用変数
    const plugin_name  = Potadra_getPluginName();
    const params       = PluginManager.parameters(plugin_name);
    const TitleRandom  = Potadra_convertBool(params.TitleRandom);
    const BattleRandom = Potadra_convertBool(params.BattleRandom);

    /**
     * BGM の存在判定
     */
    function BgmIsExist(name) {
        return Potadra_isExist('audio/bgm/' + name + '.ogg');
    }

    function PlayRandomBgm(bgm_lists) {
        const i      = Math.randomInt(bgm_lists.length);
        let bgm_info = JSON.parse(bgm_lists[i]);
        let bgm      = Potadra_convertAudio(bgm_info);

        if (!bgm) return false;

        // bgmが存在するか判定
        if (BgmIsExist(bgm.name)) {
            // 存在する場合、BGM判定
            AudioManager.playBgm(bgm);
        } else {
            // 存在しない場合、再判定
            const exist_bgm_lists = [];

            for (const bgm_list of bgm_lists) {
                bgm_info = JSON.parse(bgm_list);
                bgm      = Potadra_convertAudio(bgm_info);
                if (BgmIsExist(bgm.name)) {
                    exist_bgm_lists.push(bgm_info);
                }
            }

            // 一つも再生可能なBGMがない場合は、BGMを再生しない
            if (exist_bgm_lists.length > 0) {
                i = Math.randomInt(exist_bgm_lists.length);
                AudioManager.playBgm(exist_bgm_lists[i]);
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
