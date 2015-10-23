phina.namespace(function() {

  ps.danmaku = ps.danmaku || {};

  var action = bulletml.dsl.action;
  var actionRef = bulletml.dsl.actionRef;
  var bullet = bulletml.dsl.bullet;
  var bulletRef = bulletml.dsl.bulletRef;
  var fire = bulletml.dsl.fire;
  var fireRef = bulletml.dsl.fireRef;
  var changeDirection = bulletml.dsl.changeDirection;
  var changeSpeed = bulletml.dsl.changeSpeed;
  var accel = bulletml.dsl.accel;
  var wait = bulletml.dsl.wait;
  var vanish = bulletml.dsl.vanish;
  var repeat = bulletml.dsl.repeat;
  var bindVar = bulletml.dsl.bindVar;
  var notify = bulletml.dsl.notify;
  var direction = bulletml.dsl.direction;
  var speed = bulletml.dsl.speed;
  var horizontal = bulletml.dsl.horizontal;
  var vertical = bulletml.dsl.vertical;
  var fireOption = bulletml.dsl.fireOption;
  var offsetX = bulletml.dsl.offsetX;
  var offsetY = bulletml.dsl.offsetY;
  var autonomy = bulletml.dsl.autonomy;

  var interval = function(v) {
    return wait("{0} * (0.3 + (1.0 - $densityRank) * 0.7)".format(v));
  };
  var spd = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v));
  };
  var spdSeq = function(v) {
    return speed("{0} * (1.0 + $speedRank * 2.0)".format(v), "sequence");
  };

  var R0 = function(action) {
    return bullet(action, {
      type: 4
    });
  };
  var R1 = function(action) {
    return bullet(action, {
      type: 5
    });
  };
  var R2 = function(action) {
    return bullet(action, {
      type: 6
    });
  };
  var R3 = function(action) {
    return bullet(action, {
      type: 7
    });
  };
  var B4 = function(action) {
    return bullet(action, {
      type: 8
    });
  };
  var B5 = function(action) {
    return bullet(action, {
      type: 9
    });
  };
  var R4 = function(action) {
    return bullet(action, {
      type: 10
    });
  };
  var R5 = function(action) {
    return bullet(action, {
      type: 11
    });
  };
  var DM = function(action) {
    return bullet(action, {
      dummy: true
    });
  };

  // 黒川
  ps.danmaku.kurokawa1 = new bulletml.Root({
    top: action([
      interval(20),
      repeat(Infinity, [
        repeat(3, [
          fire(DM, spd(1.2)),
          repeat(3, [
            fire(R0, spdSeq(0), direction(0, "sequence")),
            wait(6),
          ]),
          interval(12),
        ]),
        interval(50),
      ]),
    ]),
  });

  // 秋元
  ps.danmaku.akimoto1 = new bulletml.Root({
    top0: action([
      repeat(Infinity, [
        interval(20),
        fire(R2, spd(1.0), direction(-30)),
        repeat(8, [
          fire(R2, spdSeq(0), direction(60 / 8, "sequence")),
        ]),
        interval(80),
      ]),
    ]),
    top1: action([
      repeat(Infinity, [
        interval(50),
        fire(R1, spd(1.2), direction(-10)),
        repeat(6, [
          fire(R1, spdSeq(0), direction(20 / 6, "sequence")),
        ]),
        interval(50),
      ]),
    ]),
  });

  // 黄瀬
  ps.danmaku.kise1 = new bulletml.Root({
    top: action([
      interval(20),
      repeat(Infinity, [
        fire(DM, spd(0.6)),
        repeat(5, [
          repeat(9, [
            fire(R4, spdSeq(0.02), direction(360 / (9 - 1), "sequence")),
          ]),
          wait(4),
          fire(DM, direction(7, "sequence"), spd(0.6)),
        ]),
        interval(50),
      ]),
    ]),
  });

  // 雪城1
  ps.danmaku.yukishiro1 = new bulletml.Root({
    top: action([
      wait(120),
      fire(DM, spd(0.6)),
      bindVar("dd", 1),
      repeat(3, [
        fire(R4, spdSeq(0.08), direction(-60)),
        repeat(8, [
          repeat(8, [
            fire(R4, spdSeq(0), direction(120 / 8, "sequence")),
          ]),
          wait(3),
          fire(R4, spdSeq(0), direction("-120 + $dd", "sequence")),
        ]),
        wait(30),
        fire(R4, spdSeq(0.08), direction(-60)),
        repeat(8, [
          repeat(8, [
            fire(R4, spdSeq(0), direction(120 / 8, "sequence")),
          ]),
          wait(3),
          fire(R4, spdSeq(0), direction("-120 - $dd", "sequence")),
        ]),
        wait(30),
        bindVar("dd", "$dd + 2"),
      ]),
      notify("end", {
        next: "yukishiro2"
      }),
    ]),
  });
  // 雪城2
  ps.danmaku.yukishiro2 = new bulletml.Root({
    top: action([
      interval(60),
      repeat(10, [
        fire(DM(actionRef("b")), speed(10), direction(-90, "absolute")),
        fire(DM(actionRef("b")), speed(10), direction(+90, "absolute")),
        interval(30),
      ]),
      notify("end", {
        next: "yukishiro3"
      }),
    ]),
    b: action([
      wait(2),
      fire(R2, spd(0.9), direction(-60)),
      repeat(10, [
        fire(R2, spdSeq(0), direction(120 / 10, "sequence")),
      ]),
    ]),
  });
  // 雪城3
  ps.danmaku.yukishiro3 = new bulletml.Root({
    top: action([
      interval(60),
      repeat(6, [
        bindVar("p", "$loop.index"),
        repeat(6, [
          fire(DM(actionRef("b", 180 - 20, "-($loop.index + $p * 6)")), speed(10), direction(-90, "absolute")),
          fire(DM(actionRef("b", 180 + 20, "+($loop.index + $p * 6)")), speed(10), direction(+90, "absolute")),
          interval(8),
        ]),
        interval(25),
      ]),
      notify("end", {
        next: "yukishiro1"
      }),
    ]),
    b: action([
      wait(2),
      fire(R4, spd(0.7), direction("$1 + Math.sin($2 * 0.2) * 40 - 20", "absolute")),
      fire(R4, spdSeq(0), direction(40, "sequence")),
    ]),
  });

  // 美墨1-1
  ps.danmaku.misumi11 = new bulletml.Root({
    top: action([]),
  });
  // 美墨1-2
  ps.danmaku.misumi12 = new bulletml.Root({
    top: action([]),
  });
  // 美墨1-3
  ps.danmaku.misumi13 = new bulletml.Root({
    top: action([]),
  });
  // 美墨2-1
  ps.danmaku.misumi21 = new bulletml.Root({
    top: action([]),
  });
  // 美墨2-2
  ps.danmaku.misumi22 = new bulletml.Root({
    top: action([]),
  });
  // 美墨2-3
  ps.danmaku.misumi23 = new bulletml.Root({
    top: action([]),
  });
  // 美墨3-1
  ps.danmaku.misumi31 = new bulletml.Root({
    top: action([]),
  });

});
