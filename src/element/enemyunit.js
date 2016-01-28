phina.namespace(function() {

  /**
   * 敵編隊
   */
  phina.define("ps.EnemyUnit", {
    superClass: "phina.app.Object2D",

    init: function(params) {
      this.superInit();

      var self = this;
      var EnemyClass = phina.using(params.enemyClassName);
      var formation = ps.EnemyUnit.formations[params.formation];

      this.one("enterframe", function() {
        formation.forEach(function(f) {
          EnemyClass(params.$extend({
              x: params.x + f.x,
              y: params.y + f.y,
              wait: params.wait + f.wait,
            }))
            .on("killed", function() {
              self.flare("killedOne");
            })
            .on("removed", function() {
              self.flare("removedOne");
            });
        });
      });

      var killedCount = 0;
      this.on("killedOne", function() {
        killedCount += 1;
        if (killedCount === formation.length) {
          this.flare("annihilated");
        }
      });
      var removedCount = 0;
      this.on("removedOne", function() {
        removedCount += 1;
        if (removedCount === formation.length && killedCount < formation.length) {
          this.flare("annihilated");
        }
      });

      this.on("annihilated", function() {
        this.remove();
      });
    },

    _static: {
      /**
       * 敵編隊のフォーメーション
       * x {number} 位置x。編隊位置からの相対座標
       * y {number} 位置y。編隊位置からの相対座標
       * wait {number} 編隊出現から動き出すまでのフレーム
       */
      formations: {

        // basic

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

        "basic1": [{
          x: GAMEAREA_WIDTH * -0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 30,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.15,
          y: GAMEAREA_HEIGHT * -0.1,
          wait: 20,
        }, ],

        "basic2": [{
          x: GAMEAREA_WIDTH * -0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.1,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 50,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * -0.1,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.05,
          y: GAMEAREA_HEIGHT * -0.1,
          wait: 20,
        }, ],

        // wide

        "wide0": [{
          x: GAMEAREA_WIDTH * -0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * -0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, ],

        "wide1": [{
          x: GAMEAREA_WIDTH * -0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * -0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 30,
        }, {
          x: GAMEAREA_WIDTH * 0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 40,
        }, ],

        "wide2": [{
          x: GAMEAREA_WIDTH * -0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 40,
        }, {
          x: GAMEAREA_WIDTH * -0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 30,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 10,
        }, {
          x: GAMEAREA_WIDTH * 0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, ],

        "wide3": [{
          x: GAMEAREA_WIDTH * -0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 40,
        }, {
          x: GAMEAREA_WIDTH * -0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 60,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 40,
        }, {
          x: GAMEAREA_WIDTH * 0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, ],

        "wide4": [{
          x: GAMEAREA_WIDTH * -0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * -0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 0,
        }, {
          x: GAMEAREA_WIDTH * 0.0,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 40,
        }, {
          x: GAMEAREA_WIDTH * 0.2,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 20,
        }, {
          x: GAMEAREA_WIDTH * 0.4,
          y: GAMEAREA_HEIGHT * 0.0,
          wait: 60,
        }, ],

        // line

        "line4": [{
          x: 40 * -0,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * -1,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * -2,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * -3,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * -4,
          y: 40 * +0,
          wait: 0,
        }, ],

        "line6": [{
          x: 40 * +0,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * +1,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * +2,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * +3,
          y: 40 * +0,
          wait: 0,
        }, {
          x: 40 * +4,
          y: 40 * +0,
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

        "line8": [{
          x: 0,
          y: 40 * -0,
          wait: 0,
        }, {
          x: 0,
          y: 40 * -1,
          wait: 0,
        }, {
          x: 0,
          y: 40 * -2,
          wait: 0,
        }, {
          x: 0,
          y: 40 * -3,
          wait: 0,
        }, {
          x: 0,
          y: 40 * -4,
          wait: 0,
        }, ],

        "line9": [{
          x: 40 * +0,
          y: 40 * -0,
          wait: 0,
        }, {
          x: 40 * +1,
          y: 40 * -1,
          wait: 0,
        }, {
          x: 40 * +2,
          y: 40 * -2,
          wait: 0,
        }, {
          x: 40 * +3,
          y: 40 * -3,
          wait: 0,
        }, {
          x: 40 * +4,
          y: 40 * -4,
          wait: 0,
        }, ],

      }
    }
  });

});
