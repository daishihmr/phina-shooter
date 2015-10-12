phina.namespace(function() {

  phina.define("ps.SoundManager", {
    init: function() {},
    _static: {
      bgmVolume: 0.1,
      soundVolume: 0.8,
      
      beforeBgm: null,
      currentBgm: null,
      
      currentFrame: 0,
      _lastPlayFrame: {},

      update: function(app) {
        this.currentFrame = app.ticker.frame;

        if (this.beforeBgm) {
          this.beforeBgm.volume -= this.bgmVolume / (60 * 5);
          if (this.beforeBgm.volume < 0.01) {
            this.beforeBgm.stop();
            this.beforeBgm = null;
          }
        }
      },

      startBgm: function(bgmData) {
        bgmData = (bgmData || {}).$safe({
          name: "bgm",
          loop: true,
          loopStart: 0,
          loopEnd: 0,
        });

        if (this.currentBgm) {
          if (this.beforeBgm) this.beforeBgm.stop();
          this.beforeBgm = this.currentBgm;
        }
        this.currentBgm = phina.asset.AssetManager.get("sound", bgmData.name).clone().play();
        this.currentBgm.volume = this.bgmVolume;
        this.currentBgm.loop = bgmData.loop;
        this.currentBgm.loopStart = bgmData.loopStart;
        this.currentBgm.loopEnd = bgmData.loopEnd;
      },

      stopBgm: function(fadeOut) {
        if (this.beforeBgm) {
          this.beforeBgm.stop();
          this.beforeBgm = null;
        }
        if (this.currentBgm) {
          if (fadeOut) {
            this.beforeBgm = this.currentBgm;
            this.currentBgm = null;
          } else {
            this.currentBgm.stop();
            this.currentBgm = null;
          }
        }
      },
      
      playSound: function(name) {
        if (this._lastPlayFrame[name] !== this.currentFrame) {
          var sound = phina.asset.AssetManager.get("sound", name).clone();
          sound.volume = this.soundVolume;
          sound.play();
          this._lastPlayFrame[name] = this.currentFrame;
        }
      }
    },

  });

});
