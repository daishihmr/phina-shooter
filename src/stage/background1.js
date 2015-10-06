phina.namespace(function() {

  phina.define("ps.Background1", {
    superClass: "ps.BackgroundLayer",

    init: function() {
      this.superInit({
        // fill: "hsla(40, 80%, 80%, 0.4)",
        fill: null,
        stroke: "hsl(20, 80%, 20%)",
      });

      this.camera.x = -1;
      this.camera.y = 20;
      this.camera.z = 5;
      this.camera.tweener.to({
        x: 1,
        y: 10,
      }, 3000, "easeOutQuad");

      var self = this;

      var dx = 0.04 / 5;
      var dz = 0.04;
      var rangeX = 1.8 * 5;
      var rangeZ = 2.6 * 5;

      var vertices = [
        [-0.5, 0, -0.5],
        [-0.5, 0, +0.5],
        [+0.5, 0, +0.5],
        [+0.5, 0, -0.5],
      ];

      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          Array.range(0, 8).forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices,
              })
              .setTranslation(x * 1.8, y * 0.3, z * 2.6)
              .addChildTo(self)
              .on("enterframe", function() {
                this.x += dx;
                this.z += dz;

                if (this.x < -rangeX) this.x += rangeX * 2;
                if (rangeX < this.x) this.x += -rangeX * 2;
                if (this.z < -rangeZ) this.z += rangeZ * 2;
                if (rangeZ < this.z) this.z += -rangeZ * 2;
              });
          });
        });
      });
    }
  });

});
