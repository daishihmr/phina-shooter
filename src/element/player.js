phina.namespace(function() {

  phina.define("ps.Player", {
    superClass: "ps.OutlinedSprite",

    controllable: true,
    muteki: false,

    roll: 0,

    speed: 3.6,

    init: function() {
      this.superInit("player", 32, 32);
      this.frameIndex = 4;
    },

    update: function(app) {
      if (!this.controllable) return;

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

      this.position.add(moveVector);
      this.position.x = Math.clamp(this.position.x, 4, GAMEAREA_WIDTH - 4);
      this.position.y = Math.clamp(this.position.y, 4, GAMEAREA_HEIGHT - 4);
    },

    launch: function() {
      // TODO
      this.x = GAMEAREA_WIDTH * 0.5;
      this.y = GAMEAREA_HEIGHT * 0.9;
    },

  });

  var moveVector = phina.geom.Vector2(0, 0);

});
