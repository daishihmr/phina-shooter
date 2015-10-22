var DEBUG = true;

var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT = 320;
// var SCREEN_WIDTH = 720;
// var SCREEN_HEIGHT = 480;
// var SCREEN_WIDTH = 960;
// var SCREEN_HEIGHT = 640;

var GAMEAREA_WIDTH = SCREEN_HEIGHT * 0.7;
var GAMEAREA_HEIGHT = SCREEN_HEIGHT;

var SIDEBAR_WIDTH = (SCREEN_WIDTH - GAMEAREA_WIDTH) * 0.5;
var SIDEBAR_HEIGHT = SCREEN_HEIGHT;

var FONT_SIZE_XL = ~~(0.07 * SCREEN_WIDTH);
var FONT_SIZE_L = ~~(0.03 * SCREEN_WIDTH);
var FONT_SIZE_M = ~~(0.02 * SCREEN_WIDTH);
var FONT_SIZE_S = ~~(0.01 * SCREEN_WIDTH);

phina.input.Keyboard.KEY_CODE["shot"] = phina.input.Keyboard.KEY_CODE["z"];
phina.input.Keyboard.KEY_CODE["bomb"] = phina.input.Keyboard.KEY_CODE["x"];
phina.input.Keyboard.KEY_CODE["start"] = phina.input.Keyboard.KEY_CODE["space"];

phina.input.Gamepad.BUTTON_CODE["shot"] = phina.input.Gamepad.BUTTON_CODE["x"];
phina.input.Gamepad.BUTTON_CODE["bomb"] = phina.input.Gamepad.BUTTON_CODE["a"];

phina.main(function() {
  ps.Color.initialize();

  var app = ps.Application();
  app.run();

  if (DEBUG) app.enableStats();
});

phina.namespace(function() {

  phina.define("ps.Application", {
    superClass: "phina.display.CanvasApp",

    init: function() {
      this.superInit({
        query: "#app",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      this.fps = 60;
      this.canvas.context.imageSmoothingEnabled = true;
      this.domElement.style.imageRendering = "pixelated";

      this.replaceScene(ps.MainSequence());

      this.gamepads = phina.input.GamepadManager();
    },

    update: function() {
      // this.mouse.update();
      // this.touch.update();
      // this.touchList.update();
      this.keyboard.update();
      this.gamepads.update();
      
      ps.SoundManager.update(this);
    },

  });

});

phina.namespace(function() {

  phina.define("ps.Assets", {
    _static: {
      get: function(name) {
        switch (name) {

          case "common":
            return {
              image: {
                player: "asset/player.png",
                bullet: "asset/bullets.png",
                bomb: "asset/bomb.png",

                zanki: "asset/zankiIcon.png",
                bombIcon: "asset/bombIcon.png",
              },

              font: {
                title: "asset/Black_Ops_One/BlackOpsOne-Regular.ttf",
                main: "asset/Press_Start_2P/PressStart2P-Regular.ttf",
                // mono: "asset/VT323/VT323-Regular.ttf",
                mono: "asset/Share_Tech_Mono/ShareTechMono-Regular.ttf",
              },
              
              sound: {
                shot: "asset/sen_ge_kijuu01.mp3"
              },
            };

          case "stage0":
            return {
              image: {
                enemy_stage0: "asset/enemy_stage0.png",
              },
              sound: {
                bgm: "asset/ReBoot_FreeBGM.mp3",
              },
            };

          case "stage1":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

          case "stage2":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

          case "stage3":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

          case "stage4":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

        }
      }
    }
  })
});

phina.namespace(function() {

  ps.danmaku = ps.danmaku || {};

  var action = bulletml.dsl.action;
  var actionRef = bulletml.dsl.actionRef;
  var bullet = bulletml.dsl.bullet;
  var bulletRef = bulletml.dsl.bulletRef;
  var fire = bulletml.dsl.fire;
  var fireRef = bulletml.dsl.fireRef;
  var changeDirection = bulletml.dsl.changeDirection;
  var changeSpeed = bulletml.dsl.changeSpeed;
  var accel = bulletml.dsl.accel;
  var wait = bulletml.dsl.wait;
  var vanish = bulletml.dsl.vanish;
  var repeat = bulletml.dsl.repeat;
  var bindVar = bulletml.dsl.bindVar;
  var notify = bulletml.dsl.notify;
  var direction = bulletml.dsl.direction;
  var speed = bulletml.dsl.speed;
  var horizontal = bulletml.dsl.horizontal;
  var vertical = bulletml.dsl.vertical;
  var fireOption = bulletml.dsl.fireOption;
  var offsetX = bulletml.dsl.offsetX;
  var offsetY = bulletml.dsl.offsetY;
  var autonomy = bulletml.dsl.autonomy;

  var interval = function(v) {
    return wait("{0} * (0.3 + (1.0 - $densityRank) * 0.7)".format(v));
  };
  var spd = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v));
  };
  var spdSeq = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v), "sequence");
  };

  var R0 = bullet({
    type: 4
  });
  var R1 = bullet({
    type: 5
  });
  var R2 = bullet({
    type: 6
  });
  var R3 = bullet({
    type: 7
  });
  var B4 = bullet({
    type: 8
  });
  var B5 = bullet({
    type: 9
  });
  var R4 = bullet({
    type: 10
  });
  var R5 = bullet({
    type: 11
  });
  var DM = bullet({
    dummy: true
  });

  // ザコヘリ用
  var basic = function(s, dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          fire(DM, spd(s), direction(dir)),
          repeat("$burst + 1", [
            fire(R2, spdSeq(0.15), direction(0, "sequence")),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.basic = basic(1, 0);
  ps.danmaku.basicR1 = basic(1, -5);
  ps.danmaku.basicL1 = basic(1, +5);
  ps.danmaku.basicR2 = basic(1, -15);
  ps.danmaku.basicL2 = basic(1, +15);
  ps.danmaku.basicF = basic(1.2, 0);
  ps.danmaku.basicFR1 = basic(1.2, -5);
  ps.danmaku.basicFL1 = basic(1.2, +5);
  ps.danmaku.basicFR2 = basic(1.2, -15);
  ps.danmaku.basicFL2 = basic(1.2, +15);

  // ザコヘリ3way
  var basic3way = function(dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          fire(DM, spd(1), direction(dir - 7)),
          repeat("$burst + 1", [
            fire(R2, spdSeq(0), direction(0, "sequence")),
            fire(R2, spdSeq(0), direction(7, "sequence")),
            fire(R2, spdSeq(0), direction(7, "sequence")),
            fire(DM, spdSeq(0.05), direction(-14, "sequence")),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.basic3way = basic3way(0);
  ps.danmaku.basic3wayR1 = basic3way(-5);
  ps.danmaku.basic3wayL1 = basic3way(+5);
  ps.danmaku.basic3wayR2 = basic3way(-15);
  ps.danmaku.basic3wayL2 = basic3way(+15);

  // ザコ戦車用
  var forward = function(s, dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          repeat(3, [
            fire(DM, spd(s), direction(dir, "relative")),
            repeat("$burst + 1", [
              fire(R2, spdSeq(0.15), direction(0, "sequence")),
            ]),
            interval(10),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.forward = forward(1, 0);
  ps.danmaku.forwardR1 = forward(1, -5);
  ps.danmaku.forwardL1 = forward(1, +5);
  ps.danmaku.forwardR2 = forward(1, -15);
  ps.danmaku.forwardL2 = forward(1, +15);
  ps.danmaku.forwardF = forward(1.2, 0);
  ps.danmaku.forwardFR1 = forward(1.2, -5);
  ps.danmaku.forwardFL1 = forward(1.2, +5);
  ps.danmaku.forwardFR2 = forward(1.2, -15);
  ps.danmaku.forwardFL2 = forward(1.2, +15);

  // ザコ戦車3way
  var forward3way = function(s, dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          repeat(3, [
            fire(DM, spd(s), direction(dir + "-5", "relative")),
            repeat("$burst + 1", [
              fire(R2, spdSeq(0), direction(+5, "sequence")),
              fire(R2, spdSeq(0), direction(+5, "sequence")),
              fire(R2, spdSeq(0), direction(+5, "sequence")),
              fire(DM, spdSeq(0.15), direction(-15, "sequence")),
            ]),
            interval(10),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.forward3way = forward3way(1, 0);
  ps.danmaku.forward3wayR1 = forward3way(1, -5);
  ps.danmaku.forward3wayL1 = forward3way(1, +5);
  ps.danmaku.forward3wayR2 = forward3way(1, -15);
  ps.danmaku.forward3wayL2 = forward3way(1, +15);
  ps.danmaku.forward3wayF = forward3way(1.2, 0);
  ps.danmaku.forward3wayFR1 = forward3way(1.2, -5);
  ps.danmaku.forward3wayFL1 = forward3way(1.2, +5);
  ps.danmaku.forward3wayFR2 = forward3way(1.2, -15);
  ps.danmaku.forward3wayFL2 = forward3way(1.2, +15);

});

phina.namespace(function() {
  
  ps.danmaku = ps.danmaku || {};

  var action = bulletml.dsl.action;
  var actionRef = bulletml.dsl.actionRef;
  var bullet = bulletml.dsl.bullet;
  var bulletRef = bulletml.dsl.bulletRef;
  var fire = bulletml.dsl.fire;
  var fireRef = bulletml.dsl.fireRef;
  var changeDirection = bulletml.dsl.changeDirection;
  var changeSpeed = bulletml.dsl.changeSpeed;
  var accel = bulletml.dsl.accel;
  var wait = bulletml.dsl.wait;
  var vanish = bulletml.dsl.vanish;
  var repeat = bulletml.dsl.repeat;
  var bindVar = bulletml.dsl.bindVar;
  var notify = bulletml.dsl.notify;
  var direction = bulletml.dsl.direction;
  var speed = bulletml.dsl.speed;
  var horizontal = bulletml.dsl.horizontal;
  var vertical = bulletml.dsl.vertical;
  var fireOption = bulletml.dsl.fireOption;
  var offsetX = bulletml.dsl.offsetX;
  var offsetY = bulletml.dsl.offsetY;
  var autonomy = bulletml.dsl.autonomy;

  var interval = function(v) {
    return wait("{0} * (0.3 + (1.0 - $densityRank) * 0.7)".format(v));
  };
  var spd = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v));
  };
  var spdSeq = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v), "sequence");
  };

  var R0 = bullet({
    type: 4
  });
  var R1 = bullet({
    type: 5
  });
  var R2 = bullet({
    type: 6
  });
  var R3 = bullet({
    type: 7
  });
  var B4 = bullet({
    type: 8
  });
  var B5 = bullet({
    type: 9
  });
  var R4 = bullet({
    type: 10
  });
  var R5 = bullet({
    type: 11
  });
  var DM = bullet({
    dummy: true
  });

  // 黒川
  ps.danmaku.kurokawa1 = new bulletml.Root({
    top: action([
      interval(20),
      repeat(Infinity, [
        repeat(3, [
          fire(DM, spd(1.2)),
          repeat(3, [
            fire(R0, spdSeq(0), direction(0, "sequence")),
            wait(6),
          ]),
          interval(12),
        ]),
        interval(50),
      ]),
    ]),
  });

  // 秋元
  ps.danmaku.akimoto1 = new bulletml.Root({
    top0: action([
      repeat(Infinity, [
        interval(20),
        fire(R2, spd(1.0), direction(-30)),
        repeat(8, [
          fire(R2, spdSeq(0), direction(60 / 8, "sequence")),
        ]),
        interval(80),
      ]),
    ]),
    top1: action([
      repeat(Infinity, [
        interval(50),
        fire(R1, spd(1.2), direction(-10)),
        repeat(6, [
          fire(R1, spdSeq(0), direction(20 / 6, "sequence")),
        ]),
        interval(50),
      ]),
    ]),
  });

  // 黄瀬
  ps.danmaku.kise1 = new bulletml.Root({
    top: action([
      interval(20),
      repeat(Infinity, [
        fire(DM, spd(0.6)),
        repeat(5, [
          repeat(9, [
            fire(R4, spdSeq(0.02), direction(360 / (9 - 1), "sequence")),
          ]),
          wait(4),
          fire(DM, direction(7, "sequence"), spd(0.6)),
        ]),
        interval(50),
      ]),
    ]),
  });

  // 雪城1
  ps.danmaku.yukishiro1 = new bulletml.Root({
    top: action([
      wait(120),
      repeat(5, [
        fire(R0),
        wait(30),
      ]),
      notify("end", { next: "yukishiro2" }),
    ]),
  });
  // 雪城2
  ps.danmaku.yukishiro2 = new bulletml.Root({
    top: action([]),
  });
  // 雪城3
  ps.danmaku.yukishiro3 = new bulletml.Root({
    top: action([]),
  });

  // 美墨1-1
  ps.danmaku.misumi11 = new bulletml.Root({
    top: action([]),
  });
  // 美墨1-2
  ps.danmaku.misumi12 = new bulletml.Root({
    top: action([]),
  });
  // 美墨1-3
  ps.danmaku.misumi13 = new bulletml.Root({
    top: action([]),
  });
  // 美墨2-1
  ps.danmaku.misumi21 = new bulletml.Root({
    top: action([]),
  });
  // 美墨2-2
  ps.danmaku.misumi22 = new bulletml.Root({
    top: action([]),
  });
  // 美墨2-3
  ps.danmaku.misumi23 = new bulletml.Root({
    top: action([]),
  });
  // 美墨3-1
  ps.danmaku.misumi31 = new bulletml.Root({
    top: action([]),
  });

});

phina.namespace(function() {
  
  ps.danmaku = ps.danmaku || {};

  var action = bulletml.dsl.action;
  var actionRef = bulletml.dsl.actionRef;
  var bullet = bulletml.dsl.bullet;
  var bulletRef = bulletml.dsl.bulletRef;
  var fire = bulletml.dsl.fire;
  var fireRef = bulletml.dsl.fireRef;
  var changeDirection = bulletml.dsl.changeDirection;
  var changeSpeed = bulletml.dsl.changeSpeed;
  var accel = bulletml.dsl.accel;
  var wait = bulletml.dsl.wait;
  var vanish = bulletml.dsl.vanish;
  var repeat = bulletml.dsl.repeat;
  var bindVar = bulletml.dsl.bindVar;
  var notify = bulletml.dsl.notify;
  var direction = bulletml.dsl.direction;
  var speed = bulletml.dsl.speed;
  var horizontal = bulletml.dsl.horizontal;
  var vertical = bulletml.dsl.vertical;
  var fireOption = bulletml.dsl.fireOption;
  var offsetX = bulletml.dsl.offsetX;
  var offsetY = bulletml.dsl.offsetY;
  var autonomy = bulletml.dsl.autonomy;

  var interval = function(v) {
    return wait("{0} * (0.3 + (1.0 - $densityRank) * 0.7)".format(v));
  };
  var spd = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v));
  };
  var spdSeq = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v), "sequence");
  };

  var R0 = bullet({
    type: 4
  });
  var R1 = bullet({
    type: 5
  });
  var R2 = bullet({
    type: 6
  });
  var R3 = bullet({
    type: 7
  });
  var B4 = bullet({
    type: 8
  });
  var B5 = bullet({
    type: 9
  });
  var R4 = bullet({
    type: 10
  });
  var R5 = bullet({
    type: 11
  });
  var DM = bullet({
    dummy: true
  });

});

