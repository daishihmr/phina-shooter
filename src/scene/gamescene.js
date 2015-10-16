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
      gameData.on("miss", function() {});
      gameData.on("gameover", function() {});

      ps.BulletConfig.setup(player, this.mainLayer.bulletLayer);

      this.timer(120, function() {
        player.launch();
      });
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
      var shots = this.mainLayer.shotLayer.children;

      var es = enemies.slice();
      var ss = shots.slice();

      for (var si = 0, slen = ss.length; si < slen; si++) {
        var s = ss[si];
        for (var ei = 0, elen = es.length; ei < elen; ei++) {
          var e = es[ei];
          if (e.hitTest(s.x, s.y)) {
            if (e.damage(s.power)) {
              this.flare("kill", {
                enemy: e
              });
            }
            s.remove();
            break;
          }
        }
      }
    },
    _hitTestBombVsEnemy: function() {
      var enemies = this.mainLayer.enemyLayer.children;

      var es = enemies.slice();
    },
    _hitTestBulletVsPlayer: function() {
      var bullets = this.mainLayer.bulletLayer.children;
      var player = this.player;

      if (player.muteki) return;

      var bs = bullets.slice();
      for (var bi = 0, blen = bs.length; bi < blen; bi++) {
        var b = bs[bi];
        if (b.hitTest(player.x, player.y)) {
          this.flare("miss");
          console.log("miss by bullet");
          return;
        }
      }
    },
    _hitTestEnemyVsPlayer: function() {
      var enemies = this.mainLayer.enemyLayer.children;
      var player = this.player;

      if (player.muteki) return;

      var es = enemies.slice();
      for (var ei = 0, elen = es.length; ei < elen; ei++) {
        var e = es[ei];
        if (e.hitTest(player.x, player.y)) {
          this.flare("miss");
          console.log("miss by enemy");
          return;
        }
      }
    },

    launchEnemy: function(enemy) {
      this.mainLayer.enemyLayer.addChild(enemy);
    },

    onkill: function(e) {
      var enemy = e.enemy;
      enemy.remove();
      this.gameData.flare("kill", {
        enemy: enemy
      });
    },

    onmiss: function() {
      this.gameData.flare("miss");
      var player = this.player;
      player.miss();
      if (this.gameData.zanki < 0) {
        // TODO gameover
      } else {
        this.timer(60, function() {
          player.launch();
        });
      }
    },

  });
});
