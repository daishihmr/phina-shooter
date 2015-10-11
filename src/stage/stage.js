phina.namespace(function() {

  phina.define("ps.Stage", {
    superClass: "phina.util.EventDispatcher",

    waitFor: -1,
    sequencer: null,
    random: null,

    block: false,

    init: function() {
      this.superInit();
      this.sequencer = ps.StageSequancer();
      this.random = phina.util.Random(12345);
    },

    update: function(app) {
      var frame = app.ticker.frame;
      while (this.sequencer.hasNext() && this.waitFor <= frame) {
        var task = this.sequencer.next();
        if (task) {
          if (!((task instanceof ps.LaunchEnemyTask || task instanceof ps.LaunchEnemyUnitTask) && this.block)) {
            task.execute(app, app.currentScene, this);
          }
        }
      }
    },

    _static: {
      create: function(stageId) {
        switch (stageId) {
          case 0:
            return ps.Stage1();
        }
      }
    }
  });

  phina.define("ps.StageSequancer", {

    init: function() {
      this.seq = [];
    },

    hasNext: function() {
      return this.seq.length > 0;
    },

    addTask: function(task) {
      this.seq.push(task);
      return this;
    },

    next: function() {
      return this.seq.shift();
    },

    wait: function(frame) {
      return this.addTask(ps.WaitTask(frame));
    },

    startBgm: function(bgmData) {
      return this.addTask(ps.StartBgmTask(bgmData));
    },

    stopBgm: function(fadeOut) {
      return this.addTask(ps.StopBgmTask(fadeOut));
    },

    warning: function() {
      return this.addTask(ps.WarningTask());
    },

    launchEnemy: function(enemyClassName, params) {
      return this.addTask(ps.LaunchEnemyTask(enemyClassName, params));
    },

    launchEnemyUnit: function(enemyClassName, params) {
      return this.addTask(ps.LaunchEnemyUnitTask(enemyClassName, params));
    },

    launchBoss: function(bossClassName) {
      return this.addTask(ps.LaunchBossTask(bossClassName));
    },
  });

  phina.define("ps.StageTask", {
    init: function() {},
    execute: function(app, gameScene, stage) {}
  });

  phina.define("ps.WaitTask", {
    superClass: "ps.StageTask",

    frame: 0,

    init: function(frame) {
      this.frame = frame;
    },

    execute: function(app, gameScene, stage) {
      stage.waitFor = app.ticker.frame + this.frame;
    }
  });

  phina.define("ps.StartBgmTask", {
    superClass: "ps.StageTask",

    bgmData: null,

    init: function(bgmData) {
      this.superInit();
      this.bgmData = bgmData;
    },

    execute: function(app, gameScene, stage) {
      ps.SoundManager.startBgm(this.bgmData);
    }
  });

  phina.define("ps.StopBgmTask", {
    superClass: "ps.StageTask",

    init: function(fadeOut) {
      this.superInit();
      this.fadeOut = fadeOut;
    },

    execute: function(app, gameScene, stage) {
      ps.SoundManager.stopBgm(this.fadeOut);
    }
  });

  phina.define("ps.WarningTask", {
    superClass: "ps.StageTask",

    init: function() {
      this.superInit();
    },

    execute: function(app, gameScene, stage) {}
  });

  phina.define("ps.LaunchEnemyTask", {
    superClass: "ps.StageTask",

    enemyClassName: null,
    params: null,

    init: function(enemyClassName, params) {
      this.superInit();
      this.enemyClassName = enemyClassName;
      this.params = params.$safe({
        x: GAMEAREA_WIDTH * 0.5,
        y: GAMEAREA_HEIGHT * -0.1,
        blockFlag: false,
        wait: 0,
      });
    },

    execute: function(app, gameScene, stage) {
      var EnemyClazz = phina.using(this.enemyClassName);
      var params = this.params;
      var enemy = EnemyClazz(params);
      gameScene.launchEnemy(enemy);

      stage.block = this.params.blockFlag;
    }
  });

  phina.define("ps.LaunchEnemyUnitTask", {
    superClass: "ps.StageTask",

    enemyClassName: null,
    params: null,

    init: function(enemyClassName, params) {
      this.superInit();
      this.enemyClassName = enemyClassName;
      this.params = params.$safe({
        x: GAMEAREA_WIDTH * 0.5,
        y: GAMEAREA_HEIGHT * -0.1,
        blockFlag: false,
        formation: "basic0",
        wait: 0,
      });
    },

    execute: function(app, gameScene, stage) {
      var EnemyClazz = phina.using(this.enemyClassName);
      var params = this.params;
      var enemy = null;
      ps.EnemyUnit.formation[params.formation].forEach(function(f) {
        enemy = EnemyClazz({}.$extend(params, {
          x: params.x + f.x,
          y: params.y + f.y,
          wait: f.wait,
        }));
        gameScene.launchEnemy(enemy);
      });
    }
  });

  phina.define("ps.LaunchBossTask", {
    superClass: "ps.StageTask",

    bossClassName: null,

    init: function(bossClassName, params) {
      this.superInit();
      this.bossClassName = bossClassName;
      this.params = params;
    },

    execute: function(app, gameScene, stage) {}
  });

});
