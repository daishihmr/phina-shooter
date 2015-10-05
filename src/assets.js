phina.namespace(function() {

  phina.define("ps.Assets", {
    _static: {
      get: function(name) {
        switch (name) {

          case "common":
            return {
              image: {
                player: "asset/player.png",
                zanki: "asset/zankiIcon.png",
                bomb: "asset/bombIcon.png",
              },

              font: {
                title: "asset/Black_Ops_One/BlackOpsOne-Regular.ttf",
                main: "asset/Press_Start_2P/PressStart2P-Regular.ttf",
                mono: "asset/VT323/VT323-Regular.ttf",
                // mono: "asset/Share_Tech_Mono/ShareTechMono-Regular.ttf",
              },
            };

          case "stage0":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

          case "stage1":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

          case "stage2":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

          case "stage3":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

          case "stage4":
            return {
              image: {
                dummy: "asset/zankiIcon.png",
              },
            };

        }
      }
    }
  })
});
