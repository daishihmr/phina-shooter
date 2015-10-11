phina.namespace(function() {

  phina.define("ps.Background2", {
    superClass: "ps.BackgroundLayer",

    init: function() {
      this.superInit({
        backgroundColor: ps.Color.sec0[1],
        fill: ps.Color.sec0a[8].format(0.1),
        stroke: ps.Color.sec0[8],
      });

      this.camera.x = 5;
      this.camera.y = 0.5;
      this.camera.z = 10;
      this.camera.targetX = 0;
      this.camera.targetY = 0.5;
      this.camera.targetZ = 0;
      var frame = 0;
      this.camera.on("enterframe", function(e) {
        this.targetY = -2 + Math.sin(frame * 0.002) * -2;
        frame += 1;
      });

      var self = this;

      var dx = 0.05;
      var dz = 0.10;

      var rangeX = 3.0 * 5.0;
      var rangeZ = 4.0 * 5.6;

      // 床
      var vertices2 = [
        [0, 0, 0],
      ];
      Array.range(-10, 10).forEach(function(z) {
        Array.range(-10, 10).forEach(function(x) {
          [-1, 1].forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices2,
              })
              .setTranslation(x * 2.6, y * 2.0, z * 2.6)
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

      // 建造物
      var vertices = [
        [-0.5, 0, -0.5],
        [-0.5, 0, +0.5],
        [+0.5, 0, +0.5],
        [+0.5, 0, -0.5],
      ];
      var random = phina.util.Random(12345);
      Array.range(-5, 5).forEach(function(z) {
        Array.range(-5, 5).forEach(function(x) {
          [-1, 1].forEach(function(y) {
            ps.bg.Polygon({
                vertices: vertices,
              })
              .setTranslation(x * 3.0, y * 2.0, z * 3.0)
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
