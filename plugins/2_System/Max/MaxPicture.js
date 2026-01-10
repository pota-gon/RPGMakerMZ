/*:
@plugindesc
ピクチャの最大数変更 Ver1.0.2(2025/2/17)

@url https://raw.githubusercontent.com/pota-gon/RPGMakerMZ/refs/heads/main/plugins/2_System/Max/MaxPicture.js
@target MZ
@author ポテトードラゴン

・アップデート情報
* Ver1.0.2: MZの1.9.0アップデートで、上限が500までになったので、デフォルト値やヘルプを501番に変更
* Ver1.0.1
- ヘルプ修正
- 他プラグイン導入時の convertBool が無条件で true を返すバグ修正

Copyright (c) 2026 ポテトードラゴン
Released under the MIT License.
https://opensource.org/license/mit

@help
## 概要
ピクチャの最大数を変更し
501番以上のピクチャを操作できるプラグインコマンドを提供します

## 使い方
パラメータを変更し、ピクチャの最大数を変更してください  
導入時は、 1000 となっています  
※ 最大数をあまり増やしすぎるとフリーズするので  
   変更できるのは、 9999 までとしています

プラグインコマンドから 101番 以上のピクチャを操作することができます  

@param MaxPicture
@type number
@text ピクチャの最大数
@desc ピクチャの最大数を 0 ～ 9999 で指定します
@default 1000
@min 0
@max 9999

@command show_picture
@text ピクチャの表示
@desc イベントコマンドからのピクチャ番号以上の操作を可能にします

    @arg pictureId
    @type number
    @text ピクチャ番号
    @desc ピクチャの番号を 1 ～ 9999 で指定します
    @default 501
    @min 1
    @max 9999

        @arg name
        @parent pictureId
        @type file
        @dir img/pictures
        @text ピクチャ画像
        @desc ピクチャの画像を指定します

    @arg origin
    @type select
    @text 原点
    @desc 位置の原点を指定します
    @default 0
    @option 左上
    @value 0
    @option 中央
    @value 1

        @arg x
        @parent origin
        @type number
        @text X 座標(直接指定)
        @desc 位置のX座標を -9999 ～ 9999 で指定します
        @default 0
        @min -9999
        @max 9999

        @arg y
        @parent origin
        @type number
        @text Y 座標(直接指定)
        @desc 位置のY座標を -9999 ～ 9999 で指定します
        @default 0
        @min -9999
        @max 9999

        @arg var_x
        @parent origin
        @type variable
        @text X 座標(変数で指定)
        @desc 位置のX座標を変数で指定します
              0 を指定した場合は、直接指定の座標を使用します
        @default 0

        @arg var_y
        @parent origin
        @type variable
        @text Y 座標(変数で指定)
        @desc 位置のY座標を変数で指定します
              0 を指定した場合は、直接指定の座標を使用します
        @default 0

    @arg scaleX
    @type number
    @text 幅
    @desc 拡大率の幅をを -2000 ～ 2000 ％で指定します
    @default 100
    @min -2000
    @max 2000

    @arg scaleY
    @type number
    @text 高さ
    @desc 拡大率の高さをを -2000 ～ 2000 ％で指定します
    @default 100
    @min -2000
    @max 2000

    @arg opacity
    @type number
    @text 不透明度
    @desc 合成の不透明度を 0 ～ 255 で指定します
    @default 255
    @min 0
    @max 255

        @arg blendMode
        @parent opacity
        @type select
        @text 合成方法
        @desc 合成方法を指定します
        @default 0
        @option 通常
        @value 0
        @option 加算
        @value 1
        @option 乗算
        @value 2
        @option スクリーン
        @value 3

@command move_picture
@text ピクチャの移動
@desc イベントコマンドからのピクチャ番号以上の操作を可能にします

    @arg pictureId
    @type number
    @text ピクチャ番号
    @desc ピクチャの番号を 1 ～ 9999 で指定します
    @default 501
    @min 1
    @max 9999

    @arg easingType
    @type select
    @text イージングタイプ
    @desc イージングタイプを指定します
    @default 0
    @option 一定速度
    @value 0
    @option ゆっくり始まる
    @value 1
    @option ゆっくり終わる
    @value 2
    @option ゆっくり始まってゆっくり終わる
    @value 3

    @arg origin
    @type select
    @text 原点
    @desc 位置の原点を指定します
    @default 0
    @option 左上
    @value 0
    @option 中央
    @value 1

        @arg x
        @parent origin
        @type number
        @text X 座標(直接指定)
        @desc 位置のX座標を -9999 ～ 9999 で指定します
        @default 0
        @min -9999
        @max 9999

        @arg y
        @parent origin
        @type number
        @text Y 座標(直接指定)
        @desc 位置のY座標を -9999 ～ 9999 で指定します
        @default 0
        @min -9999
        @max 9999

        @arg var_x
        @parent origin
        @type variable
        @text X 座標(変数で指定)
        @desc 位置のX座標を変数で指定します
              0 を指定した場合は、直接指定の座標を使用します
        @default 0

        @arg var_y
        @parent origin
        @type variable
        @text Y 座標(変数で指定)
        @desc 位置のY座標を変数で指定します
              0 を指定した場合は、直接指定の座標を使用します
        @default 0

    @arg scaleX
    @type number
    @text 幅
    @desc 拡大率の幅を -2000 ～ 2000 ％で指定します
    @default 100
    @min -2000
    @max 2000

    @arg scaleY
    @type number
    @text 高さ
    @desc 拡大率の高さを -2000 ～ 2000 ％で指定します
    @default 100
    @min -2000
    @max 2000

    @arg opacity
    @type number
    @text 不透明度
    @desc 合成の不透明度を 0 ～ 255 で指定します
    @default 255
    @min 0
    @max 255

        @arg blendMode
        @parent opacity
        @type select
        @text 合成方法
        @desc 合成方法を指定します
        @default 0
        @option 通常
        @value 0
        @option 加算
        @value 1
        @option 乗算
        @value 2
        @option スクリーン
        @value 3

    @arg duration
    @type number
    @text フレーム(1/60秒)
    @desc 移動時間を 1 ～ 999 フレーム(1/60秒) で指定します
    @default 60
    @min 1
    @max 999

    @arg wait
    @parent duration
    @type boolean
    @text 完了までウェイト
    @desc 完了までウェイトするか
    @on ウェイトする
    @off ウェイトしない
    @default true

@command rotate_picture
@text ピクチャの回転
@desc イベントコマンドからのピクチャ番号以上の操作を可能にします

    @arg pictureId
    @type number
    @text ピクチャ番号
    @desc ピクチャの番号を 1 ～ 9999 で指定します
    @default 501
    @min 1
    @max 9999

    @arg speed
    @type number
    @text 回転の速度
    @desc 回転の速度を -90 ～ 90 で指定します
    @default 0
    @min -90
    @max 90

@command tint_picture
@text ピクチャの色調変更
@desc イベントコマンドからのピクチャ番号以上の操作を可能にします

    @arg pictureId
    @type number
    @text ピクチャ番号
    @desc ピクチャの番号を 1 ～ 9999 で指定します
    @default 501
    @min 1
    @max 9999

    @arg toneType
    @type select
    @text 色調
    @desc 色調の種類を指定します
    通常の場合、後続の色設定で指定した値を使用します
    @default 通常
    @option 通常
    @option ダーク
    @option セピア
    @option 夕暮れ
    @option 夜

        @arg red
        @parent toneType
        @type number
        @text 赤
        @desc 色調の赤を -255 ～ 255 で指定します
        @default 0
        @min -255
        @max 255

        @arg green
        @parent toneType
        @type number
        @text 緑
        @desc 色調の緑を -255 ～ 255 で指定します
        @default 0
        @min -255
        @max 255

        @arg blue
        @parent toneType
        @type number
        @text 青
        @desc 色調の青を -255 ～ 255 で指定します
        @default 0
        @min -255
        @max 255

        @arg gray
        @parent toneType
        @type number
        @text グレー
        @desc 色調のグレーを 0 ～ 255 で指定します
        @default 0
        @min 0
        @max 255

    @arg duration
    @type number
    @text フレーム(1/60秒)
    @desc 移動時間を 1 ～ 999 フレーム(1/60秒) で指定します
    @default 60
    @min 1
    @max 999

        @arg wait
        @parent duration
        @type boolean
        @text 完了までウェイト
        @desc 完了までウェイトするか
        @on ウェイトする
        @off ウェイトしない
        @default true

@command erase_picture
@text ピクチャの消去
@desc イベントコマンドからのピクチャ番号以上の操作を可能にします

    @arg pictureId
    @type number
    @text ピクチャ番号
    @desc ピクチャの番号を 1 ～ 9999 で指定します
    @default 501
    @min 1
    @max 9999
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

    // パラメータ用変数
    const plugin_name = Potadra_getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MaxPicture = Number(params.MaxPicture || 1000);

    // プラグインコマンド(ピクチャの表示)
    PluginManager.registerCommand(plugin_name, "show_picture", args => {
        const pictureId = Number(args.pictureId || 501);
        const name = String(args.name);
        const origin = Number(args.origin || 0);
        const x = Number(args.x || 0);
        const y = Number(args.y || 0);
        const var_x = Number(args.var_x || 0);
        const var_y = Number(args.var_y || 0);
        const point = picturePoint(x, y, var_x, var_y);
        const scaleX = Number(args.scaleX || 100);
        const scaleY = Number(args.scaleY || 100);
        const opacity = Number(args.opacity || 255);
        const blendMode = Number(args.blendMode || 0);

        $gameScreen.showPicture(pictureId, name, origin, point.x, point.y, scaleX, scaleY, opacity, blendMode);
    });

    // プラグインコマンド(ピクチャの移動)
    PluginManager.registerCommand(plugin_name, "move_picture", function(args) {
        const pictureId = Number(args.pictureId || 501);
        const easingType = Number(args.easingType || 0);
        const origin = Number(args.origin || 0);
        const x = Number(args.x || 0);
        const y = Number(args.y || 0);
        const var_x = Number(args.var_x || 0);
        const var_y = Number(args.var_y || 0);
        const point = picturePoint(x, y, var_x, var_y);
        const scaleX = Number(args.scaleX || 100);
        const scaleY = Number(args.scaleY || 100);
        const opacity = Number(args.opacity || 255);
        const blendMode = Number(args.blendMode || 0);
        const duration = Number(args.duration || 60);
        const wait = Potadra_convertBool(args.wait);

        $gameScreen.movePicture(pictureId, origin, point.x, point.y, scaleX, scaleY, opacity, blendMode, duration, easingType);
        if (wait) this.wait(duration);
    });

    function picturePoint(x, y, var_x, var_y) {
        const point = new Point();
        point.x = var_x === 0 ? x : $gameVariables.value(var_x);
        point.y = var_y === 0 ? y : $gameVariables.value(var_y);
        return point;
    }

    // プラグインコマンド(ピクチャの回転)
    PluginManager.registerCommand(plugin_name, "rotate_picture", function(args) {
        const pictureId = Number(args.pictureId || 501);
        const speed = Number(args.speed || 0);
        this.command233([pictureId, speed]);
    });

    // プラグインコマンド(ピクチャの色調変更)
    PluginManager.registerCommand(plugin_name, "tint_picture", function(args) {
        const pictureId = Number(args.pictureId || 501);
        const toneType = String(args.toneType || '通常');
        let tone = [0, 0, 0, 0];
        switch (toneType) {
            case '通常':
                const red   = Number(args.red || 0);
                const green = Number(args.green || 0);
                const blue  = Number(args.blue || 0);
                const gray  = Number(args.gray || 0);
                tone = [red, green, blue, gray];
                break;
            case 'ダーク':
                tone = [-68, -68, -68, 0];
                break;
            case 'セピア':
                tone = [34, -34, -68, 170];
                break;
            case '夕暮れ':
                tone = [68, -34, -34, 0];
                break;
            case '夜':
                tone = [-68, -68, 0, 68];
                break;
        }
        const duration = Number(args.duration || 60);
        const wait = Potadra_convertBool(args.wait);
        this.command234([pictureId, tone, duration, wait]);
    });

    // プラグインコマンド(ピクチャの消去)
    PluginManager.registerCommand(plugin_name, "erase_picture", function(args) {
        const pictureId = Number(args.pictureId || 501);
        this.command235([pictureId]);
    });

    /**
     * ピクチャの最大数
     *
     * @returns {} 
     */
    Game_Screen.prototype.maxPictures = function() {
        return MaxPicture;
    };
})();
