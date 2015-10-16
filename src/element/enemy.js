phina.namespace(function() {

  phina.define("ps.Enemy", {
    superClass: "ps.OutlinedSprite",

    hp: 0,
    score: 0,

    danmakuName: null,
    runner: null,

    entered: false,

    init: function(texture, width, height, params) {
      this.superInit(texture, width, height);
      this.$extend(params);
    },

    startAttack: function() {
      this.runner = ps.danmaku[this.danmakuName].createRunner(ps.BulletConfig);
      this.on("enterframe", function() {
        this.runner.x = this.position.x;
        this.runner.y = this.position.y;
        this.runner.update();
      });
    },

    setSrcRect: function(x, y, w, h) {
      this.srcRect.x = x;
      this.srcRect.y = y;
      this.srcRect.width = w;
      this.srcRect.height = h;
      return this;
    },

    hitTestRect: function(_x, _y) {
      var x = _x - this.position.x;
      var y = _y - this.position.y;

      var left = -this.boundingWidth * this.originX;
      var right = +this.boundingWidth * (1 - this.originX);
      var top = -this.boundingHeight * this.originY;
      var bottom = +this.boundingHeight * (1 - this.originY);

      return (left < x && x < right) && (top < y && y < bottom);
    },

    hitTestCircle: function(_x, _y) {
      var x = _x - this.position.x;
      var y = _y - this.position.y;

      if (((x) * (x) + (y) * (y)) < (this.radius * this.radius)) {
        return true;
      }
      return false;
    },

    update: function() {
      if (!this.entered) {
        this.entered = (-this.width * this.originX) < this.x &&
          this.x < (GAMEAREA_WIDTH + this.width * this.originX) &&
          (-this.height * this.originY) < this.y &&
          this.y < (GAMEAREA_HEIGHT + this.height * this.originY);
      }

      if (this.entered) {
        if (this.x < (-this.width * this.originX) ||
          (GAMEAREA_WIDTH + this.width * this.originX) < this.x ||
          this.y < (-this.height * this.originY) ||
          (GAMEAREA_HEIGHT + this.height * this.originY) < this.y) {
          this.remove();
          return;
        }
      }
    },

    damage: function(power) {
      if (!this.entered) return false;
      this.hp -= power;
      
      this.flare("killed");
      
      return this.hp < 0;
    },

  });

});