phina.namespace(function() {
  
  ps.danmaku = ps.danmaku || {};

  var action = bulletml.dsl.action;
  var actionRef = bulletml.dsl.actionRef;
  var bullet = bulletml.dsl.bullet;
  var bulletRef = bulletml.dsl.bulletRef;
  var fire = bulletml.dsl.fire;
  var fireRef = bulletml.dsl.fireRef;
  var changeDirection = bulletml.dsl.changeDirection;
  var changeSpeed = bulletml.dsl.changeSpeed;
  var accel = bulletml.dsl.accel;
  var wait = bulletml.dsl.wait;
  var vanish = bulletml.dsl.vanish;
  var repeat = bulletml.dsl.repeat;
  var bindVar = bulletml.dsl.bindVar;
  var notify = bulletml.dsl.notify;
  var direction = bulletml.dsl.direction;
  var speed = bulletml.dsl.speed;
  var horizontal = bulletml.dsl.horizontal;
  var vertical = bulletml.dsl.vertical;
  var fireOption = bulletml.dsl.fireOption;
  var offsetX = bulletml.dsl.offsetX;
  var offsetY = bulletml.dsl.offsetY;
  var autonomy = bulletml.dsl.autonomy;

  var interval = function(v) {
    return wait("{0} * (0.3 + (1.0 - $densityRank) * 0.7)".format(v));
  };
  var spd = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v));
  };
  var spdSeq = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v), "sequence");
  };

  var R0 = bullet({
    type: 4
  });
  var R1 = bullet({
    type: 5
  });
  var R2 = bullet({
    type: 6
  });
  var R3 = bullet({
    type: 7
  });
  var B4 = bullet({
    type: 8
  });
  var B5 = bullet({
    type: 9
  });
  var R4 = bullet({
    type: 10
  });
  var R5 = bullet({
    type: 11
  });
  var DM = bullet({
    dummy: true
  });

});

phina.namespace(function() {
  
  ps.danmaku = ps.danmaku || {};

  var action = bulletml.dsl.action;
  var actionRef = bulletml.dsl.actionRef;
  var bullet = bulletml.dsl.bullet;
  var bulletRef = bulletml.dsl.bulletRef;
  var fire = bulletml.dsl.fire;
  var fireRef = bulletml.dsl.fireRef;
  var changeDirection = bulletml.dsl.changeDirection;
  var changeSpeed = bulletml.dsl.changeSpeed;
  var accel = bulletml.dsl.accel;
  var wait = bulletml.dsl.wait;
  var vanish = bulletml.dsl.vanish;
  var repeat = bulletml.dsl.repeat;
  var bindVar = bulletml.dsl.bindVar;
  var notify = bulletml.dsl.notify;
  var direction = bulletml.dsl.direction;
  var speed = bulletml.dsl.speed;
  var horizontal = bulletml.dsl.horizontal;
  var vertical = bulletml.dsl.vertical;
  var fireOption = bulletml.dsl.fireOption;
  var offsetX = bulletml.dsl.offsetX;
  var offsetY = bulletml.dsl.offsetY;
  var autonomy = bulletml.dsl.autonomy;

  var interval = function(v) {
    return wait("{0} * (0.3 + (1.0 - $densityRank) * 0.7)".format(v));
  };
  var spd = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v));
  };
  var spdSeq = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v), "sequence");
  };

  var R0 = bullet({
    type: 4
  });
  var R1 = bullet({
    type: 5
  });
  var R2 = bullet({
    type: 6
  });
  var R3 = bullet({
    type: 7
  });
  var B4 = bullet({
    type: 8
  });
  var B5 = bullet({
    type: 9
  });
  var R4 = bullet({
    type: 10
  });
  var R5 = bullet({
    type: 11
  });
  var DM = bullet({
    dummy: true
  });

});

phina.namespace(function() {
  
  ps.danmaku = ps.danmaku || {};

  var action = bulletml.dsl.action;
  var actionRef = bulletml.dsl.actionRef;
  var bullet = bulletml.dsl.bullet;
  var bulletRef = bulletml.dsl.bulletRef;
  var fire = bulletml.dsl.fire;
  var fireRef = bulletml.dsl.fireRef;
  var changeDirection = bulletml.dsl.changeDirection;
  var changeSpeed = bulletml.dsl.changeSpeed;
  var accel = bulletml.dsl.accel;
  var wait = bulletml.dsl.wait;
  var vanish = bulletml.dsl.vanish;
  var repeat = bulletml.dsl.repeat;
  var bindVar = bulletml.dsl.bindVar;
  var notify = bulletml.dsl.notify;
  var direction = bulletml.dsl.direction;
  var speed = bulletml.dsl.speed;
  var horizontal = bulletml.dsl.horizontal;
  var vertical = bulletml.dsl.vertical;
  var fireOption = bulletml.dsl.fireOption;
  var offsetX = bulletml.dsl.offsetX;
  var offsetY = bulletml.dsl.offsetY;
  var autonomy = bulletml.dsl.autonomy;

  var interval = function(v) {
    return wait("{0} * (0.3 + (1.0 - $densityRank) * 0.7)".format(v));
  };
  var spd = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v));
  };
  var spdSeq = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v), "sequence");
  };

  var R0 = bullet({
    type: 4
  });
  var R1 = bullet({
    type: 5
  });
  var R2 = bullet({
    type: 6
  });
  var R3 = bullet({
    type: 7
  });
  var B4 = bullet({
    type: 8
  });
  var B5 = bullet({
    type: 9
  });
  var R4 = bullet({
    type: 10
  });
  var R5 = bullet({
    type: 11
  });
  var DM = bullet({
    dummy: true
  });

});

phina.namespace(function() {

  phina.define("ps.BombDisplay", {
    superClass: "ps.ItemDisplay",

    init: function(initialValue) {
      this.superInit("bombIcon", initialValue);
    },

  });
});

phina.namespace(function() {

  phina.define("ps.Bullet", {
    superClass: "ps.OutlinedSprite",

    runner: null,

    init: function() {
      this.superInit("bullet", 24, 24);
      this.age = 0;
      this.boundingType = "circle";
      this.radius = 2;
    },

    onremoved: function() {
      this.bulletLayer.pool.push(this);
    },

    update: function(app) {
      var runner = this.runner;
      if (runner) {
        var bx = this.x;
        var by = this.y;
        runner.x = bx;
        runner.y = by;
        runner.update();
        var dx = runner.x - bx;
        var dy = runner.y - by;

        this.x += dx * ps.Bullet.globalSpeedRate;
        this.y += dy * ps.Bullet.globalSpeedRate;

        if (this.x < -12 || GAMEAREA_WIDTH + 12 < this.x || this.y < -12 || GAMEAREA_HEIGHT + 12 < this.y) {
          this.remove();
          return;
        }

        this.rotation = Math.atan2(this.y - by, this.x - bx) * 180 / Math.PI;

        this.age += 1;
      }
    },

    hitTest: function(_x, _y) {
      if (!this.visible || !this.parent) return false;

      var x = _x - this.x;
      var y = _y - this.y;

      if ((x * x + y * y) < (this.radius * this.radius)) {
        return true;
      }
      return false;
    },

    _static: {
      globalSpeedRate: 1.0,
    },

  });
});

