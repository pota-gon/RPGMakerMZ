/*:
@plugindesc
アイテム入手 Ver2.0.0(2025/1/18)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/System/Name/NameGetItem.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver2.0.0
- プラグインコマンドが長くなるため、SE設定をstructに変更（再設定が必要になります）
- SKM_GetInformationMZ に対応
- TinyGetInfoWndMZ.js に対応
- 名前検索用のパラメータ追加
- リファクタリング
* Ver1.4.6
- 減らす場合の最大値を変更
- 取得したい => 入手するに名称変更
* Ver1.4.5: 検索時のバグ修正

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
名前からアイテムを入手する  
プラグインコマンドを提供します

## 使い方
1. プラグインコマンドを呼び出します
2. プラグインコマンドの名前に『入手するアイテム名』を入力します
3. プラグインコマンドを指定したイベントが呼び出されると
アイテムを検索し入手します

検索の順番は、アイテム => 武器 => 防具 の順番となります  
同じ名称のアイテムが複数ある場合は、最初に検索したアイテムを入手します

セーブデータ上のアイテムは、IDで記録されます  
ゲーム公開後は、データベースの入れ替えはおすすめしません

@command get_item
@text アイテム入手
@desc 名前からアイテムを入手します

    @arg name
    @type string
    @text 名前
    @desc 入手するアイテムの名称

        @arg search
        @parent name
        @type struct<Search>
        @text 検索
        @desc アイテム名検索用
        このパラメータはデータとしては使用しません

    @arg count
    @type number
    @text 個数
    @desc 入手するアイテムの個数
    @default 1
    @min -999999999999999

    @arg message
    @type multiline_string
    @text アイテム入手メッセージ
    @desc アイテム獲得時のメッセージ。空文字の場合、表示しません
    %1: アイコン番号 %2: アイテム名 %3: 個数
    @default \I[%1]%2を%3個手に入れた！

    @arg se
    @type struct<SE>
    @text アイテム入手SE
    @desc アイテム入手SE。指定しない場合、再生しません
    宝箱を開ける音、ピッケルの音などを指定
    @default {"name":"Item3","volume":"90","pitch":"100","pan":"0"}
*/

/*~struct~Search:
@param item
@type item
@text アイテム名検索用
@desc このパラメータはデータとしては使用しません

@param weapon
@type weapon
@text 武器名検索用
@desc このパラメータはデータとしては使用しません

@param armor
@type armor
@text 防具名検索用
@desc このパラメータはデータとしては使用しません
*/

/*~struct~SE:
@param name
@type file
@dir audio/se
@text ファイル名
@desc 再生するSEのファイル名
@default Item3

@param volume
@type number
@text 音量
@desc 再生するSEの音量
@min 0
@max 100
@default 90

@param pitch
@type number
@text ピッチ
@desc 再生するSEのピッチ
@min 50
@max 150
@default 100

@param pan
@type number
@text 位相
@desc 再生するSEの位相
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
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
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
    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) return val;
        for (let i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column && data[i][search_column] == id) {
                val = column ? data[i][column] : data[i];
                break;
            } else if (i == id) {
                val = data[i];
                break;
            }
        }
        return val;
    }
    function Potadra_itemSearch(name, column = false, search_column = "name", val = false, initial = 1) {
        const item = Potadra_search($dataItems, name, column, search_column, val, initial);
        if (item) return item;
        const weapon = Potadra_search($dataWeapons, name, column, search_column, val, initial);
        if (weapon) return weapon;
        const armor = Potadra_search($dataArmors, name, column, search_column, val, initial);
        if (armor) return armor;
        return false;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();

    // プラグインの導入有無
    const GetInformation       = Potadra_isPlugin('GetInformation');
    const TinyGetInfoWndMZ     = Potadra_isPlugin('TinyGetInfoWndMZ');
    const SKM_GetInformationMZ = Potadra_isPlugin('SKM_GetInformationMZ');

    // プラグインコマンド(アイテム入手)
    PluginManager.registerCommand(plugin_name, "get_item", function(args) {
        const name    = String(args.name);
        const count   = Number(args.count || 1);
        const message = String(args.message);
        const se      = Potadra_convertAudio(args.se, 'Item3');

        const item    = Potadra_itemSearch(name);
        if (GetInformation || SKM_GetInformationMZ) {
            CommonPopupManager._popEnable = CommonPopupManager.popEnable();
        }
        if (TinyGetInfoWndMZ) {
            let params = [item.id, 0, 0, count, false];
            if (DataManager.isItem(item)) {
                params = [item.id, 0, 0, count];
                this.command126(params);
            } else if (DataManager.isWeapon(item)) {
                this.command127(params);
            } else if (DataManager.isArmor(item)) {
                this.command128(params);
            } else {
                return false;
            }
        } else {
            $gameParty.gainItem(item, count);
        }
        if (GetInformation || SKM_GetInformationMZ) {
            CommonPopupManager._popEnable = false;
        }
        if (se) AudioManager.playSe(se);
        if (!GetInformation && !SKM_GetInformationMZ && !TinyGetInfoWndMZ && message) {
            $gameMessage.add(message.format(item.iconIndex, item.name, count));
        }
    });
})();
