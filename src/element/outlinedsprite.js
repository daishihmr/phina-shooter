phina.namespace(function() {

  phina.define("ps.OutlinedSprite", {
    superClass: "phina.display.Sprite",

    init: function(texture, width, height) {
      this.superInit(texture, width, height);

      var self = this;

      this.outline = phina.display.Sprite(texture + "Outline", width, height).addChildTo(this);
      this.outline.blendMode = "lighter";
      this.outline.update = function(app) {
        this.srcRect = self.srcRect;
        this.alpha = ps.OutlinedSprite.staticAlpha;
      };
    },

    _static: {
      staticAlpha: 1.0
    }
  });

});
