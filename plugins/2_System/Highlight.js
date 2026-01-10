/*:
@plugindesc
ハイライト Ver1.0.0(2025/10/4)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Highlight.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
特定の文字を指定した色に変更します

## 使い方
1. プラグインパラメータのグループを設定します
   グループは、地名・重要など共通の設定を定義できます
2, プラグインパラメータのデータ設定で特定の文字を指定します
3. 文章の表示を呼び出すと設定した表示内容で特定の文字がハイライトされます

### ルビ(ふりがな) について
pandaさんの PANDA_RubyText.js を導入することで  
ハイライトと同時にルビをつけることができます
http://www.werepanda.jp/blog/20200920202955.html

プラグインパラメータ上の 特定の文字(Word) に対応するように  
ルビ(Ruby) をつけるようにしてください

例: 召喚スキル に ルビ(Ruby) をつける場合

・特定の文字(Word)
召喚スキル

・ルビ(Ruby)
{召|しょう}{喚|かん}スキル

@param groups
@type struct<Group>[]
@text グループ
*/

/*~struct~Group:
@param GroupName
@text グループ名
@desc 管理用の名称。空白でもOK

@param GroupColor
@type color
@text グループ色
@desc グループ内の文字色を、この色に変更します
グループ内の共通の設定
@default 0

@param GroupBeforeWord
@text グループ前文字
@desc 特定の文字の前に表示する文字
グループ内の共通の設定

@param GroupAfterWord
@text グループ後文字
@desc 特定の文字の後に表示する文字
グループ内の共通の設定

@param GroupClassName
@type combo
@text グループクラス名
@desc 適用するクラス名
グループ内の共通の設定
@default Window_Message
@option Window_Base
@option Window_Scrollable
@option Window_Selectable
@option Window_Command
@option Window_HorzCommand
@option Window_Help
@option Window_Gold
@option Window_StatusBase
@option Window_MenuCommand
@option Window_MenuStatus
@option Window_MenuActor
@option Window_ItemCategory
@option Window_ItemList
@option Window_SkillType
@option Window_SkillStatus
@option Window_SkillList
@option Window_EquipStatus
@option Window_EquipCommand
@option Window_EquipSlot
@option Window_EquipItem
@option Window_Status
@option Window_StatusParams
@option Window_StatusEquip
@option Window_Options
@option Window_SavefileList
@option Window_ShopCommand
@option Window_ShopBuy
@option Window_ShopSell
@option Window_ShopNumber
@option Window_ShopStatus
@option Window_NameEdit
@option Window_NameInput
@option Window_NameBox
@option Window_ChoiceList
@option Window_NumberInput
@option Window_EventItem
@option Window_Message
@option Window_ScrollText
@option Window_MapName
@option Window_BattleLog
@option Window_PartyCommand
@option Window_ActorCommand
@option Window_BattleStatus
@option Window_BattleActor
@option Window_BattleEnemy
@option Window_BattleSkill
@option Window_BattleItem
@option Window_TitleCommand
@option Window_GameEnd
@option Window_DebugRange
@option Window_DebugEdit

@param data
@type struct<Data>[]
@text データ
*/

/*~struct~Data:
@param Word
@text 特定の文字
@desc この文字を、ハイライトします

@param Color
@type color
@text 色
@desc 文字色を、この色に変更します
0 以外を設定すると適用されます
@default 0

@param BeforeWord
@text 前文字
@desc 特定の文字の前に表示する文字
個別の設定

@param AfterWord
@text 後文字
@desc 特定の文字の後に表示する文字
個別の設定

@param Ruby
@text ルビ
@desc ふりがな
ルビ表示プラグイン(PANDA_RubyText.js) に対応します

@param ClassName
@type combo
@text クラス名
@desc 適用するクラス名
個別の設定
@option Window_Base
@option Window_Scrollable
@option Window_Selectable
@option Window_Command
@option Window_HorzCommand
@option Window_Help
@option Window_Gold
@option Window_StatusBase
@option Window_MenuCommand
@option Window_MenuStatus
@option Window_MenuActor
@option Window_ItemCategory
@option Window_ItemList
@option Window_SkillType
@option Window_SkillStatus
@option Window_SkillList
@option Window_EquipStatus
@option Window_EquipCommand
@option Window_EquipSlot
@option Window_EquipItem
@option Window_Status
@option Window_StatusParams
@option Window_StatusEquip
@option Window_Options
@option Window_SavefileList
@option Window_ShopCommand
@option Window_ShopBuy
@option Window_ShopSell
@option Window_ShopNumber
@option Window_ShopStatus
@option Window_NameEdit
@option Window_NameInput
@option Window_NameBox
@option Window_ChoiceList
@option Window_NumberInput
@option Window_EventItem
@option Window_Message
@option Window_ScrollText
@option Window_MapName
@option Window_BattleLog
@option Window_PartyCommand
@option Window_ActorCommand
@option Window_BattleStatus
@option Window_BattleActor
@option Window_BattleEnemy
@option Window_BattleSkill
@option Window_BattleItem
@option Window_TitleCommand
@option Window_GameEnd
@option Window_DebugRange
@option Window_DebugEdit
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    let Groups = [];
    if (params.groups) Groups = JSON.parse(params.groups);

    // 他プラグイン連携(プラグインの導入有無)
    const PANDA_RubyText = Potadra_isPlugin('PANDA_RubyText');

    /**
     * 制御文字の事前変換
     *    実際の描画を始める前に、原則として文字列に変わるものだけを置き換える。
     *    文字「\」はエスケープ文字（\e）に変換。
     *
     * @param {} text - 
     * @returns {} 
     */
    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        let tmp_text = _Window_Base_convertEscapeCharacters.apply(this, arguments);
        for (const groups of Groups) {
            const group           = JSON.parse(groups);
            const GroupColor      = Number(group.GroupColor || 0);
            const GroupBeforeWord = String(group.GroupBeforeWord || '');
            const GroupAfterWord  = String(group.GroupAfterWord || '');
            const GroupClassName  = String(group.GroupClassName || 'Window_Message');
            const Data            = JSON.parse(group.data);

            if (!Data) continue;

            for (const data of Data.reverse()) {
                const datum = JSON.parse(data);
                const Word = datum.Word;
                if (Word) {
                    let Color        = Number(datum.Color || 0);
                    const BeforeWord = String(datum.BeforeWord || GroupBeforeWord);
                    const AfterWord  = String(datum.AfterWord || GroupAfterWord);
                    const Ruby       = datum.Ruby;
                    const ClassName  = String(datum.ClassName || GroupClassName);

                    if (this.constructor.name !== ClassName) continue;

                    if (Color === 0) Color = GroupColor;

                    let regex = new RegExp(`(${Word})`, "gi");
                    if (PANDA_RubyText && Ruby) {
                        tmp_text = tmp_text.replace(regex, (_, p1) =>
                            "\x1bC[" + Color + "]" + BeforeWord + Ruby + "\x1bC[" + Color + "]" + AfterWord + "\x1bC[0]"
                        );
                    } else {
                        tmp_text = tmp_text.replace(regex, (_, p1) =>
                            "\x1bC[" + Color + "]" + BeforeWord + p1 + "\x1bC[" + Color + "]" + AfterWord + "\x1bC[0]"
                        );
                    }
                }
            }
        }
        return tmp_text;
    };
})();
