phina.namespace(function() {

  phina.define("ps.Bullet", {
    superClass: "ps.OutlinedSprite",

    runner: null,
    active: false,

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
        
        if (!this.active) {
          this.frameIndex += 1;
          if (this.frameIndex <= 0 || 44 < this.frameIndex) {
            this.remove();
          }
        }
      }
    },
    
    spawn: function(runner, spec) {
      this.x = runner.x;
      this.y = runner.y;
      this.runner = runner;
      this.frameIndex = spec.type || 0;
      this.visible = !spec.dummy;
      this.active = true;
      this.outline.visible = true;
      return this;
    },
    
    erase: function() {
      if (!this.visible) {
        this.remove();
      }
      
      this.active = false;
      this.frameIndex = 12;
      this.outline.visible = false;
      this.runner.fireable = false;
      return this;
    },

    hitTest: function(_x, _y) {
      if (!this.visible || !this.active || !this.parent) return false;

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
