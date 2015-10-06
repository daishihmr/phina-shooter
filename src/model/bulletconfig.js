phina.namespace(function() {

  phina.define("ps.BulletConfig", {

    speedRate: 2,
    target: null,
    bulletLayer: null,

    init: function(target, bulletLayer) {
      this.target = target;
      this.bulletLayer = bulletLayer;
      
      this.put("densityRank", 0.0);
      this.put("speedRank", 0.0);
      this.put("burst", 0);
    },

    createNewBullet: function(runner, spec) {
      this.bulletLayer.spawn(runner, spec);
    },
    
    put: function(name, value) {
      bulletml.Walker.globalScope["$" + name] = value;
    },
  });

});
