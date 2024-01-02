/*:
@plugindesc
ランダムアイテム入手 Ver1.3.9(2022/9/10)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/main/plugins/Name/RandomItem.js
@target MZ
@author ポテトードラゴン

・アップデート情報
- 検索時のバグ修正
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

・TODO
- 抽選と素材でプラグインコマンドを分けるか検討
- 抽選でアイテムを複数入手出来るようにするか検討
- 必要アイテムに装備品を含めるか、含めないか選べるようにする。

Copyright (c) 2024 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
# 概要
プラグインコマンド指定したアイテムの中からランダムにアイテムを入手します。

# 使い方
1. プラグインコマンドを呼び出します。
2. コマンド名 **ランダムアイテム取得** を選択します。
3. 必要項目を設定します。設定方法については後述します。
4. 設定内容を元にアイテムやゴールドを取得出来ます。

# プラグインコマンド(ランダムアイテム取得)
プラグインコマンドのコマンド名 **ランダムアイテム取得** の
引数の説明をします。  
また、他のコマンドにプリセットがあるので参考にしてください。

* プリセット(抽選): ランダム宝箱
* プリセット(素材): 伐採
* プリセット(素材): 採掘

## アイテムリスト
後述する引数 **抽選か素材か** の  
**抽選** か **素材** かで、仕様が大きく変わるため、分けて説明します。

### ■ 抽選の場合
アイテムを1つだけ入手します。

#### ・アイテム名
アイテム名を文字列で入力します。  
例えば『ポーション』を入手する場合は、 **ポーション** と入力します。

また、数字を入力するとゴールドを入手することもできます。  
後述する **最低入手数** ～ **アイテム名** で設定した値が入手範囲になります。

**<設定例>**
* アイテム名： 1000
* 最低入手数： 100

この場合、 100G ～ 1000G を入手するようになります。  
入手ゴールドを固定したい場合、 **アイテム名** と **最低入手数** は
同じ値を設定してください。

#### ・抽選確率
当たりやすさです。くじの本数と考えてください。  
本数が多いものが当たりやすく、本数の少ないものは、当たりづらくなります。

以下のように設定すると **ポーション** が "はずれ(100/121)"  
**ハイポーション** が "レア(20/121)"、
**エリクサー** が "激レア(1/121)" となります。

|アイテム名|抽選確率(くじの本数)|
|---|---|
|ポーション|100|
|ハイポーション|20|
|エリクサー|1|

#### ・素材入手回数
使わないため、設定の必要はありません。

#### ・最低入手数
**アイテム名** に数字(ゴールド)を指定した場合、  
この値が最低入手ゴールドとなります。  
設定方法は、 **アイテム名** の説明を参照してください。

---

### ■ 素材の場合
アイテムを複数入手します。

#### ・アイテム名
アイテム名を文字列で入力します。  
例えば『ポーション』を入手する場合は、 **ポーション** と入力します。

また、数字を入力するとゴールドを入手することもできます。  
後述する **最低入手数** ～ **アイテム名** で設定した値が入手範囲になります。

**<設定例>**
* アイテム名： 1000
* 最低入手数： 100

この場合、 100G ～ 1000G を入手するようになります。  
入手ゴールドを固定したい場合、 **アイテム名** と **最低入手数** は
同じ値を設定してください。

#### ・抽選確率
素材の入手確率(1 ～ 100%)です。  
後述する **素材入手回数** 分、入手判定を行います。

以下のように設定すると **雑草** を 80 % の確率で 10回
入手判定し、 5 ～ 10個 雑草を入手します。  
**薬草** を 50 % の確率で 10回入手判定し、 3 ～ 10個 薬草を入手します。  
**レア草** を 10 % の確率で 10回入手判定し、 0 ～ 10個 レア草を入手します。

|アイテム名|抽選確率(%)|素材入手回数|最低入手数|
|---|---|---|---|
|雑草|80|10|5|
|薬草|50|10|3|
|レア草|10|10|0|

#### ・素材入手回数
**抽選確率** の確率で **素材入手回数** で指定した回数分、
アイテム入手判定を実施します。  
詳しくは **抽選確率** の説明を参照してください。

#### ・最低入手数
判定の結果に関わらず、 **最低入手数** で
指定したアイテム数は確実に入手できます。  
詳しくは **抽選確率** の説明を参照してください。

**アイテム名** に数字(ゴールド)を指定した場合、  
この値が最低入手ゴールドとなります。  
設定方法は、 **アイテム名** の説明を参照してください。

---

## 抽選か素材か
アイテムリストの仕様が変更されます。  
詳しくは **アイテムリスト** の説明を参照してください。

### 抽選
1つのアイテムのみ入手する場合に使用します。  
(ランダム宝箱やガチャなどに利用)

#### 素材
複数のアイテムを入手する場合に使用します。  
(採取ポイントなどに利用)

## 必要アイテムリスト

### 必要アイテム名
必要になるアイテム名を指定します。  
鍵がないと開けられない宝箱や、
ピッケルを使用する採掘ポイントなどに利用します。

例えば『ピッケル』が必要になる場合は、 **ピッケル** と入力します。  
必要アイテムは装備品は含めない仕様ですが、
引数で設定出来るように今後アップデートする予定です。

### 必要アイテム個数
必要になるアイテム個数を指定します。  
オーブを5つ集めるなど、同じアイテムが複数必要になる場合の機能です。  
デフォルトは、1個のため、この機能を使わない場合は変更の必要はありません。

### 消費確率
必要アイテムを消費する確率(0～100%)を指定します。  
ピッケルの破壊率などに利用します。小数点も利用可能です。

指定した確率で必要アイテム個数分、アイテムを消費します。  
アイテムを消費しないようにする場合は、 **0** を指定してください。

### 必要アイテム未所持メッセージ
必要アイテムがない場合の表示メッセージです。  
必要なアイテムの情報を表示したい場合に利用してください。  
何も入力しない場合、メッセージは表示されません。

## アイテム入手SE
アイテムを入手したときのSEです。  
指定しない場合、SEは再生しません。

### 再生するSEの音量
アイテム入手SEの音量です。

### 再生するSEのピッチ
アイテム入手SEのピッチです。

### 再生するSEの位相
アイテム入手SEの位相です。

## アイテム入手メッセージ
アイテムを入手したときのメッセージです。  
何も入力しない場合、メッセージは表示されません。

@param GoldIconIndex
@type number
@text ゴールド入手アイコン
@desc ゴールド入手時のアイコン
@default 314

@param GoldMessage
@type multiline_string
@text ゴールド入手メッセージ
@desc ゴールド入手時のメッセージ
%1: アイコン番号 %2: 入手ゴールド %3: 通貨
@default \I[%1]%2%3手に入れた！

@command random_item
@text ランダムアイテム取得
@desc リストの中から抽選でアイテムを取得します

    @arg items
    @type struct<ItemList>[]
    @text アイテムリスト

    @arg lottery
    @type boolean
    @text 抽選か素材か
    @desc 抽選: 1つのアイテムのみ(ランダム宝箱やガチャなどに利用)
    素材: 複数アイテム(採取ポイントなどに利用)
    @on 抽選
    @off 素材
    @default true

    @arg uses
    @type struct<UseList>[]
    @text 必要アイテムリスト

        @arg use_message
        @parent uses
        @type multiline_string
        @text 必要アイテム未所持メッセージ
        @desc 必要アイテムを未所持のときのメッセージ
        空文字の場合、表示しません
        @default \I[%1]%2が%3個必要です。

    @arg se
    @type file
    @dir audio/se
    @text アイテム入手SE
    @desc アイテム入手SE。指定しない場合、再生しません
    宝箱を開ける音、ピッケルの音などを指定
    @default Item3

        @arg volume
        @parent se
        @type number
        @text 音量
        @desc 再生するSEの音量
        @default 90
        @max 100
        @min 0

        @arg pitch
        @parent se
        @type number
        @text ピッチ
        @desc 再生するSEのピッチ
        @default 100
        @max 150
        @min 50

        @arg pan
        @parent se
        @type number
        @text 位相
        @desc 再生するSEの位相
        @default 0
        @max 100
        @min -100

    @arg get_message
    @type multiline_string
    @text アイテム入手メッセージ
    @desc アイテム入手時のメッセージ。空文字の場合、表示しません
    %1: アイコン番号 %2: アイテム名 %3: 個数
    @default \I[%1]%2を%3個手に入れた！

@command treasure_chest
@text プリセット(抽選): ランダム宝箱
@desc ランダムにアイテムを入手する宝箱のサンプル

    @arg items
    @type struct<ItemList>[]
    @text アイテムリスト

    @arg lottery
    @type boolean
    @text 抽選か素材か
    @desc 抽選: 1つのアイテムのみ(ランダム宝箱やガチャなどに利用)
    素材: 複数アイテム(採取ポイントなどに利用)
    @on 抽選
    @off 素材
    @default true

    @arg uses
    @type struct<UseList>[]
    @text 必要アイテムリスト

        @arg use_message
        @parent uses
        @type multiline_string
        @text 必要アイテム未所持メッセージ
        @desc 必要アイテムを未所持のときのメッセージ
        空文字の場合、表示しません
        @default 宝箱を開けるには\I[%1]%2が%3個必要です。

    @arg se
    @type file
    @dir audio/se
    @text アイテム入手SE
    @desc アイテム入手SE。指定しない場合、再生しません
    宝箱を開ける音、ピッケルの音などを指定
    @default Chest1

        @arg volume
        @parent se
        @type number
        @text 音量
        @desc 再生するSEの音量
        @default 90
        @max 100
        @min 0

        @arg pitch
        @parent se
        @type number
        @text ピッチ
        @desc 再生するSEのピッチ
        @default 100
        @max 150
        @min 50

        @arg pan
        @parent se
        @type number
        @text 位相
        @desc 再生するSEの位相
        @default 0
        @max 100
        @min -100

    @arg get_message
    @type multiline_string
    @text アイテム入手メッセージ
    @desc アイテム入手時のメッセージ。空文字の場合、表示しません
    %1: アイコン番号 %2: アイテム名 %3: 個数
    @default \I[%1]%2を%3個手に入れた！

@command felling
@text プリセット(素材): 伐採
@desc 木を切ったときにアイテムを入手するサンプル

    @arg items
    @type struct<ItemList>[]
    @text アイテムリスト

    @arg lottery
    @type boolean
    @text 抽選か素材か
    @desc 抽選: 1つのアイテムのみ(ランダム宝箱やガチャなどに利用)
    素材: 複数アイテム(採取ポイントなどに利用)
    @on 抽選
    @off 素材
    @default false

    @arg uses
    @type struct<UseList>[]
    @text 必要アイテムリスト

        @arg use_message
        @parent uses
        @type multiline_string
        @text 必要アイテム未所持メッセージ
        @desc 必要アイテムを未所持のときのメッセージ
        空文字の場合、表示しません
        @default \I[%1]%2が%3個必要です。
        \I[%1]%2は道具屋で買うことが出来ます。

    @arg se
    @type file
    @dir audio/se
    @text アイテム入手SE
    @desc アイテム入手SE。指定しない場合、再生しません
    宝箱を開ける音、ピッケルの音などを指定
    @default Slash1

        @arg volume
        @parent se
        @type number
        @text 音量
        @desc 再生するSEの音量
        @default 90
        @max 100
        @min 0

        @arg pitch
        @parent se
        @type number
        @text ピッチ
        @desc 再生するSEのピッチ
        @default 100
        @max 150
        @min 50

        @arg pan
        @parent se
        @type number
        @text 位相
        @desc 再生するSEの位相
        @default 0
        @max 100
        @min -100

    @arg get_message
    @type multiline_string
    @text アイテム入手メッセージ
    @desc アイテム入手時のメッセージ。空文字の場合、表示しません
    %1: アイコン番号 %2: アイテム名 %3: 個数
    @default \I[%1]%2を%3個手に入れた！

@command mining
@text プリセット(素材): 採掘
@desc 採掘したときにアイテムを入手するサンプル

    @arg items
    @type struct<ItemList>[]
    @text アイテムリスト

    @arg lottery
    @type boolean
    @text 抽選か素材か
    @desc 抽選: 1つのアイテムのみ(ランダム宝箱やガチャなどに利用)
    素材: 複数アイテム(採取ポイントなどに利用)
    @on 抽選
    @off 素材
    @default false

    @arg uses
    @type struct<UseList>[]
    @text 必要アイテムリスト

        @arg use_message
        @parent uses
        @type multiline_string
        @text 必要アイテム未所持メッセージ
        @desc 必要アイテムを未所持のときのメッセージ
        空文字の場合、表示しません
        @default \I[%1]%2が%3個必要です。
        \I[%1]%2は道具屋で買うことが出来ます。

    @arg se
    @type file
    @dir audio/se
    @text アイテム入手SE
    @desc アイテム入手SE。指定しない場合、再生しません
    宝箱を開ける音、ピッケルの音などを指定
    @default Sword2

        @arg volume
        @parent se
        @type number
        @text 音量
        @desc 再生するSEの音量
        @default 90
        @max 100
        @min 0

        @arg pitch
        @parent se
        @type number
        @text ピッチ
        @desc 再生するSEのピッチ
        @default 100
        @max 150
        @min 50

        @arg pan
        @parent se
        @type number
        @text 位相
        @desc 再生するSEの位相
        @default 0
        @max 100
        @min -100

    @arg get_message
    @type multiline_string
    @text アイテム入手メッセージ
    @desc アイテム入手時のメッセージ。空文字の場合、表示しません
    %1: アイコン番号 %2: アイテム名 %3: 個数
    @default \I[%1]%2を%3個手に入れた！
*/

