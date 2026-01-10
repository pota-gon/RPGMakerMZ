/*:
@plugindesc
飛行船エンカウント Ver1.0.0(2025/1/1)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/3_Game/Map/EncountAirShip.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.0: 初期版完成

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
飛行船でエンカウントするようになります

## 使い方
1. マップのエンカウント設定で  
   飛行船用のリージョン(初期設定では 255 )の設定を実施します

2. 飛行船の戦闘背景をパラメータの 飛行船戦闘背景1  
   飛行船戦闘背景2 で必要に応じて変更します

3. 飛行船に乗るとエンカウントするようになります

@param Region
@type number
@text エンカウントリージョン
@desc 飛行船でエンカウントする場合に使用するリージョン番号
マップ上では、このリージョン番号を設定する必要はありません
@default 255

@param AirShipBattleback1Name
@type combo
@text 飛行船戦闘背景1
@desc 飛行船の戦闘背景1(battlebacks1) を指定
@default Clouds
@option Castle1
@option Castle2
@option Castle3
@option Clouds
@option Cobblestones1
@option Cobblestones2
@option Cobblestones3
@option Cobblestones4
@option Cobblestones5
@option Colosseum
@option Crystal
@option Cyberspace
@option DecorativeTile1
@option DecorativeTile2
@option DemonCastle1
@option DemonCastle2
@option DemonCastle3
@option DemonicWorld
@option Desert
@option Dirt
@option DirtCave
@option DirtField
@option Fort1
@option Fort2
@option Grassland
@option GrassMaze
@option Ground1
@option Ground2
@option IceCave
@option IceMaze
@option Lava1
@option Lava2
@option LavaCave
@option PoisonSwamp
@option Road1
@option Road2
@option Road3
@option RockCave
@option Sand
@option Ship
@option Smoke
@option Snowfield
@option Space
@option Stone1
@option Stone2
@option Stone3
@option Temple
@option Tent
@option Wasteland
@option Wood1
@option Wood2

@param AirShipBattleback2Name
@type combo
@text 飛行船戦闘背景2
@desc 飛行船の戦闘背景2(battlebacks1) を指定
@default Clouds
@option Brick
@option Bridge
@option Castle1
@option Castle2
@option Castle3
@option Cliff
@option Clouds
@option Colosseum
@option Crystal
@option DarkSpace
@option DemonCastle1
@option DemonCastle2
@option DemonCastle3
@option DemonicWorld
@option Desert
@option DirtCave
@option Forest
@option Fort1
@option Fort2
@option Grassland
@option GrassMaze
@option IceCave
@option IceMaze
@option Lava
@option LavaCave
@option PoisonSwamp
@option Port
@option RockCave
@option Room1
@option Room2
@option Room3
@option Ruins1
@option Ruins2
@option Ruins3
@option Ship
@option Smoke
@option Snowfield
@option Stone1
@option Stone2
@option Stone3
@option Temple
@option Tent
@option Tower
@option Town1
@option Town2
@option Town3
@option Town4
@option Town5
@option Wasteland
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
    const Region                 = Number(params.Region || 255);
    const AirShipBattleback1Name = String(params.AirShipBattleback1Name || 'Clouds');
    const AirShipBattleback2Name = String(params.AirShipBattleback2Name || 'Clouds');

    /**
     * エンカウント項目の採用可能判定
     *
     * @returns {} 
     */
    Game_Player.prototype.canEncounter = function() {
        return (
            !$gameParty.hasEncounterNone() &&
            $gameSystem.isEncounterEnabled() &&
            !this.isMoveRouteForcing() &&
            !this.isDebugThrough()
        );
    };

    /**
     * フィールドの戦闘背景1
     *
     * @returns {} 
     */
    const _Sprite_Battleback_overworldBattleback1Name = Sprite_Battleback.prototype.overworldBattleback1Name;
    Sprite_Battleback.prototype.overworldBattleback1Name = function() {
        if ($gamePlayer.isInAirship()) {
            return AirShipBattleback1Name;
        } else {
            return _Sprite_Battleback_overworldBattleback1Name.apply(this, arguments);
        }
    };

    /**
     * フィールドの戦闘背景2
     *
     * @returns {} 
     */
    const _Sprite_Battleback_overworldBattleback2Name = Sprite_Battleback.prototype.overworldBattleback2Name;
    Sprite_Battleback.prototype.overworldBattleback2Name = function() {
        if ($gamePlayer.isInAirship()) {
            return AirShipBattleback2Name;
        } else {
            return _Sprite_Battleback_overworldBattleback2Name.apply(this, arguments);
        }
    };

    /**
     * エンカウント判定
     *
     * @param {} encounter - エンカウント設定
     */
    const _Game_Player_meetsEncounterConditions = Game_Player.prototype.meetsEncounterConditions;
    Game_Player.prototype.meetsEncounterConditions = function(encounter) {
        if (this.isInAirship()) {
            return encounter.regionSet.includes(Region);
        } else {
            return _Game_Player_meetsEncounterConditions.apply(this, arguments);
        }
    };
})();
