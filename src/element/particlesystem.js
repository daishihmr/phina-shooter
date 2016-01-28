phina.namespace(function() {

  phina.define("ps.ParticleSystem", {
    superClass: "phina.display.CanvasElement",

    /**
     * @param {string} params.texture
     * @param {function} params.emitterShape
     * @param {boolean} params.loop
     * @param {number} params.duration
     * @param {number} params.emissionPerFrame
     * @param {number} params.size
     * @param {function} params.speedByLifetime
     */
    init: function(params) {
      this.superInit();
      this.params = params.$safe({
        texture: "particleWhite",
        emitterShape: function(r0, r1) {
          return {
            position: {
              x: 0,
              y: 0,
            },
            velocity: {
              x: Math.cos(r0 * Math.PI * 2) * 10,
              y: Math.sin(r0 * Math.PI * 2) * 10,
            },
          }
        },
        loop: false,
        duration: 60,
        maxParticle: 100,
        size: 10,
      });

      this.ftweener
        .wait(params.duration)
        .call(function() {
          this.remove();
        }.bind(this));

      this.e = 0;
    },

    update: function() {
      var epf = this.params.emissionPerFrame;
      this.e += epf;
      if (1 < this.e) {
        for (var i = 0; i < epf; i++) {
          this.emit();
          this.e -= 1;
        }
      }
    },

    emit: function() {
      var r0 = Math.random();
      var r1 = Math.random();
    }

  });

  phina.define("ps.Particle", {
    superClass: "phina.display.Sprite",

    velocity: null,

    init: function(texture, width, height) {
      this.superInit(texture, width, height);
    },

    update: function() {

    },

  });

});
