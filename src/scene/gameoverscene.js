phina.namespace(function() {

  phina.define("ps.GameoverScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      this.fromJSON({
        children: {
          label: {
            className: "ps.TitleLogoLabel",
            arguments: {
              text: "GAME OVER"
            },
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.5,
          }
        }
      });
    }
  });

});
