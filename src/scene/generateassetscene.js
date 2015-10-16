phina.namespace(function() {

  phina.define("ps.GenerateAssetScene", {
    superClass: "phina.display.CanvasScene",

    init: function(params) {
      this.superInit();
      this.one("enterframe", function() {
        this.generate(params.assetType);
      });
    },

    generate: function(assetType) {
      switch (assetType) {
        case "stage0":
          ps.TextureEdit.outline("enemy_stage0", "red");

          break;

        default:
          ps.TextureEdit.outline("bullet", "rgba(255,180,0,0.5)", 2);
          ps.TextureEdit.outline("player", "rgba(0,100,255,0.5)", 2);
          ps.TextureEdit.outline("bomb", "lightgreen", 2);

          var c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("rgba(255, 255, 255, 0.5)");
          phina.asset.AssetManager.set("image", "particleW", c);

          c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("hsla(0, 100%, 70%, 0.5)");
          phina.asset.AssetManager.set("image", "particleR", c);

          c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("hsla(60, 100%, 70%, 0.5)");
          phina.asset.AssetManager.set("image", "particleY", c);

          c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("hsla(120, 100%, 70%, 0.5)");
          phina.asset.AssetManager.set("image", "particleG", c);

          c = phina.graphics.Canvas().setSize(32, 32);
          c.clearColor("hsla(240, 100%, 70%, 0.5)");
          phina.asset.AssetManager.set("image", "particleB", c);

          break;
      }

      this.exit();
    },
  });

});
