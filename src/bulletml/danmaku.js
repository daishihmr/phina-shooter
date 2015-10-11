phina.namespace(function() {

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

  var B0 = bullet({
    type: 0
  });
  var B1 = bullet({
    type: 1
  });
  var B2 = bullet({
    type: 2
  });
  var B3 = bullet({
    type: 3
  });
  var R0 = bullet({
    type: 4
  });
  var R1 = bullet({
    type: 5
  });
  var R2 = bullet({
    type: 6
  });
  var R3 = bullet({
    type: 7
  });
  var B4 = bullet({
    type: 8
  });
  var B5 = bullet({
    type: 9
  });
  var R4 = bullet({
    type: 10
  });
  var R5 = bullet({
    type: 11
  });
  var DM = bullet({
    dummy: true
  });

  ps.danmaku = {};

  // ザコ
  var basic = function(s, dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          fire(DM, spd(s), direction(dir)),
          repeat("$burst", [
            fire(R2, spdSeq(0.15), direction(0, "sequence")),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.basic = basic(1, 0);
  ps.danmaku.basicR1 = basic(1, -5);
  ps.danmaku.basicL1 = basic(1, +5);
  ps.danmaku.basicR2 = basic(1, -15);
  ps.danmaku.basicL2 = basic(1, +15);
  ps.danmaku.basicF = basic(1.2, 0);
  ps.danmaku.basicFR1 = basic(1.2, -5);
  ps.danmaku.basicFL1 = basic(1.2, +5);
  ps.danmaku.basicFR2 = basic(1.2, -15);
  ps.danmaku.basicFL2 = basic(1.2, +15);

  // ザコ3way
  var basic3 = function(dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          fire(DM, spd(1), direction(dir - 7)),
          repeat("$burst", [
            fire(R2, spdSeq(0.05), direction(0, "sequence")),
            fire(R2, spdSeq(0), direction(7, "sequence")),
            fire(R2, spdSeq(0), direction(7, "sequence")),
            fire(DM, spdSeq(0), direction(-14, "sequence")),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.basic3 = basic3(0);
  ps.danmaku.basic3R1 = basic3(-5);
  ps.danmaku.basic3L1 = basic3(+5);
  ps.danmaku.basic3R2 = basic3(-15);
  ps.danmaku.basic3L2 = basic3(+15);

  // ザコ
  var forward = function(s, dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          repeat(3, [
            fire(DM, spd(s), direction(dir, "relative")),
            repeat("$burst", [
              fire(R2, spdSeq(0.15), direction(0, "sequence")),
            ]),
            interval(10),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.forward = forward(1, 0);
  ps.danmaku.forwardR1 = forward(1, -5);
  ps.danmaku.forwardL1 = forward(1, +5);
  ps.danmaku.forwardR2 = forward(1, -15);
  ps.danmaku.forwardL2 = forward(1, +15);
  ps.danmaku.forwardF = forward(1.2, 0);
  ps.danmaku.forwardFR1 = forward(1.2, -5);
  ps.danmaku.forwardFL1 = forward(1.2, +5);
  ps.danmaku.forwardFR2 = forward(1.2, -15);
  ps.danmaku.forwardFL2 = forward(1.2, +15);

  // Stage1 ------------------------------

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
        fire(DM, spd(0.8)),
        repeat(12, [
          fire(R4, spdSeq(0), direction(360 / (12 - 1), "sequence")),
        ]),
        interval(50),
      ]),
    ]),
  });

  // Stage2 ------------------------------
  // Stage3 ------------------------------
  // Stage4 ------------------------------
  // Stage5 ------------------------------

});
