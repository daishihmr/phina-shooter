phina.namespace(function() {

  phina.define("ps.Kujo1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 24, 24, params.$safe({
        boundingType: "circle",
        radius: 10,
        danmakuName: "basic",
      }));
      this.setSrcRect(32, 0, 24, 24);

      var propeler = ps.OutlinedSprite("enemy_stage0", 32, 32)
        .addChildTo(this)
        .on("enterframe", function() {
          this.rotation += 20;
        });
      propeler.srcRect.x = 0;
      propeler.srcRect.y = 128;
      propeler.srcRect.width = 32;
      propeler.srcRect.height = 32;

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        })
        .by({
          y: GAMEAREA_HEIGHT * 1.0
        }, 80, "easeOutQuad")
        .wait(120)
        .to({
          y: params.y
        }, 80, "easeInQuad");
    },

    update: function(app) {
      var player = app.currentScene.player;
      this.rotation = Math.atan2(player.y - this.y, player.x - this.x) * Math.RAD_TO_DEG;
    }
  });

  phina.define("ps.Kiryu1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 24, 24, params.$safe({
        boundingType: "circle",
        radius: 10,
        danmakuName: "basic",
      }));
      this.setSrcRect(0, 0, 24, 24);

      var propeler = ps.OutlinedSprite("enemy_stage0", 32, 32)
        .addChildTo(this)
        .on("enterframe", function() {
          this.rotation += 20;
        });
      propeler.srcRect.x = 0;
      propeler.srcRect.y = 128;
      propeler.srcRect.width = 32;
      propeler.srcRect.height = 32;

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        });
    },

    update: function(app) {
      var player = app.currentScene.player;
      this.rotation = Math.atan2(player.y - this.y, player.x - this.x) * Math.RAD_TO_DEG;
    }
  });

  phina.define("ps.Kise1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 32, 32, params.$safe({
        boundingType: "circle",
        radius: 14,
        danmakuName: "kise1",
      }));
      this.setSrcRect(0, 32, 32, 32);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        });
    },
  });

  phina.define("ps.Natsuki1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 32, 32, params.$safe({
        boundingType: "circle",
        radius: 14,
        danmakuName: "forward",
      }));
      this.setSrcRect(32, 32, 32, 32);

      this.direction = params.direction * Math.DEG_TO_RAD;

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.startAttack();
        });
    },

    update: function(app) {
      this.x += Math.cos(this.direction) * 0.5;
      this.y += Math.sin(this.direction) * 0.5;
      this.rotation = this.direction * Math.RAD_TO_DEG;

      var player = app.currentScene.player;
      var t = Math.atan2(player.y - this.y, player.x - this.x) + Math.PI * 2;
      if (this.runner) this.runner.direction = ~~((t + U225) / U45) * U45;
    }
  });

  var U45 = Math.PI * 2 / 8;
  var U225 = Math.PI * 2 / 16;
});
