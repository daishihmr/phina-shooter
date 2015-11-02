phina.namespace(function() {

  phina.define("ps.EnemyLooper", {
    superClass: "phina.app.Object2D",

    init: function(params) {
      this.superInit();
      this.params = params;
      this.enemyClass = phina.using(params.enemyClassName);
      this.setPosition(params.x, params.y);
      this.maxCount = params.maxCount;

      this.count = 0;
    },

    spawn: function() {
      this.count += 1;
      if (this.maxCount < this.count) {
        this.remove();
        return;
      }

      var self = this;
      this.one("enterframe", function() {
        var enemy = self.enemyClass(self.params)
          .setPosition(self.x, self.y)
          .addChildTo(self.parent)
          .on("killed", function() {
            self.spawn();
            self.remove();
          })
          .on("annihilated", function() {
            self.spawn();
            self.remove();
          });
      });
    },

  });

});
