phina.namespace(function() {

  phina.define("ps.Application", {
    superClass: "phina.display.CanvasApp",

    init: function() {
      this.superInit({
        query: "#app",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      this.fps = 60;
      
      var loading = ps.LoadingScene({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        lie: false,
        exitType: "replace",
        nextScene: ps.GameScene,
        assets: {
          font: {
            title: "asset/Bangers/Bangers.ttf",
            main: "asset/Anton/Anton.ttf",
            mono: "asset/Share_Tech_Mono/ShareTechMono-Regular.ttf",
          }
        }
      });
      this.replaceScene(loading);
    }

  });

});
