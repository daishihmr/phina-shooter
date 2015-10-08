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
            // draw: function(canvas) {
            // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          scoreItemLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
            // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          shotLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
            // canvas.context.globalCompositeOperation = "lighter";
            // },
          },

          effectLayer0: {
            className: "phina.display.CanvasElement",
            children: {
              playerBurnerL: {
                className: "ps.AfterBurner",
                onenterframe: function() {
                  this.position.x = self.player.position.x - 4;
                  this.position.y = self.player.position.y + 10;
                }
              },
              playerBurnerR: {
                className: "ps.AfterBurner",
                onenterframe: function() {
                  this.position.x = self.player.position.x + 4;
                  this.position.y = self.player.position.y + 10;
                }
              },
            },
          },

          player: {
            className: "ps.Player",
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.9,
            // draw: function(canvas) {
            // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          itemLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
            // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          enemyLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
            // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          effectLayer1: {
            className: "phina.app.Element",
            // draw: function(canvas) {
            // canvas.context.globalCompositeOperation = "lighter";
            // },
          },

          bulletLayer: {
            className: "ps.BulletLayer",
            // draw: function(canvas) {
            //   canvas.context.globalCompositeOperation = "lighter";
            // },
          },

          dummy: {
            className: "phina.app.Element",
            // draw: function(canvas) {
            //   canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          playerMarker: {
            className: "phina.display.CircleShape",
            arguments: {
              radius: 3,
              fill: ps.Color.sec0[13],
              stroke: ps.Color.sec0[3],
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