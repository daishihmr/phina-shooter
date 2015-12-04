phina.namespace(function() {

  phina.define("ps.Kujo1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 24, 24, params.$safe({
        boundingType: "circle",
        radius: 12,
        danmakuName: "basic",
        hp: 2,
      }));
      this.setSrcRect(32, 0, 24, 24);

      var propeler = ps.OutlinedSprite("enemy_stage0", 32, 32)
        .addChildTo(this)
        .on("enterframe", function() {
          this.rotation += 20;
        })
        .setSrcRect(0, 128, 32, 32);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.activate();
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

    onenterframe: function(e) {
      var app = e.app;
      var player = app.currentScene.player;
      this.rotation = Math.atan2(player.y - this.y, player.x - this.x) * Math.RAD_TO_DEG;
    },

    onkilled: function() {
      this.remove();
    },
  });

  phina.define("ps.Kiryu1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 24, 24, params.$safe({
        boundingType: "circle",
        radius: 12,
        danmakuName: "basic",
        hp: 2,
      }));
      this.setSrcRect(0, 0, 24, 24);

      this.move = phina.geom.Vector2(0, 1);

      var propeler = ps.OutlinedSprite("enemy_stage0", 32, 32)
        .addChildTo(this)
        .on("enterframe", function() {
          this.rotation += 20;
        })
        .setSrcRect(0, 128, 32, 32);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.activate();
          self.startAttack();
        });
    },

    onenterframe: function(e) {
      var app = e.app;
      var player = app.currentScene.player;
      this.rotation = Math.atan2(player.y - this.y, player.x - this.x) * Math.RAD_TO_DEG;
      if (this.y < player.y) {
        var delta = phina.geom.Vector2(player.x - this.x, player.y - this.y).normalize().mul(0.3);
        this.move.add(delta).normalize().mul(3);
      }
      this.position.add(this.move);
    },

    onkilled: function() {
      this.remove();
    },
  });

  phina.define("ps.Kise1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 32, 32, params.$safe({
        boundingType: "circle",
        radius: 16,
        danmakuName: "kise1",
        hp: 10,
      }));
      this.setSrcRect(0, 32, 32, 32);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.activate();
          self.startAttack();
        });
    },

    onenterframe: function(e) {
      this.y += 0.25;
    },

    onkilled: function() {
      this.remove();
    },
  });

  phina.define("ps.Natsuki1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 32, 32, params.$safe({
        boundingType: "circle",
        radius: 16,
        danmakuName: "forward",
        hp: 2,
      }));
      this.setSrcRect(32, 32, 32, 32);

      this.direction = params.direction * Math.DEG_TO_RAD;

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.activate();
          self.startAttack();
        });
    },

    onenterframe: function(e) {
      var app = e.app;
      this.x += Math.cos(this.direction) * 0.75;
      this.y += Math.sin(this.direction) * 0.75;
      this.rotation = this.direction * Math.RAD_TO_DEG;

      var player = app.currentScene.player;
      var t = Math.atan2(player.y - this.y, player.x - this.x) + Math.PI * 2;
      if (this.runner) this.runner.direction = ~~((t + U225) / U45) * U45;
    },

    onkilled: function() {
      this.remove();
    },
  });

  phina.define("ps.Kurokawa1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 64, 64, params.$safe({
        boundingType: "circle",
        radius: 30,
        danmakuName: "kurokawa1",
        hp: 30,
      }));
      this.setSrcRect(64, 0, 64, 64);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.activate();
          self.startAttack();
        })
        .by({
          y: GAMEAREA_HEIGHT * 0.3
        }, 40, "easeOutQuad");
    },

    onenterframe: function(e) {
      this.y += 0.5;
    },

    onkilled: function() {
      this.remove();
    },
  });

  phina.define("ps.Akimoto1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 128, 64, params.$safe({
        boundingType: "rect",
        boundingWidth: 90,
        boundingHeight: 30,
        danmakuName: "akimoto1",
        hp: 60,
      }));
      this.setSrcRect(0, 64, 128, 64);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.activate();
          self.startAttack();
        })
        .by({
          y: GAMEAREA_HEIGHT * 0.3
        }, 40, "easeOutQuad");
    },

    onenterframe: function(e) {
      this.y += 0.4;
    },

    onkilled: function() {
      this.remove();
    },
  });

  phina.define("ps.Yukishiro1", {
    superClass: "ps.Enemy",
    init: function(params) {
      this.superInit("enemy_stage0", 192, 96, params.$safe({
        boundingType: "rect",
        boundingWidth: 190,
        boundingHeight: 60,
        danmakuName: "yukishiro1",
        // hp: 300,
        hp: 3,
        eraseBullet: true,
      }));
      this.setSrcRect(128, 0, 192, 96);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.activate();
          self.startAttack();
        })
        .to({
          y: GAMEAREA_HEIGHT * 0.20
        }, 60, "easeOutQuad")
        .call(function() {
          self.ftweener
            .clear()
            .to({
              x: GAMEAREA_WIDTH * 0.6,
              y: GAMEAREA_HEIGHT * 0.24,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.5,
              y: GAMEAREA_HEIGHT * 0.28,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.4,
              y: GAMEAREA_HEIGHT * 0.24,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.5,
              y: GAMEAREA_HEIGHT * 0.20,
            }, 150, "easeInOutQuad")
            .setLoop(true);
        });
    },
    onbulletend: function(e) {
      this.startAttack(e.next);
    },

    onkilled: function() {
      this.remove();
    },
  });

  phina.define("ps.Misumi1", {
    superClass: "ps.Enemy",
    init: function(params) {
      var MAX_HP = 600;
      this.superInit("enemy_stage0", 192, 96, params.$safe({
        boundingType: "rect",
        boundingWidth: 190,
        boundingHeight: 60,
        danmakuName: "misumi11",
        hp: MAX_HP,
        eraseBullet: true,
      }));
      this.setSrcRect(128, 96, 192, 96);

      var self = this;
      this.ftweener
        .wait(params.wait)
        .call(function() {
          self.activate();
          self.startAttack();
        })
        .to({
          y: GAMEAREA_HEIGHT * 0.20
        }, 60, "easeOutQuad")
        .call(function() {
          self.ftweener
            .clear()
            .to({
              x: GAMEAREA_WIDTH * 0.6,
              y: GAMEAREA_HEIGHT * 0.24,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.5,
              y: GAMEAREA_HEIGHT * 0.28,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.4,
              y: GAMEAREA_HEIGHT * 0.24,
            }, 150, "easeInOutQuad")
            .to({
              x: GAMEAREA_WIDTH * 0.5,
              y: GAMEAREA_HEIGHT * 0.20,
            }, 150, "easeInOutQuad")
            .setLoop(true);
        });

      this.on("damaged", function(e) {
        if (e.after <= MAX_HP * 0.6 && MAX_HP * 0.6 < e.before) {
          var gameScene = this.parent.parent;
          gameScene.bulletLayer.eraseAll();
          this.startAttack("misumi21");
        } else if (e.after <= MAX_HP * 0.2 && MAX_HP * 0.2 < e.before) {
          var gameScene = this.parent.parent;
          gameScene.bulletLayer.eraseAll();
          this.startAttack("misumi31");
        }
      });
    },
    onbulletend: function(e) {
      this.startAttack(e.next);
    },

    onkilled: function() {
      this.remove();
    },
  });

  var U45 = Math.PI * 2 / 8;
  var U225 = Math.PI * 2 / 16;
});
