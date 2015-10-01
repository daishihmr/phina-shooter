phina.namespace(function() {

  phina.define("ps.HudLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit(options.$safe({
        fill: "white",
        stroke: null,
        fontSize: FONT_SIZE_M,
        fontFamily: "main",
        align: "left",
        baseline: "middle",
      }));
    },

  });
});
