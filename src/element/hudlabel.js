phina.namespace(function() {

  phina.define("ps.HudLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit(options.$safe({
        fill: ps.Color.sec0[14],
        stroke: ps.Color.sec0[6],
        fontSize: FONT_SIZE_M,
        fontFamily: "main",
        align: "left",
        baseline: "middle",
      }));
    },

  });
});
