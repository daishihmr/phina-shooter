phina.namespace(function() {

  phina.define("ps.Background1", {
    superClass: "ps.BackgroundLayer",

    init: function() {
      this.superInit({
        backgroundColor: ps.Color.sec0[1],
        fill: ps.Color.sec0a[6].format(0.2),
        stroke: ps.Color.sec0[3],
      });

      this.camera.x = -1;
      this.camera.y = 35;
      this.camera.z = 4;
      var f = 0;
      this.camera.on("enterframe", function(e) {
        this.x = Math.sin(f * 0.003);
        this.y = 20 + Math.cos(f * 0.001) * 10;
        f += 1;
      });

      var self = this;

      var dx = 0.01;
      var dz = 0.04;

      var rangeX2 = 1.205 * 5;
      var rangeZ2 = 1.205 * 5;
      var vertices2 = [
        [0, 0, 0],
      ];

      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          ps.bg.Polygon({
              vertices: vertices2,
            })
            .setTranslation(x * 1.205, 0, z * 1.205)
            .addChildTo(self)
            .on("enterframe", function() {
              this.x += dx;
              this.z += dz;

              if (this.x < -rangeX2) this.x += rangeX2 * 2;
              if (rangeX2 < this.x) this.x += -rangeX2 * 2;
              if (this.z < -rangeZ2) this.z += rangeZ2 * 2;
              if (rangeZ2 < this.z) this.z += -rangeZ2 * 2;
            });
        });
      });

      var rangeX = 3.0 * 5.6;
      var rangeZ = 3.0 * 5.0;

      var vertices = [
        [-0.5, 0, -0.5],
        [-0.5, 0, +0.5],
        [+0.5, 0, +0.5],
        [+0.5, 0, -0.5],
      ];

      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          Array.range(0, Math.randint(4, 9)).forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices,
              })
              .setTranslation(x * 3.0, y * 0.25, z * 3.0)
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
