phina.namespace(function() {

  phina.define("ps.BackgroundLayer", {
    superClass: "phina.display.Layer",

    _cameraOffsetX: 0,

    renderChildBySelf: true,
    skip: false,

    init: function(params) {
      this.superInit({
        width: GAMEAREA_WIDTH,
        height: GAMEAREA_HEIGHT,
      });
      this.setOrigin(0, 0);
      this.backgroundColor = params.backgroundColor;

      this.stroke = params.stroke;
      this.fill = params.fill;
      this.lineWidth = 1;

      this.camera = ps.bg.Camera().addChildTo(this);
    },

    update: function(app) {
      this.skip = app.ticker.frame % 2 !== 0;
    },

    render: function() {
      var self = this;
      var cam = this.camera;
      var canvas = this.canvas;
      var w = canvas.canvas.width;
      var h = canvas.canvas.height;

      canvas.clearColor(this.backgroundColor);

      // if (self.fill) {
      //   canvas.fillStyle = self.fill;
      //   canvas.fill();
      // }
      if (self.stroke) {
        canvas.strokeStyle = self.stroke;
        canvas.context.lineWidth = self.lineWidth;
        // canvas.stroke();
      }

      for (var i = 0, len = this.children.length; i < len; i++) {
        var child = this.children[i];
        if (child instanceof ps.bg.Polygon) {
          var src = child.render(cam);
          var positions = [];
          for (var s = 0, slen = src.length; s < slen; s++) {
            var pos = src[s];
            if (pos[3] < 0) {
              positions = [];
              break;
            } else {
              positions.push(((pos[0] / pos[3]) + 0.5) * w);
              positions.push((-(pos[1] / pos[3]) + 0.5) * h);
            }
          }

          var alpha = Math.clamp(1.0 - src[0][2] * src[0][2] * 0.001, 0.0, 1.0);
          if (alpha < 0.01) continue;
          canvas.context.globalAlpha = alpha;

          if (4 <= positions.length) {
            canvas.beginPath();
            canvas.lines.apply(canvas, positions);
            canvas.closePath();
            if (self.fill) canvas.fill();
            if (self.stroke) canvas.stroke();
          } else if (positions.length === 2) {
            canvas.beginPath();
            canvas.rect(positions[0], positions[1], 1, 1);
            canvas.closePath();
            if (self.fill) canvas.fill();
            if (self.stroke) canvas.stroke();
          }
        }
      }

      canvas.context.globalAlpha = 1.0;
    },

    draw: function(canvas) {
      if (!this.skip) this.render();

      var image = this.canvas.domElement;
      canvas.context.drawImage(image,
        0, 0, image.width, image.height, -this.width * this.originX, -this.height * this.originY, this.width, this.height
      );
    },
  });

  phina.define("ps.bg.Camera", {
    superClass: "phina.app.Element",

    init: function() {
      this.superInit();

      this.position = vec3.set(vec3.create(), 5, 3, 50);
      this.target = vec3.set(vec3.create(), 0, 0, 0);
      this.up = vec3.set(vec3.create(), 0, 1, 0);

      this.vMatrix = mat4.create();
      this.pMatrix = mat4.perspective(mat4.create(), 70, GAMEAREA_WIDTH / GAMEAREA_HEIGHT, 0.1, 10000);

      this.vpMatrix = mat4.create();

      this.needsUpdate = true;
    },

    update: function() {
      if (this.needsUpdate) {
        mat4.lookAt(this.vMatrix, this.position, this.target, this.up);
        mat4.mul(this.vpMatrix, this.pMatrix, this.vMatrix);
        this.needsUpdate = false;
      }
    },

    _accessor: {
      x: {
        get: function() {
          return this.position[0];
        },
        set: function(v) {
          this.position[0] = v;
          this.needsUpdate = true;
        }
      },
      y: {
        get: function() {
          return this.position[1];
        },
        set: function(v) {
          this.position[1] = v;
          this.needsUpdate = true;
        }
      },
      z: {
        get: function() {
          return this.position[2];
        },
        set: function(v) {
          this.position[2] = v;
          this.needsUpdate = true;
        }
      },
      targetX: {
        get: function() {
          return this.target[0];
        },
        set: function(v) {
          this.target[0] = v;
          this.needsUpdate = true;
        }
      },
      targetY: {
        get: function() {
          return this.target[1];
        },
        set: function(v) {
          this.target[1] = v;
          this.needsUpdate = true;
        }
      },
      targetZ: {
        get: function() {
          return this.target[2];
        },
        set: function(v) {
          this.target[2] = v;
          this.needsUpdate = true;
        }
      },
      upX: {
        get: function() {
          return this.up[0];
        },
        set: function(v) {
          this.up[0] = v;
          this.needsUpdate = true;
        }
      },
      upY: {
        get: function() {
          return this.up[1];
        },
        set: function(v) {
          this.up[1] = v;
          this.needsUpdate = true;
        }
      },
      upZ: {
        get: function() {
          return this.up[2];
        },
        set: function(v) {
          this.up[2] = v;
          this.needsUpdate = true;
        }
      },
    }
  });

  phina.define("ps.bg.Polygon", {
    superClass: "phina.app.Element",

    init: function(params) {
      this.superInit();

      this.vertices = params.vertices.map(function(vertex) {
        return vec4.set(vec4.create(), vertex[0], vertex[1], vertex[2], 1);
      });

      this.calcPosition = this.vertices.map(function(vertex) {
        return vec4.clone(vertex);
      });

      // this.rotation = quat.create();
      this.translation = vec3.create();
      // this.scale = vec3.set(vec3.create(), 1, 1, 1);

      this.mMatrix = mat4.create();
      this.mvpMatrix = mat4.create();

      this.needsUpdate = true;
    },

    update: function() {
      if (this.needsUpdate) {
        // mat4.fromRotationTranslationScale(this.mMatrix, this.rotation, this.translation, this.scale);
        mat4.fromTranslation(this.mMatrix, this.translation);
        this.needsUpdate = false;
      }
    },

    render: function(camera) {
      var vertices = this.vertices;
      var calcPosition = this.calcPosition;
      var mvp = mat4.mul(this.mvpMatrix, camera.vpMatrix, this.mMatrix);

      for (var i = 0, len = vertices.length; i < len; i++) {
        var vertex = vertices[i];
        vec4.transformMat4(calcPosition[i], vertex, mvp);
      }

      return calcPosition;
    },

    setTranslation: function(x, y, z) {
      this.translation[0] = x;
      this.translation[1] = y;
      this.translation[2] = z;
      return this;
    },

    _accessor: {
      x: {
        get: function() {
          return this.translation[0];
        },
        set: function(v) {
          this.translation[0] = v;
          this.needsUpdate = true;
        }
      },
      y: {
        get: function() {
          return this.translation[1];
        },
        set: function(v) {
          this.translation[1] = v;
          this.needsUpdate = true;
        }
      },
      z: {
        get: function() {
          return this.translation[2];
        },
        set: function(v) {
          this.translation[2] = v;
          this.needsUpdate = true;
        }
      },
    },
  });

});
