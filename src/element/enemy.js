phina.namespace(function() {

  phina.define("ps.Enemy", {
    superClass: "ps.OutlinedSprite",

    hp: 0,
    score: 0,

    danmakuName: null,
    runner: null,

    radius: 0,

    init: function(texture, width, height, params) {
      this.superInit(texture, width, height);
      this.setPosition(params.x, params.y);
      this.danmakuName = params.danmakuName;

      this.boundingType = params.boundingType;
      this.radius = params.radius;
      this.boundingWidth = params.boundingWidth;
      this.boundingHeight = params.boundingHeight;
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

    hitTestRect: function(x, y) {
      var left = -this.boundingWidth * this.originX;
      var right = +this.boundingWidth * (1 - this.originX);
      var top = -this.boundingHeight * this.originY;
      var bottom = +this.boundingHeight * (1 - this.originY);

      return (left < x && x < right) && (top < y && y < bottom);
    },

    hitTestCircle: function(x, y) {
      if ((x * x + y * y) < (this.radius * this.radius)) {
        return true;
      }
      return false;
    },
  });

});
