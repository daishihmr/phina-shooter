phina.namespace(function() {

  phina.define("ps.TitleLogoLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit((options || {}).$safe({
        text: "Phina Shooter",
        align: "center",
        fontFamily: "title",
        fontSize: FONT_SIZE_L,
        fill: "hsl(50, 80%, 80%)",
        stroke: "hsl(0, 100%, 50%)",
      }));
    }

  });

});
