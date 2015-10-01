phina.namespace(function() {

  phina.define("ps.ScoreLabel", {
    superClass: "phina.display.Label",

    init: function() {
      this.superInit({
        fill: "white",
        stroke: null,
        fontSize: FONT_SIZE_M,
        fontFamily: "mono",
        align: "right",
        baseline: "middle",
      });

      this.score = 9999999999999;
    },

    formatText: function() {
      var v = "" + Math.floor(this._score);
      if (12 < v.length) {
        v = v.substring(0, v.length - 12) + "兆" + v.substring(v.length - 12);
      }
      if (8 < v.length) {
        v = v.substring(0, v.length - 8) + "億" + v.substring(v.length - 8);
      }
      if (4 < v.length) {
        v = v.substring(0, v.length - 4) + "万" + v.substring(v.length - 4);
      }

      this.text = v;
    },

    _accessor: {
      score: {
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
