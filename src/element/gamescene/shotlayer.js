phina.namespace(function() {

  phina.define("ps.ShotLayer", {
    superClass: "phina.display.CanvasElement",

    pool: null,

    init: function() {
      this.superInit();
      var self = this;
      this.pool = Array.range(0, 28).map(function() {
        var shot = ps.Shot();
        shot.shotLayer = self;
        return shot;
      });
    },

    fireVulcan: function(frameIndex, x, y, direction) {
      var shot = this.pool.shift();
      if (shot) {
        shot.setup(frameIndex, x, y, direction).addChildTo(this);
      }
    },

  });

});
