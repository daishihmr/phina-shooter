phina.namespace(function() {

  phina.define("ps.Enemy", {
    superClass: "ps.OutlinedSprite",

    hp: 0,
    score: 0,

    danmakuName: null,
    runner: null,

    init: function(texture, width, height, params) {
      this.superInit(texture, width, height);
      this.setPosition(params.x, params.y);
      this.danmakuName = params.danmakuName;
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
    }
  });

});
