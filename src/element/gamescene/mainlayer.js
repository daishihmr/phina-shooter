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
