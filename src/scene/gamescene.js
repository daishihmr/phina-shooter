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

      this.fromJSON({
        stageId: params.stageId,
        gameData: params.gameData,
        children: {
          mainLayer: {
            className: "ps.gamescene.MainLayer",
            x: SIDEBAR_WIDTH,
            y: 0,

            children: {
              backgroundLayer: {
                className: "ps.Background1",
              },

              player: {
                className: "ps.Player",
                x: GAMEAREA_WIDTH * 0.5,
                y: GAMEAREA_HEIGHT * 0.9,
              },
              
              b: {
                className: "phina.display.Sprite",
                arguments: ["bomb"],
                x: GAMEAREA_WIDTH * 0.5,
                y: GAMEAREA_HEIGHT * 0.5,
              }
            }
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

      this.leftSideBar.bindGameData(this.gameData);
      this.rightSideBar.bindGameData(this.gameData);
    },

    update: function(app) {
      this.gameData.updateView(app.ticker.frame);
    },

    launchEnemy: function(enemy) {
      // TODO
    },

  });
});
