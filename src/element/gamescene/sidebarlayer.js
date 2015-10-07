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
      this.backgroundColor = ps.Color.sec1[0];
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
    },

    bindGameData: function(gameData) {
      gameData.bind("zanki", this.zanki);
      gameData.bind("bomb", this.bomb);
    },

  });

});
