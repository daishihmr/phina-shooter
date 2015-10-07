phina.namespace(function() {

  phina.define("ps.SettingScene", {
    superClass: "phina.game.ManagerScene",

    init: function() {
      this.superInit({
        scenes: [

          {
            label: "top",
            className: "ps.settingscene.Top",
          },

        ],
      });
    }
  });

  phina.define("ps.settingscene.Top", {
    superClass: "phina.app.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });
    }
  });

});