phina.namespace(function() {

  phina.define("ps.Kujo1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 24, 24, params.$safe({
        boundingType: "circle",
        radius: 12,
        danmakuName: "basic",
        hp: 2,
      }));
      this.setSrcRect(32, 0, 24, 24);

      var propeler = ps.OutlinedSprite("enemy_stage0", 32, 32)
        .addChildTo(this)
        .on("enterframe", function() {
          this.rotation += 20;
        })
        .setSrcRect(0, 128, 32, 32);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        })
        .by({
          y: GAMEAREA_HEIGHT * 1.0
        }, 80, "easeOutQuad")
        .wait(120)
        .to({
          y: params.y
        }, 80, "easeInQuad");
    },

    onenterframe: function(e) {
      var app = e.app;
      var player = app.currentScene.player;
      this.rotation = Math.atan2(player.y - this.y, player.x - this.x) * Math.RAD_TO_DEG;
    }
  });

  phina.define("ps.Kiryu1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 24, 24, params.$safe({
        boundingType: "circle",
        radius: 12,
        danmakuName: "basic",
        hp: 2,
      }));
      this.setSrcRect(0, 0, 24, 24);
      
      this.move = phina.geom.Vector2(0, 1);

      var propeler = ps.OutlinedSprite("enemy_stage0", 32, 32)
        .addChildTo(this)
        .on("enterframe", function() {
          this.rotation += 20;
        })
        .setSrcRect(0, 128, 32, 32);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        });
    },

    onenterframe: function(e) {
      var app = e.app;
      var player = app.currentScene.player;
      this.rotation = Math.atan2(player.y - this.y, player.x - this.x) * Math.RAD_TO_DEG;
      if (this.y < player.y) {
        var delta = phina.geom.Vector2(player.x - this.x, player.y - this.y).normalize().mul(0.3);
        this.move.add(delta).normalize().mul(3);
      }
      this.position.add(this.move);
    }
  });

  phina.define("ps.Kise1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 32, 32, params.$safe({
        boundingType: "circle",
        radius: 16,
        danmakuName: "kise1",
        hp: 10,
      }));
      this.setSrcRect(0, 32, 32, 32);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        });
    },
    
    onenterframe: function(e) {
      this.y += 0.25;
    }
  });

  phina.define("ps.Natsuki1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 32, 32, params.$safe({
        boundingType: "circle",
        radius: 16,
        danmakuName: "forward",
        hp: 2,
      }));
      this.setSrcRect(32, 32, 32, 32);

      this.direction = params.direction * Math.DEG_TO_RAD;

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        });
    },

    onenterframe: function(e) {
      var app = e.app;
      this.x += Math.cos(this.direction) * 0.75;
      this.y += Math.sin(this.direction) * 0.75;
      this.rotation = this.direction * Math.RAD_TO_DEG;

      var player = app.currentScene.player;
      var t = Math.atan2(player.y - this.y, player.x - this.x) + Math.PI * 2;
      if (this.runner) this.runner.direction = ~~((t + U225) / U45) * U45;
    }
  });
  
  phina.define("ps.Kurokawa1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 64, 64, params.$safe({
        boundingType: "circle",
        radius: 30,
        danmakuName: "kurokawa1",
        hp: 30,
      }));
      this.setSrcRect(64, 0, 64, 64);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        })
        .by({
          y: GAMEAREA_HEIGHT * 0.3
        }, 40, "easeOutQuad");
    },
    
    onenterframe: function(e) {
      this.y += 0.5;
    }
  });

  phina.define("ps.Akimoto1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 128, 64, params.$safe({
        boundingType: "rect",
        boundingWidth: 90,
        boundingHeight: 30,
        danmakuName: "akimoto1",
        hp: 60,
      }));
      this.setSrcRect(0, 64, 128, 64);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        })
        .by({
          y: GAMEAREA_HEIGHT * 0.3
        }, 40, "easeOutQuad");
    },
    
    onenterframe: function(e) {
      this.y += 0.4;
    }
  });

  phina.define("ps.Yukishiro1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 192, 96, params.$safe({
        boundingType: "rect",
        boundingWidth: 190,
        boundingHeight: 60,
        danmakuName: "yukishiro1",
        hp: 300,
      }));
      this.setSrcRect(128, 0, 192, 96);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        })
        .to({
          y: GAMEAREA_HEIGHT * 0.20
        }, 60, "easeOutQuad")
        .call(function() {
          self.ftweener
            .clear()
            .to({
              x: GAMEAREA_WIDTH * 0.6,
              y: GAMEAREA_HEIGHT * 0.24,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.5,
              y: GAMEAREA_HEIGHT * 0.28,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.4,
              y: GAMEAREA_HEIGHT * 0.24,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.5,
              y: GAMEAREA_HEIGHT * 0.20,
            }, 150, "easeInOutQuad")
            .setLoop(true);
        });
    },
    onbulletend: function(e) {
      this.startAttack(e.next);
    }
  });

  var U45 = Math.PI * 2 / 8;
  var U225 = Math.PI * 2 / 16;
});

phina.namespace(function() {

  phina.define("ps.Enemy", {
    superClass: "ps.OutlinedSprite",

    hp: 0,
    score: 0,

    danmakuName: null,
    runner: null,

    entered: false,

    init: function(texture, width, height, params) {
      this.superInit(texture, width, height);
      this.$extend(params);
    },

    startAttack: function(danmakuName) {
      if (danmakuName) this.danmakuName = danmakuName;
      this.runner = ps.danmaku[this.danmakuName].createRunner(ps.BulletConfig);
      this.on("enterframe", function() {
        this.runner.x = this.position.x;
        this.runner.y = this.position.y;
        this.runner.update();
        this.runner.onNotify = function(eventType, event) {
          this.flare("bullet" + eventType, event);
        }.bind(this);
      });
    },

    hitTestRect: function(_x, _y) {
      var x = _x - this.position.x;
      var y = _y - this.position.y;

      var left = -this.boundingWidth * this.originX;
      var right = +this.boundingWidth * (1 - this.originX);
      var top = -this.boundingHeight * this.originY;
      var bottom = +this.boundingHeight * (1 - this.originY);

      return (left < x && x < right) && (top < y && y < bottom);
    },

    hitTestCircle: function(_x, _y) {
      var x = _x - this.position.x;
      var y = _y - this.position.y;

      if ((x * x + y * y) < (this.radius * this.radius)) {
        return true;
      }
      return false;
    },

    update: function() {
      if (!this.entered) {
        this.entered = (-this.width * this.originX) < this.x &&
          this.x < (GAMEAREA_WIDTH + this.width * this.originX) &&
          (-this.height * this.originY) < this.y &&
          this.y < (GAMEAREA_HEIGHT + this.height * this.originY);
      }

      if (this.entered) {
        if (this.x < (-this.width * this.originX) ||
          (GAMEAREA_WIDTH + this.width * this.originX) < this.x ||
          this.y < (-this.height * this.originY) ||
          (GAMEAREA_HEIGHT + this.height * this.originY) < this.y) {
          this.remove();
          return;
        }
      }
    },

    damage: function(power) {
      if (!this.entered) return false;
      this.hp -= power;
      
      this.flare("killed");
      
      return this.hp < 0;
    },

  });

});

phina.namespace(function() {

  phina.define("ps.EnemyUnit", {
    init: function() {},
    _static: {
      formation: {

        "basic0": [{
          x: GAMEAREA_WIDTH * -0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.05,
          y: GAMEAREA_HEIGHT * -0.1,
          wait: 20,
        }, ],

        "basic1": [{
          x: GAMEAREA_WIDTH * -0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 30,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.15,
          y: GAMEAREA_HEIGHT * -0.1,
          wait: 20,
        }, ],

        "basic2": [{
          x: GAMEAREA_WIDTH * -0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 50,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * -0.1,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.05,
          y: GAMEAREA_HEIGHT * -0.1,
          wait: 20,
        }, ],

        "line4": [{
          x: 40 * -0,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * -1,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * -2,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * -3,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * -4,
          y: 40 * +0,
          wait: 0,
        }, ],

        "line6": [{
          x: 40 * +0,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * +1,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * +2,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * +3,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * +4,
          y: 40 * +0,
          wait: 0,
        }, ],

        "line7": [{
          x: 40 * -0,
          y: 40 * -0,
          wait: 0,
        }, {
          x: 40 * -1,
          y: 40 * -1,
          wait: 0,
        }, {
          x: 40 * -2,
          y: 40 * -2,
          wait: 0,
        }, {
          x: 40 * -3,
          y: 40 * -3,
          wait: 0,
        }, {
          x: 40 * -4,
          y: 40 * -4,
          wait: 0,
        }, ],

        "line8": [{
          x: 0,
          y: 40 * -0,
          wait: 0,
        }, {
          x: 0,
          y: 40 * -1,
          wait: 0,
        }, {
          x: 0,
          y: 40 * -2,
          wait: 0,
        }, {
          x: 0,
          y: 40 * -3,
          wait: 0,
        }, {
          x: 0,
          y: 40 * -4,
          wait: 0,
        }, ],

        "line9": [{
          x: 40 * +0,
          y: 40 * -0,
          wait: 0,
        }, {
          x: 40 * +1,
          y: 40 * -1,
          wait: 0,
        }, {
          x: 40 * +2,
          y: 40 * -2,
          wait: 0,
        }, {
          x: 40 * +3,
          y: 40 * -3,
          wait: 0,
        }, {
          x: 40 * +4,
          y: 40 * -4,
          wait: 0,
        }, ],

      }
    }
  });

});

