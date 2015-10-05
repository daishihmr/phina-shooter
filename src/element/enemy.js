phina.namespace(function() {

  phina.define("ps.Enemy", {
    superClass: "phina.display.Sprite",

    init: function(params) {
      this.superInit(params.texture, params.width, params.height);
    }
  });

});
