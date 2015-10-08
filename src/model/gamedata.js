phina.namespace(function() {

  phina.define("ps.GameData", {
    superClass: "phina.util.EventDispatcher",

    currentStage: 0,

    score: Math.randint(0, 100000000000),
    zanki: 2,
    bomb: 3,
    psyche: Math.randint(0, 100000000000),
    highScore: Math.randint(0, 100000000000),

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

    miss: function() {
      this.zanki -= 1;
      this.psyche = 0;
    },

    useBomb: function() {
      this.bomb -= 1;
      this.psyche *= 0.7;
    },

    addPsyche: function(v) {
      this.psyche += v;
    },

    addScore: function(v) {
      var self = this;
      var before = this.score;
      var after = this.score + v;

      if (this.extendMode === "normal") {
        this.extendScore.forEach(function(es) {
          if (before < es && es <= after) {
            self.zanki += 1;
            self.flare("extend");
          }
        });
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
    }

  });

});