phina.namespace(function() {

  phina.define("ps.BackgroundLayer", {
    superClass: "phina.display.Layer",

    renderChildBySelf: true,
    skip: false,

    init: function(params) {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);
      this.backgroundColor = params.backgroundColor;

      this.stroke = params.stroke;
      this.fill = params.fill;
      this.lineWidth = 1;

      this.camera = ps.bg.Camera().addChildTo(this);
    },

    update: function(app) {
      this.skip = app.ticker.frame % 3 !== 0;
    },

    render: function() {
      var self = this;
      var cam = this.camera;
      var canvas = this.canvas;
      var w = canvas.canvas.width;
      var h = canvas.canvas.height;

      canvas.clearColor(this.backgroundColor);

      if (self.stroke) {
        canvas.strokeStyle = self.stroke;
        canvas.context.lineWidth = self.lineWidth;
      }
      if (self.fill) {
        canvas.fillStyle = self.fill;
        canvas.fill();
      }

      for (var i = 0, len = this.children.length; i < len; i++) {
        var child = this.children[i];
        if (child instanceof ps.bg.Polygon) {
          var src = child.render(cam);
          var positions = [];
          for (var s = 0, slen = src.length; s < slen; s++) {
            var pos = src[s];
            if (pos[3] < 0) {
              positions = [];
              break;
            } else {
              positions.push(((pos[0] / pos[3]) + 0.5) * w);
              positions.push((-(pos[1] / pos[3]) + 0.5) * h);
            }
          }

          var alpha = Math.clamp(1.0 - src[0][2] * 0.032, 0.0, 1.0);
          if (alpha < 0.01) continue;
          canvas.context.globalAlpha = alpha;

          if (4 <= positions.length) {
            canvas.beginPath();
            canvas.lines.apply(canvas, positions);
            canvas.closePath();
            if (self.stroke) canvas.stroke();
            if (self.fill) canvas.fill();
          } else if (positions.length === 2) {
            canvas.beginPath();
            canvas.rect(positions[0], positions[1], 1, 1);
            canvas.closePath();
            if (self.stroke) canvas.stroke();
            if (self.fill) canvas.fill();
          }
        }
      }

      canvas.context.globalAlpha = 1.0;
    },

    draw: function(canvas) {
      if (!this.skip) this.render();

      var image = this.canvas.domElement;
      canvas.context.drawImage(image,
        0, 0, image.width, image.height, -this.width * this.originX, -this.height * this.originY, this.width, this.height
      );
    },
  });

  phina.define("ps.bg.Camera", {
    superClass: "phina.app.Element",

    init: function() {
      this.superInit();

      this.position = vec3.set(vec3.create(), 5, 3, 50);
      this.target = vec3.set(vec3.create(), 0, 0, 0);
      this.up = vec3.set(vec3.create(), 0, 1, 0);

      this.vMatrix = mat4.create();
      this.pMatrix = mat4.perspective(mat4.create(), 70, GAMEAREA_WIDTH / GAMEAREA_HEIGHT, 0.1, 10000);

      this.vpMatrix = mat4.create();

      this.needsUpdate = true;
    },

    update: function() {
      if (this.needsUpdate) {
        mat4.lookAt(this.vMatrix, this.position, this.target, this.up);
        mat4.mul(this.vpMatrix, this.pMatrix, this.vMatrix);
        this.needsUpdate = false;
      }
    },

    _accessor: {
      x: {
        get: function() {
          return this.position[0];
        },
        set: function(v) {
          this.position[0] = v;
          this.needsUpdate = true;
        }
      },
      y: {
        get: function() {
          return this.position[1];
        },
        set: function(v) {
          this.position[1] = v;
          this.needsUpdate = true;
        }
      },
      z: {
        get: function() {
          return this.position[2];
        },
        set: function(v) {
          this.position[2] = v;
          this.needsUpdate = true;
        }
      },
      targetX: {
        get: function() {
          return this.target[0];
        },
        set: function(v) {
          this.target[0] = v;
          this.needsUpdate = true;
        }
      },
      targetY: {
        get: function() {
          return this.target[1];
        },
        set: function(v) {
          this.target[1] = v;
          this.needsUpdate = true;
        }
      },
      targetZ: {
        get: function() {
          return this.target[2];
        },
        set: function(v) {
          this.target[2] = v;
          this.needsUpdate = true;
        }
      },
      upX: {
        get: function() {
          return this.up[0];
        },
        set: function(v) {
          this.up[0] = v;
          this.needsUpdate = true;
        }
      },
      upY: {
        get: function() {
          return this.up[1];
        },
        set: function(v) {
          this.up[1] = v;
          this.needsUpdate = true;
        }
      },
      upZ: {
        get: function() {
          return this.up[2];
        },
        set: function(v) {
          this.up[2] = v;
          this.needsUpdate = true;
        }
      },
    }
  });

  phina.define("ps.bg.Polygon", {
    superClass: "phina.app.Element",

    init: function(params) {
      this.superInit();

      this.vertices = params.vertices.map(function(vertex) {
        return vec4.set(vec4.create(), vertex[0], vertex[1], vertex[2], 1);
      });

      this.calcPosition = this.vertices.map(function(vertex) {
        return vec4.clone(vertex);
      });

      // this.rotation = quat.create();
      this.translation = vec3.create();
      // this.scale = vec3.set(vec3.create(), 1, 1, 1);

      this.mMatrix = mat4.create();
      this.mvpMatrix = mat4.create();

      this.needsUpdate = true;
    },

    update: function() {
      if (this.needsUpdate) {
        // mat4.fromRotationTranslationScale(this.mMatrix, this.rotation, this.translation, this.scale);
        mat4.fromTranslation(this.mMatrix, this.translation);
        this.needsUpdate = false;
      }
    },

    render: function(camera) {
      var vertices = this.vertices;
      var calcPosition = this.calcPosition;
      var mvp = mat4.mul(this.mvpMatrix, camera.vpMatrix, this.mMatrix);

      for (var i = 0, len = vertices.length; i < len; i++) {
        var vertex = vertices[i];
        vec4.transformMat4(calcPosition[i], vertex, mvp);
      }

      return calcPosition;
    },

    setTranslation: function(x, y, z) {
      this.translation[0] = x;
      this.translation[1] = y;
      this.translation[2] = z;
      return this;
    },

    _accessor: {
      x: {
        get: function() {
          return this.translation[0];
        },
        set: function(v) {
          this.translation[0] = v;
          this.needsUpdate = true;
        }
      },
      y: {
        get: function() {
          return this.translation[1];
        },
        set: function(v) {
          this.translation[1] = v;
          this.needsUpdate = true;
        }
      },
      z: {
        get: function() {
          return this.translation[2];
        },
        set: function(v) {
          this.translation[2] = v;
          this.needsUpdate = true;
        }
      },
    },
  });

});

phina.namespace(function() {

  phina.define("ps.BulletLayer", {
    superClass: "phina.display.CanvasElement",

    pool: null,

    init: function() {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);

      var self = this;
      this.pool = Array.range(0, 256).map(function() {
        var b = ps.Bullet();
        b.bulletLayer = self;
        return b;
      });
    },

    spawn: function(runner, spec) {
      var bullet = this.pool.shift();
      if (!bullet) return;
      
      bullet.x = runner.x;
      bullet.y = runner.y;
      bullet.runner = runner;
      bullet.frameIndex = spec.type || 0;
      bullet.visible = !spec.dummy;
      bullet.addChildTo(this);
    },

    update: function() {
      var bs = this.children.slice(0);
      for (var i = 0, len = bs.length; i < len; i++) {
        var b = bs[i];
        if (b.x < 0 || GAMEAREA_WIDTH < b.x || b.y < 0 || GAMEAREA_HEIGHT < b.y) {
          b.remove();
        }
      }
    },
  });

});

phina.namespace(function() {

  phina.define("ps.EffectLayer", {
    superClass: "phina.display.CanvasElement",

    init: function() {
      this.superInit();
    }
  });

});

phina.namespace(function() {

  phina.define("ps.gamescene.MainLayer", {
    superClass: "phina.display.Layer",

    init: function(params) {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);
      this.backgroundColor = null;

      var self = this;

      this.fromJSON({
        children: {
          backgroundLayer: {
            className: params.stage.backgroundClassName,
          },

          scoreItemLayer: {
            className: "phina.display.CanvasElement",
          },

          deadEnemyLayer: {
            className: "phina.display.CanvasElement",
          },

          effectLayer0: {
            className: "phina.display.CanvasElement",
          },

          enemyLayer: {
            className: "phina.display.CanvasElement",
          },

          shotLayer: {
            className: "ps.ShotLayer",
          },

          player: {
            className: "ps.Player",
            visible: false,
          },

          itemLayer: {
            className: "phina.display.CanvasElement",
          },

          effectLayer1: {
            className: "phina.display.CanvasElement",
            children: {
              playerBurners: {
                className: "phina.display.CanvasElement",
                children: {
                  playerBurnerL: {
                    className: "ps.AfterBurner",
                    onenterframe: function() {
                      this.position.x = self.player.position.x - 4;
                      this.position.y = self.player.position.y + 12;
                    }
                  },
                  playerBurnerR: {
                    className: "ps.AfterBurner",
                    onenterframe: function() {
                      this.position.x = self.player.position.x + 4;
                      this.position.y = self.player.position.y + 12;
                    }
                  }
                }
              }
            },
          },

          bulletLayer: {
            className: "ps.BulletLayer",
          },

          playerMarker: {
            className: "phina.display.CircleShape",
            arguments: {
              radius: 3,
              fill: "hsl(240,100%,90%)",
              stroke: "hsl(240,70%,50%)",
              strokeWidth: 1.3,
            },
            onenterframe: function(e) {
              this.setScale(0.9 + Math.sin(e.app.ticker.frame * 0.3) * 0.1);
              this.position = self.player.position;
            },
          }
        }
      });

      this.player.parts.push(this.effectLayer1.playerBurners.playerBurnerL);
      this.player.parts.push(this.effectLayer1.playerBurners.playerBurnerR);
      this.player.parts.push(this.playerMarker);
    }

  });
});

phina.namespace(function() {

  phina.define("ps.ShotLayer", {
    superClass: "phina.display.CanvasElement",

    pool: null,

    init: function() {
      this.superInit();
      var self = this;
      this.pool = Array.range(0, 28).map(function() {
        var shot = ps.Shot();
        shot.shotLayer = self;
        return shot;
      });
    },

    fireVulcan: function(frameIndex, x, y, direction, power) {
      var shot = this.pool.shift();
      if (shot) {
        shot.setup(frameIndex, x, y, direction, power).addChildTo(this);
      }
    },

  });

});

phina.namespace(function() {

  phina.define("ps.gamescene.SideBarLayer", {
    superClass: "phina.display.Layer",

    skipDraw: false,

    init: function() {
      this.superInit({
        width: SIDEBAR_WIDTH,
        height: SIDEBAR_HEIGHT,
      });
      this.setOrigin(0, 0);
      this.backgroundColor = ps.Color.pri[0];
      this.gridX = phina.util.Grid(SIDEBAR_WIDTH, 16);
      this.gridY = phina.util.Grid(SIDEBAR_HEIGHT, 17);
    },

    bindGameData: function(gameData) {},

    update: function(app) {
      this.skipDraw = app.ticker.frame % 5 !== 0
    },

    draw: function(canvas) {
      if (this.skipDraw) {
        var image = this.canvas.domElement;
        canvas.context.drawImage(image,
          0, 0, image.width, image.height, -this.width * this.originX, -this.height * this.originY, this.width, this.height
        );
      } else {
        phina.display.Layer.prototype.draw.call(this, canvas);
      }
    }

  });

  phina.define("ps.gamescene.LeftSideBar", {
    superClass: "ps.gamescene.SideBarLayer",

    init: function() {
      this.superInit();
      this.fromJSON({
        children: {
          scoreLabel: {
            className: "ps.HudLabel",
            arguments: {
              text: "SCORE",
            },
            x: this.gridX.span(1),
            y: this.gridY.span(1),
          },
          score: {
            className: "ps.ScoreLabel",
            x: this.gridX.span(15),
            y: this.gridY.span(2),
          },

          psycheLabel: {
            className: "ps.HudLabel",
            arguments: {
              text: "PSYCHE",
            },
            x: this.gridX.span(1),
            y: this.gridY.span(3),
          },
          psyche: {
            className: "ps.ScoreLabel",
            x: this.gridX.span(15),
            y: this.gridY.span(4),
          },

          highScoreLabel: {
            className: "ps.HudLabel",
            arguments: {
              text: "HIGH SCORE",
            },
            x: this.gridX.span(1),
            y: this.gridY.span(15),
          },
          highScore: {
            className: "ps.ScoreLabel",
            x: this.gridX.span(15),
            y: this.gridY.span(16),
          },
        }
      });
    },

    bindGameData: function(gameData) {
      gameData.bind("score", this.score);
      gameData.bind("psyche", this.psyche);
      gameData.bind("highScore", this.highScore);
    },

  });

  phina.define("ps.gamescene.RightSideBar", {
    superClass: "ps.gamescene.SideBarLayer",

    init: function() {
      this.superInit();
      this.fromJSON({
        children: {
          zankiLabel: {
            className: "ps.HudLabel",
            arguments: {
              text: "ZANKI",
            },
            x: this.gridX.span(1),
            y: this.gridY.span(1),
          },
          zanki: {
            className: "ps.ZankiDisplay",
            arguments: 3 - 1,
            x: this.gridX.span(15),
            y: this.gridY.span(2),
          },

          bombLabel: {
            className: "ps.HudLabel",
            arguments: {
              text: "BOMB",
            },
            x: this.gridX.span(1),
            y: this.gridY.span(3),
          },
          bomb: {
            className: "ps.BombDisplay",
            arguments: 3,
            x: this.gridX.span(15),
            y: this.gridY.span(4),
          },

          gameTitleLabel: {
            className: "ps.TitleLogoLabel",
            x: this.gridX.center(),
            y: this.gridY.span(16),
          },
        }
      });
    },

    bindGameData: function(gameData) {
      gameData.bind("zanki", this.zanki);
      gameData.bind("bomb", this.bomb);
    },

  });

});

phina.namespace(function() {

  phina.define("ps.HudLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit(options.$safe({
        fill: ps.Color.sec0[14],
        stroke: ps.Color.sec0[6],
        fontSize: FONT_SIZE_M,
        fontFamily: "main",
        align: "left",
        baseline: "middle",
      }));
    },
    
    update: function(app) {
      this.alpha = 1.0;
    },

  });
});

phina.namespace(function() {

  phina.define("ps.ItemDisplay", {
    superClass: "phina.display.CanvasElement",

    init: function(textureName, initialValue) {
      this.superInit();
      this.setOrigin(1, 0.5);
      this.textureName = textureName;

      this._count = initialValue || 0;
      this.updateView();
    },

    updateView: function() {
      var self = this;
      var t = this.textureName;
      var count = this._count;

      if (0 < count - this.children.length) {
        (count - this.children.length).times(function(i) {
          var newItem = phina.display.Sprite(t);
          newItem.setPosition(self.children.length * -newItem.width * 1.02, 0)
            .addChildTo(self);
        });
      }

      this.children.forEach(function(child, i) {
        child.visible = i < count;
      });
    },

    _accessor: {
      value: {
        get: function() {
          return this._count;
        },
        set: function(v) {
          this._count = v;
          this.updateView();
        }
      }
    }

  });
});

