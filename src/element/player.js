phina.namespace(function() {

  phina.define("ps.Player", {
    superClass: "ps.OutlinedSprite",

    controllable: true,
    muteki: false,

    roll: 0,

    speed: 3.6,
    
    shotLayer: null,

    init: function() {
      this.superInit("player", 32, 32);
      this.frameIndex = 4;
    },

    update: function(app) {
      if (!this.controllable) return;
      
      var frame = app.ticker.frame;

      var kb = app.keyboard;
      var gp = app.gamepads.get(0);
      var p = app.pointer;
      
      moveVector.set(0, 0);

      moveVector.add(kb.getKeyDirection().mul(this.speed));
      if (gp) {
        var stick = gp.getStickDirection();
        if (0.4 < stick.length()) {
          moveVector.add(stick.normalize().mul(this.speed));
        }
      }
      if (p.getPointing()) {
        moveVector.add(p.deltaPosition.mul(2));
      }

      if (moveVector.x) {
        this.roll = Math.clamp(this.roll + moveVector.x * 0.1, -4, 4);
      } else {
        this.roll *= 0.8;
        if (Math.abs(this.roll) < 0.1) {
          this.roll = 0;
        }
      }
      if (this.roll !== 0) {
        var sign = this.roll / Math.abs(this.roll);
        var r = ~~(Math.abs(this.roll)) * sign;
        this.frameIndex = Math.clamp(4 + r, 0, 8);
      }

      var position = this.position;
      position.add(moveVector);
      position.x = Math.clamp(position.x, 4, GAMEAREA_WIDTH - 4);
      position.y = Math.clamp(position.y, 4, GAMEAREA_HEIGHT - 4);
      
      if (frame % 4 === 0) {
        var xv = Math.sin(frame / 4 * 0.6) * 8;
        this.shotLayer.fireVulcan(0, position.x - xv, position.y - 4, -90);
        this.shotLayer.fireVulcan(0, position.x + xv, position.y - 4, -90);
        this.shotLayer.fireVulcan(2, position.x - 14, position.y - 2, -93);
        this.shotLayer.fireVulcan(2, position.x + 14, position.y - 2, -87);
      }
    },

    launch: function() {
      // TODO
      this.x = GAMEAREA_WIDTH * 0.5;
      this.y = GAMEAREA_HEIGHT * 0.9;
    },

  });

  var moveVector = phina.geom.Vector2(0, 0);

  phina.define("ps.AfterBurner", {
    superClass: "phina.app.Object2D",

    init: function() {
      this.superInit();
    },

    update: function(app) {
      if (app.ticker.frame % 2 !== 0) return;
      var p = phina.display.Sprite("particleB")
        .setScale(0.125)
        .setPosition(this.position.x, this.position.y)
        .on("enterframe", function() {
          this.position.y += 1;
          this.alpha -= 0.1;
          if (this.alpha < 0.01) this.remove();
        })
        .addChildTo(this.parent);
      p.draw = function(canvas) {
        canvas.context.globalCompositeOperation = "lighter";
        phina.display.Sprite.prototype.draw.call(this, canvas);
        canvas.context.globalCompositeOperation = "source-over";
      };
    },
    
  });

});
