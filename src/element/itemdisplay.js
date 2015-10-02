phina.namespace(function() {

  phina.define("ps.ItemDisplay", {
    superClass: "phina.display.CanvasElement",

    init: function(textureName, initialValue) {
      this.superInit();
      this.setOrigin(1, 0.5);
      this.textureName = textureName;

      this._count = initialValue || 0;
      this.updateView();
    },

    updateView: function() {
      var self = this;
      var t = this.textureName;
      var count = this._count;

      if (0 < count - this.children.length) {
        (count - this.children.length).times(function(i) {
          var newItem = phina.display.Sprite(t);
          newItem.setPosition(self.children.length * -newItem.width * 1.1, 0)
            .addChildTo(self);
        });
      }

      this.children.forEach(function(child, i) {
        child.visible = i < count;
      });
    },

    _accessor: {
      value: {
        get: function() {
          return this._count;
        },
        set: function(v) {
          this._count = v;
          this.updateView();
        }
      }
    }

  });
});
