phina.namespace(function() {

  phina.define("ps.Bullet", {
    superClass: "ps.OutlinedSprite",

    runner: null,

    init: function() {
      this.superInit("bullet", 24, 24);
      this.age = 0;
      this.boundingType = "circle";
      this.radius = 2;
    },

    onremoved: function() {
      this.bulletLayer.pool.push(this);
    },

    update: function(app) {
      var runner = this.runner;
      if (runner) {
        var bx = this.x;
        var by = this.y;
        runner.x = bx;
        runner.y = by;
        runner.update();
        var dx = runner.x - bx;
        var dy = runner.y - by;

        this.x += dx * ps.Bullet.globalSpeedRate;
        this.y += dy * ps.Bullet.globalSpeedRate;

        if (this.x < -12 || GAMEAREA_WIDTH + 12 < this.x || this.y < -12 || GAMEAREA_HEIGHT + 12 < this.y) {
          this.remove();
          return;
        }

        this.rotation = Math.atan2(this.y - by, this.x - bx) * 180 / Math.PI;

        this.age += 1;
      }
    },

    hitTest: function(_x, _y) {
      if (!this.visible || !this.parent) return false;

      var x = _x - this.x;
      var y = _y - this.y;

      if ((x * x + y * y) < (this.radius * this.radius)) {
        return true;
      }
      return false;
    },

    _static: {
      globalSpeedRate: 1.0,
    },

  });
});
