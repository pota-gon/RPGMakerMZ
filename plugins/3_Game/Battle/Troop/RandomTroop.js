/*:
@plugindesc
敵グループランダム決定 Ver1.5.4(2026/1/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Battle/Troop/RandomTroop.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.5.4: リファクタリング
* Ver1.5.3: リファクタリング、ヘルプ更新
* Ver1.5.2: ヘルプ更新
* Ver1.5.1
- 自動整列の判定が正しくなかったバグ修正
- <空中>タグにY座標を指定できるように修正
- ヘルプ更新
- リファクタリング
* Ver1.5.0
- 自動整列の有効をサイドビューではなく、プラグインパラメータで設定できるように変更
- 自動整列タグの説明追加
- タグの説明が分かりづらかったので、一部修正
* Ver1.4.1: 自動整列を無効にする機能を追加

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
任意の敵グループにて、ランダムに敵キャラを決定できる機能を追加します

## 使い方
1. 任意の敵グループを選択します

2. ランダム出現させたい敵キャラを追加します  
   同じ敵キャラを追加した場合は、出現率が上がります

3. 敵グループ名にタグを記載します  
   タグの記載方法は、下記手順を参考にしてください

4. マップやイベントの設定で敵グループを呼び出すと  
   ランダムに敵キャラが出現します

### タグ(敵グループ)
敵グループ名に下記タグを指定することで  
敵グループをランダムに決定します

タグを指定しない場合は、 通常の敵グループとして扱われます

#### 必須のタグ
必ず記載するようにしてください  
片方しか設定しない場合は、出現数は固定となります

<MIN:1>  
敵キャラの最低出現数を1～8で指定します

<MAX:1>  
敵キャラの最大出現数を1～8で指定します

#### 任意のタグ
必要に応じて記載してください

<FIX:1>  
固定する敵キャラを1～8で指定します  
1～8の順番は敵グループに追加した順番です  
最初に追加したものが、1番になります
また、<FIX:1,2>と , で区切ることで、複数の敵キャラを固定することができます

<自動整列ON>  
人数による自動整列を有効にします

<自動整列OFF>  
人数による自動整列を無効にします

### メモ(敵キャラ)

<空中>  
こうもりなどの空中に飛んでいる敵を上部に表示します  
タグ名はパラメータで変更可能です

<空中: Y>  
<空中> を指定したときは、Y座標を -100 しますが  
敵キャラごとに、Y座標を指定することで微調整することが可能です

・設定例  
<空中: 150>  
Y座標を -150 します。<空中>を指定したときより高い位置に移動します

<空中: 50>  
Y座標を -50 します。<空中>を指定したときより低い位置に移動します

### サイドビューでの設定について
フロントビュー用のプラグインであるため  
サイドビューの整列機能は実装の予定はありません

砂川さんの NRP_TroopRandomFormation.js を使用することで  
サイドビューでも配置を整列出来るため、そちらをご利用ください  
https://newrpg.seesaa.net/article/475049887.html

※ 注意  
敵グループで設定したモンスター数より、<MAX:X>で指定したXの値が大きい場合  
超過したモンスターについては、フロントビュー用の整列で配置が決定します

@param SkyName
@type string
@text 空中名称
@desc 敵キャラのメモに記載するメタデータ(<空中>)の名称
こうもりなどの空中に飛んでいる敵を上部に表示します
@default 空中

@param Alignment
@type boolean
@text 自動整列
@desc 自動整列を有効にするか
@on 有効にする
@off 有効にしない
@default true

    @param EnableAlignmentMetaName
    @parent Alignment
    @text 自動整列ONタグ
    @desc 自動整列ONに使うタグの名称
    デフォルトは 自動整列ON
    @default 自動整列ON

    @param DisableAlignmentMetaName
    @parent Alignment
    @text 自動整列OFFタグ
    @desc 自動整列OFFに使うタグの名称
    デフォルトは 自動整列OFF
    @default 自動整列OFF
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
    function Potadra_isPlugin(plugin_name) {
        return PluginManager._scripts.includes(plugin_name);
    }
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const SkyName                  = String(params.SkyName || '空中');
    const Alignment                = Potadra_convertBool(params.Alignment);
    const EnableAlignmentMetaName  = String(params.EnableAlignmentMetaName || '自動整列ON');
    const DisableAlignmentMetaName = String(params.DisableAlignmentMetaName || '自動整列OFF');

    // 他プラグイン連携(パラメータ取得)
    const debug_params     = Potadra_getPluginParams('Debug');
    const EnableResolution = Potadra_convertBool(debug_params.EnableResolution);
    const ResolutionWidth  = debug_params ? Number(debug_params.ResolutionWidth || 816) : 816;
    const ResolutionHeight = debug_params ? Number(debug_params.ResolutionHeight || 624) : 624;

    function check_max_match(name) {
        return name.match(/<max:\s*(\d+)>/i);
    }
    function check_min_match(name) {
        return name.match(/<min:\s*(\d+)>/i);
    }

    // 固定敵キャラの設定
    function check_fix_match(name) {
        const fix_match = name.match(/<fix:(\s*.+?)>/i);

        let fix = [];
        if (fix_match) {
            fix = fix_match[1].split(',');
        }

        return fix;
    }

    // 敵キャラの出現数を算出
    function check_max(max, max_match, min_match) {
        let min = 1;
        if (max_match) max = Number(max_match[1]);
        if (min_match) min = Number(min_match[1]);

        // 敵キャラの出現数を算出
        max = Math.randomInt(max) + 1;
        if (max < min) {
            max = min;
        }
        return max;
    }

    // 空中判定
    function check_sky(enemy) {
        // Y座標指定
        const sky = enemy.enemy().meta[SkyName];
        let sky_y = 100;
        if (sky) {
            if (sky !== true) sky_y = Number(sky.trim());
            enemy._screenY -= sky_y;
        }
    }

    /**
     * セットアップ
     *
     * @param {} troopId - 
     */
    const _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        // 通常処理呼び出し
        _Game_Troop_setup.apply(this, arguments);

        const name      = this.troop().name;
        const max_match = check_max_match(name);
        const min_match = check_min_match(name);

        if (max_match || min_match) {
            this.clear();
            this._troopId = troopId;
            this._enemies = [];

            const members = this.troop().members;

            // 敵キャラの出現数を算出
            const max = check_max(members.length, max_match, min_match);

            // 抽選する敵キャラのIDを配列に格納
            let ary   = [];
            let ary_x = [];
            let ary_y = [];
            for (const member of members) {
                if ($dataEnemies[member.enemyId]) {
                    ary.push(member.enemyId);
                    ary_x.push(member.x);
                    ary_y.push(member.y);
                }
            }

            // 固定敵キャラの設定
            const fix = check_fix_match(name);

            // 敵キャラを抽選
            let width = Graphics.width;
            let height = Graphics.height;
            if (debug_params && EnableResolution) {
                if (!width) width = ResolutionWidth;
                if (!height) height = ResolutionHeight;
            } else {
                if (!width) width = $dataSystem.advanced.screenWidth;
                if (!height) height = $dataSystem.advanced.screenHeight;
            }
            
            // 配置サイズの計算
            let first = (width / max) / 2;
            let y = height - 180 - 8; // 180 はメニューサイズ、 8 は余白

            for (let i = 0; i < max; i++) {
                let enemyId;
                let index = fix[i];
                if (index) {
                    index -= 1;
                    enemyId = ary[index];
                } else {
                    enemyId = ary[Math.floor(Math.random() * ary.length)];
                }
                let x = first + (first * i) * 2;
                if ((!Alignment || name.includes(DisableAlignmentMetaName)) && !name.includes(EnableAlignmentMetaName)) {
                    if (ary_x[i]) x = ary_x[i];
                    if (ary_y[i]) y = ary_y[i];
                }
                const enemy = new Game_Enemy(enemyId, x, y);

                // 空中判定
                check_sky(enemy);

                this._enemies.push(enemy);
            }

            // 同名の敵キャラに ABC などの文字を付加
            this.makeUniqueNames();
        }
    };
})();
