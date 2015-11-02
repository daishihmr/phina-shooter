phina.namespace(function() {

  phina.define("ps.GameData", {
    superClass: "phina.util.EventDispatcher",

    currentStage: 0,

    score: Math.randint(0, 100000000000),
    zanki: 2,
    bomb: 3,
    psyche: Math.randint(0, 100000000000),
    highScore: Math.randint(0, 100000000000),
    rank: 0,

    /**
     * "normal" or "every"
     */
    extendMode: null,
    extendScore: null,

    init: function() {
      this.superInit();
      this._binder = {};

      this.extendMode = "normal";
      this.extendScore = [100000000, 200000000];
    },

    updateView: function(frame) {
      if (frame % 5 !== 0) return;

      var self = this;
      self._binder.forIn(function(name, view) {
        if (self[name] !== undefined) {
          view.value = self[name];
        }
      });
    },

    addPsyche: function(v) {
      this.psyche += v;
    },

    addScore: function(v) {
      var self = this;
      var before = this.score;
      var after = this.score + v;

      if (this.extendMode === "normal") {
        for (var i = 0, len = this.extendScore.length; i < len; i++) {
          var es = this.extendScore[i];
          if (before < es && es <= after) {
            self.zanki += 1;
            self.flare("extend");
            break;
          }
        }
      } else if (this.extendMode === "every") {
        var es = this.extendScore[0];
        if (Math.floor(before / es) < Math.floor(after / es)) {
          this.zanki += 1;
          this.flare("extend");
        }
      }

      this.score = after;
    },

    bind: function(propertyName, view) {
      this._binder[propertyName] = view;
    },

    onbomb: function() {
      this.bomb -= 1;
    },

    onkill: function(e) {

    },

    onmiss: function() {
      this.zanki -= 1;
    },

  });

});