phina.namespace(function() {

  phina.define("ps.OutlinedSprite", {
    superClass: "phina.display.Sprite",

    init: function(texture, width, height) {
      this.superInit(texture, width, height);

      var self = this;

      this.outline = phina.display.Sprite(texture + "Outline", width, height).addChildTo(this);
      this.outline.blendMode = "lighter";
      this.outline.update = function(app) {
        this.srcRect = self.srcRect;
        this.alpha = ps.OutlinedSprite.staticAlpha;
      };
    },

    setSrcRect: function(x, y, w, h) {
      this.srcRect.x = x;
      this.srcRect.y = y;
      this.srcRect.width = w;
      this.srcRect.height = h;
      return this;
    },

    _static: {
      staticAlpha: 1.0
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Player", {
    superClass: "ps.OutlinedSprite",

    controllable: false,
    muteki: false,

    roll: 0,

    speed: 3.6,

    shotLayer: null,

    trigger: 0,
    fireFrame: 0,

    parts: null,

    init: function() {
      this.superInit("player", 32, 32);
      this.frameIndex = 4;
      this.x = GAMEAREA_WIDTH * 0.5;
      this.y = GAMEAREA_HEIGHT * 1.2;
      this.controllable = false;
      this.muteki = true;
      this.parts = [];
    },

    update: function(app) {
      if (!this.controllable) return;

      var frame = app.ticker.frame;

      var keyboard = app.keyboard;
      var gamepad = app.gamepads.get(0);
      // var pointer = app.pointer;

      moveVector.set(0, 0);

      moveVector.add(keyboard.getKeyDirection().mul(this.speed));
      if (gamepad) {
        var stick = gamepad.getStickDirection();
        if (0.4 < stick.length()) {
          moveVector.add(stick.normalize().mul(this.speed));
        }
      }
      // if (pointer.getPointing()) {
      //   moveVector.add(pointer.deltaPosition.mul(2));
      // }

      if (moveVector.x) {
        this.roll = Math.clamp(this.roll + moveVector.x * 0.1, -4, 4);
      } else {
        this.roll *= 0.8;
        if (Math.abs(this.roll) < 0.1) {
          this.roll = 0;
        }
      }
      if (this.roll !== 0) {
        var sign = this.roll / Math.abs(this.roll);
        var r = ~~(Math.abs(this.roll)) * sign;
        this.frameIndex = Math.clamp(4 + r, 0, 8);
      }

      var position = this.position;
      position.add(moveVector);
      position.x = Math.clamp(position.x, 4, GAMEAREA_WIDTH - 4);
      position.y = Math.clamp(position.y, 4, GAMEAREA_HEIGHT - 4);

      if (keyboard.getKeyDown("shot") || gamepad.getKeyDown("shot")) {
        this.trigger = 14;
      } else {
        this.trigger -= 1;
      }

      if (0 < this.trigger && frame % 14 === 0) {
        ps.SoundManager.playSound("shot");
      }

      if (0 < this.trigger && frame % 4 === 0) {
        var xv = Math.sin(this.fireFrame * 0.6) * 8;
        var dv = Math.sin(this.fireFrame * 1.0) * 8;
        this.shotLayer.fireVulcan(0, position.x - xv, position.y - 20, -90, 1.0);
        this.shotLayer.fireVulcan(0, position.x + xv, position.y - 20, -90, 1.0);
        this.shotLayer.fireVulcan(2, position.x - 14, position.y - 2, -90 - 12 + dv, 0.5);
        this.shotLayer.fireVulcan(2, position.x + 14, position.y - 2, -90 + 12 - dv, 0.5);
        this.fireFrame += 1;
      }
    },

    launch: function() {
      this.x = GAMEAREA_WIDTH * 0.5;
      this.y = GAMEAREA_HEIGHT * 1.2;

      this.controllable = false;
      this.muteki = true;
      this.visible = true;
      this.roll = 0;
      this.frameIndex = 4;
      this.parts.forEach(function(part) {
        part.visible = true;
      });

      var self = this;
      this.ftweener
        .clear()
        .to({
          y: GAMEAREA_HEIGHT * 0.8,
        }, 60, "easeOutBack")
        .call(function() {
          self.controllable = true;
          self.timer(180, function() {
            self.muteki = false;
          });
        });
    },

    miss: function() {
      this.controllable = false;
      this.muteki = true;
      this.visible = false;
      this.parts.forEach(function(part) {
        part.visible = false;
      });
    },

  });

  var moveVector = phina.geom.Vector2(0, 0);

  phina.define("ps.AfterBurner", {
    superClass: "phina.app.Object2D",

    init: function() {
      this.superInit();
    },

    update: function(app) {
      if (app.ticker.frame % 2 !== 0) return;
      if (!this.visible) return;
      var p = phina.display.Sprite("particleB")
        .setScale(0.125)
        .setPosition(this.position.x, this.position.y)
        .on("enterframe", function() {
          this.position.y += 1;
          this.alpha -= 0.1;
          if (this.alpha < 0.01) this.remove();
        })
        .addChildTo(this.parent);
      p.blendMode = "lighter";
    },

  });

});

phina.namespace(function() {

  phina.define("ps.ScoreLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit((options || {}).$safe({
        fill: "white",
        stroke: null,
        fontSize: FONT_SIZE_L,
        fontFamily: "mono",
        align: "right",
        baseline: "middle",
      }));

      this.value = 0;
    },

    formatText: function() {
      var v = "" + Math.floor(this._score);
      Array.range(5, 0).forEach(function(i) {
        var s = i * 3;
        if (s < v.length) {
          v = v.substring(0, v.length - s) + "," + v.substring(v.length - s);
        }
      });

      this.text = v;
    },
    // formatText: function() {
    //   var v = "" + Math.floor(this._score);
    //   if (12 < v.length) {
    //     v = v.substring(0, v.length - 12) + "兆" + v.substring(v.length - 12);
    //   }
    //   if (8 < v.length) {
    //     v = v.substring(0, v.length - 8) + "億" + v.substring(v.length - 8);
    //   }
    //   if (4 < v.length) {
    //     v = v.substring(0, v.length - 4) + "万" + v.substring(v.length - 4);
    //   }

    //   this.text = v;
    // },

    _accessor: {
      value: {
        get: function() {
          return this._score;
        },
        set: function(v) {
          this._score = v;
          this.formatText();
        }
      }
    }

  });
});

phina.namespace(function() {

  var speed = 12;

  phina.define("ps.Shot", {
    superClass: "phina.display.Sprite",
    
    shotLayer: null,
    power: 0,

    init: function() {
      this.superInit("bullet", 24, 24);
    },
    
    onremoved: function() {
      this.shotLayer.pool.push(this);
    },

    setup: function(frameIndex, x, y, direction, power) {
      this.frameIndex = frameIndex;
      this.x = x;
      this.y = y;
      this.rotation = direction;
      this.power = power;
      var rad = direction * Math.DEG_TO_RAD;
      this.velocity = phina.geom.Vector2(Math.cos(rad) * speed, Math.sin(rad) * speed);
      
      return this;
    },

    update: function() {
      this.power = Math.max(this.power * 0.95, 0.5);
      var position = this.position;
      position.add(this.velocity);
      if (position.x < 0 || GAMEAREA_WIDTH < position.x || position.y < 0 || GAMEAREA_HEIGHT < position.y) {
        this.remove();
      }
    },

  });

});

phina.namespace(function() {

  phina.define("ps.TitleLogoLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit((options || {}).$safe({
        text: "Phina Shooter",
        align: "center",
        fontFamily: "title",
        fontSize: FONT_SIZE_L,
        stroke: ps.Color.pri[6],
        fill: ps.Color.pri[13],
      }));
    }

  });

});

phina.namespace(function() {

  phina.define("ps.ZankiDisplay", {
    superClass: "ps.ItemDisplay",

    init: function(initialValue) {
      this.superInit("zanki", initialValue);
    },

  });
});

phina.namespace(function() {

  phina.define("ps.BulletConfig", {
    init: function() {},
    _static: {

      speedRate: 3,
      target: null,
      bulletLayer: null,

      setup: function(target, bulletLayer) {
        this.target = target;
        this.bulletLayer = bulletLayer;

        this.put("densityRank", 0.00);
        this.put("speedRank", 0.00);
        this.put("burst", 0);
      },

      createNewBullet: function(runner, spec) {
        this.bulletLayer.spawn(runner, spec);
      },

      put: function(name, value) {
        bulletml.Walker.globalScope["$" + name] = value;
      },
    }
  });

});

phina.namespace(function() {

  phina.define("ps.GameData", {
    superClass: "phina.util.EventDispatcher",

    currentStage: 0,

    score: Math.randint(0, 100000000000),
    zanki: 2,
    bomb: 3,
    psyche: Math.randint(0, 100000000000),
    highScore: Math.randint(0, 100000000000),

    /**
     * "normal" or "every"
     */
    extendMode: null,
    extendScore: null,

    init: function() {
      this.superInit();
      this._binder = {};

      this.extendMode = "normal";
      this.extendScore = [100000000, 200000000];
    },

    updateView: function(frame) {
      if (frame % 5 !== 0) return;

      var self = this;
      self._binder.forIn(function(name, view) {
        if (self[name] !== undefined) {
          view.value = self[name];
        }
      });
    },

    addPsyche: function(v) {
      this.psyche += v;
    },

    addScore: function(v) {
      var self = this;
      var before = this.score;
      var after = this.score + v;

      if (this.extendMode === "normal") {
        this.extendScore.forEach(function(es) {
          if (before < es && es <= after) {
            self.zanki += 1;
            self.flare("extend");
          }
        });
      } else if (this.extendMode === "every") {
        var es = this.extendScore[0];
        if (Math.floor(before / es) < Math.floor(after / es)) {
          this.zanki += 1;
          this.flare("extend");
        }
      }

      this.score = after;
    },

    bind: function(propertyName, view) {
      this._binder[propertyName] = view;
    },
    
    onbomb: function() {
      this.bomb -= 1;
    },

    onkill: function(e) {
      
    },
    
    onmiss: function() {
      this.zanki -= 1;
    },

  });

});

phina.main(function() {
  var s = 10;
  var l = s * Math.sqrt(3);
  var bg = phina.graphics.Canvas();
  bg.setSize(l * 2, s * 6);
  bg.strokeStyle = "hsla(240, 8%, 50%, 0.3)";
  bg.strokeLines(
    l, 0,
    l, s,
    0, s * 2,
    0, s * 4,
    l, s * 5,
    l, s * 6
  );
  bg.strokeLines(l, s, l * 2, s * 2);
  bg.strokeLines(l, s * 5, l * 2, s * 4);
  document.body.style.backgroundImage = "url({0})".format(bg.canvas.toDataURL());
  document.body.style.backgroundRepeat = "repeat";
});

