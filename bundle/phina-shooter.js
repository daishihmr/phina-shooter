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

phina.main(function() {
  ps.Color.initialize();

  var app = ps.Application();
  app.run();
  
  app.enableStats();
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
      this.mouse.update();
      this.touch.update();
      this.touchList.update();
      this.keyboard.update();
      this.gamepads.update();
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
            };

          case "stage0":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
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

  var B0 = bullet({
    type: 0
  });
  var B1 = bullet({
    type: 1
  });
  var B2 = bullet({
    type: 2
  });
  var B3 = bullet({
    type: 3
  });
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

  ps.danmaku = {};

  // ザコ
  var basic = function(dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          fire(DM, spd(1), direction(dir)),
          repeat("$burst", [
            fire(R2, spdSeq(0.15), direction(0, "sequence")),
          ]),
          interval(90),
        ]),
      ]),
    });
  };
  ps.danmaku.basic = basic(0);
  ps.danmaku.basicR1 = basic(-5);
  ps.danmaku.basicL1 = basic(+5);
  ps.danmaku.basicR2 = basic(-15);
  ps.danmaku.basicL2 = basic(+15);

  // ザコ3way
  var basic3 = function(dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          fire(DM, spd(1), direction(dir - 7)),
          repeat("$burst", [
            fire(R2, spdSeq(0.05), direction(0, "sequence")),
            fire(R2, spdSeq(0), direction(7, "sequence")),
            fire(R2, spdSeq(0), direction(7, "sequence")),
            fire(DM, spdSeq(0), direction(-14, "sequence")),
          ]),
          interval(90),
        ]),
      ]),
    });
  };
  ps.danmaku.basic3 = basic3(0);
  ps.danmaku.basic3R1 = basic3(-5);
  ps.danmaku.basic3L1 = basic3(+5);
  ps.danmaku.basic3R2 = basic3(-15);
  ps.danmaku.basic3L2 = basic3(+15);

  // Stage1 ------------------------------

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
        fire(DM, spd(1.4)),
        repeat(12, [
          fire(R4, spdSeq(0), direction(360 / (12 - 1), "sequence")),
        ]),
        interval(90),
      ]),
    ]),
  });

  // Stage2 ------------------------------
  // Stage3 ------------------------------
  // Stage4 ------------------------------
  // Stage5 ------------------------------

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
    dummy: false,

    init: function() {
      this.superInit("bullet", 24, 24);
      this.age = 0;
    },

    update: function(app) {
      var runner = this.runner;
      if (runner) {
        var pos = this.position;
        
        var bx = pos.x;
        var by = pos.y;
        runner.update();
        var dx = runner.x - bx;
        var dy = runner.y - by;

        pos.x += dx * ps.Bullet.globalSpeedRate;
        pos.y += dy * ps.Bullet.globalSpeedRate;

        this.rotation = Math.atan2(pos.y - by, pos.x - bx) * 180 / Math.PI;

        this.age += 1;
      }
    },

    _static: {
      globalSpeedRate: 1.0,
    },

  });
});

