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
              next = "stage{0}preload".format(stageId + 1);
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
                nextLabel: stageName,
              },

              {
                label: stageName,
                className: "ps.GameScene",
                arguments: {
                  stageId: stageId,
                  gameData: gameData,
                },
                nextLabel: stageName + "result",
              },

              {
                label: stageName + "result",
                className: "ps.ResultScene",
                arguments: {
                  gameData: gameData,
                },
                nextLabel: next,
              },

            ];
          }),

          {
            label: "ending",
            className: "ps.EndingScene",
            nextLabel: "gameover",
          },

          {
            label: "gameover",
            className: "ps.GameoverScene",
            nextLabel: "nameEntry",
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
