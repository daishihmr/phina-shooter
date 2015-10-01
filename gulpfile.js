var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var fs = require('node-fs-extra');
require("high");

var sourceFiles = function() {
  var scan = function(file) {
    var fileList = fs.readdirSync(file);
    return fileList.map(function(child) {
      var stat = fs.statSync(file + '/' + child);
      if (stat.isFile()) {
        return file + '/' + child;
      } else if (stat.isDirectory()) {
        return scan(file + '/' + child);
      }
    });
  };

  var srcs = scan('./src').flatten().erase('./src/main.js');
  srcs.unshift('./src/main.js');

  return srcs;
};

gulp.task('default', ['lib', 'concat']);

gulp.task('lib', function() {
  fs.copy('./phina.js/build/phina.js', './bundle/lib/phina.js');
});

gulp.task('concat', function() {
  gulp.src(sourceFiles())
    .pipe(sourcemaps.init())
    .pipe(concat('phina-shooter.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./bundle'));
});

gulp.task('watch', function() {
  gulp.watch(sourceFiles(), ['concat']);
});