/*~struct~ItemList:
@param name
@text アイテム名
@desc 抽選するアイテム名

@param rate
@type number
@text 抽選確率
@desc 抽選: 排出率
素材: 100 で必ずアイテムを入手
@default 100

@param count
@type number
@text 素材入手回数
@desc 抽選確率 が 100の場合は、アイテムの入手数になる
抽選ではこのパラメータは無効
@default 1

@param min
@type number
@text 最低入手数
@desc 素材の入手結果がこの値より下の場合は、この数のアイテムを入手
抽選ではこのパラメータは無効
@default 0
*/

/*~struct~UseList:
@param use_name
@text 必要アイテム名
@desc 必要なアイテムを名前で指定。空文字なら無条件でアイテム入手
鍵やピッケルなどに利用

    @param use_count
    @parent use_name
    @type number
    @text 必要アイテム個数
    @desc 必要なアイテムの個数
    @default 1

    @param use_break
    @parent use_name
    @type number
    @text 消費確率
    @desc 必要アイテムを消費する確率
    100: 消費する 50: 50%の確率で消費 0: 消費しない
    @max 100
    @min 0
    @decimals 2
    @default 100
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
    function Potadra_convertBool(bool) {
        if (bool === "false" || bool === '' || bool === undefined) {
            return false;
        } else {
            return true;
        }
    }
    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (!id) {
            return val;
        }
        for (let i = initial; i < data.length; i++) {
            if (!data[i]) continue;
            if (search_column) {
                if (data[i][search_column] == id) {
                    if (column) {
                        val = data[i][column];
                    } else {
                        val = data[i];
                    }
                    break;
                }
            } else if (i == id) {
                val = data[i];
                break;
            }
        }
        return val;
    }
    function Potadra_itemSearch(name, column = false, search_column = "name", val = false, initial = 1) {
        const item = Potadra_search($dataItems, name, column, search_column, val, initial);
        if (item) {
            return item;
        }
        const weapon = Potadra_search($dataWeapons, name, column, search_column, val, initial);
        if (weapon) {
            return weapon;
        }
        const armor = Potadra_search($dataArmors, name, column, search_column, val, initial);
        if (armor) {
            return armor;
        }
        return false;
    }
    function Potadra_random(probability, rate = 1) {
        return Math.random() <= probability / 100 * rate;
    }
    function Potadra_gacha(seed, rates) {
        let sum = 0;
        const rand = Math.randomInt(seed);
        for (let i = 0; i < rates.length; i++) {
            sum += rates[i];
            if (rand < sum) {
                return i;
            }
        }
        return 0;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const GoldIconIndex  = Number(params.GoldIconIndex || 314);
    const GoldMessage    = String(params.GoldMessage) || '\I[%1]%2%3手に入れた！';

    // 他プラグイン連携(プラグインの導入有無)
    const GetInformation = Potadra_isPlugin('GetInformation');

    // プラグインコマンド(ランダムアイテム取得)
    PluginManager.registerCommand(plugin_name, "random_item", function(args) {
        gacha(args);
    });

    // プラグインコマンド(プリセット(抽選): ランダム宝箱)
    PluginManager.registerCommand(plugin_name, "treasure_chest", function(args) {
        gacha(args);
    });

    // プラグインコマンド(プリセット(素材): 伐採)
    PluginManager.registerCommand(plugin_name, "felling", function(args) {
        gacha(args);
    });

    // プラグインコマンド(プリセット(素材): 採掘)
    PluginManager.registerCommand(plugin_name, "mining", function(args) {
        gacha(args);
    });

    // 実際の処理
    function gacha(args) {
        if (GetInformation) {
            CommonPopupManager._popEnable = CommonPopupManager.popEnable();
        }

        let item_lists;
        if (args.items) {
            item_lists = JSON.parse(args.items);
        }

        const lottery     = Potadra_convertBool(args.lottery);
        const use_message = String(args.use_message);
        const se          = String(args.se);
        const volume      = Number(args.volume || 90);
        const pitch       = Number(args.pitch || 100);
        const pan         = Number(args.pan || 0);
        const get_message = String(args.get_message);

        let first_item, first_name, first_count, use_lists;

        let get_item_count = 0;
        let use_item       = false;

        let uses = args.uses;
        if (uses) {
            use_lists = JSON.parse(uses);
        }

        // 必要アイテムがある場合その処理
        if (use_lists) {
            for (let i = 0; i < use_lists.length; i++) {
                const use_info  = JSON.parse(use_lists[i]);
                const use_name  = use_info.use_name;
                const use_count = Number(use_info.use_count || 1);
                const use_break = Number(use_info.use_break || 0);
                const item      = Potadra_itemSearch(use_name);
                const count     = $gameParty.numItems(item);

                if (i === 0) {
                    first_item  = item;
                    first_name  = use_name;
                    first_count = use_count;
                }

                // 所持数(装備品を含めない) >= 必要数
                if (count >= use_count) {
                    // 消費処理
                    if (use_break > 0) {
                        if (Potadra_random(use_break)) {
                            $gameParty.gainItem(item, -1 * use_count, false);
                        }
                    }
                    use_item = true;
                    break;
                }
            }
        }

        if (!use_item && first_item) {
            // 必要アイテムが足りないときの処理
            if (use_message) {
                $gameMessage.add(use_message.format(first_item.iconIndex, first_name, first_count));
            }
            // イベント処理の中断
            $gameMap._interpreter.command115();
            return false;
        }

        if (!item_lists) {
            // イベント処理の中断
            $gameMap._interpreter.command115();
            return false;
        }

        // 抽選・素材
        if (lottery) {
            const rates = [];
            const items = [];

            // ガチャ情報作成
            let sum = 0;
            let min = 0;
            for (const item_list of item_lists) {
                const item_info = JSON.parse(item_list);
                const rate      = Number(item_info.rate || 100);
                const name      = item_info.name;
                let item;
                if (isNaN(name)) {
                    item = Potadra_itemSearch(name);
                } else { // ゴールド用
                    item = Number(name);
                    if (Number(item_info.min) > 0) {
                        min = Number(item_info.min);
                    }
                }
                sum += rate;
                rates.push(rate);
                items.push(item);
            }

            // ガチャをまわす
            const index = Potadra_gacha(sum, rates);

            // アイテム入手
            const item = items[index];
            if (item) {
                if (isNaN(item)) {
                    $gameParty.gainItem(item, 1);
                    if (!GetInformation && get_message) {
                        $gameMessage.add(get_message.format(item.iconIndex, item.name, 1));
                    }
                } else { // ゴールド用
                    let gold = Math.randomInt(item) + 1;
                    if (gold < min) {
                        gold = min;
                    }
                    $gameParty.gainGold(gold);
                    if (!GetInformation && get_message) {
                        $gameMessage.add(GoldMessage.format(GoldIconIndex, gold, TextManager.currencyUnit));
                    }
                }
                get_item_count = 1;
            }
        } else {
            for (const item_list of item_lists) {
                const item_info = JSON.parse(item_list);
                const rate      = Number(item_info.rate || 100);
                const count     = Number(item_info.count || 1);
                const min       = Number(item_info.min || 0);
                const name      = item_info.name;
                let item;
                if (isNaN(name)) {
                    item = Potadra_itemSearch(name);
                } else { // ゴールド用
                    item = Number(name);
                }

                if (item) {
                    if (isNaN(item)) {
                        let item_count = 0;
                        for (let j = 0; j < count; j++) {
                            if (Potadra_random(rate)) {
                                item_count++;
                            }
                        }
                        if (item_count < min) {
                            item_count = min;
                        }

                        // アイテム入手
                        if (item_count > 0) {
                            $gameParty.gainItem(item, item_count);
                            if (!GetInformation && get_message && item_count > 0) {
                                $gameMessage.add(get_message.format(item.iconIndex, item.name, item_count));
                            }
                            get_item_count++;
                        }
                    } else { // ゴールド用
                        let gold = 0;
                        for (let j = 0; j < count; j++) {
                            if (Potadra_random(rate)) {
                                gold += Math.randomInt(item) + 1;
                            }
                        }
                        if (gold < min) {
                            gold = min;
                        }
                        // ゴールド入手
                        if (gold > 0) {
                            $gameParty.gainGold(gold);
                            if (!GetInformation && get_message) {
                                $gameMessage.add(GoldMessage.format(GoldIconIndex, gold, TextManager.currencyUnit));
                            }
                            get_item_count++;
                        }
                    }
                }
            }
        }

        // アイテム入手SE
        if (se && get_item_count > 0) {
            AudioManager.playSe({"name": se, "volume": volume, "pitch": pitch, "pan": pan});
        }

        if (GetInformation) {
            CommonPopupManager._popEnable = false;
        }
    }
})();
