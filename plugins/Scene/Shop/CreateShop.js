/*:
@plugindesc
合成屋 Ver0.13.1(2025/6/21)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/Scene/Shop/CreateShop.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver0.13.1
- 購入個数ウィンドウのバグ修正
  + 購入個数を変更したときに必要素材のページが切り替わるバグ修正
  + 購入個数を変更したときに必要素材が更新されないバグ修正
- 複数ページがある合成品から、カーソル上下・ページ切り替え時に必要素材が表示されないことがあるバグ修正
  商品に変更があった場合は、ページ数を1ページ目にするようにしました
- リファクタリング
* Ver0.13.0
- 商品名と必要素材にアイテム・武器・防具のIDを指定できるように変更
- ShopScene_Extension.js 導入時は、必要素材の切り替えをshiftキーになるように変更(競合対応)
- リファクタリング
* Ver0.12.0
- Qキー(pagedown)とW(pageup)キーを使用していた部分は、
  合成アイテムのスクロールと競合するため、移動左キー(left)と移動右(right)キーで動作するように変更
- 必要素材の未設定時にParmeter Errorを出力するように修正(プラグインパラメータでON・OFF可能)
- 必要素材の設定漏れが発生しやすいため、デフォルト値として空配列を指定
- メニュー表示名の設定をコンボボックスに変更
- メニュー表示名の説明を修正
- 未実装の機能、分解に設定注意コメントを追加
* Ver0.11.0
- 名前検索用のパラメータ追加
- リファクタリング
* Ver0.10.9
- 合成素材があるとき、複数ページを切り替えられる機能が動作していなかったのを修正
- shiftキーを使用していた部分は、装備の変更と競合するため、Qキー(pagedown)とW(pageup)キーで動作するように変更
* Ver0.10.8
- ページがおかしくなるバグ修正
- 競合対策を実施
- 検索時のバグ修正

・TODO
- ヘルプ更新

Copyright (c) 2025 ポテトードラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

@help
## 概要
合成屋を作成出来るようにします

## 使い方


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
                const item = Potadra.nameSearch(data, name, column);
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

    // 他プラグイン連携(プラグインの導入有無)
    const ShopScene_Extension = Potadra_isPlugin('ShopScene_Extension');

    // 他プラグイン連携(パラメータ取得)
    const max_item_params   = Potadra_getPluginParams('MaxItem');
    const MaxDigits         = max_item_params ? String(max_item_params.MaxDigits || '00') : '00';
    const MaxDigitsMetaName = max_item_params ? String(max_item_params.MaxDigitsMetaName || '最大桁数') : '最大桁数';

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
            this.drawItemName(item, rect.x, rect.y, nameWidth);
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
                        this.drawItemName(item, 0, y, nameWidth);
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
