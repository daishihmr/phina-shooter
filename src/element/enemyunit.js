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
          x: 40 * 0,
          y: 40 * 0,
          wait: 0,
        }, {
          x: 40 * 1,
          y: 40 * 0,
          wait: 0,
        }, {
          x: 40 * 2,
          y: 40 * 0,
          wait: 0,
        }, {
          x: 40 * 3,
          y: 40 * 0,
          wait: 0,
        }, {
          x: 40 * 4,
          y: 40 * 0,
          wait: 0,
        }, ],

        "line7": [{
          x: 40 * -0,
          y: 40 * -0,
          wait: 0,
        }, {
          x: 40 * -1,
          y: 40 * -1,
          wait: 0,
        }, {
          x: 40 * -2,
          y: 40 * -2,
          wait: 0,
        }, {
          x: 40 * -3,
          y: 40 * -3,
          wait: 0,
        }, {
          x: 40 * -4,
          y: 40 * -4,
          wait: 0,
        }, ],

      }
    }
  });

});