phina.namespace(function() {

  phina.define("ps.EndingScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });
      this.fromJSON({
        children: {
          label: {
            className: "ps.TitleLogoLabel",
            arguments: {
              text: "ending"
            },
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.5,
          }
        }
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.GameoverScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      this.fromJSON({
        children: {
          label: {
            className: "ps.TitleLogoLabel",
            arguments: {
              text: "GAME OVER"
            },
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.5,
          }
        }
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.GameScene", {
    superClass: "phina.display.CanvasScene",

    stageId: null,
    gameData: null,

    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "hsl(30, 60%, 60%)",
      });

      this.stage = ps.Stage.create(params.stageId);

      this.fromJSON({
        children: {
          mainLayer: {
            className: "ps.gamescene.MainLayer",
            arguments: {
              stage: this.stage,
            },
            x: SIDEBAR_WIDTH,
            y: 0,
          },
          leftSideBar: {
            className: "ps.gamescene.LeftSideBar",
            x: 0,
            y: 0,
          },
          rightSideBar: {
            className: "ps.gamescene.RightSideBar",
            x: SCREEN_WIDTH - SIDEBAR_WIDTH,
            y: 0,
          },
        }
      });

      var player = this.player = this.mainLayer.player;
      player.shotLayer = this.mainLayer.shotLayer;

      var gameData = this.gameData = params.gameData;
      this.leftSideBar.bindGameData(gameData);
      this.rightSideBar.bindGameData(gameData);
      gameData.on("miss", function() {});
      gameData.on("gameover", function() {});

      ps.BulletConfig.setup(player, this.mainLayer.bulletLayer);

      this.timer(120, function() {
        player.launch();
      });
    },

    update: function(app) {
      this.stage.update(app);

      var frame = app.ticker.frame;

      this.gameData.updateView(frame);

      ps.OutlinedSprite.staticAlpha = 0.5 + Math.sin(frame * 0.26) * 0.5;

      this._hitTestShotVsEnemy();
      this._hitTestBombVsEnemy();
      this._hitTestBulletVsPlayer();
      this._hitTestEnemyVsPlayer();
    },

    _hitTestShotVsEnemy: function() {
      var enemies = this.mainLayer.enemyLayer.children;
      var shots = this.mainLayer.shotLayer.children;

      var es = enemies.slice();
      var ss = shots.slice();

      for (var si = 0, slen = ss.length; si < slen; si++) {
        var s = ss[si];
        for (var ei = 0, elen = es.length; ei < elen; ei++) {
          var e = es[ei];
          if (e.hitTest(s.x, s.y)) {
            if (e.damage(s.power)) {
              this.flare("kill", {
                enemy: e
              });
            }
            s.remove();
            break;
          }
        }
      }
    },
    _hitTestBombVsEnemy: function() {
      var enemies = this.mainLayer.enemyLayer.children;

      var es = enemies.slice();
    },
    _hitTestBulletVsPlayer: function() {
      var bullets = this.mainLayer.bulletLayer.children;
      var player = this.player;

      if (player.muteki) return;

      var bs = bullets.slice();
      for (var bi = 0, blen = bs.length; bi < blen; bi++) {
        var b = bs[bi];
        if (b.hitTest(player.x, player.y)) {
          this.flare("miss");
          console.log("miss by bullet");
          return;
        }
      }
    },
    _hitTestEnemyVsPlayer: function() {
      var enemies = this.mainLayer.enemyLayer.children;
      var player = this.player;

      if (player.muteki) return;

      var es = enemies.slice();
      for (var ei = 0, elen = es.length; ei < elen; ei++) {
        var e = es[ei];
        if (e.hitTest(player.x, player.y)) {
          this.flare("miss");
          console.log("miss by enemy");
          return;
        }
      }
    },

    launchEnemy: function(enemy) {
      this.mainLayer.enemyLayer.addChild(enemy);
    },

    onkill: function(e) {
      var enemy = e.enemy;
      enemy.remove();
      this.gameData.flare("kill", {
        enemy: enemy
      });
    },

    onmiss: function() {
      this.gameData.flare("miss");
      var player = this.player;
      player.miss();
      if (this.gameData.zanki < 0) {
        // TODO gameover
      } else {
        this.timer(60, function() {
          player.launch();
        });
      }
    },

  });
});

phina.namespace(function() {

  phina.define("ps.GenerateAssetScene", {
    superClass: "phina.display.CanvasScene",

    init: function(params) {
      this.superInit();
      this.one("enterframe", function() {
        this.generate(params.assetType);
      });
    },

    generate: function(assetType) {
      switch (assetType) {
        case "stage0":
          ps.TextureEdit.outline("enemy_stage0", "red");

          ps.TextureEdit.dark("enemy_stage0");

          break;

        default:
          ps.TextureEdit.outline("bullet", "rgba(255,180,0,0.5)", 2);
          ps.TextureEdit.outline("player", "rgba(0,100,255,0.5)", 2);
          ps.TextureEdit.outline("bomb", "lightgreen", 2);

          var c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("rgba(255, 255, 255, 0.5)");
          phina.asset.AssetManager.set("image", "particleW", c);

          c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("hsla(0, 100%, 70%, 0.5)");
          phina.asset.AssetManager.set("image", "particleR", c);

          c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("hsla(60, 100%, 70%, 0.5)");
          phina.asset.AssetManager.set("image", "particleY", c);

          c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("hsla(120, 100%, 70%, 0.5)");
          phina.asset.AssetManager.set("image", "particleG", c);

          c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("hsla(240, 100%, 70%, 0.5)");
          phina.asset.AssetManager.set("image", "particleB", c);

          break;
      }

      this.exit();
    },
  });

});

phina.namespace(function() {

  phina.define("ps.LoadingScene", {
    superClass: "phina.game.LoadingScene",

    init: function(params) {
      this.superInit({
        assets: ps.Assets.get(params.assetType),
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        lie: false,
        exitType: "auto",
      });
      this.fromJSON({
        backgroundColor: "black",
        children: {
          label: {
            className: "ps.TitleLogoLabel",
            arguments: {
              text: "downloading"
            },
            x: SCREEN_WIDTH * 0.5,
            y: SCREEN_HEIGHT * 0.5,
            onenterframe: function(e) {
              var c = ~~(e.app.ticker.frame / 10) % 5;
              this.text = "downloading" + ".".repeat(c);
            }
          }
        }
      });
    }

  });
});

phina.namespace(function() {

  phina.define("ps.NameEntryScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });
      this.fromJSON({
        children: {
          label: {
            className: "ps.TitleLogoLabel",
            arguments: {
              text: "name entry"
            },
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.5,
          }
        }
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.ResultScene", {
    superClass: "phina.display.CanvasScene",

    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      this.fromJSON({
        gameData: params.gameData,
        children: {
          label: {
            className: "ps.TitleLogoLabel",
            arguments: {
              text: "result"
            },
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.5,
          }
        }
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.SettingScene", {
    superClass: "phina.game.ManagerScene",

    init: function() {
      this.superInit({
        scenes: [

          {
            label: "top",
            className: "ps.settingscene.Top",
          },

        ],
      });
    }
  });

  phina.define("ps.settingscene.Top", {
    superClass: "phina.app.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });
    }
  });

});
phina.namespace(function() {

  phina.define("ps.TitleScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      this.fromJSON({
        children: {
          title: {
            className: "ps.TitleLogoLabel",
            arguments: {
              fontSize: FONT_SIZE_XL,
            },
            x: SCREEN_WIDTH * 0.5,
            y: SCREEN_HEIGHT * 0.5,
          }
        }
      });

      // TODO
      this.tweener.wait(500).call(function() {
        this.exit("arcadeMode");
      }.bind(this));
    }
  });

});

phina.namespace(function() {

  phina.define("ps.TutorialScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });
      this.fromJSON({
        children: {
          label: {
            className: "ps.TitleLogoLabel",
            arguments: {
              text: "tutorial"
            },
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.5,
          }
        }
      });
    }
  });

});

