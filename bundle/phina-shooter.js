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
    }

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
                zanki: "asset/zankiIcon.png",
                bomb: "asset/bombIcon.png",
              },

              font: {
                title: "asset/Black_Ops_One/BlackOpsOne-Regular.ttf",
                main: "asset/Press_Start_2P/PressStart2P-Regular.ttf",
                mono: "asset/VT323/VT323-Regular.ttf",
                // mono: "asset/Share_Tech_Mono/ShareTechMono-Regular.ttf",
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

  phina.define("ps.BombDisplay", {
    superClass: "ps.ItemDisplay",

    init: function(initialValue) {
      this.superInit("bomb", initialValue);
    },

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
          newItem.setPosition(self.children.length * -newItem.width * 1.1, 0)
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

    init: function(options) {
      this.superInit((options || {}).$safe({
        fill: "white",
        stroke: null,
        fontSize: FONT_SIZE_L,
        fontFamily: "mono",
        align: "right",
        baseline: "middle",
      }));

      this.value = Math.rand(0, 10000000000000);
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

  phina.define("ps.TitleLogoLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit((options || {}).$safe({
        text: "Phina Shooter",
        align: "center",
        fontFamily: "title",
        fontSize: FONT_SIZE_L,
        fill: "hsl(50, 80%, 80%)",
        stroke: "hsl(0, 100%, 50%)",
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

  phina.define("ps.GameData", {
    superClass: "phina.util.EventDispatcher",

    currentStage: 0,

    score: 0,
    zanki: 0,
    bomb: 0,
    psyche: 0,
    highScore: 0,

    init: function() {
      this.superInit();
      this._binder = {};
    },

    update: function() {
      var self = this;
      self._binder.forIn(function(name, view) {
        if (self[name] !== undefined) {
          view.value = self[name];
        }
      });
    },

    bind: function(name, view) {
      this._binder[name] = view;
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
      this.gridX = phina.util.Grid(SIDEBAR_WIDTH, 16);
      this.gridY = phina.util.Grid(SIDEBAR_HEIGHT, 17);
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
    }

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
              text: "BOMBER",
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
    }

  });

});

phina.namespace(function() {

  phina.define("ps.GameScene", {
    superClass: "phina.display.CanvasScene",

    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      this.fromJSON({
        stageId: params.stageId,
        children: {
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
          mainLayer: {
            className: "ps.gamescene.MainLayer",
            x: SIDEBAR_WIDTH,
            y: 0,
          },
        }
      });
    },

    update: function() {}

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

  /**
   * arcadeモード
   */
  phina.define("ps.ArcadeModeSequence", {
    superClass: "phina.game.ManagerScene",

    init: function() {
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
                  stageId: stageId
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
          
        ],

        startLabel: "load",
      });
    }
  });

});

//# sourceMappingURL=phina-shooter.js.map
