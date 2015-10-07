phina.namespace(function() {

  phina.define("ps.TextureEdit", {
    init: function() {},
    _static: {
      outline: function(textureName, color, lineWidth) {
        color = color || "white";
        lineWidth = lineWidth || 1;

        var texture = phina.asset.AssetManager.get("image", textureName);
        if (texture == null) {
          return;
        }
        var w = texture.domElement.width;
        var h = texture.domElement.height;

        var src = phina.graphics.Canvas().setSize(w, h);
        src.context.drawImage(texture.domElement, 0, 0);

        var srcData = src.context.getImageData(0, 0, w, h);
        var data = srcData.data;

        var dst = phina.graphics.Canvas().setSize(w, h);
        dst.fillStyle = color;
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {

            var cIndex = ((y + 0) * w + (x + 0)) * 4 + 3;

            var lIndex = ((y + 0) * w + (x - 1)) * 4 + 3;
            var rIndex = ((y + 0) * w + (x + 1)) * 4 + 3;
            var tIndex = ((y - 1) * w + (x + 0)) * 4 + 3;
            var bIndex = ((y + 1) * w + (x + 0)) * 4 + 3;
            var l = (0 <= lIndex && lIndex < data.length) ? data[lIndex] : 255;
            var r = (0 <= rIndex && rIndex < data.length) ? data[rIndex] : 255;
            var t = (0 <= tIndex && tIndex < data.length) ? data[tIndex] : 255;
            var b = (0 <= bIndex && bIndex < data.length) ? data[bIndex] : 255;

            var a = data[cIndex];

            if (a > 0 && (l == 0 || r == 0 || t == 0 || b == 0)) {
              dst.fillRect(x - lineWidth * 0.5, y - lineWidth * 0.5, lineWidth, lineWidth);
            }
          }
        }

        phina.asset.AssetManager.set("image", textureName + "Outline", dst);
      }
    }
  });

});
