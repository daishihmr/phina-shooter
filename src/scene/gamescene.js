phina.namespace(function() {

  phina.define("ps.GameScene", {
    superClass: "phina.display.CanvasScene",

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "black",
      });

      var sidebarGridX = phina.util.Grid(SIDEBAR_WIDTH, 16);
      var sidebarGridY = phina.util.Grid(SIDEBAR_HEIGHT, 16);

      this.fromJSON({
        children: {
          leftLayer: {
            className: "ps.gamescene.SideBarLayer",
            x: 0,
            y: 0,
            children: {

              totalScoreLabel: {
                className: "ps.HudLabel",
                arguments: {
                  text: "TOTAL SCORE",
                },
                x: sidebarGridX.span(1),
                y: sidebarGridY.span(1),
              },
              totalScore: {
                className: "ps.ScoreLabel",
                x: sidebarGridX.span(15),
                y: sidebarGridY.span(2),
              },

              stageScoreLabel: {
                className: "ps.HudLabel",
                arguments: {
                  text: "STAGE SCORE",
                },
                x: sidebarGridX.span(1),
                y: sidebarGridY.span(3),
              },
              stageScore: {
                className: "ps.ScoreLabel",
                x: sidebarGridX.span(15),
                y: sidebarGridY.span(4),
              },

              psycheLabel: {
                className: "ps.HudLabel",
                arguments: {
                  text: "PSYCHE",
                },
                x: sidebarGridX.span(1),
                y: sidebarGridY.span(6),
              },
              psyche: {
                className: "ps.ScoreLabel",
                x: sidebarGridX.span(15),
                y: sidebarGridY.span(7),
              },

            }
          },
          rightLayer: {
            className: "ps.gamescene.SideBarLayer",
            x: SCREEN_WIDTH - SIDEBAR_WIDTH,
            y: 0,
            children: {
              gameTitleLabel: {
                className: "ps.HudLabel",
                arguments: {
                  text: "Phina Shooter",
                  align: "center",
                  fontFamily: "title",
                  fontSize: FONT_SIZE_L,
                  fill: "hsl(50, 80%, 80%)",
                  stroke: "hsl(0, 100%, 50%)",
                },
                x: sidebarGridX.center(),
                y: sidebarGridY.span(15),
              },
            }
          },
          mainLayer: {
            className: "ps.gamescene.MainLayer",
            x: SIDEBAR_WIDTH,
            y: 0,
          },
        }
      });
    },
    
    update: function() {
    }

  });
});
