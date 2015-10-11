phina.namespace(function() {

  phina.define("ps.TitleScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      this.fromJSON({
        children: {
          title: {
            className: "ps.TitleLogoLabel",
            arguments: {
              fontSize: FONT_SIZE_XL,
            },
            x: SCREEN_WIDTH * 0.5,
            y: SCREEN_HEIGHT * 0.5,
          }
        }
      });

      // TODO
      this.tweener.wait(500).call(function() {
        this.exit("arcadeMode");
      }.bind(this));
    }
  });

});
