phina.namespace(function() {

  phina.define("ps.Bullet", {
    superClass: "phina.display.Sprite",

    runner: null,
    dummy: false,

    init: function() {
      this.superInit("bullet", 32, 32);
      this.age = 0;
      this.scale.x = 0.75;
      this.scale.y = 0.75;
    },

    update: function(app) {
      if (this.runner) {
        var bx = this.position.x;
        var by = this.position.y;
        this.runner.update();
        this.position.x = this.runner.x;
        this.position.y = this.runner.y;
        
        this.rotation = Math.atan2(this.runner.y - by, this.runner.x - bx) * 180 / Math.PI;
        this.scale.y = 0.75 + Math.sin(this.age * 0.8) * 0.12;
      }
      
      this.age += 1;
    }

  });
});