phina.namespace(function() {

  /**
   * arcadeモード
   */
  phina.define("ps.ArcadeModeSequence", {
    superClass: "phina.game.ManagerScene",
    
    init: function() {
      
      var gameData = ps.GameData();
      
      this.superInit({
        scenes: [

          Array.range(0, 5).map(function(stageId) {
            var stageName = "stage{0}".format(stageId);
            if (stageId < 4) {
              next = "stage{0}preload".format(stageId);
            } else {
              next = "ending";
            }
            return [

              {
                label: stageName + "preload",
                className: "ps.LoadingScene",
                arguments: {
                  assetType: stageName
                },
              },

              {
                label: stageName + "generate",
                className: "ps.GenerateAssetScene",
                arguments: {
                  assetType: stageName
                },
              },

              {
                label: stageName,
                className: "ps.GameScene",
                arguments: {
                  stageId: stageId,
                  gameData: gameData,
                },
              },

              {
                label: stageName + "result",
                className: "ps.ResultScene",
                arguments: {
                  gameData: gameData,
                },
              },

            ];
          }),

          {
            label: "ending",
            className: "ps.EndingScene",
          },

          {
            label: "gameover",
            className: "ps.GameoverScene",
          },

          {
            label: "nameEntry",
            className: "ps.NameEntryScene",
          },

        ].flatten(),
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.MainSequence", {
    superClass: "phina.game.ManagerScene",

    init: function() {
      this.superInit({
        scenes: [

          {
            label: "load",
            className: "ps.LoadingScene",
            arguments: {
              assetType: "common"
            },
          },

          {
            label: "generate",
            className: "ps.GenerateAssetScene",
          },

          {
            label: "title",
            className: "ps.TitleScene",
          },

          {
            label: "arcadeMode",
            className: "ps.ArcadeModeSequence",
            nextLabel: "title",
          },

          {
            label: "tutorial",
            className: "ps.TutorialScene",
            nextLabel: "title",
          },

          {
            label: "setting",
            className: "ps.SettingScene",
            nextLabel: "title",
          },

          {
            label: "ranking",
            className: "ps.RankingScene",
            nextLabel: "title",
          },

        ],
      });
    }
  });

});
phina.namespace(function() {

  phina.define("ps.RankingScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Background0", {
    superClass: "ps.BackgroundLayer",

    init: function() {
      this.superInit({
        backgroundColor: ps.Color.pri[1],
        fill: ps.Color.pria[7].format(0.2),
        stroke: ps.Color.pri[4],
      });

      this.camera.x = 2;
      this.camera.y = 35;
      this.camera.z = 8;
      this.camera.targetY = 3;
      var frame = 0;
      this.camera.on("enterframe", function(e) {
        this.y = 16 + Math.cos(frame * 0.001) * 13;
        frame += 1;
      });

      var self = this;

      var dx = 0.04;
      var dz = 0.16;

      var rangeX = 3.0 * 5.0;
      var rangeZ = 4.0 * 5.6;

      // 床
      var vertices2 = [
        [0, 0, 0],
      ];
      Array.range(-10, 10).forEach(function(z) {
        Array.range(-10, 10).forEach(function(x) {
          ps.bg.Polygon({
              vertices: vertices2,
            })
            .setTranslation(x * 2.6, 0, z * 2.6)
            .addChildTo(self)
            .on("enterframe", function() {
              this.x += dx;
              this.z += dz;

              if (this.x < -rangeX) this.x += rangeX * 2;
              if (rangeX < this.x) this.x += -rangeX * 2;
              if (this.z < -rangeZ) this.z += rangeZ * 2;
              if (rangeZ < this.z) this.z += -rangeZ * 2;
            });
        });
      });

      // 建造物
      var vertices = [
        [-0.7, 0, -0.7],
        [-0.7, 0, +0.7],
        [+0.7, 0, +0.7],
        [+0.7, 0, -0.7],
      ];
      var random = phina.util.Random(12345);
      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          Array.range(0, random.randint(6, 11)).forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices,
              })
              .setTranslation(x * 3.0, y * 0.21, z * 4.0)
              .addChildTo(self)
              .on("enterframe", function() {
                this.x += dx;
                this.z += dz;

                if (this.x < -rangeX) this.x += rangeX * 2;
                if (rangeX < this.x) this.x += -rangeX * 2;
                if (this.z < -rangeZ) this.z += rangeZ * 2;
                if (rangeZ < this.z) this.z += -rangeZ * 2;
              });
          });
        });
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Background1", {
    superClass: "ps.BackgroundLayer",

    init: function() {
      this.superInit({
        backgroundColor: ps.Color.sec0[1],
        fill: ps.Color.sec0a[8].format(0.1),
        stroke: ps.Color.sec0[8],
      });

      this.camera.x = 5;
      this.camera.y = 0.5;
      this.camera.z = 10;
      this.camera.targetX = 0;
      this.camera.targetY = 0.5;
      this.camera.targetZ = 0;
      var frame = 0;
      this.camera.on("enterframe", function(e) {
        this.targetY = -2 + Math.sin(frame * 0.002) * -2;
        frame += 1;
      });

      var self = this;

      var dx = 0.05;
      var dz = 0.10;

      var rangeX = 3.0 * 5.0;
      var rangeZ = 4.0 * 5.6;

      // 床
      var vertices2 = [
        [0, 0, 0],
      ];
      Array.range(-10, 10).forEach(function(z) {
        Array.range(-10, 10).forEach(function(x) {
          [-1, 1].forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices2,
              })
              .setTranslation(x * 2.6, y * 2.0, z * 2.6)
              .addChildTo(self)
              .on("enterframe", function() {
                this.x += dx;
                this.z += dz;

                if (this.x < -rangeX) this.x += rangeX * 2;
                if (rangeX < this.x) this.x += -rangeX * 2;
                if (this.z < -rangeZ) this.z += rangeZ * 2;
                if (rangeZ < this.z) this.z += -rangeZ * 2;
              });
          });
        });
      });

      // 建造物
      var vertices = [
        [-0.5, 0, -0.5],
        [-0.5, 0, +0.5],
        [+0.5, 0, +0.5],
        [+0.5, 0, -0.5],
      ];
      var random = phina.util.Random(12345);
      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          [-1, 1].forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices,
              })
              .setTranslation(x * 3.0, y * 2.0, z * 3.0)
              .addChildTo(self)
              .on("enterframe", function() {
                this.x += dx;
                this.z += dz;

                if (this.x < -rangeX) this.x += rangeX * 2;
                if (rangeX < this.x) this.x += -rangeX * 2;
                if (this.z < -rangeZ) this.z += rangeZ * 2;
                if (rangeZ < this.z) this.z += -rangeZ * 2;
              });
          });
        });
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Background2", {
    superClass: "ps.BackgroundLayer",

    init: function() {
      this.superInit({
        backgroundColor: ps.Color.pri[1],
        fill: ps.Color.pria[7].format(0.2),
        stroke: ps.Color.pri[4],
      });

      this.camera.x = 2;
      this.camera.y = 35;
      this.camera.z = 8;
      this.camera.targetY = 3;
      var frame = 0;
      this.camera.on("enterframe", function(e) {
        this.y = 16 + Math.cos(frame * 0.001) * 13;
        frame += 1;
      });

      var self = this;

      var dx = 0.04;
      var dz = 0.16;

      var rangeX = 3.0 * 5.0;
      var rangeZ = 4.0 * 5.6;

      // 床
      var vertices2 = [
        [0, 0, 0],
      ];
      Array.range(-10, 10).forEach(function(z) {
        Array.range(-10, 10).forEach(function(x) {
          ps.bg.Polygon({
              vertices: vertices2,
            })
            .setTranslation(x * 2.6, 0, z * 2.6)
            .addChildTo(self)
            .on("enterframe", function() {
              this.x += dx;
              this.z += dz;

              if (this.x < -rangeX) this.x += rangeX * 2;
              if (rangeX < this.x) this.x += -rangeX * 2;
              if (this.z < -rangeZ) this.z += rangeZ * 2;
              if (rangeZ < this.z) this.z += -rangeZ * 2;
            });
        });
      });

      // 建造物
      var vertices = [
        [-0.7, 0, -0.7],
        [-0.7, 0, +0.7],
        [+0.7, 0, +0.7],
        [+0.7, 0, -0.7],
      ];
      var random = phina.util.Random(12345);
      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          Array.range(0, random.randint(6, 11)).forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices,
              })
              .setTranslation(x * 3.0, y * 0.21, z * 4.0)
              .addChildTo(self)
              .on("enterframe", function() {
                this.x += dx;
                this.z += dz;

                if (this.x < -rangeX) this.x += rangeX * 2;
                if (rangeX < this.x) this.x += -rangeX * 2;
                if (this.z < -rangeZ) this.z += rangeZ * 2;
                if (rangeZ < this.z) this.z += -rangeZ * 2;
              });
          });
        });
      });
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Stage", {
    superClass: "phina.util.EventDispatcher",

    waitFor: -1,
    sequencer: null,
    random: null,

    block: false,

    init: function() {
      this.superInit();
      this.sequencer = ps.StageSequancer();
      this.random = phina.util.Random(12345);
    },

    update: function(app) {
      var frame = app.ticker.frame;
      while (this.sequencer.hasNext() && this.waitFor <= frame) {
        var task = this.sequencer.next();
        if (task) {
          if (!((task instanceof ps.LaunchEnemyTask || task instanceof ps.LaunchEnemyUnitTask) && this.block)) {
            task.execute(app, app.currentScene, this);
          }
        }
      }
    },

    _static: {
      create: function(stageId) {
        switch (stageId) {
          case 0:
            return ps.Stage0();
        }
      }
    }
  });

  phina.define("ps.StageSequancer", {

    init: function() {
      this.seq = [];
    },

    hasNext: function() {
      return this.seq.length > 0;
    },

    addTask: function(task) {
      this.seq.push(task);
      return this;
    },

    next: function() {
      return this.seq.shift();
    },

    wait: function(frame) {
      return this.addTask(ps.WaitTask(frame));
    },

    startBgm: function(bgmData) {
      return this.addTask(ps.StartBgmTask(bgmData));
    },

    stopBgm: function(fadeOut) {
      return this.addTask(ps.StopBgmTask(fadeOut));
    },

    warning: function() {
      return this.addTask(ps.WarningTask());
    },

    launchEnemy: function(enemyClassName, params) {
      return this.addTask(ps.LaunchEnemyTask(enemyClassName, params));
    },

    launchEnemyUnit: function(enemyClassName, params) {
      return this.addTask(ps.LaunchEnemyUnitTask(enemyClassName, params));
    },

    launchBoss: function(bossClassName) {
      return this.addTask(ps.LaunchBossTask(bossClassName));
    },
    
    call: function(func) {
      return this.addTask(ps.CallFuncTask(func));
    },
  });

  phina.define("ps.StageTask", {
    init: function() {},
    execute: function(app, gameScene, stage) {}
  });

  phina.define("ps.WaitTask", {
    superClass: "ps.StageTask",

    frame: 0,

    init: function(frame) {
      this.frame = frame;
    },

    execute: function(app, gameScene, stage) {
      stage.waitFor = app.ticker.frame + this.frame;
    }
  });

  phina.define("ps.StartBgmTask", {
    superClass: "ps.StageTask",

    bgmData: null,

    init: function(bgmData) {
      this.superInit();
      this.bgmData = bgmData;
    },

    execute: function(app, gameScene, stage) {
      ps.SoundManager.startBgm(this.bgmData);
    }
  });

  phina.define("ps.StopBgmTask", {
    superClass: "ps.StageTask",

    init: function(fadeOut) {
      this.superInit();
      this.fadeOut = fadeOut;
    },

    execute: function(app, gameScene, stage) {
      ps.SoundManager.stopBgm(this.fadeOut);
    }
  });

  phina.define("ps.WarningTask", {
    superClass: "ps.StageTask",

    init: function() {
      this.superInit();
    },

    execute: function(app, gameScene, stage) {}
  });

  phina.define("ps.LaunchEnemyTask", {
    superClass: "ps.StageTask",

    enemyClassName: null,
    params: null,

    init: function(enemyClassName, params) {
      this.superInit();
      this.enemyClassName = enemyClassName;
      this.params = params.$safe({
        x: GAMEAREA_WIDTH * 0.5,
        y: GAMEAREA_HEIGHT * -0.1,
        blockFlag: false,
        wait: 0,
      });
    },

    execute: function(app, gameScene, stage) {
      var EnemyClazz = phina.using(this.enemyClassName);
      var params = this.params;
      var enemy = EnemyClazz(params);
      gameScene.launchEnemy(enemy);

      stage.block = this.params.blockFlag;
    }
  });

  phina.define("ps.LaunchEnemyUnitTask", {
    superClass: "ps.StageTask",

    enemyClassName: null,
    params: null,

    init: function(enemyClassName, params) {
      this.superInit();
      this.enemyClassName = enemyClassName;
      this.params = params.$safe({
        x: GAMEAREA_WIDTH * 0.5,
        y: GAMEAREA_HEIGHT * -0.1,
        blockFlag: false,
        formation: "basic0",
        wait: 0,
      });
    },

    execute: function(app, gameScene, stage) {
      var EnemyClazz = phina.using(this.enemyClassName);
      var params = this.params;
      var enemy = null;
      ps.EnemyUnit.formation[params.formation].forEach(function(f) {
        enemy = EnemyClazz({}.$extend(params, {
          x: params.x + f.x,
          y: params.y + f.y,
          wait: f.wait,
        }));
        gameScene.launchEnemy(enemy);
      });
    }
  });

  phina.define("ps.LaunchBossTask", {
    superClass: "ps.StageTask",

    bossClassName: null,

    init: function(bossClassName, params) {
      this.superInit();
      this.bossClassName = bossClassName;
      this.params = params;
    },

    execute: function(app, gameScene, stage) {}
  });

  phina.define("ps.CallFuncTask", {
    superClass: "ps.StageTask",

    func: null,

    init: function(func) {
      this.superInit();
      this.func = func;
    },

    execute: function(app, gameScene, stage) {
      this.func();
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Stage0", {
    superClass: "ps.Stage",

    backgroundClassName: "ps.Background0",

    init: function() {
      this.superInit();

      var x = function(v) {
        return GAMEAREA_WIDTH * v * 0.1;
      };
      var y = function(v) {
        return GAMEAREA_HEIGHT * v * 0.1;
      };

      this.sequencer
        .startBgm()
        //
        .wait(250)
        .launchEnemy("ps.Yukishiro1", {
          x: x(+5),
          y: y(-1),
        })
        //
      ;
    }

  });

});

phina.namespace(function() {
  // Color Palette by Paletton.com
  // Palette URL: http://paletton.com/#uid=50f1n0kmGpNdfBfixtwqklHuEgU

  phina.define("ps.Color", {
    init: function() {},
    _static: {
      pri: [],
      sec0: [],
      sec1: [],

      initialize: function(scene) {
        ps.Color.pri = [];
        ps.Color.sec0 = [];
        ps.Color.sec1 = [];
        ps.Color.pria = [];
        ps.Color.sec0a = [];
        ps.Color.sec1a = [];

        var p0 = 21;
        var r = 140;
        var s0 = (p0 - r + 360) % 360;
        var s1 = (p0 + r + 360) % 360;

        var size = 16;
        var sMin = 48;
        var sMax = 90;
        var sLev = (sMax - sMin) / (size - 1);
        var hMin = 5;
        var hMax = 84;
        var hLev = (hMax - hMin) / (size - 1);
        Array.range(0, size).forEach(function(i) {
          var s = Math.floor(sMin + sLev * i);
          var h = Math.floor(hMin + hLev * i);
          ps.Color.pri[i] = "hsl({0},{1}%,{2}%)"    .format(p0, s, h);
          ps.Color.sec0[i] = "hsl({0},{1}%,{2}%)"   .format(s0, s, h);
          ps.Color.sec1[i] = "hsl({0},{1}%,{2}%)"   .format(s1, s, h);
          ps.Color.pria[i] = "hsla({0},{1}%,{2}%,"  .format(p0, s, h) + "{0})";
          ps.Color.sec0a[i] = "hsla({0},{1}%,{2}%," .format(s0, s, h) + "{0})";
          ps.Color.sec1a[i] = "hsla({0},{1}%,{2}%," .format(s1, s, h) + "{0})";
        });

        if (scene) ps.Color.test().addChildTo(scene);
      },

      test: function() {
        var r = phina.display.CanvasElement();
        ps.Color.pri.forEach(function(c, i) {
          phina.display.RectangleShape({
              width: 20,
              height: 20,
              fill: c,
              stroke: null,
            })
            .setPosition(20 + i * 20, 20 + 20)
            .addChildTo(r);
        });

        ps.Color.sec0.forEach(function(c, i) {
          phina.display.RectangleShape({
              width: 20,
              height: 20,
              fill: c,
              stroke: null,
            })
            .setPosition(20 + i * 20, 20 + 0)
            .addChildTo(r);
        });

        ps.Color.sec1.forEach(function(c, i) {
          phina.display.RectangleShape({
              width: 20,
              height: 20,
              fill: c,
              stroke: null,
            })
            .setPosition(20 + i * 20, 20 + 40)
            .addChildTo(r);
        });

        return r;
      }
    },
  });

});

