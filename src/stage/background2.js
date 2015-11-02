phina.namespace(function() {

  phina.define("ps.Background2", {
    superClass: "ps.BackgroundLayer",

    init: function() {
      this.superInit({
        backgroundColor: ps.Color.pri[1],
        fill: ps.Color.pria[7].format(0.2),
        stroke: ps.Color.pri[4],
      });

      this.camera.x = 2;
      this.camera.y = 35;
      this.camera.z = 8;
      this.camera.targetY = 3;
      var frame = 0;
      this.camera.on("enterframe", function(e) {
        this.y = 16 + Math.cos(frame * 0.001) * 13;
        frame += 1;
      });

      var self = this;

      var dx = 0.04;
      var dz = 0.16;

      var rangeX = 3.0 * 5.0;
      var rangeZ = 4.0 * 5.6;

      // 床
      var vertices2 = [
        [0, 0, 0],
      ];
      Array.range(-10, 10).forEach(function(z) {
        Array.range(-10, 10).forEach(function(x) {
          ps.bg.Polygon({
              vertices: vertices2,
            })
            .setTranslation(x * 2.6, 0, z * 2.6)
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

      // 建造物
      var vertices = [
        [-0.7, 0, -0.7],
        [-0.7, 0, +0.7],
        [+0.7, 0, +0.7],
        [+0.7, 0, -0.7],
      ];
      var random = phina.util.Random(12345);
      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          Array.range(0, random.randint(6, 11)).forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices,
              })
              .setTranslation(x * 3.0, y * 0.21, z * 4.0)
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
