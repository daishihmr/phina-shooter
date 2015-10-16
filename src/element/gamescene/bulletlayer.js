phina.namespace(function() {

  phina.define("ps.BulletLayer", {
    superClass: "phina.display.CanvasElement",

    pool: null,

    init: function() {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);

      var self = this;
      this.pool = Array.range(0, 256).map(function() {
        var b = ps.Bullet();
        b.bulletLayer = self;
        return b;
      });
    },

    spawn: function(runner, spec) {
      var bullet = this.pool.shift();
      if (!bullet) return;
      
      bullet.x = runner.x;
      bullet.y = runner.y;
      bullet.runner = runner;
      bullet.frameIndex = spec.type || 0;
      bullet.visible = !spec.dummy;
      bullet.addChildTo(this);
    },

    update: function() {
      var bs = this.children.slice(0);
      for (var i = 0, len = bs.length; i < len; i++) {
        var b = bs[i];
        if (b.x < 0 || GAMEAREA_WIDTH < b.x || b.y < 0 || GAMEAREA_HEIGHT < b.y) {
          b.remove();
        }
      }
    },
  });

});
