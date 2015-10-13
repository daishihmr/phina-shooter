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

          shotLayer: {
            className: "ps.ShotLayer",
          },

          effectLayer0: {
            className: "phina.display.CanvasElement",
          },

          enemyLayer: {
            className: "phina.display.CanvasElement",
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
              playerBurner: {
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

      this.player.parts.push(this.effectLayer1.playerBurner);
      this.player.parts.push(this.playerMarker);
    }

  });
});
