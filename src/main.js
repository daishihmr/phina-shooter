var DEBUG = true;

var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT = 320;
// var SCREEN_WIDTH = 720;
// var SCREEN_HEIGHT = 480;
// var SCREEN_WIDTH = 960;
// var SCREEN_HEIGHT = 640;

var GAMEAREA_WIDTH = SCREEN_HEIGHT * 0.7;
var GAMEAREA_HEIGHT = SCREEN_HEIGHT;

var SIDEBAR_WIDTH = (SCREEN_WIDTH - GAMEAREA_WIDTH) * 0.5;
var SIDEBAR_HEIGHT = SCREEN_HEIGHT;

var FONT_SIZE_XL = ~~(0.07 * SCREEN_WIDTH);
var FONT_SIZE_L = ~~(0.03 * SCREEN_WIDTH);
var FONT_SIZE_M = ~~(0.02 * SCREEN_WIDTH);
var FONT_SIZE_S = ~~(0.01 * SCREEN_WIDTH);

phina.input.Keyboard.KEY_CODE["shot"] = phina.input.Keyboard.KEY_CODE["z"];
phina.input.Keyboard.KEY_CODE["bomb"] = phina.input.Keyboard.KEY_CODE["x"];
phina.input.Keyboard.KEY_CODE["start"] = phina.input.Keyboard.KEY_CODE["space"];

phina.input.Gamepad.BUTTON_CODE["shot"] = phina.input.Gamepad.BUTTON_CODE["x"];
phina.input.Gamepad.BUTTON_CODE["bomb"] = phina.input.Gamepad.BUTTON_CODE["a"];
phina.input.Gamepad.BUTTON_CODE["start"] = phina.input.Gamepad.BUTTON_CODE["y"];

phina.main(function() {
  ps.Color.initialize();

  var app = ps.Application();
  app.run();

  if (DEBUG) app.enableStats();
});
