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
        .launchEnemy("ps.Yukishiro1", {
          x: x(+5),
          y: y(-1),
        })
        //
      ;
    }

  });

});
