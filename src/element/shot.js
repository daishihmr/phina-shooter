phina.namespace(function() {

  phina.define("ps.Shot", {
    superClass: "phina.display.Sprite",

    init: function() {
      this.superInit("bullet", 32, 32);
      this.frameIndex = 0;
    }
  });

});
