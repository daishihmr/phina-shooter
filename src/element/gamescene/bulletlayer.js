phina.namespace(function() {

  phina.define("ps.BulletLayer", {
    superClass: "phina.display.Layer",

    init: function() {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);
      this.backgroundColor = null;
    },

    spawn: function(runner, spec) {
      var bullet = ps.Bullet().addChildTo(this);
      bullet.runner = runner;
      bullet.frameIndex = spec.type || 0;
      if (spec.dummy) {
        bullet.visible = false;
      }
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
