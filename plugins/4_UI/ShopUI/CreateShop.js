/*:
@plugindesc
合成屋 Ver1.0.1(2026/2/8)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/ShopUI/CreateShop.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1
- ？の文字数をアイテム名に合わせる機能と最大文字数制限機能を追加
- 未所持アイテム・素材の？？？表示機能を追加
* Ver1.0.0: 安定したのでバージョンを 1.0.0 に変更

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
アイテムを合成して新しいアイテムを作成する「合成屋」の機能を追加します

プラグインコマンドやメニューから合成屋を呼び出すことができます

## 使い方
合成屋は「プラグインコマンド」で呼び出す方法と
「メニュー」に追加する方法の2通りがあります

### 1. プラグインコマンドで合成屋を呼び出す
イベント中に一時的な合成屋を開きたい場合に使用します

1. イベントコマンド「プラグインコマンド」を選択します
2. プラグイン名で `CreateShop` を選び、コマンド名で `合成屋` を選択します
3. `商品リスト` を設定します
   - **商品名**: 合成して作成するアイテムを名前またはIDで指定します
   - **価格**: 合成に必要な金額です。0にすると無料になります
   - **必要素材リスト**:
     - **必要素材名**: 合成に必要な素材アイテムを名前またはIDで指定します
     - **個数**: 必要な素材の数を指定します
4. イベントを実行すると、設定した内容で合成屋が開きます

### 2. メニューに合成屋コマンドを追加する
いつでもアクセスできる常設の合成屋として利用したい場合に使用します

1. プラグインパラメータ `MenuCommand` グループを設定します
2. `メニュー表示名` に、メニューに表示したいコマンド名（例: アイテム合成）を
   入力します
3. `メニュー合成リスト` に、メニューから開いたときに表示される
   商品リストを設定します(設定方法はプラグインコマンドと同じです)
4. `メニュー表示スイッチ` にスイッチIDを設定すると
   そのスイッチがONのときだけメニューに表示されるようになります
   0の場合は常に表示されます

### 3. 未所持アイテム・素材の？？？表示機能
まだ入手していないアイテムや素材を「？？？」として隠すことができます

#### アイテムの？？？表示
- `未所持アイテムを？？？表示` パラメータを「？？？表示する」に設定すると
  未所持のアイテムが「？？？」として表示されます
- `未所持アイテム？？？表示スイッチ` にスイッチIDを設定すると
  そのスイッチがONのときだけ？？？表示されます
  0の場合はパラメータ設定に従います

#### 素材の？？？表示
- `未所持素材を？？？表示` パラメータを「？？？表示する」に設定すると
  未所持の素材が「？？？」として表示されます
- `未所持素材？？？表示スイッチ` にスイッチIDを設定すると
  そのスイッチがONのときだけ？？？表示されます
  0の場合はパラメータ設定に従います

#### ？の文字数設定
- `？の文字数モード` で？の表示方法を選択できます
  - **アイテム名の文字数に合わせる**: 未所持アイテムの実際の名前の文字数分、？を表示します
  - **固定文字数**: 設定した固定の文字数で？を表示します
- `？の固定文字数` で固定文字数モード時の？の個数を設定します(1～20)
- `？の最大文字数` で？の最大文字数を制限できます
  0に設定すると無制限になります

**使用例:**
- ゲーム序盤は未所持アイテムを隠し、進行度に応じてスイッチで表示
- レアアイテムの存在を隠したい場合に使用
- アイテム名が長すぎる場合は最大文字数で制限

### 合成画面の操作
- 合成に必要な素材が足りているアイテムは明るく表示され、選択できます
- 必要素材がウィンドウに収まりきらない場合
  以下のキーでページをめくることができます
  - **通常**: ← → (左右カーソルキー)
  - **ShopScene_Extension.js 導入時**: Shiftキー

### 注意事項
- 分解機能は現在実装されていません。
  プラグインパラメータの「合成のみ」設定は変更しないでください
- 必要素材が設定されていない商品をリストに加えると
  エラーが発生する可能性があります(プラグインパラメータで挙動を変更可能)

@param MenuCommand
@type combo
@text メニュー表示名
@desc メニューの表示が出来るコマンド
空文字でメニューに表示しません
@default アイテム合成

@param MenuSwitch
@parent MenuCommand
@type switch
@text メニュー表示スイッチ
@desc ONのときメニューにコマンドを表示します
0(なし)の場合、常にメニューへ表示します
@default 0

    @param DisableMenuSwitch
    @parent MenuCommand
    @type switch
    @text メニュー禁止スイッチ
    @desc ONのときコマンドの使用を禁止します
    @default 0

    @param MenuGoods
    @parent MenuCommand
    @type struct<GoodsList>[]
    @text メニュー合成リスト
    @desc メニュー画面で開いたときの合成リスト
    設定しない場合、メニューに表示しません

    @param BuyOnly
    @parent MenuCommand
    @type boolean
    @text 合成のみ
    @desc 合成するのみにするか
    ※ 分解は未実装の機能なので、設定変更しないでください
    @on 合成のみ
    @off 合成と分解
    @default false

    @param BuyName
    @parent MenuCommand
    @text 合成屋購入コマンド名
    @desc 合成屋の購入コマンド名
    @default 合成する

    @param SellName
    @parent MenuCommand
    @text 合成屋売却コマンド名
    @desc 合成屋の売却コマンド名
    ※ 分解は未実装の機能なので、設定変更しないでください
    @default 分解する

    @param CancelName
    @parent MenuCommand
    @text 合成屋キャンセルコマンド名
    @desc 合成屋のキャンセルコマンド名
    @default やめる

    @param MaterialName
    @parent MenuCommand
    @text 必要素材名
    @desc 必要素材の表示名
    @default 必要素材

@param NoneMaterialMessage
@type boolean
@text 必要素材未設定エラーメッセージ
@desc 必要素材未設定の場合、エラーメッセージを出すか
出力しない場合、価格だけのアイテムを並べることができます
@on 出力する
@off 出力しない
@default true

    @param NoneMaterialError
    @parent NoneMaterialMessage
    @type boolean
    @text 必要素材未設定エラー
    @desc 必要素材未設定の場合、エラーとするか
    エラーにしない場合、エラーが発生してもゲームを終了しません
    @on エラーにする
    @off エラーにしない
    @default true

@param MiniWindow
@type boolean
@text ミニウィンドウ対応
@desc ミニウィンドウ表示可否
@on ミニウィンドウ表示
@off ミニウィンドウ非表示
@default false

@param SubCommand
@type boolean
@text サブコマンド対応
@desc サブコマンド対応可否
@on 対応する
@off 対応しない
@default false

@param Unknown
@text 未所持
@desc ※ 分類用のパラメータです

    @param UnknownName
    @parent Unknown
    @type string
    @text 未所持名
    @desc 未所持アイテムの表示名
    @default ？

    @param UnknownItem
    @parent Unknown
    @type boolean
    @text 未所持アイテムを？？？表示
    @desc 未所持の合成アイテムを？？？で表示するか
    @on ？？？表示する
    @off 通常表示
    @default false

        @param UnknownItemSwitch
        @parent UnknownItem
        @type switch
        @text 未所持アイテム？？？表示スイッチ
        @desc ONのとき未所持アイテムを？？？で表示します
        0(なし)の場合、パラメータ設定に従います
        @default 0

    @param UnknownMaterial
    @parent Unknown
    @type boolean
    @text 未所持素材を？？？表示
    @desc 未所持の合成素材を？？？で表示するか
    @on ？？？表示する
    @off 通常表示
    @default false

        @param UnknownMaterialSwitch
        @parent UnknownMaterial
        @type switch
        @text 未所持素材？？？表示スイッチ
        @desc ONのとき未所持素材を？？？で表示します
        0(なし)の場合、パラメータ設定に従います
        @default 0

    @param UnknownCharMode
    @parent Unknown
    @type select
    @option アイテム名の文字数に合わせる
    @value itemName
    @option 固定文字数
    @value fixed
    @text ？の文字数モード
    @desc ？？？の文字数をアイテム名に合わせるか、固定にするか
    @default itemName

        @param UnknownCharCount
        @parent UnknownCharMode
        @type number
        @min 1
        @max 20
        @text ？の固定文字数
        @desc 固定文字数モード時の？の個数
        @default 3

        @param UnknownCharMax
        @parent UnknownCharMode
        @type number
        @min 1
        @max 50
        @text ？の最大文字数
        @desc ？の最大文字数(この数を超える場合は制限されます)
        0で無制限
        @default 10

@command create_shop
@text 合成屋
@desc 合成屋を呼び出します

    @arg goods
    @type struct<GoodsList>[]
    @text 商品リスト
    @desc ショップの商品リスト

    @arg buyOnly
    @type boolean
    @text 合成のみ
    @desc 合成するのみにするか
    @on 合成のみ
    @off 合成と分解
    @default false

    @arg BuyName
    @text 合成屋購入コマンド名
    @desc 合成屋の購入コマンド名
    @default 合成する

    @arg SellName
    @text 合成屋売却コマンド名
    @desc 合成屋の売却コマンド名
    ※ 分解は未実装の機能なので、設定変更しないでください
    @default 分解する

    @arg CancelName
    @text 合成屋キャンセルコマンド名
    @desc 合成屋のキャンセルコマンド名
    @default やめる

    @arg MaterialName
    @text 必要素材名
    @desc 必要素材の表示名
    @default 必要素材
*/

