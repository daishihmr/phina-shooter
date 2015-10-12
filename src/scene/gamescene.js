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
      player.shotLayer = this.mainLayer.shotLayer;

      var gameData = this.gameData = params.gameData;
      this.leftSideBar.bindGameData(gameData);
      this.rightSideBar.bindGameData(gameData);
      gameData.on("miss", function() {
      });
      gameData.on("gameover", function() {
      });

      ps.BulletConfig.setup(player, this.mainLayer.bulletLayer);
    },

    update: function(app) {
      this.stage.update(app);

      var frame = app.ticker.frame;

      this.gameData.updateView(frame);

      ps.OutlinedSprite.staticAlpha = 0.5 + Math.sin(frame * 0.26) * 0.5;

      this._hitTestShotVsEnemy();
      this._hitTestBombVsEnemy();
      this._hitTestBulletVsPlayer();
      this._hitTestEnemyVsPlayer();
    },

    _hitTestShotVsEnemy: function() {
      var enemies = this.mainLayer.enemyLayer.children;
      var shot = this.mainLayer.shotLayer.children;
      
      var es = enemies.slice();
      var ss = shot.slice();
    },
    _hitTestBombVsEnemy: function() {
      var enemies = this.mainLayer.enemyLayer.children;

      var es = enemies.slice();
    },
    _hitTestBulletVsPlayer: function() {
      var bullets = this.main.bulletLayer.children;
      var player = this.player;
      
      if (player.muteki) return;
      
      var bs = bullets.slice();
    },
    _hitTestEnemyVsPlayer: function() {
      var enemies = this.mainLayer.enemyLayer.children;
      var player = this.player;
      
      if (player.muteki) return;
      
      var es = enemies.slice();
    },

    launchEnemy: function(enemy) {
      this.mainLayer.enemyLayer.addChild(enemy);
    },

  });
});
