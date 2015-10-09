phina.namespace(function() {

  phina.define("ps.ScoreLabel", {
    superClass: "phina.display.Label",

    init: function(options) {
      this.superInit((options || {}).$safe({
        fill: "white",
        stroke: null,
        fontSize: FONT_SIZE_L,
        fontFamily: "mono",
        align: "right",
        baseline: "middle",
      }));

      this.value = 0;
    },

    formatText: function() {
      var v = "" + Math.floor(this._score);
      Array.range(5, 0).forEach(function(i) {
        var s = i * 3;
        if (s < v.length) {
          v = v.substring(0, v.length - s) + "," + v.substring(v.length - s);
        }
      });

      this.text = v;
    },
    // formatText: function() {
    //   var v = "" + Math.floor(this._score);
    //   if (12 < v.length) {
    //     v = v.substring(0, v.length - 12) + "兆" + v.substring(v.length - 12);
    //   }
    //   if (8 < v.length) {
    //     v = v.substring(0, v.length - 8) + "億" + v.substring(v.length - 8);
    //   }
    //   if (4 < v.length) {
    //     v = v.substring(0, v.length - 4) + "万" + v.substring(v.length - 4);
    //   }

    //   this.text = v;
    // },

    _accessor: {
      value: {
        get: function() {
          return this._score;
        },
        set: function(v) {
          this._score = v;
          this.formatText();
        }
      }
    }

  });
});
