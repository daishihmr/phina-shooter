phina.namespace(function() {

  phina.define("ps.Bullet", {
    superClass: "ps.OutlinedSprite",

    runner: null,
    dummy: false,

    init: function() {
      this.superInit("bullet", 24, 24);
      this.age = 0;
    },

    update: function(app) {
      var runner = this.runner;
      if (runner) {
        var pos = this.position;
        
        var bx = pos.x;
        var by = pos.y;
        runner.update();
        var dx = runner.x - bx;
        var dy = runner.y - by;

        pos.x += dx * ps.Bullet.globalSpeedRate;
        pos.y += dy * ps.Bullet.globalSpeedRate;

        this.rotation = Math.atan2(pos.y - by, pos.x - bx) * 180 / Math.PI;

        this.age += 1;
      }
    },

    _static: {
      globalSpeedRate: 1.0,
    },

  });
});
