phina.namespace(function() {

  phina.define("ps.LoadingScene", {
    superClass: "phina.game.LoadingScene",

    init: function(params) {
      this.superInit({
        assets: ps.Assets.get(params.assetType),
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        lie: false,
        exitType: "auto",
      });
      this.fromJSON({
        backgroundColor: "black",
        children: {
          label: {
            className: "ps.TitleLogoLabel",
            arguments: {
              text: "downloading"
            },
            x: SCREEN_WIDTH * 0.5,
            y: SCREEN_HEIGHT * 0.5,
            onenterframe: function(e) {
              var c = ~~(e.app.ticker.frame / 10) % 5;
              this.text = "downloading" + ".".repeat(c);
            }
          }
        }
      });
    }

  });
});
