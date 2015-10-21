phina.namespace(function() {

  phina.define("ps.Stage0", {
    superClass: "ps.Stage",

    backgroundClassName: "ps.Background0",

    init: function() {
      this.superInit();

      var x = function(v) {
        return GAMEAREA_WIDTH * v * 0.1;
      };
      var y = function(v) {
        return GAMEAREA_HEIGHT * v * 0.1;
      };

      this.sequencer
        .startBgm()
        //
        .wait(250)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(80)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(80)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .launchEnemyUnit("ps.Natsuki1", {
          x: x(-1),
          y: y(2),
          direction: 45,
          formation: "line7",
        })
        //
        .wait(80)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(80)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(200)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        .wait(50)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-5),
          formation: "basic0",
        })
        //
        .launchEnemyUnit("ps.Natsuki1", {
          x: x(11),
          y: y(3),
          direction: 180,
          formation: "line6",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(80)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(80)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
        .wait(75)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
          formation: "basic0",
        })
        //
      ;
    }

  });

});
