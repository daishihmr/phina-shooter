phina.namespace(function() {

  phina.define("ps.EnemyUnit", {
    init: function() {},
    _static: {
      formation: {

        "basic0": [{
          x: GAMEAREA_WIDTH * -0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.05,
          y: GAMEAREA_HEIGHT * -0.1,
          wait: 20,
        }, ],

        "line6": [{
          x: 32 * 0,
          y: 32 * 0,
          wait: 0,
        }, {
          x: 32 * 1,
          y: 32 * 0,
          wait: 0,
        }, {
          x: 32 * 2,
          y: 32 * 0,
          wait: 0,
        }, {
          x: 32 * 3,
          y: 32 * 0,
          wait: 0,
        }, {
          x: 32 * 4,
          y: 32 * 0,
          wait: 0,
        }, ],

        "line7": [{
          x: 32 * -0,
          y: 32 * -0,
          wait: 0,
        }, {
          x: 32 * -1,
          y: 32 * -1,
          wait: 0,
        }, {
          x: 32 * -2,
          y: 32 * -2,
          wait: 0,
        }, {
          x: 32 * -3,
          y: 32 * -3,
          wait: 0,
        }, {
          x: 32 * -4,
          y: 32 * -4,
          wait: 0,
        }, ],

      }
    }
  });

});
