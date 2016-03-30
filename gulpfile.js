var jasmine = require('gulp-jasmine');
var notify = require('gulp-notify');
var gulp = require('gulp');

gulp.task('test', function () {
  gulp.src('spec/javascripts/*.js')
    .pipe(jasmine())
    .on('error', notify.onError({
      title: 'Jasmine Test Failed',
      message: 'One or more tests failed, see the cli for details.'
    }));
});
