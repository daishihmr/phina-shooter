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

      this.gameData = params.gameData;
      this.leftSideBar.bindGameData(this.gameData);
      this.rightSideBar.bindGameData(this.gameData);
      ps.BulletConfig.setup(player, this.mainLayer.bulletLayer);

      player.shotLayer = this.mainLayer.shotLayer;
    },

    update: function(app) {
      this.stage.update(app);

      var frame = app.ticker.frame;

      this.gameData.updateView(frame);

      ps.OutlinedSprite.staticAlpha = 0.5 + Math.sin(frame * 0.26) * 0.5;
    },

    launchEnemy: function(enemy) {
      this.mainLayer.enemyLayer.addChild(enemy);
    },

  });
});
