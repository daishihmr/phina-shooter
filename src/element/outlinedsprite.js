phina.namespace(function() {

  phina.define("ps.OutlinedSprite", {
    superClass: "phina.display.Sprite",

    init: function(texture, width, height) {
      this.superInit(texture, width, height);

      var self = this;

      this.outline = phina.display.Sprite(texture + "Outline", width, height).addChildTo(this);
      this.outline.update = function(app) {
        this.srcRect = self.srcRect;
        this.alpha = ps.OutlinedSprite.staticAlpha;
      };
      this.outline.draw = function(canvas) {
        canvas.context.globalCompositeOperation = "lighter";
        phina.display.Sprite.prototype.draw.call(this, canvas);
        canvas.context.globalCompositeOperation = "source-over";
      }
    },

    _static: {
      staticAlpha: 1.0
    }
  });

});