/*~struct~GoodsList:
@param name
@type string
@text 商品名
@desc 商品名(アイテム)を名前で指定
アイテムのIDが指定されている場合は、使用しません

    @param item
    @parent name
    @type item
    @text アイテムID
    @desc 商品名(アイテム)をIDで指定

    @param weapon
    @parent name
    @type weapon
    @text 武器ID
    @desc 商品名(武器)をIDで指定

    @param armor
    @parent name
    @type armor
    @text 防具ID
    @desc 商品名(防具)をIDで指定

@param price
@type number
@text 価格
@desc 価格を指定。0: お金は不要
@default 0

@param materials
@type struct<MaterialsList>[]
@text 必要素材リスト
@desc 必要素材のリスト
@default []
*/

/*~struct~MaterialsList:
@param name
@type string
@text 必要素材名
@desc 必要素材名(アイテム)を名前で指定
アイテムのIDが指定されている場合は、使用しません

    @param item
    @parent name
    @type item
    @text アイテムID
    @desc 商品名(アイテム)をIDで指定

    @param weapon
    @parent name
    @type weapon
    @text 武器ID
    @desc 商品名(武器)をIDで指定

    @param armor
    @parent name
    @type armor
    @text 防具ID
    @desc 商品名(防具)をIDで指定

@param count
@type number
@text 個数
@desc 個数を指定
@default 1
@min 1
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



    function Potadra_search(data, id, column = "name", search_column = "id", val = "", initial = 1) {
        if (id === null || id === undefined) return val;
        let cache = Potadra__searchCache_get(data);
        if (!cache) {
            cache = {};
            Potadra__searchCache_set(data, cache);
        }
        const key = `${search_column}:${id}`;
        if (key in cache) {
            const entry = cache[key];
            return column ? entry?.[column] ?? val : entry;
        }
        let result = val;
        for (let i = initial; i < data.length; i++) {
            const item = data[i];
            if (!item) continue;
            if (search_column && item[search_column] == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
            if (!search_column && i == id) {
                result = column ? item[column] : item;
                cache[key] = item;
                return result;
            }
        }
        cache[key] = val;
        return val;
    }
    function Potadra_nameSearch(data, name, column = "id", search_column = "name", val = "", initial = 1) {
        return Potadra_search(data, name, column, search_column, val, initial);
    }
    function Potadra_itemKindSearch(name, item_id, weapon_id, armor_id, column = false) {
        const categories = [
            { kind: 0, data: $dataItems, id: item_id },
            { kind: 1, data: $dataWeapons, id: weapon_id },
            { kind: 2, data: $dataArmors, id: armor_id }
        ];
        for (const { kind, data, id } of categories) {
            if (id !== 0) {
                const item = column === "id" ? id : data[id];
                if (item) return [kind, item];
            }
        }
        if (name) {
            for (const { kind, data } of categories) {
                const item = Potadra_nameSearch(data, name, column);
                if (item) return [kind, item];
            }
        }
        return [0, false];
    }
    function Potadra_checkSwitch(switch_no, bool = true) {
        return switch_no === 0 || $gameSwitches.value(switch_no) === bool;
    }
    function Potadra_maxDigits(item, max_digits, meta_name) {
        if (!item) {
            return max_digits;
        }
        const max_digit_str = item.meta[meta_name];
        return max_digit_str ? String(max_digit_str) : max_digits;
    }

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MenuCommand       = String(params.MenuCommand);
    const MenuSwitch        = Number(params.MenuSwitch || 0);
    const DisableMenuSwitch = Number(params.DisableMenuSwitch || 0);
    let MenuGoods;
    if (params.MenuGoods) {
        MenuGoods = JSON.parse(params.MenuGoods);
    }
    let materials = {};
    const BuyOnly = Potadra_convertBool(params.BuyOnly);
    let BuyName, SellName, CancelName, MaterialName, MaxSize;
    const NoneMaterialMessage = Potadra_convertBool(params.NoneMaterialMessage);
    const NoneMaterialError   = Potadra_convertBool(params.NoneMaterialError);
    const MiniWindow          = Potadra_convertBool(params.MiniWindow);
    const SubCommand          = Potadra_convertBool(params.SubCommand);
    const UnknownItem         = Potadra_convertBool(params.UnknownItem);
    const UnknownName         = String(params.UnknownName || '？');
    const UnknownItemSwitch   = Number(params.UnknownItemSwitch || 0);
    const UnknownMaterial     = Potadra_convertBool(params.UnknownMaterial);
    const UnknownMaterialSwitch = Number(params.UnknownMaterialSwitch || 0);
    const UnknownCharMode     = String(params.UnknownCharMode || 'itemName');
    const UnknownCharCount    = Number(params.UnknownCharCount || 3);
    const UnknownCharMax      = Number(params.UnknownCharMax || 10);

    // 他プラグイン連携(プラグインの導入有無)
    const ShopScene_Extension = Potadra_isPlugin('ShopScene_Extension');

    // 他プラグイン連携(パラメータ取得)
    const max_item_params   = Potadra_getPluginParams('MaxItem');
    const MaxDigits         = max_item_params ? String(max_item_params.MaxDigits || '00') : '00';
    const MaxDigitsMetaName = max_item_params ? String(max_item_params.MaxDigitsMetaName || '最大桁数') : '最大桁数';

    /**
     * 未所持アイテムを？？？表示するか判定
     *
     * @returns {boolean} ？？？表示するか
     */
    function isUnknownItemEnabled() {
        if (UnknownItemSwitch > 0) {
            return $gameSwitches.value(UnknownItemSwitch);
        }
        return UnknownItem;
    }

    /**
     * 未所持素材を？？？表示するか判定
     *
     * @returns {boolean} ？？？表示するか
     */
    function isUnknownMaterialEnabled() {
        if (UnknownMaterialSwitch > 0) {
            return $gameSwitches.value(UnknownMaterialSwitch);
        }
        return UnknownMaterial;
    }

    /**
     * ？の文字数を取得
     *
     * @param {object} item - アイテムオブジェクト
     * @returns {string} ？の文字列
     */
    function getUnknownText(item) {
        let count;
        
        if (UnknownCharMode === 'fixed') {
            // 固定文字数モード
            count = UnknownCharCount;
        } else {
            // アイテム名の文字数に合わせるモード
            if (item && item.name) {
                count = item.name.length;
            } else {
                count = UnknownCharCount; // アイテム名が取得できない場合は固定値
            }
        }
        
        // 最大文字数の制限を適用
        if (UnknownCharMax > 0 && count > UnknownCharMax) {
            count = UnknownCharMax;
        }
        
        return UnknownName.repeat(count);
    }

    // プラグインコマンド(合成屋)
    PluginManager.registerCommand(plugin_name, "create_shop", args => {
        const good_lists = JSON.parse(args.goods);
        const buy_only   = Potadra_convertBool(args.buyOnly);
        BuyName          = String(args.BuyName    || "合成する");
        SellName         = String(args.SellName   || "分解する");
        CancelName       = String(args.CancelName || "やめる");
        MaterialName     = String(args.MaterialName);
        MaxSize          = 4;
        if (MaterialName) MaxSize = 3;

        create_shop(good_lists, buy_only);
    });

    class ParameterError extends Error {
        constructor(message, options) {
          super(message, options);
          this.name = 'Parameter Error'; // エラー名を明示的に
        }
    }

    // 必要素材の設定
    function set_material_lists(good_data) {
        let material_lists = [];
        try {
            material_lists = JSON.parse(good_data.materials);
        } catch (e) {
            if (NoneMaterialMessage) {
                const message = "必要素材が設定されていません。プラグインの設定を見直してください。";
                console.warn(message);
                if (NoneMaterialError) throw new ParameterError(message);
            }
        }
        return material_lists;
    }
    function set_materials(material_lists, i) {
        materials[i] = [];
        for (let j = 0; j < material_lists.length; j++) {
            const material  = JSON.parse(material_lists[j]);
            const item_id   = Number(material.item || 0);
            const weapon_id = Number(material.weapon || 0);
            const armor_id  = Number(material.armor || 0);
            const item      = Potadra_itemKindSearch(material.name, item_id, weapon_id, armor_id)[1];
            const count     = Number(material.count);
            materials[i].push({"item": item, "count": count});
        }
    }

    // 実際の処理
    function create_shop(good_lists, buy_only) {
        const goods = [];

        for (let i = 0; i < good_lists.length; i++) {
            const good_data = JSON.parse(good_lists[i]);
            const name      = good_data.name;
            const price     = good_data.price;
            const item_id   = Number(good_data.item || 0);
            const weapon_id = Number(good_data.weapon || 0);
            const armor_id  = Number(good_data.armor || 0);

            // 商品の設定
            const item_infos = Potadra_itemKindSearch(name, item_id, weapon_id, armor_id, "id");
            const val = item_infos[1];
            if (val) {
                goods.push([item_infos[0], val, 1, price]);
            }

            // 必要素材の設定
            let material_lists = set_material_lists(good_data);
            set_materials(material_lists, i);
        }

        SceneManager.push(Scene_CreateShop);
        SceneManager.prepareNextScene(goods, buy_only);
    }

    // メニューでの合成
    if (MenuCommand && MenuGoods) {
        /**
         * メニュー画面で表示するコマンドウィンドウです。
         *
         * @class
         */

        /**
         * 独自コマンドの追加用
         */
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
            if (Potadra_checkSwitch(MenuSwitch)) {
                this.addCommand(MenuCommand, "create_shop", Potadra_checkSwitch(DisableMenuSwitch, false));
            }
        };


        /**
         * メニュー画面の処理を行うクラスです。
         *
         * @class
         */

        /**
         * コマンドウィンドウの作成
         */
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.apply(this, arguments);
            this._commandWindow.setHandler("create_shop", this.create_shop.bind(this));
        };
    }

    if (MenuCommand || SubCommand) {
        /**
         * コマンド［合成］
         */
        Scene_Menu.prototype.create_shop = function() {
            BuyName      = String(params.BuyName    || "合成する");
            SellName     = String(params.SellName   || "分解する");
            CancelName   = String(params.CancelName || "やめる");
            MaterialName = String(params.MaterialName);
            MaxSize      = 4;
            if (MaterialName) {
                MaxSize = 3;
            }
            create_shop(MenuGoods, BuyOnly);
        };
    }


    /**
     * 合成屋画面で、購入／売却を選択するウィンドウです
     *
     * @class
     */
    class Window_CreateShopCommand extends Window_ShopCommand {
        /**
         * 桁数の取得
         *
         * @returns {number} 桁数
         */
        maxCols() {
            return 2;
        }

        /**
         * コマンドリストの作成
         */
        makeCommandList() {
            this.addCommand(BuyName, "buy");
            // this.addCommand(SellName, "sell", !this._purchaseOnly);
            this.addCommand(CancelName, "cancel");
        }
    }

    /**
     * 合成屋画面で、購入できる商品の一覧を表示するウィンドウです
     *
     * @class
     */
    class Window_CreateShopBuy extends Window_ShopBuy {
        /**
         * 必要素材ウィンドウの設定
         *
         * @param {} materialWindow -
         */
        setMaterialWindow(materialWindow) {
            this._materialWindow = materialWindow;
        }

        /**
         * ヘルプテキスト更新
         */
        updateHelp() {
            super.updateHelp();
            this._materialWindow.setIndex(this.index());
        }

        // カーソル上下・ページ切り替え時に_pageIndexを0(初期値)にする
        cursorDown(wrap) {
            super.cursorDown(wrap);
            if (this._materialWindow) this._materialWindow.resetPage();
        }
        cursorUp(wrap) {
            super.cursorUp(wrap);
            if (this._materialWindow) this._materialWindow.resetPage();
        }
        cursorPagedown() {
            const oldIndex = this.index(); // 変更前の index を保持
            super.cursorPagedown();        // 通常のページ送り
            if (this.index() !== oldIndex && this._materialWindow) {
                this._materialWindow.resetPage(); // index が変わったときのみページをリセット
            }
        }
        cursorPageup() {
            const oldIndex = this.index(); // 変更前の index を保持
            super.cursorPageup();          // 通常のページ送り
            if (this.index() !== oldIndex && this._materialWindow) {
                this._materialWindow.resetPage(); // index が変わったときのみページをリセット
            }
        }

        /**
         * 選択項目の有効状態を取得
         *
         * @returns {}
         */
        isCurrentItemEnabled() {
            return this.isEnabled(this._data[this.index()], this.index());
        }

        /**
         * アイテムを許可状態で表示するかどうか
         *
         * @param {} item -
         * @param {} index -
         * @returns {}
         */
        isEnabled(item, index) {
            let enable = super.isEnabled(item, index);
            if (enable) {
                if (materials[index]) {
                    for (let i = 0; i < materials[index].length; i++) {
                        if (materials[index][i]) {
                            const item       = materials[index][i].item;
                            const count      = materials[index][i].count;
                            const possession = $gameParty.numItems(item); // 所持数
                            if (possession < count) {
                                enable = false;
                                break;
                            }
                        }
                    }
                }
            }
            return enable;
        }

        /**
         * 項目の描画
         *
         * @param {} index -
         */
        drawItem(index) {
            const item = this.itemAt(index);
            const price = this.price(item);
            const rect = this.itemLineRect(index);
            const priceWidth = this.priceWidth();
            const priceX = rect.x + rect.width - priceWidth;
            const nameWidth = rect.width - priceWidth;
            this.changePaintOpacity(this.isEnabled(item, index));
            
            // 未所持アイテムを？？？表示するか判定
            if (isUnknownItemEnabled() && item && $gameParty.numItems(item) === 0) {
                // アイテムを？？？として描画
                this.changeTextColor(ColorManager.systemColor());
                const iconBoxWidth = ImageManager.iconWidth + 4;
                const unknownText = getUnknownText(item);
                this.drawText(unknownText, rect.x + iconBoxWidth, rect.y, nameWidth - iconBoxWidth);
                this.resetTextColor();
            } else {
                this.drawItemName(item, rect.x, rect.y, nameWidth);
            }
            
            this.drawText(price, priceX, rect.y, priceWidth, "right");
            this.changePaintOpacity(true);
        }
    }


    /**
     * 合成屋画面で、売却のために所持アイテムの一覧を表示するウィンドウです
     *
     * @class
     */
    class Window_CreateShopSell extends Window_ShopSell {

    }


    /**
     * 合成屋画面で、購入または売却するアイテムの個数を入力するウィンドウです
     *
     * @class
     */
    class Window_CreateShopNumber extends Window_ShopNumber {
        /**
         * アイテム名表示行の Y 座標
         *
         * @returns {number} アイテム名表示行の Y 座標
         */
        itemNameY() {
            return 34;
        }

        /**
         * タッチ操作用ボタンの Y 座標
         *
         * @returns {number} タッチ操作用ボタンの Y 座標
         */
        buttonY() {
            return Math.floor(this.totalPriceY() + this.lineHeight() * 1.5);
        }

        /**
         * 個数の変更
         *
         * @param {} amount -
         */
        changeNumber(amount) {
            super.changeNumber(amount);
            this.updateMaterialWindowNumber();
        }

        /**
         * 必要素材ウィンドウの設定
         *
         * @param {} materialWindow -
         */
        setMaterialWindow(materialWindow) {
            this._materialWindow = materialWindow;
        }

        /**
         * 必要素材個数の更新
         */
        updateMaterialWindowNumber() {
            if (this._materialWindow) {
                this._materialWindow.setNumber(this._number);
            }
        }
    }


    /**
     * 合成屋画面で、アイテムの所持数やアクターの装備を表示するウィンドウです
     *
     * @class
     */
    class Window_CreateShopStatus extends Window_ShopStatus {

    }


    /**
     * 合成屋画面で、必要素材を表示するウィンドウです
     *
     * @class
     */
    class Window_Potadra_Material extends Window_Selectable {
        /**
         * オブジェクト初期化
         *
         * @param {} rect -
         */
        constructor(rect) {
            super(rect);
            this._item = null;
            this._index = 0;
            this._number = 1;
            this._pageIndex = 0;
            this.refresh();
        }

        /**
         * 個数入力ウィンドウの設定
         *
         * @param {} materialWindow -
         */
        setNumberWindow(numberWindow) {
            this._numberWindow = numberWindow;
        }

        /**
         * インデックスの設定
         *
         * @param {numner} index - インデックス
         */
        setIndex(index) {
            this._index = index;
            this.refresh();
        }

        /**
         * 個数の設定
         *
         * @param {number} number - 個数
         */
        setNumber(number) {
            this._number = number;
            this.refresh();
        }

        /**
         * リフレッシュ
         */
        refresh() {
            super.refresh();
            this.drawMaterial();
        }

        /**
         * 必要素材の描画
         */
        drawMaterial() {
            let pos = 0;
            this.changeTextColor(ColorManager.systemColor());
            if (MaterialName) {
                pos = 1;
                const max_page = this.maxPages();
                if (max_page > 1) {
                    this.drawText(MaterialName + '(' + (this._pageIndex + 1) + '/' + max_page + ')', 0, 0, 420);
                } else {
                    this.drawText(MaterialName, 0, 0, 420);
                }
            }
            this.resetTextColor();
            const index = this._index;
            if (materials[index]) {
                const start = this._pageIndex * MaxSize;
                const end   = start + MaxSize;
                for (let i = start; i < end; i++) {
                    if (materials[index][i]) {
                        const position   = (i % MaxSize + pos);
                        const item       = materials[index][i].item;
                        const count      = materials[index][i].count;
                        const need       = count * this._number; // 必要数
                        const possession = $gameParty.numItems(item); // 所持数
                        const rect = this.itemLineRect(index);
                        const numberWidth = Potadra_maxDigits(item, MaxDigits, MaxDigitsMetaName);
                        const maxItemWidth = this.textWidth(Potadra_maxDigits(item, numberWidth + numberWidth + ' / '));
                        const maxItemX = rect.x + rect.width - maxItemWidth;
                        const y = 34 * position;
                        const nameWidth = rect.width - maxItemWidth;
                        this.changePaintOpacity(possession >= need);
                        
                        // 未所持素材を？？？表示するか判定
                        if (isUnknownMaterialEnabled() && item && possession === 0) {
                            // 素材を？？？として描画
                            this.changeTextColor(ColorManager.systemColor());
                            const iconBoxWidth = ImageManager.iconWidth + 4;
                            const unknownText = getUnknownText(item);
                            this.drawText(unknownText, iconBoxWidth, y, nameWidth - iconBoxWidth);
                            this.resetTextColor();
                        } else {
                            this.drawItemName(item, 0, y, nameWidth);
                        }
                        
                        this.drawText(possession + " / " + need, maxItemX, y, maxItemWidth, "right");
                        this.changePaintOpacity(true);
                    }
                }
            } 
        }

        /**
         * 個数の設定
         *
         * @returns {}
         */
        number() {
            return this._number;
        }

        /**
         * フレーム更新
         */
        update() {
            super.update();
            this.updatePage();
        }

        /**
         * ページの最初に移動する
         */
        resetPage() {
            this._pageIndex = 0;
            this.refresh();
        }

        /**
         * ページの更新
         */
        updatePage() {
            if (this.isPageChangeEnabled()) {
                if (this.isPageChangeRequested()) {
                    this.changePage();
                } else if (this.isPageBeforeRequested()) {
                    this.changePage(true);
                }
            }
        }

        /**
         * 最大ページ数の取得
         */
        maxPages() {
            let material = materials[this._index];
            if (material) {
                return Math.ceil(material.length / MaxSize);
            } else {
                return 1;
            }
        }

        /**
         * ページ更新判定
         *
         * @returns {boolean} ページ更新可否
         */
        isPageChangeEnabled() {
            // NumberWindow が表示されているときは無効化
            if (this._numberWindow && this._numberWindow.visible) {
                return false;
            }
            return this.visible && this.maxPages() >= 2;
        }

        /**
         * ページ更新操作(rightキーもしくはタッチされた場合)
         *
         * @returns {boolean} ページ更新可否
         */
        isPageChangeRequested() {
            let right_key = "right";

            // ShopScene_Extension.js 導入時は、shiftキーに変更
            if (ShopScene_Extension) right_key = "shift";

            if (Input.isTriggered(right_key)) {
                return true;
            }
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                return true;
            }
            return false;
        }

        /**
         * ページ戻る操作(leftキーが押された場合)
         *
         * @returns {boolean} ページ更新可否
         */
        isPageBeforeRequested() {
            if (!ShopScene_Extension && Input.isTriggered("left")) {
                return true;
            }
            return false;
        }

        /**
         * ページ変更
         */
        changePage(before = false) {
            if (before) {
                if (this._pageIndex === 0) {
                    this._pageIndex = this.maxPages() - 1;
                } else {
                    this._pageIndex = (this._pageIndex - 1) % this.maxPages();
                }
            } else {
                this._pageIndex = (this._pageIndex + 1) % this.maxPages();
            }
            this.refresh();
            this.playCursorSound();
        }
    }


    /**
     * 合成屋画面の処理を行うクラスです
     *
     * @class
     */
    class Scene_CreateShop extends Scene_Shop {
        /**
         * オブジェクト作成
         */
        create() {
            Scene_MenuBase.prototype.create.apply(this, arguments);
            this.createHelpWindow();
            this.createGoldWindow();
            this.createCommandWindow();
            this.createDummyWindow();
            this.createMaterialWindow(); // ここを追加
            this.createNumberWindow();
            this.createStatusWindow();
            this.createBuyWindow();
            this.createCategoryWindow();
            this.createSellWindow();
        }

        /**
         * 必要素材ウィンドウの作成
         */
        createMaterialWindow() {
            const rect = this.materialWindowRect();
            this._materialWindow = new Window_Potadra_Material(rect);
            this._materialWindow.hide();
            this.addWindow(this._materialWindow);
        }

        /**
         * 必要素材ウィンドウのサイズ指定
         *
         * @returns {}
         */
        materialWindowRect() {
            const wx = 0;
            const wh = this.calcWindowHeight(MaxSize, true);
            const buy_window_y      = this._dummyWindow.y;
            const buy_window_height = this._dummyWindow.height - wh;
            const wy = buy_window_y + buy_window_height;
            // const wy = this._dummyWindow.height - this.mainAreaHeight();
            // const wy = 120 + 200 + 42;
            const ww = Graphics.boxWidth - this.statusWidth();
            // this.mainAreaHeight() -
            // this._commandWindow.height -
            // 200 - 42;
            return new Rectangle(wx, wy, ww, wh);
        }

        /**
         * コマンドウィンドウの作成
         */
        createCommandWindow() {
            const rect = this.commandWindowRect();
            this._commandWindow = new Window_CreateShopCommand(rect); // ここを変えた
            this._commandWindow.setPurchaseOnly(this._purchaseOnly);
            this._commandWindow.y = this.mainAreaTop();
            this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
            // this._commandWindow.setHandler("sell", this.commandSell.bind(this)); // ここを変えた
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }

        /**
         * 個数入力ウィンドウの作成
         */
        createNumberWindow() {
            const rect = this.numberWindowRect();
            this._numberWindow = new Window_CreateShopNumber(rect); // ここを変えた
            this._numberWindow.hide();
            this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
            this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
            this._numberWindow.setMaterialWindow(this._materialWindow); // ここを追加
            this._materialWindow.setNumberWindow(this._numberWindow);
            this.addWindow(this._numberWindow);
        }

        /**
         * 個数入力ウィンドウのサイズ指定
         *
         * @returns {}
         */
        numberWindowRect() {
            const wx = 0;
            const wy = this._dummyWindow.y;
            const ww = Graphics.boxWidth - this.statusWidth();
            const wh = this.calcWindowHeight(5, true);
            return new Rectangle(wx, wy, ww, wh);
        }

        /**
         * 購入ウィンドウの作成
         */
        createBuyWindow() {
            const rect = this.buyWindowRect();
            this._buyWindow = new Window_CreateShopBuy(rect); // ここを変えた
            this._buyWindow.setupGoods(this._goods);
            this._buyWindow.setHelpWindow(this._helpWindow);
            this._buyWindow.setStatusWindow(this._statusWindow);
            this._buyWindow.hide();
            this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
            this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
            this._buyWindow.setMaterialWindow(this._materialWindow); // ここを追加
            this.addWindow(this._buyWindow);
        }

        /**
         * 購入ウィンドウのサイズ指定
         *
         * @returns {}
         */
        buyWindowRect() {
            const wx = 0;
            const wy = this._dummyWindow.y;
            const ww = Graphics.boxWidth - this.statusWidth();
            const wh = this._dummyWindow.height - this._materialWindow.height;
            return new Rectangle(wx, wy, ww, wh);
        }

        /**
         * 購入ウィンドウのアクティブ化
         */
        activateBuyWindow() {
            super.activateBuyWindow();
            this._materialWindow.show();
        }

        /**
         * 売却ウィンドウのアクティブ化
         */
        activateSellWindow() {
            super.activateSellWindow();
            this._materialWindow.hide();
        }

        /**
         * 購入［決定］
         */
        onBuyOk() {
            super.onBuyOk();
            this._materialWindow.setIndex(this._buyWindow.index());
        }

        /**
         * 購入［キャンセル］
         */
        onBuyCancel() {
            super.onBuyCancel();
            this._materialWindow.setIndex(0);
            this._materialWindow.hide();
        }

        /**
         * 個数入力［決定］
         */
        onNumberOk() {
            super.onNumberOk();
            this._materialWindow.setNumber(1);
        }

        /**
         * 個数入力［キャンセル］
         */
        onNumberCancel() {
            super.onNumberCancel();
            this._materialWindow.setNumber(1);
        }

        /**
         * 最大購入可能個数の取得
         *
         * @returns {}
         */
        maxBuy() {
            let max = super.maxBuy();
            const index = this._buyWindow.index();
            if (materials[index]) {
                for (let i = 0; i < materials[index].length; i++) {
                    if (materials[index][i]) {
                        const item  = materials[index][i].item;
                        const count = materials[index][i].count;
                        const m = $gameParty.numItems(item) / count; // 所持数
                        if (max > m) {
                            max = m;
                        }
                    }
                }
            }
            return max;
        }

        /**
         * 購入の実行
         *
         * @param {} number -
         */
        doBuy(number) {
            $gameParty.loseGold(number * this.buyingPrice());
            $gameParty.gainItem(this._item, number);
            const index = this._buyWindow.index();
            if (materials[index]) {
                for (let i = 0; i < materials[index].length; i++) {
                    if (materials[index][i]) {
                        const item  = materials[index][i].item;
                        const count = materials[index][i].count;
                        $gameParty.loseItem(item, number * count);
                    }
                }
            }
        }
    }

    // ミニウィンドウ表示対応
    if (MiniWindow) {
        var __SCreateShop_create = Scene_CreateShop.prototype.create;
        Scene_CreateShop.prototype.create = function() {
            __SCreateShop_create.call(this);
            this.createMiniWindow();
        };
    }
})();
