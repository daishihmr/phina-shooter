phina.namespace(function() {

  phina.define("ps.Stage1", {
    superClass: "ps.Stage",

    backgroundClassName: "ps.Background1",

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
        .wait(150)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
        })
        //
        .wait(150)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-7),
        })
        //
        .wait(150)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
        })
        //
        .launchEnemyUnit("ps.Natsuki1", {
          x: x(-1),
          y: y(2),
          direction: 45,
          formation: "line7",
        })
        //
        .wait(250)
        .launchEnemyUnit("ps.Kujo1", {
          x: x(5),
          y: y(-7),
        })
        .launchEnemyUnit("ps.Kujo1", {
          x: x(2),
          y: y(-5),
        })
        //
        .launchEnemyUnit("ps.Natsuki1", {
          x: x(11),
          y: y(3),
          direction: 180,
          formation: "line6",
        })
        //
      ;
    }

  });

});
