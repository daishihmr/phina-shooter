phina.namespace(function() {

  phina.define("ps.Application", {
    superClass: "phina.display.CanvasApp",

    init: function() {
      this.superInit({
        query: "#app",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      this.fps = 60;
      this.canvas.context.imageSmoothingEnabled = true;
      this.domElement.style.imageRendering = "pixelated";

      this.replaceScene(ps.MainSequence());

      this.gamepads = phina.input.GamepadManager();
    },

    update: function() {
      this.mouse.update();
      this.touch.update();
      this.touchList.update();
      this.keyboard.update();
      this.gamepads.update();
    },

  });

});
