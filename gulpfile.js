var gulp = require('gulp');
var clean = require('gulp-clean');
var util = require('gulp-util');
var through2 = require('through2');
var jsdc = require('jsdc');

var path = require('path');

gulp.task('clean-bulid', function() {
  return gulp.src('./build/*')
    .pipe(clean());
});

function cb(file, enc, cb) {
  var target = file.path.replace(path.sep + 'src' + path.sep,  path.sep + 'build' + path.sep);
  util.log(path.relative(file.cwd, file.path), '->', path.relative(file.cwd, target));
  var content = file.contents.toString('utf-8');
  jsdc.reset();
  content = jsdc.parse(content);
  file.contents = new Buffer(content);
  cb(null, file);
}

gulp.task('default', ['clean-bulid'], function() {
  gulp.src('./src/**/*.js')
    .pipe(through2.obj(cb))
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', function(file) {
    var to = file.path.replace(path.sep + 'src' + path.sep,  path.sep + 'build' + path.sep);
    to = path.dirname(to);
    gulp.src(file.path)
      .pipe(through2.obj(cb))
      .pipe(gulp.dest(to));
  });
});