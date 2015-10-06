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

      this.gameData = params.gameData;
      this.leftSideBar.bindGameData(this.gameData);
      this.rightSideBar.bindGameData(this.gameData);
      this.bulletConfig = ps.BulletConfig(this.mainLayer.player, this.mainLayer.bulletLayer);
      
      runner = ps.danmaku.akimoto1.createRunner(this.bulletConfig);
      runner.x = GAMEAREA_WIDTH * 0.5;
      runner.y = GAMEAREA_HEIGHT * 0.2;
    },

    update: function(app) {
      this.gameData.updateView(app.ticker.frame);
      runner.update();
    },

    launchEnemy: function(enemy) {
      // TODO
    },

  });

  var runner;
});
