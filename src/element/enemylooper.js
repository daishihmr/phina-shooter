phina.namespace(function() {

  phina.define("ps.EnemyLooper", {
    superClass: "phina.app.Object2D",

    init: function(params) {
      this.superInit();
      this.params = params;
      this.enemyClass = phina.using(params.enemyClassName);
      this.setPosition(params.x, params.y);
      this.maxCount = params.maxCount;
      this.limitAge = params.limitAge;

      this.count = 0;

      this.one("added", function() {
        this.spawn();
        this.age = 0;
      });
    },

    update: function() {
      this.age += 1;
    },

    spawn: function() {
      this.count += 1;
      if (this.limitAge <= this.age || this.maxCount < this.count) {
        this.remove();
        return;
      }

      var self = this;
      this.one("enterframe", function() {
        var enemy = self.enemyClass(self.params)
          .setPosition(self.x, self.y)
          .addChildTo(self.parent);

        var next = function() {
          self.spawn();
          this.off("removed", next);
          this.off("killed", next);
          this.off("annihilated", next);
        };

        enemy
          .on("removed", next)
          .on("killed", next)
          .on("annihilated", next);
      });
    },

  });

});
