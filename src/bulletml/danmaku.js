phina.namespace(function() {

  ps.danmaku = {};

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

  // ザコヘリ用
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

  // ザコヘリ3way
  var basic3way = function(dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          fire(DM, spd(1), direction(dir - 7)),
          repeat("$burst", [
            fire(R2, spdSeq(0), direction(0, "sequence")),
            fire(R2, spdSeq(0), direction(7, "sequence")),
            fire(R2, spdSeq(0), direction(7, "sequence")),
            fire(DM, spdSeq(0.05), direction(-14, "sequence")),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.basic3way = basic3way(0);
  ps.danmaku.basic3wayR1 = basic3way(-5);
  ps.danmaku.basic3wayL1 = basic3way(+5);
  ps.danmaku.basic3wayR2 = basic3way(-15);
  ps.danmaku.basic3wayL2 = basic3way(+15);

  // ザコ戦車用
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

  // ザコ戦車3way
  var forward3way = function(s, dir) {
    return new bulletml.Root({
      top: action([
        interval(10),
        repeat(Infinity, [
          repeat(3, [
            fire(DM, spd(s), direction(dir + "-5", "relative")),
            repeat("$burst", [
              fire(R2, spdSeq(0), direction(+5, "sequence")),
              fire(R2, spdSeq(0), direction(+5, "sequence")),
              fire(R2, spdSeq(0), direction(+5, "sequence")),
              fire(DM, spdSeq(0.15), direction(-15, "sequence")),
            ]),
            interval(10),
          ]),
          interval(50),
        ]),
      ]),
    });
  };
  ps.danmaku.forward3way = forward3way(1, 0);
  ps.danmaku.forward3wayR1 = forward3way(1, -5);
  ps.danmaku.forward3wayL1 = forward3way(1, +5);
  ps.danmaku.forward3wayR2 = forward3way(1, -15);
  ps.danmaku.forward3wayL2 = forward3way(1, +15);
  ps.danmaku.forward3wayF = forward3way(1.2, 0);
  ps.danmaku.forward3wayFR1 = forward3way(1.2, -5);
  ps.danmaku.forward3wayFL1 = forward3way(1.2, +5);
  ps.danmaku.forward3wayFR2 = forward3way(1.2, -15);
  ps.danmaku.forward3wayFL2 = forward3way(1.2, +15);

});
