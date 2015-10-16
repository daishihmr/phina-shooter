phina.namespace(function() {

  phina.define("ps.Timer", {
    superClass: "phina.app.Element",

    init: function(time) {
      this.superInit();
      this.time = time;
    },

    update: function() {
      this.time -= 1;
      if (this.time <= 0) {
        this.flare("time");
        this.remove();
      }
    }
  });

  phina.app.Element.prototype.method("timer", function(time, callback) {
    ps.Timer(time)
      .addChildTo(this)
      .on("time", callback);
    return this;
  });

});
