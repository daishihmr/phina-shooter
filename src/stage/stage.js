phina.namespace(function() {

  phina.define("ps.Stage", {
    superClass: "phina.util.EventDispatcher",

    waitFor: -1,
    sequencer: null,
    random: null,

    lock: false,

    init: function() {
      this.superInit();
      this.sequencer = ps.StageSequancer();
      this.random = phina.util.Random(12345);
    },

    update: function(app) {
      var frame = app.ticker.frame;
      while (this.sequencer.hasNext() && this.waitFor <= frame) {
        this.sequencer.next().execute(app, app.currentScene, this);
      }
    },

    _static: {
      create: function(stageId) {
        switch (stageId) {
          case 0:
            return ps.Stage0();
            // TODO
        }
      }
    }
  });

  phina.define("ps.StageSequancer", {
    
    cur: 0,

    init: function() {
      this.seq = [];
    },

    hasNext: function() {
      return this.cur < this.seq.length;
    },

    addTask: function(task) {
      this.seq.push(task);
      return this;
    },

    next: function() {
      var task = this.seq[this.cur];
      this.cur += 1;
      return task;
    },

    wait: function(frame) {
      return this.addTask(ps.WaitTask(frame));
    },
    
    repeatStart: function(time) {
      var self = this;
      return this.addTask(ps.CallFuncTask(function() {
        self.backCur = self.cur;
        self.time = time;
      }));
    },
    repeatEnd: function() {
      var self = this;
      return this.addTask(ps.CallFuncTask(function() {
        self.time -= 1;
        if (0 < self.time) {
          self.cur = self.backCur;
        }
      }));
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

    launchEnemy: function(enemyClassName, params, lock) {
      return this.addTask(ps.LaunchEnemyTask(enemyClassName, params, lock));
    },

    launchEnemyUnit: function(enemyClassName, params) {
      return this.addTask(ps.LaunchEnemyUnitTask(enemyClassName, params));
    },
    
    launchEnemyLoop: function(enemyClassName, params) {
      return this.addTask(ps.LaunchEnemyLoopTask(enemyClassName, params));
    },

    launchBoss: function(bossClassName) {
      return this.addTask(ps.LaunchBossTask(bossClassName));
    },

    call: function(func) {
      return this.addTask(ps.CallFuncTask(func));
    },

    unlock: function() {
      return this.addTask(ps.CallFuncTask(function(app, scene, stage) {
        stage.lock = false;
      }));
    }
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
    lock: false,

    init: function(enemyClassName, params, lock) {
      this.superInit();
      this.enemyClassName = enemyClassName;
      this.params = params.$safe({
        x: GAMEAREA_WIDTH * 0.5,
        y: GAMEAREA_HEIGHT * -0.1,
        wait: 0,
      });
      this.lock = lock;
    },

    execute: function(app, gameScene, stage) {
      if (stage.lock) return;

      var EnemyClazz = phina.using(this.enemyClassName);
      var params = this.params;
      var enemy = EnemyClazz(params);
      gameScene.launchEnemy(enemy);

      stage.lock = this.lock;
      if (this.lock) {
        enemy.on("killed", function() {
          stage.lock = false;
        });
        enemy.on("annihilated", function() {
          stage.lock = false;
        });
        enemy.on("removed", function() {
          stage.lock = false;
        });
      }
    }
  });

  phina.define("ps.LaunchEnemyUnitTask", {
    superClass: "ps.StageTask",

    params: null,

    init: function(enemyClassName, params) {
      this.superInit();
      this.params = params.$safe({
        enemyClassName: enemyClassName,
        x: GAMEAREA_WIDTH * 0.5,
        y: GAMEAREA_HEIGHT * -0.1,
        formation: "basic0",
        wait: 0,
      });
    },

    execute: function(app, gameScene, stage) {
      if (stage.lock) return;
      
      var enemyUnit = ps.EnemyUnit(this.params);
      gameScene.launchEnemy(enemyUnit);
    }
  });

  phina.define("ps.LaunchEnemyLoopTask", {
    superClass: "ps.StageTask",

    params: null,

    init: function(enemyClassName, params) {
      this.superInit();
      this.params = params.$safe({
        enemyClassName: enemyClassName,
        x: GAMEAREA_WIDTH * 0.5,
        y: GAMEAREA_HEIGHT * -0.1,
        maxCount: 5,
        limitAge: 300,
        wait: 0,
      });
    },

    execute: function(app, gameScene, stage) {
      if (stage.lock) return;

      var enemyLooper = ps.EnemyLooper(this.params);
      gameScene.launchEnemy(enemyLooper);
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

  phina.define("ps.CallFuncTask", {
    superClass: "ps.StageTask",

    func: null,

    init: function(func) {
      this.superInit();
      this.func = func;
    },

    execute: function(app, gameScene, stage) {
      this.func(app, gameScene, stage);
    }
  });

});