phina.namespace(function() {

  phina.define("ps.Enemy", {
    superClass: "phina.display.Sprite",

    hp: 0,
    score: 0,

    init: function(params) {
      this.superInit(params.texture, params.width, params.height);
      this.$extend(params);
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
    
    bullets: null,

    init: function() {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);
      this.backgroundColor = null;
      
      this.bullets = [];
    },

    spawn: function(runner, spec) {
      var bullet = ps.Bullet().addChildTo(this);
      bullet.position.x = runner.x;
      bullet.position.y = runner.y;
      bullet.runner = runner;
      bullet.frameIndex = spec.type || 0;
      if (spec.dummy) {
        bullet.visible = false;
      }
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
            className: "phina.app.Element",
          },

          shotLayer: {
            className: "ps.ShotLayer",
            draw: function(canvas) {
              canvas.context.globalCompositeOperation = "lighter";
            },
          },

          effectLayer0: {
            className: "phina.display.CanvasElement",
          },

          player: {
            className: "ps.Player",
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.9,
          },

          itemLayer: {
            className: "phina.app.Element",
          },

          enemyLayer: {
            className: "phina.app.Element",
          },

          effectLayer1: {
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
              },
            },
          },

          bulletLayer: {
            className: "ps.BulletLayer",
          },

          dummy: {
            className: "ps.OutlinedSprite",
            arguments: ["bomb"],
            x: 20,
            y: 70,
            onenterframe: function() {
              this.x += 0.2;
              this.y += 0.2;
            }
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

    fireVulcan: function(frameIndex, x, y, direction) {
      var shot = this.pool.shift();
      if (shot) {
        shot.setup(frameIndex, x, y, direction).addChildTo(this);
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
      this.outline.update = function(app) {
        this.frameIndex = self.frameIndex;
        this.alpha = ps.OutlinedSprite.staticAlpha;
      };
      this.outline.draw = function(canvas) {
        canvas.context.globalCompositeOperation = "lighter";
        phina.display.Sprite.prototype.draw.call(this, canvas);
        canvas.context.globalCompositeOperation = "source-over";
      }
    },

    _static: {
      staticAlpha: 1.0
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Player", {
    superClass: "ps.OutlinedSprite",

    controllable: true,
    muteki: false,

    roll: 0,

    speed: 3.6,
    
    shotLayer: null,

    init: function() {
      this.superInit("player", 32, 32);
      this.frameIndex = 4;
    },

    update: function(app) {
      if (!this.controllable) return;
      
      var frame = app.ticker.frame;

      var kb = app.keyboard;
      var gp = app.gamepads.get(0);
      var p = app.pointer;
      
      moveVector.set(0, 0);

      moveVector.add(kb.getKeyDirection().mul(this.speed));
      if (gp) {
        var stick = gp.getStickDirection();
        if (0.4 < stick.length()) {
          moveVector.add(stick.normalize().mul(this.speed));
        }
      }
      if (p.getPointing()) {
        moveVector.add(p.deltaPosition.mul(2));
      }

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
      
      if (frame % 4 === 0) {
        var xv = Math.sin(frame / 4 * 0.6) * 8;
        this.shotLayer.fireVulcan(0, position.x - xv, position.y - 4, -90);
        this.shotLayer.fireVulcan(0, position.x + xv, position.y - 4, -90);
        this.shotLayer.fireVulcan(2, position.x - 14, position.y - 2, -93);
        this.shotLayer.fireVulcan(2, position.x + 14, position.y - 2, -87);
      }
    },

    launch: function() {
      // TODO
      this.x = GAMEAREA_WIDTH * 0.5;
      this.y = GAMEAREA_HEIGHT * 0.9;
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
      var p = phina.display.Sprite("particleB")
        .setScale(0.125)
        .setPosition(this.position.x, this.position.y)
        .on("enterframe", function() {
          this.position.y += 1;
          this.alpha -= 0.1;
          if (this.alpha < 0.01) this.remove();
        })
        .addChildTo(this.parent);
      p.draw = function(canvas) {
        canvas.context.globalCompositeOperation = "lighter";
        phina.display.Sprite.prototype.draw.call(this, canvas);
        canvas.context.globalCompositeOperation = "source-over";
      };
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

    init: function() {
      this.superInit("bullet", 24, 24);
    },
    
    onremoved: function() {
      this.shotLayer.pool.push(this);
    },

    setup: function(frameIndex, x, y, direction) {
      this.frameIndex = frameIndex;
      this.x = x;
      this.y = y;
      this.rotation = direction;
      var rad = direction * Math.DEG_TO_RAD;
      this.velocity = phina.geom.Vector2(Math.cos(rad) * speed, Math.sin(rad) * speed);
      
      return this;
    },

    update: function() {
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

    speedRate: 3,
    target: null,
    bulletLayer: null,

    init: function(target, bulletLayer) {
      this.target = target;
      this.bulletLayer = bulletLayer;
      
      this.put("densityRank", 0.0);
      this.put("speedRank", 0.0);
      this.put("burst", 0);
    },

    createNewBullet: function(runner, spec) {
      this.bulletLayer.spawn(runner, spec);
    },
    
    put: function(name, value) {
      bulletml.Walker.globalScope["$" + name] = value;
    },
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

    miss: function() {
      this.zanki -= 1;
      this.psyche = 0;
    },

    useBomb: function() {
      this.bomb -= 1;
      this.psyche *= 0.7;
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
    }

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
    }
  });

});

phina.namespace(function() {

  phina.define("ps.GameScene", {
    superClass: "phina.display.CanvasScene",

    stageId: null,
    gameData: null,
    bulletConfig: null,

    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "hsl(30, 60%, 60%)",
      });

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
      
      var player = this.mainLayer.player;

      this.gameData = params.gameData;
      this.leftSideBar.bindGameData(this.gameData);
      this.rightSideBar.bindGameData(this.gameData);
      this.bulletConfig = ps.BulletConfig(player, this.mainLayer.bulletLayer);

      player.shotLayer = this.mainLayer.shotLayer;

      // TODO atdks
      runner = ps.danmaku.akimoto1.createRunner(this.bulletConfig);
      runner.x = GAMEAREA_WIDTH * 0.5;
      runner.y = GAMEAREA_HEIGHT * 0.2;
    },

    update: function(app) {
      var frame = app.ticker.frame;

      this.gameData.updateView(frame);

      ps.OutlinedSprite.staticAlpha = 0.5 + Math.sin(frame * 0.15) * 0.5;

      // TODO atdks
      runner.update();
    },

    launchEnemy: function(enemy) {
      // TODO
    },

  });

  // TODO atdks
  var runner;
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
              next = "stage{0}preload".format(stageId + 1);
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
                nextLabel: stageName,
              },

              {
                label: stageName,
                className: "ps.GameScene",
                arguments: {
                  stageId: stageId,
                  gameData: gameData,
                },
                nextLabel: stageName + "result",
              },

              {
                label: stageName + "result",
                className: "ps.ResultScene",
                arguments: {
                  gameData: gameData,
                },
                nextLabel: next,
              },

            ];
          }),

          {
            label: "ending",
            className: "ps.EndingScene",
            nextLabel: "gameover",
          },

          {
            label: "gameover",
            className: "ps.GameoverScene",
            nextLabel: "nameEntry",
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
            nextLabel: "title",
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

  phina.define("ps.Background1", {
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
        this.y = 18 + Math.cos(frame * 0.001) * 14;
        frame += 1;
      });

      var self = this;

      var dx = 0.02;
      var dz = 0.08;

      var rangeX2 = 2.6 * 10;
      var rangeZ2 = 2.6 * 10;
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

              if (this.x < -rangeX2) this.x += rangeX2 * 2;
              if (rangeX2 < this.x) this.x += -rangeX2 * 2;
              if (this.z < -rangeZ2) this.z += rangeZ2 * 2;
              if (rangeZ2 < this.z) this.z += -rangeZ2 * 2;
            });
        });
      });

      var rangeX = 3.0 * 5.0;
      var rangeZ = 4.0 * 5.6;
      var vertices = [
        [-0.5, 0, -0.5],
        [-0.5, 0, +0.5],
        [+0.5, 0, +0.5],
        [+0.5, 0, -0.5],
      ];
      var random = phina.util.Random(12345);
      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          Array.range(0, random.randint(4, 9)).forEach(function(y) {
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

    init: function() {
      this.superInit();

      this.sequencer = ps.StageSequancer();
    },

    update: function(app) {
      var frame = app.ticker.frame;
      while (this.waitFor <= frame) {
        var task = this.sequencer.next();
        if (task) {
          task.execute(app, app.currentScene, this);
        }
      }
    },

    _static: {
      create: function(stageId) {
        switch (stageId) {
          case 0:
            return ps.Stage1();
        }
      }
    }
  });

  phina.define("ps.StageSequancer", {

    init: function() {
      this.seq = [];
    },

    addTask: function(task) {
      this.seq.push(task);
      return this;
    },

    next: function() {
      return this.seq.shift();
    },

    wait: function(frame) {
      return this.addTask(ps.StageTask(frame));
    },

    playBgm: function(bgmData) {
      return this.addTask(ps.PlayBgmTask(bgmData));
    },

    stopBgm: function() {
      return this.addTask(ps.StopBgmTask());
    },

    warning: function() {
      return this.addTask(ps.WarningTask());
    },

    launchEnemy: function(enemyClassName, params) {
      return this.addTask(ps.LaunchEnemyTask(enemyClassName, params));
    },

    launchBoss: function(bossClassName) {
      return this.addTask(ps.LaunchBossTask(bossClassName));
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

  phina.define("ps.PlayBgmTask", {
    superClass: "ps.StageTask",

    bgmData: null,

    init: function(bgmData) {
      this.superInit();
      this.bgmData = bgmData;
    }
  });

  phina.define("ps.StopBgmTask", {
    superClass: "ps.StageTask",

    init: function() {
      this.superInit();
    }
  });

  phina.define("ps.WarningTask", {
    superClass: "ps.StageTask",

    init: function() {
      this.superInit();
    }
  });

  phina.define("ps.LaunchEnemyTask", {
    superClass: "ps.StageTask",

    enemyClassName: null,
    params: null,

    init: function(enemyClassName, params) {
      this.superInit();
      this.enemyClassName = enemyClassName;
      this.params = params;
    }
  });

  phina.define("ps.LaunchBossTask", {
    superClass: "ps.StageTask",

    bossClassName: null,

    init: function(bossClassName, params) {
      this.superInit();
      this.bossClassName = bossClassName;
      this.params = params;
    }
  });

});

phina.namespace(function() {

  phina.define("ps.Stage1", {
    superClass: "ps.Stage",

    backgroundClassName: "ps.Background1",

    init: function() {
      this.superInit();
    }

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
      }
    }
  });

});

//# sourceMappingURL=phina-shooter.js.map
