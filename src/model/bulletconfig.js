phina.namespace(function() {

  phina.define("ps.BulletConfig", {
    init: function() {},
    _static: {

      speedRate: 3,
      target: null,
      bulletLayer: null,

      setup: function(target, bulletLayer) {
        this.target = target;
        this.bulletLayer = bulletLayer;

        this.put("densityRank", 0.00);
        this.put("speedRank", 0.00);
        this.put("burst", 0);
      },

      createNewBullet: function(runner, spec) {
        this.bulletLayer.spawn(runner, spec);
      },

      put: function(name, value) {
        bulletml.Walker.globalScope["$" + name] = value;
      },
    }
  });

});