phina.namespace(function() {

  phina.define("ps.FramebasedTweener", {
    superClass: 'phina.accessory.Accessory',

    /**
     * @constructor
     */
    init: function(target) {
      this.superInit(target);

      this._loop = false;
      this._init();
    },

    _init: function() {
      this._tasks = [];
      this._index = 0;
      this.playing = true;
      this._update = this._updateTask;
    },

    update: function(app) {
      this._update(app);
    },

    to: function(props, duration, easing) {
      this._add({
        type: 'tween',
        mode: 'to',
        props: props,
        duration: duration,
        easing: easing,
      });
      return this;
    },

    by: function(props, duration, easing) {
      this._add({
        type: 'tween',
        mode: 'by',
        props: props,
        duration: duration,
        easing: easing,
      });

      return this;
    },

    from: function(props, duration, easing) {
      this._add({
        type: 'tween',
        mode: 'from',
        props: props,
        duration: duration,
        easing: easing,
      });
      return this;
    },

    wait: function(time) {
      this._add({
        type: 'wait',
        data: {
          limit: time,
        },
      });
      return this;
    },

    call: function(func, self, args) {
      this._add({
        type: 'call',
        data: {
          func: func,
          self: self || this,
          args: args,
        },
      });
      return this;
    },

    /**
     * プロパティをセット
     * @param {Object} key
     * @param {Object} value
     */
    set: function(key, value) {
      var values = null;
      if (arguments.length == 2) {
        values = {};
        values[key] = value;
      } else {
        values = key;
      }
      this._tasks.push({
        type: "set",
        data: {
          values: values
        }
      });

      return this;
    },

    moveTo: function(x, y, duration, easing) {
      return this.to({
        x: x,
        y: y
      }, duration, easing);
    },
    moveBy: function(x, y, duration, easing) {
      return this.by({
        x: x,
        y: y
      }, duration, easing);
    },

    fade: function(value, duration, easing) {
      return this.to({
        alpha: value
      }, duration, easing);
    },

    fadeOut: function(duration, easing) {
      return this.fade(0.0, duration, easing)
    },

    fadeIn: function(duration, easing) {
      return this.fade(1.0, duration, easing)
    },

    /**
     * アニメーション開始
     */
    play: function() {
      this.playing = true;
      return this;
    },

    /**
     * アニメーションを一時停止
     */
    pause: function() {
      this.playing = false;
      return this;
    },

    stop: function() {
      this.playing = false;
      this.rewind();
      return this;
    },

    /**
     * アニメーションを巻き戻す
     */
    rewind: function() {
      this._update = this._updateTask;
      this._index = 0;
      this.play();
      return this;
    },

    yoyo: function() {
      // TODO: 最初の値が分からないので反転できない...
      this._update = this._updateTask;
      this._index = 0;
      this._tasks.each(function(task) {
        if (task.type === 'tween') {

        }
      });
      this.play();

      return this;
    },

    /**
     * アニメーションループ設定
     * @param {Boolean} flag
     */
    setLoop: function(flag) {
      this._loop = flag;
      return this;
    },

    /**
     * アニメーションをクリア
     */
    clear: function() {
      this._init();
      return this;
    },

    fromJSON: function(json) {
      if (json.loop !== undefined) {
        this.setLoop(json.loop);
      }

      json.tweens.each(function(t) {
        var t = t.clone();
        var method = t.shift();
        this[method].apply(this, t);
      }, this);

      return this;
    },

    _add: function(params) {
      this._tasks.push(params);
    },

    _updateTask: function(app) {
      if (!this.playing) return;

      var task = this._tasks[this._index];
      if (!task) {
        if (this._loop) {
          this.rewind();
          this._update(app);
        } else {
          this.playing = false;
        }
        return;
      } else {
        ++this._index;
      }

      if (task.type === 'tween') {
        this._tween = phina.util.Tween();

        if (task.mode === 'to') {
          this._tween.to(this.target, task.props, task.duration, task.easing);
        } else if (task.mode === 'by') {
          this._tween.by(this.target, task.props, task.duration, task.easing);
        } else {
          this._tween.from(this.target, task.props, task.duration, task.easing);
        }
        this._update = this._updateTween;
        this._update(app);
      } else if (task.type === 'wait') {
        this._wait = {
          time: 0,
          limit: task.data.limit,
        };

        this._update = this._updateWait;
        this._update(app);
      } else if (task.type === 'call') {
        task.data.func.apply(task.data.self, task.data.args);
        // 1フレーム消費しないよう再帰
        this._update(app);
      } else if (task.type === 'set') {
        this.target.$extend(task.data.values);
        // 1フレーム消費しないよう再帰
        this._update(app);
      }
    },

    _updateTween: function(app) {
      var tween = this._tween;
      var time = 1;

      tween.forward(time);
      this.flare('tween');

      if (tween.time >= tween.duration) {
        delete this._tween;
        this._tween = null;
        this._update = this._updateTask;
      }
    },

    _updateWait: function(app) {
      var wait = this._wait;
      var time = 1;
      wait.time += time;

      if (wait.time >= wait.limit) {
        delete this._wait;
        this._wait = null;
        this._update = this._updateTask;
      }
    },
  });

  phina.app.Element.prototype.getter('ftweener', function() {
    if (!this._tweener) {
      this._tweener = ps.FramebasedTweener().attachTo(this);
    }
    return this._tweener;
  });

});

phina.namespace(function() {

  phina.define("ps.SoundManager", {
    init: function() {},
    _static: {
      _bgmVolume: 0.0,
      soundVolume: 1.0,

      beforeBgm: null,
      currentBgm: null,

      currentFrame: 0,
      _lastPlayFrame: {},

      update: function(app) {
        this.currentFrame = app.ticker.frame;

        if (this.beforeBgm) {
          this.beforeBgm.volume -= this._bgmVolume / (60 * 5);
          if (this.beforeBgm.volume < 0.01) {
            this.beforeBgm.stop();
            this.beforeBgm = null;
          }
        }
      },

      startBgm: function(bgmData) {
        bgmData = (bgmData || {}).$safe({
          name: "bgm",
          loop: true,
          loopStart: 0,
          loopEnd: 0,
        });

        if (this.currentBgm) {
          if (this.beforeBgm) this.beforeBgm.stop();
          this.beforeBgm = this.currentBgm;
        }
        this.currentBgm = phina.asset.AssetManager.get("sound", bgmData.name).clone().play();
        this.currentBgm.volume = this._bgmVolume;
        this.currentBgm.loop = bgmData.loop;
        this.currentBgm.loopStart = bgmData.loopStart;
        this.currentBgm.loopEnd = bgmData.loopEnd;
      },

      stopBgm: function(fadeOut) {
        if (this.beforeBgm) {
          this.beforeBgm.stop();
          this.beforeBgm = null;
        }
        if (this.currentBgm) {
          if (fadeOut) {
            this.beforeBgm = this.currentBgm;
            this.currentBgm = null;
          } else {
            this.currentBgm.stop();
            this.currentBgm = null;
          }
        }
      },

      playSound: function(name) {
        if (this._lastPlayFrame[name] !== this.currentFrame) {
          var sound = phina.asset.AssetManager.get("sound", name).clone();
          sound.volume = this.soundVolume;
          sound.play();
          this._lastPlayFrame[name] = this.currentFrame;
        }
      },

      getBgmVolume: function() {
        return this._bgmVolume;
      },
      setBgmVolume: function(v) {
        this._bgmVolume = v;
        if (this.currentBgm) this.currentBgm.volume = v;
      },
    },

  });

});

phina.namespace(function() {

  phina.define("ps.TextureEdit", {
    init: function() {},
    _static: {
      outline: function(textureName, color, lineWidth) {
        color = color || "white";
        lineWidth = lineWidth || 1;

        var texture = phina.asset.AssetManager.get("image", textureName);
        if (texture == null) {
          return;
        }
        var w = texture.domElement.width;
        var h = texture.domElement.height;

        var src = phina.graphics.Canvas().setSize(w, h);
        src.context.drawImage(texture.domElement, 0, 0);

        var srcData = src.context.getImageData(0, 0, w, h);
        var data = srcData.data;

        var dst = phina.graphics.Canvas().setSize(w, h);
        dst.fillStyle = color;
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {

            var cIndex = ((y + 0) * w + (x + 0)) * 4 + 3;

            var lIndex = ((y + 0) * w + (x - 1)) * 4 + 3;
            var rIndex = ((y + 0) * w + (x + 1)) * 4 + 3;
            var tIndex = ((y - 1) * w + (x + 0)) * 4 + 3;
            var bIndex = ((y + 1) * w + (x + 0)) * 4 + 3;
            var l = (0 <= lIndex && lIndex < data.length) ? data[lIndex] : 255;
            var r = (0 <= rIndex && rIndex < data.length) ? data[rIndex] : 255;
            var t = (0 <= tIndex && tIndex < data.length) ? data[tIndex] : 255;
            var b = (0 <= bIndex && bIndex < data.length) ? data[bIndex] : 255;

            var a = data[cIndex];

            if (a > 0 && (l == 0 || r == 0 || t == 0 || b == 0)) {
              dst.fillRect(x - lineWidth * 0.5, y - lineWidth * 0.5, lineWidth, lineWidth);
            }
          }
        }

        phina.asset.AssetManager.set("image", textureName + "Outline", dst);
      },

      dark: function(textureName) {
        var texture = phina.asset.AssetManager.get("image", textureName);
        if (texture == null) {
          return;
        }
        var w = texture.domElement.width;
        var h = texture.domElement.height;

        var src = phina.graphics.Canvas().setSize(w, h);
        src.context.drawImage(texture.domElement, 0, 0);

        var srcData = src.context.getImageData(0, 0, w, h);
        var data = srcData.data;

        var dst = phina.graphics.Canvas().setSize(w, h);
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {

            var index = (y * w + x) * 4;
            var r = data[index + 0];
            var g = data[index + 1];
            var b = data[index + 2];
            var a = data[index + 3];

            if (a > 0) {
              dst.fillStyle = "rgba({0},{1},{2},{3})".format(~~(r * 0.6), ~~(g * 0.4), ~~(b * 0.4), a / 255);
              dst.fillRect(x, y, 1, 1);
            }
          }
        }

        phina.asset.AssetManager.set("image", textureName + "Dark", dst);
      }
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Timer", {
    superClass: "phina.app.Element",

    init: function(time) {
      this.superInit();
      this.time = time;
    },

    update: function() {
      this.time -= 1;
      if (this.time <= 0) {
        this.flare("time");
        this.remove();
      }
    }
  });

  phina.app.Element.prototype.method("timer", function(time, callback) {
    ps.Timer(time)
      .addChildTo(this)
      .on("time", callback);
    return this;
  });

});

//# sourceMappingURL=phina-shooter.js.map
