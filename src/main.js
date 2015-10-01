var SCREEN_WIDTH = 720;
var SCREEN_HEIGHT = 480;

var GAMEAREA_WIDTH = SCREEN_HEIGHT * 0.7;
var GAMEAREA_HEIGHT = SCREEN_HEIGHT;

var SIDEBAR_WIDTH = (SCREEN_WIDTH - GAMEAREA_WIDTH) * 0.5;
var SIDEBAR_HEIGHT = SCREEN_HEIGHT;

var FONT_SIZE_XL = 0.07 * SCREEN_WIDTH;
var FONT_SIZE_L = 0.03 * SCREEN_WIDTH;
var FONT_SIZE_M = 0.02 * SCREEN_WIDTH;
var FONT_SIZE_S = 0.012 * SCREEN_WIDTH;

phina.main(function() {

  var app = ps.Application();
  app.run();
  
  app.enableStats();
});
