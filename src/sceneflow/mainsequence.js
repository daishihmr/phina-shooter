phina.namespace(function() {

  phina.define("ps.MainSequence", {
    superClass: "phina.game.ManagerScene",

    init: function() {
      this.superInit({
        scenes: [

          {
            label: "load",
            className: "ps.LoadingScene",
            arguments: {
              assetType: "common"
            },
            nextLabel: "title",
          },

          {
            label: "title",
            className: "ps.TitleScene",
          },

          {
            label: "arcadeMode",
            className: "ps.ArcadeModeSequence",
            nextLabel: "title",
          },

          {
            label: "tutorial",
            className: "ps.TutorialScene",
            nextLabel: "title",
          },

          {
            label: "setting",
            className: "ps.SettingScene",
            nextLabel: "title",
          },

          {
            label: "ranking",
            className: "ps.RankingScene",
            nextLabel: "title",
          },

        ],
      });
    }
  });

});