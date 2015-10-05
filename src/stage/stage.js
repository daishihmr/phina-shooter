phina.namespace(function() {

  phina.define("ps.Stage", {
    superClass: "phina.util.EventDispatcher",

    waitFor: -1,
    sequencer: null,

    init: function() {
      this.superInit();

      this.sequencer = ps.StageSequancer();
    },

    update: function(app) {
      var frame = app.ticker.frame;
      while (this.waitFor <= frame) {
        var task = this.sequencer.next();
        if (task) {
          task.execute(app, app.currentScene, this);
        }
      }
    }
  });

  phina.define("ps.StageSequancer", {

    init: function() {
      this.seq = [];
    },

    addTask: function(task) {
      this.seq.push(task);
      return this;
    },

    next: function() {
      return this.seq.shift();
    },

    wait: function(frame) {
      return this.addTask(ps.StageTask(frame));
    },

    playBgm: function(bgmData) {
      return this.addTask(ps.PlayBgmTask(bgmData));
    },

    stopBgm: function() {
      return this.addTask(ps.StopBgmTask());
    },

    warning: function() {
      return this.addTask(ps.WarningTask());
    },

    launchEnemy: function(enemyClassName, params) {
      return this.addTask(ps.LaunchEnemyTask(enemyClassName, params));
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

  phina.define("ps.PlayBgmTask", {
    superClass: "ps.StageTask",

    bgmData: null,

    init: function(bgmData) {
      this.superInit();
      this.bgmData = bgmData;
    }
  });

  phina.define("ps.StopBgmTask", {
    superClass: "ps.StageTask",

    init: function() {
      this.superInit();
    }
  });

  phina.define("ps.WarningTask", {
    superClass: "ps.StageTask",

    init: function() {
      this.superInit();
    }
  });

  phina.define("ps.LaunchEnemyTask", {
    superClass: "ps.StageTask",

    enemyClassName: null,
    params: null,

    init: function(enemyClassName, params) {
      this.superInit();
      this.enemyClassName = enemyClassName;
      this.params = params;
    }
  });

  phina.define("ps.LaunchBossTask", {
    superClass: "ps.StageTask",

    bossClassName: null,

    init: function(bossClassName, params) {
      this.superInit();
      this.bossClassName = bossClassName;
      this.params = params;
    }
  });

});
