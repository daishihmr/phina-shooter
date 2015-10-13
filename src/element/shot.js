phina.namespace(function() {

  var speed = 12;

  phina.define("ps.Shot", {
    superClass: "phina.display.Sprite",
    
    shotLayer: null,
    power: 0,

    init: function() {
      this.superInit("bullet", 24, 24);
    },
    
    onremoved: function() {
      this.shotLayer.pool.push(this);
    },

    setup: function(frameIndex, x, y, direction, power) {
      this.frameIndex = frameIndex;
      this.x = x;
      this.y = y;
      this.rotation = direction;
      this.power = power;
      var rad = direction * Math.DEG_TO_RAD;
      this.velocity = phina.geom.Vector2(Math.cos(rad) * speed, Math.sin(rad) * speed);
      
      return this;
    },

    update: function() {
      this.power = Math.max(this.power * 0.95, 0.5);
      var position = this.position;
      position.add(this.velocity);
      if (position.x < 0 || GAMEAREA_WIDTH < position.x || position.y < 0 || GAMEAREA_HEIGHT < position.y) {
        this.remove();
      }
    },

  });

});
