phina.namespace(function() {

  phina.define("ps.Enemy", {
    superClass: "phina.display.Sprite",

    hp: 0,
    score: 0,

    init: function(params) {
      this.superInit(params.texture, params.width, params.height);
      this.$extend(params);
    }
  });

});
