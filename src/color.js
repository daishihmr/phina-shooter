phina.namespace(function() {
  // Color Palette by Paletton.com
  // Palette URL: http://paletton.com/#uid=50f1n0kmGpNdfBfixtwqklHuEgU

  phina.define("ps.Color", {
    init: function() {},
    _static: {
      pri: [],
      sec0: [],
      sec1: [],

      initialize: function(scene) {
        ps.Color.pri = [];
        ps.Color.sec0 = [];
        ps.Color.sec1 = [];
        ps.Color.pria = [];
        ps.Color.sec0a = [];
        ps.Color.sec1a = [];

        var p0 = 21;
        var r = 140;
        var s0 = (p0 - r + 360) % 360;
        var s1 = (p0 + r + 360) % 360;

        var size = 15;
        var sMin = 48;
        var sMax = 90;
        var sLev = (sMax - sMin) / (size - 1);
        var hMin = 5;
        var hMax = 84;
        var hLev = (hMax - hMin) / (size - 1);
        Array.range(0, size).forEach(function(i) {
          var s = Math.floor(sMin + sLev * i);
          var h = Math.floor(hMin + hLev * i);
          ps.Color.pri[i] = "hsl({0},{1}%,{2}%)"    .format(p0, s, h);
          ps.Color.sec0[i] = "hsl({0},{1}%,{2}%)"   .format(s0, s, h);
          ps.Color.sec1[i] = "hsl({0},{1}%,{2}%)"   .format(s1, s, h);
          ps.Color.pria[i] = "hsla({0},{1}%,{2}%,"  .format(p0, s, h) + "{0})";
          ps.Color.sec0a[i] = "hsla({0},{1}%,{2}%," .format(s0, s, h) + "{0})";
          ps.Color.sec1a[i] = "hsla({0},{1}%,{2}%," .format(s1, s, h) + "{0})";
        });

        if (scene) ps.Color.test().addChildTo(scene);
      },

      test: function() {
        var r = phina.display.CanvasElement();
        ps.Color.pri.forEach(function(c, i) {
          phina.display.RectangleShape({
              width: 20,
              height: 20,
              fill: c,
              stroke: null,
            })
            .setPosition(20 + i * 20, 20 + 20)
            .addChildTo(r);
        });

        ps.Color.sec0.forEach(function(c, i) {
          phina.display.RectangleShape({
              width: 20,
              height: 20,
              fill: c,
              stroke: null,
            })
            .setPosition(20 + i * 20, 20 + 0)
            .addChildTo(r);
        });

        ps.Color.sec1.forEach(function(c, i) {
          phina.display.RectangleShape({
              width: 20,
              height: 20,
              fill: c,
              stroke: null,
            })
            .setPosition(20 + i * 20, 20 + 40)
            .addChildTo(r);
        });

        return r;
      }
    },
  });

});
