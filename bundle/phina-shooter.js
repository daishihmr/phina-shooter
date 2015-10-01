var SCREEN_WIDTH = 720;
var SCREEN_HEIGHT = 480;

var GAMEAREA_WIDTH = SCREEN_HEIGHT * 0.7;
var GAMEAREA_HEIGHT = SCREEN_HEIGHT;

var SIDEBAR_WIDTH = (SCREEN_WIDTH - GAMEAREA_WIDTH) * 0.5;
var SIDEBAR_HEIGHT = SCREEN_HEIGHT;

var FONT_SIZE_XL = 0.07 * SCREEN_WIDTH;
var FONT_SIZE_L = 0.03 * SCREEN_WIDTH;
var FONT_SIZE_M = 0.02 * SCREEN_WIDTH;
var FONT_SIZE_S = 0.012 * SCREEN_WIDTH;

phina.main(function() {

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
      
      var loading = ps.LoadingScene({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        lie: false,
        exitType: "replace",
        nextScene: ps.GameScene,
        assets: {
          font: {
            title: "asset/Bangers/Bangers.ttf",
            main: "asset/Anton/Anton.ttf",
            mono: "asset/Share_Tech_Mono/ShareTechMono-Regular.ttf",
          }
        }
      });
      this.replaceScene(loading);
    }

  });

});

phina.namespace(function() {

  phina.define("ps.HudLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit(options.$safe({
        fill: "white",
        stroke: null,
        fontSize: FONT_SIZE_M,
        fontFamily: "main",
        align: "left",
        baseline: "middle",
      }));
    },

  });
});

phina.namespace(function() {

  phina.define("ps.Player", {
    superClass: "phina.display.Sprite",

    init: function() {
      this.superInit();
    }

  });

});

phina.namespace(function() {

  phina.define("ps.ScoreLabel", {
    superClass: "phina.display.Label",

    init: function() {
      this.superInit({
        fill: "white",
        stroke: null,
        fontSize: FONT_SIZE_M,
        fontFamily: "mono",
        align: "right",
        baseline: "middle",
      });

      this.score = 9999999999999;
    },

    formatText: function() {
      var v = "" + Math.floor(this._score);
      if (12 < v.length) {
        v = v.substring(0, v.length - 12) + "兆" + v.substring(v.length - 12);
      }
      if (8 < v.length) {
        v = v.substring(0, v.length - 8) + "億" + v.substring(v.length - 8);
      }
      if (4 < v.length) {
        v = v.substring(0, v.length - 4) + "万" + v.substring(v.length - 4);
      }

      this.text = v;
    },

    _accessor: {
      score: {
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

  phina.define("ps.gamescene.MainLayer", {
    superClass: "phina.display.Layer",

    init: function() {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);
      this.backgroundColor = "hsl(240, 100%, 5%)";
    }

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
      this.backgroundColor = "hsl(0, 100%, 7%)";
    },

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
  
});

phina.namespace(function() {

  phina.define("ps.GameScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      var sidebarGridX = phina.util.Grid(SIDEBAR_WIDTH, 16);
      var sidebarGridY = phina.util.Grid(SIDEBAR_HEIGHT, 16);

      this.fromJSON({
        children: {
          leftLayer: {
            className: "ps.gamescene.SideBarLayer",
            x: 0,
            y: 0,
            children: {

              totalScoreLabel: {
                className: "ps.HudLabel",
                arguments: {
                  text: "TOTAL SCORE",
                },
                x: sidebarGridX.span(1),
                y: sidebarGridY.span(1),
              },
              totalScore: {
                className: "ps.ScoreLabel",
                x: sidebarGridX.span(15),
                y: sidebarGridY.span(2),
              },

              stageScoreLabel: {
                className: "ps.HudLabel",
                arguments: {
                  text: "STAGE SCORE",
                },
                x: sidebarGridX.span(1),
                y: sidebarGridY.span(3),
              },
              stageScore: {
                className: "ps.ScoreLabel",
                x: sidebarGridX.span(15),
                y: sidebarGridY.span(4),
              },

              psycheLabel: {
                className: "ps.HudLabel",
                arguments: {
                  text: "PSYCHE",
                },
                x: sidebarGridX.span(1),
                y: sidebarGridY.span(6),
              },
              psyche: {
                className: "ps.ScoreLabel",
                x: sidebarGridX.span(15),
                y: sidebarGridY.span(7),
              },

            }
          },
          rightLayer: {
            className: "ps.gamescene.SideBarLayer",
            x: SCREEN_WIDTH - SIDEBAR_WIDTH,
            y: 0,
            children: {
              gameTitleLabel: {
                className: "ps.HudLabel",
                arguments: {
                  text: "Phina Shooter",
                  align: "center",
                  fontFamily: "title",
                  fontSize: FONT_SIZE_L,
                  fill: "hsl(50, 80%, 80%)",
                  stroke: "hsl(0, 100%, 50%)",
                },
                x: sidebarGridX.center(),
                y: sidebarGridY.span(15),
              },
            }
          },
          mainLayer: {
            className: "ps.gamescene.MainLayer",
            x: SIDEBAR_WIDTH,
            y: 0,
          },
        }
      });
    },
    
    update: function() {
    }

  });
});

phina.namespace(function() {

  phina.define("ps.LoadingScene", {
    superClass: "phina.game.LoadingScene",

    init: function(options) {
      this.superInit(options);
    }

  });
});

//# sourceMappingURL=phina-shooter.js.map
