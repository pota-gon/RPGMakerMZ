/*:
@plugindesc
習得スキル表示装備画面 Ver1.0.1(2025/1/8)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/4_UI/EquipUI/EquipWindows.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.1: NameDatabase.js のスキル追加のメタタグ名称を参照するように変更
* Ver1.0.0
- HP・MP・TP消費の省略名をプラグインパラメータで指定できる機能追加
- TPの表示がおかしかったのを修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
装備画面に習得スキルなどを表示できるようにします

## 使い方
初期設定は必要ありません  
プラグイン導入だけで動作します

@param HpName
@text HP省略名
@desc HP・MP・TPの中で2つ以上のコストを使用するときの省略名
@default H

@param MpName
@text MP省略名
@desc HP・MP・TPの中で2つ以上のコストを使用するときの省略名
@default M

@param TpName
@text TP省略名
@desc HP・MP・TPの中で2つ以上のコストを使用するときの省略名
@default T
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
    function Potadra_getPluginParams(plugin_name) {
        return Potadra_isPlugin(plugin_name) ? PluginManager.parameters(plugin_name) : false;
    }
    function Potadra_metaData(meta_data, delimiter = '\n') {
        if (meta_data) {
            const data = meta_data.split(delimiter);
            if (data) return data.map(datum => datum.trim());
        }
        return false;
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
    function Potadra_checkName(data, name, val = false) {
        if (isNaN(name)) {
            return Potadra_nameSearch(data, name.trim(), "id", "name", val);
        }
        return Number(name || val);
    }
    function Potadra_ids(names, data) {
        const ids = [];
        if (names) {
            for (const name of names) {
                if (name) {
                    const id = Potadra_checkName(data, name);
                    if (id) ids.push(id);
                }
            }
        }
        return ids;
    }

    // パラメータ用定数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用定数
    const HpName = String(params.HpName);
    const MpName = String(params.MpName);
    const TpName = String(params.TpName);

    // 他プラグイン連携(プラグインの導入有無)
    const PANDA_NicknameAsClass = Potadra_isPlugin('PANDA_NicknameAsClass');

    // 他プラグイン連携(パラメータ取得)
    const skill_cost_params = Potadra_getPluginParams('SkillCost');
    const ItemCostName = skill_cost_params ? String(skill_cost_params.ItemCostName || '個') : '個';

    const name_database_params = Potadra_getPluginParams('NameDatabase');
    const AddSkillMetaName = name_database_params ? String(name_database_params.AddSkillMetaName || 'スキル追加') : 'スキル追加';

    //------------------------------------------------------------------------------
    // Scene_Equip
    //------------------------------------------------------------------------------
    // 装備画面の処理を行うクラスです。
    //------------------------------------------------------------------------------

    /**
     * ウィンドウの作成
     */
    Scene_Equip.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createStatusWindow();
        this.createSkillWindow();
        this.createCommandWindow();
        this.createSlotWindow();
        this.createItemWindow();
        this.refreshActor();
    };

    /**
     * ステータスウィンドウのサイズ
     *
     * @returns {} 
     */
    Scene_Equip.prototype.statusWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this.statusWidth();
        const wh = this.mainAreaHeight() - 168;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 習得スキルウィンドウの作成
     */
    Scene_Equip.prototype.createSkillWindow = function() {
        const rect = this.skillWindowRect();
        this._skillWindow = new Window_EquipSkill(rect);
        this.addWindow(this._skillWindow);
    };

    /**
     * 習得スキルウィンドウのサイズ
     *
     * @returns {} 
     */
    Scene_Equip.prototype.skillWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaHeight() - 116;
        const ww = this.statusWidth();
        const wh = this.mainAreaHeight() - 298;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * スロットウィンドウの作成
     */
    Scene_Equip.prototype.createSlotWindow = function() {
        const rect = this.slotWindowRect();
        this._slotWindow = new Window_EquipSlot(rect);
        this._slotWindow.setHelpWindow(this._helpWindow);
        this._slotWindow.setStatusWindow(this._statusWindow);
        this._slotWindow.setSkillWindow(this._skillWindow);
        this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
        this._slotWindow.setHandler("cancel", this.onSlotCancel.bind(this));
        this.addWindow(this._slotWindow);
    };

    /**
     * アイテムウィンドウの作成
     */
    Scene_Equip.prototype.createItemWindow = function() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_EquipItem(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setStatusWindow(this._statusWindow);
        this._itemWindow.setSkillWindow(this._skillWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this._itemWindow.hide();
        this._slotWindow.setItemWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    };

    /**
     * スロット［キャンセル］
     */
    Scene_Equip.prototype.onSlotCancel = function() {
        this._skillWindow.setItem(null);
        this._slotWindow.deselect();
        this._commandWindow.activate();
    };

    /**
     * 
     */
    Scene_Equip.prototype.refreshActor = function() {
        const actor = this.actor();
        this._statusWindow.setActor(actor);
        this._skillWindow.setActor(actor);
        this._slotWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    };

    //------------------------------------------------------------------------------
    // Window_EquipStatus
    //------------------------------------------------------------------------------
    // 装備画面で、アクターの能力値変化を表示するウィンドウです。
    //------------------------------------------------------------------------------

    /**
     * リフレッシュ
     */
    Window_EquipStatus.prototype.refresh = function() {
        this.contents.clear();
        if (this._actor) {
            this.hideAdditionalSprites();

            const nameRect = this.itemLineRect(0);

            // 1列目
            this.drawActorName(this._actor, nameRect.x, 0, nameRect.width / 2);
            let class_name;
            if (PANDA_NicknameAsClass) {
                class_name = this._actor._nickname;
            } else {
                class_name = this._actor.currentClass().name;
            }
            this.drawText(class_name, nameRect.x + 140, 0, nameRect.width / 2);

            // 2列目
            this.drawActorCharacter(this._actor, nameRect.x + 30, nameRect.height + 60);
            this.equipStatusBasicGauges(this._actor, nameRect.x + 68, this.lineHeight());

            // 3列目
            this.contents.fontSize = 20;
            for (let i = 0; i < 6; i++) {
                const x = this.itemPadding();
                const y = 64 + Math.floor((this.lineHeight() - 8) * (i + 1.5));
                this.drawItem(x, y, 2 + i);
            }
            this.resetFontSettings();
        }
    };

    /**
     * 
     *
     * @param {} actor - 
     * @param {} type - 
     * @param {} x - 
     * @param {} y - 
     */
    Window_EquipStatus.prototype.equipStatusPlaceGauge = function(actor, type, x, y) {
        const key = "actor%1-gauge-%2".format(actor.actorId(), type);
        const sprite = this.createInnerSprite(key, Sprite_EquipStatusGauge);
        sprite.setup(actor, type);
        sprite.move(x, y);
        sprite.updateActor(this._actor, this._tempActor);
        sprite.show();
    };

    /**
     * 
     *
     * @param {} actor - 
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    Window_EquipStatus.prototype.equipStatusBasicGauges = function(actor, x, y) {
        this.equipStatusPlaceGauge(actor, "hp", x, y);
        this.equipStatusPlaceGauge(actor, "mp", x, y + this.gaugeLineHeight());
        if ($dataSystem.optDisplayTp) {
            this.equipStatusPlaceGauge(actor, "tp", x, y + this.gaugeLineHeight() * 2);
        }
    };

    //------------------------------------------------------------------------------
    // Sprite_EquipStatusGauge
    //------------------------------------------------------------------------------
    class Sprite_EquipStatusGauge extends Sprite_Gauge {
        constructor() {
            super();
        }
        bitmapWidth() {
            return 208;
        }
        labelFontSize() {
            return $gameSystem.mainFontSize() - 6;
        }
        valueFontSize() {
            return $gameSystem.mainFontSize() - 8;
        }
        drawValue() {
            const width           = 48;
            const height          = this.textHeight();
            const rightArrowWidth = 32;
            const x               = 78;
            const arrowX          = 131;
            const x2              = 157;
            const y               = 6;
            const currentValue    = this.currentValue();

            this.setupValueFont();

            // 現在の値
            this.bitmap.drawText(currentValue, x, y - 3, width, height, "right");

            // ->
            this.bitmap.textColor = ColorManager.systemColor();
            this.bitmap.drawText("\u2192", arrowX, y, rightArrowWidth, height);

            // 変更後の値
            if (this._tempActor) {
                let newValue = null;
                let diffValue = null;
                if (this._statusType === 'tp') {
                    newValue  = this._tempActor.maxTp();
                    diffValue = newValue - this._actor.maxTp();
                } else {
                    const paramId = this._statusType === 'hp' ? 0 : 1;
                    newValue  = this._tempActor.param(paramId);
                    diffValue = newValue - this._actor.param(paramId);
                }
                this.bitmap.textColor = ColorManager.paramchangeTextColor(diffValue);
                this.bitmap.drawText(newValue, x2, y - 3, width, height, "right");
            }
            this.bitmap.textColor = ColorManager.normalColor();
        }
        updateActor(actor, tempActor) {
            if (this._actor !== actor || this._tempActor !== tempActor) {
                this._actor     = actor;
                this._tempActor = tempActor;
                this.redraw();
            }
        };
    }

    //------------------------------------------------------------------------------
    // Window_EquipSlot
    //------------------------------------------------------------------------------
    // 装備画面で、アクターが現在装備しているアイテムを表示するウィンドウです。
    //------------------------------------------------------------------------------

    /**
     * 習得スキルウィンドウの設定
     *
     * @param {} skillWindow - 
     */
    Window_EquipSlot.prototype.setSkillWindow = function(skillWindow) {
        this._skillWindow = skillWindow;
    };

    /**
     * ヘルプテキスト更新
     */
    const _Window_EquipSlot_updateHelp = Window_EquipSlot.prototype.updateHelp;
    Window_EquipSlot.prototype.updateHelp = function() {
        _Window_EquipSlot_updateHelp.apply(this, arguments);
        if (this._skillWindow) {
            this._skillWindow.setItem(this.item());
        }
    };

    //------------------------------------------------------------------------------
    // Window_EquipItem
    //------------------------------------------------------------------------------
    // 装備画面で、装備変更の候補となるアイテムの一覧を表示するウィンドウです。
    //------------------------------------------------------------------------------

    /**
     * 習得スキルウィンドウの設定
     *
     * @param {} skillWindow - 
     */
    Window_EquipItem.prototype.setSkillWindow = function(skillWindow) {
        this._skillWindow = skillWindow;
    };

    /**
     * ヘルプテキスト更新
     */
    const _Window_EquipItem_updateHelp = Window_EquipItem.prototype.updateHelp;
    Window_EquipItem.prototype.updateHelp = function() {
        _Window_EquipItem_updateHelp.apply(this, arguments);
        if (this._skillWindow) {
            this._skillWindow.setItem(this.item());
        }
    };

    //------------------------------------------------------------------------------
    // Window_EquipSkill
    //------------------------------------------------------------------------------
    // 装備画面で、習得スキルを表示するウィンドウです
    //------------------------------------------------------------------------------

    /**
     * 
     *
     * @class
     */
    class Window_EquipSkill extends Window_SkillList {
        constructor(rect) {
            super(rect);
            this._actor = null;
            this._item = null;
            this._skills = [];
            this._pageIndex = 0;
            this._contentsBackSprite.alpha = 0; // メニューの黒背景が残るときがあるので、初期化時のみ実行
            this.refresh();
        }

        setActor(actor) {
            if (this._actor !== actor) {
                this._actor = actor;
                this.refresh();
            }
        };

        setItem(item) {
            if (this._item !== item) {
                this._item = item;
                this.refresh();
            }
        };

        setSkills() {
            const item = this._item;
            let skill_ids = [];
            this._skills = [];
            if (item) {
                let traits = item.traits.filter(trait => trait.code === 43);
                const skill_names = Potadra_metaData(item.meta[AddSkillMetaName]);
                skill_ids = traits.map(trait => trait["dataId"]).concat(Potadra_ids(skill_names, $dataSkills));
                for (let i = 0; i < skill_ids.length; i++) {
                    const skill_id = skill_ids[i];
                    const skill = $dataSkills[skill_id];
                    if (skill) this._skills.push(skill);
                }
            }
        }

        /**
         * リフレッシュ
         */
        refresh(init = true) {
            super.refresh();

            const name_width = 160;
            const cost_width = 78;

            this.contents.clear();
            this.contents.fontSize = 16;

            this.setSkills(name_width, cost_width);
            if (init) {
                this._pageIndex = 0;
            } else {
                this._pageIndex = (this._pageIndex + 1) % this.maxPages();
            }

            // ヘッダ: 習得スキル・消費表示
            this.updateHeader();

            // データ: 習得スキル・消費表示
            this.updateData(name_width, cost_width) 

            this.resetFontSettings();
        }

        /**
         * ヘッダ: 習得スキル・消費表示
         */
        updateHeader(name_width, cost_width) {
            const y0       = -8;
            const max_page = this.maxPages();
            this.changeTextColor(ColorManager.systemColor());
            if (max_page > 1) {
                this.drawText("習得スキル" + '(' + (this._pageIndex + 1) + '/' + max_page + ')', 0, y0, name_width);
            } else {
                this.drawText("習得スキル", 0, y0, name_width);
            }
            this.drawText("消費", 196, y0, cost_width);
            this.resetTextColor();
        }

        /**
         * データ: 習得スキル・消費表示
         */
        updateData(name_width, cost_width) {
            const item = this._item;
            if (item) {
                const MaxSize = this.maxSize();
                const start = this._pageIndex * MaxSize;
                const end   = start + MaxSize;
                for (let i = start; i < end; i++) {
                    const skill = this._skills[i];
                    if (skill) {
                        this.resetTextColor();
                        const y  = (i % MaxSize) * 24;
                        const y2 = y + 18;
                        const iconY = y + 25 + (this.lineHeight() - ImageManager.iconHeight) / 2;
                        this.drawIcon(skill.iconIndex, 0, iconY);
                        this.drawText(skill.name, 24, y2, name_width);
                        this.drawSkillCost(skill, name_width + cost_width - 36, y2, cost_width);
                    }
                }
            }
        }

        /**
         * アイコンの描画
         *     enabled : 有効フラグ。false のとき半透明で描画
         *
         * @param {} iconIndex - 
         * @param {} x - 
         * @param {} y - 
         */
        drawIcon(iconIndex, x, y) {
            const bitmap = ImageManager.loadSystem("IconSet");
            const pw     = ImageManager.iconWidth;
            const ph     = ImageManager.iconHeight;
            const sx     = (iconIndex % 16) * pw;
            const sy     = Math.floor(iconIndex / 16) * ph;
            const n      = Math.floor((this.contents.fontSize / 28) * ImageManager.iconWidth);
            this.contents.blt(bitmap, sx, sy, pw, ph, x, y, n, n);
        };

        /**
         * スキルの使用コストを描画
         *
         * @param {} skill - 
         * @param {} x - 
         * @param {} y - 
         * @param {} width - 
         */
        drawSkillCost(skill, x, y, width) {
            if (skill_cost_params) {
                if (this._actor.skillHpCost(skill) > 0 && this._actor.skillMpCost(skill) > 0 && this._actor.skillTpCost(skill) > 0) {
                    const cost_width = width / 3;
                    this.changeTextColor(ColorManager.hpCostColor());
                    this.drawText(HpName + this._actor.skillHpCost(skill), x, y, cost_width, "right");
                    this.changeTextColor(ColorManager.mpCostColor());
                    this.drawText(MpName + this._actor.skillMpCost(skill), x + cost_width, y, cost_width, "right");
                    this.changeTextColor(ColorManager.tpCostColor());
                    this.drawText(TpName + this._actor.skillTpCost(skill), x + cost_width * 2, y, cost_width, "right");
                } else if (this._actor.skillHpCost(skill) > 0 && this._actor.skillMpCost(skill) > 0) {
                    const cost_width = width / 2;
                    this.changeTextColor(ColorManager.hpCostColor());
                    this.drawText(HpName + this._actor.skillHpCost(skill), x, y, cost_width, "right");
                    this.changeTextColor(ColorManager.mpCostColor());
                    this.drawText(MpName + this._actor.skillMpCost(skill), x + cost_width, y, cost_width, "right");
                } else if (this._actor.skillHpCost(skill) > 0 && this._actor.skillTpCost(skill) > 0) {
                    const cost_width = width / 2;
                    this.changeTextColor(ColorManager.hpCostColor());
                    this.drawText(HpName + this._actor.skillHpCost(skill), x, y, cost_width, "right");
                    this.changeTextColor(ColorManager.tpCostColor());
                    this.drawText(TpName + this._actor.skillTpCost(skill), x + cost_width, y, cost_width, "right");
                } else if (this._actor.skillMpCost(skill) > 0 && this._actor.skillTpCost(skill) > 0) {
                    const cost_width = width / 2;
                    this.changeTextColor(ColorManager.mpCostColor());
                    this.drawText(MpName + this._actor.skillMpCost(skill), x, y, cost_width, "right");
                    this.changeTextColor(ColorManager.tpCostColor());
                    this.drawText(TpName + this._actor.skillTpCost(skill), x + cost_width, y, cost_width, "right");
                } else if (this._actor.skillTpCost(skill) > 0) {
                    this.changeTextColor(ColorManager.tpCostColor());
                    this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
                } else if (this._actor.skillMpCost(skill) > 0) {
                    this.changeTextColor(ColorManager.mpCostColor());
                    this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
                } else if (this._actor.skillHpCost(skill) > 0) {
                    this.changeTextColor(ColorManager.hpCostColor());
                    this.drawText(this._actor.skillHpCost(skill), x, y, width, "right");
                } else if (this._actor.skillGoldCost(skill) > 0) {
                    this.changeTextColor(ColorManager.goldCostColor());
                    this.drawText(this._actor.skillGoldCost(skill) + TextManager.currencyUnit, x, y, width, "right");
                } else if (this._actor.skillItemCost(skill) > 0) {
                    this.changeTextColor(ColorManager.itemCostColor());
                    this.drawText(this._actor.skillItemCost(skill) + ItemCostName, x, y, width, "right");
                }
            } else {
                super.drawSkillCost(skill, x, y, width);
            }
        };

        /**
         * フレーム更新
         */
        update() {
            super.update();
            this.updatePage();
        }

        /**
         * ページの更新
         */
        updatePage() {
            if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
                this.changePage();
            }
        }

        /**
         * 項目数の取得
         */
        maxSize() {
            return 5;
        }

        /**
         * 最大ページ数の取得
         */
        maxPages() {
            if (this._skills) {
                return Math.ceil(this._skills.length / this.maxSize());
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
            return this.visible && this.maxPages() >= 2;
        }

        /**
         * ページ更新操作(Shiftキーもしくはタッチされた場合)
         *
         * @returns {boolean} ページ更新可否
         */
        isPageChangeRequested() {
            if (Input.isTriggered("shift")) {
                return true;
            }
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                return true;
            }
            return false;
        }

        /**
         * ページ変更
         */
        changePage() {
            this.refresh(false);
            this.playCursorSound();
        }
    }
})();
