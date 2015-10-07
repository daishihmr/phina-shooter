phina.namespace(function() {

  phina.define("ps.gamescene.MainLayer", {
    superClass: "phina.display.Layer",

    init: function(params) {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);
      this.backgroundColor = null;

      this.fromJSON({
        children: {
          backgroundLayer: {
            className: params.stage.backgroundClassName,
            // draw: function(canvas) {
              // canvas.context.globalCompositeOperation = "source-over";
            // },
          },
          
          scoreItemLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
              // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          shotLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
              // canvas.context.globalCompositeOperation = "lighter";
            // },
          },

          player: {
            className: "ps.Player",
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.9,
            // draw: function(canvas) {
              // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          itemLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
              // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          enemyLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
              // canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          effectLayer: {
            className: "phina.app.Element",
            // draw: function(canvas) {
              // canvas.context.globalCompositeOperation = "lighter";
            // },
          },

          bulletLayer: {
            className: "ps.BulletLayer",
            // draw: function(canvas) {
            //   canvas.context.globalCompositeOperation = "lighter";
            // },
          },

          dummy: {
            className: "phina.app.Element",
            // draw: function(canvas) {
            //   canvas.context.globalCompositeOperation = "source-over";
            // },
          },

          b: {
            className: "ps.OutlinedSprite",
            arguments: ["bomb"],
            x: GAMEAREA_WIDTH * 0.5,
            y: GAMEAREA_HEIGHT * 0.2,
          }
        }
      });
    }

  });
});
