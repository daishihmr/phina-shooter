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
