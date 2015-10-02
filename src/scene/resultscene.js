phina.namespace(function() {

  phina.define("ps.ResultScene", {
    superClass: "phina.display.CanvasScene",

    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      this.fromJSON({
        gameData: params.gameData,
      });
    }
  });

});
