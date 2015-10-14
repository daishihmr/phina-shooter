phina.namespace(function() {

  /**
   * arcadeモード
   */
  phina.define("ps.ArcadeModeSequence", {
    superClass: "phina.game.ManagerScene",
    
    init: function() {
      
      var gameData = ps.GameData();
      
      this.superInit({
        scenes: [

          Array.range(0, 5).map(function(stageId) {
            var stageName = "stage{0}".format(stageId);
            if (stageId < 4) {
              next = "stage{0}preload".format(stageId);
            } else {
              next = "ending";
            }
            return [

              {
                label: stageName + "preload",
                className: "ps.LoadingScene",
                arguments: {
                  assetType: stageName
                },
              },

              {
                label: stageName + "generate",
                className: "ps.GenerateAssetScene",
                arguments: {
                  assetType: stageName
                },
              },

              {
                label: stageName,
                className: "ps.GameScene",
                arguments: {
                  stageId: stageId,
                  gameData: gameData,
                },
              },

              {
                label: stageName + "result",
                className: "ps.ResultScene",
                arguments: {
                  gameData: gameData,
                },
              },

            ];
          }),

          {
            label: "ending",
            className: "ps.EndingScene",
          },

          {
            label: "gameover",
            className: "ps.GameoverScene",
          },

          {
            label: "nameEntry",
            className: "ps.NameEntryScene",
          },

        ].flatten(),
      });
    }
  });

});
