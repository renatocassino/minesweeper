// var notify = require('gulp-notify');
var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');

gulp.task('test', function () {
  gulp.src(['public/javascripts/jquery.js', 'public/js/campo.js', 'spec/javascripts/*.js'])
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless());
//    .on('error', notify.onError({
//      title: 'Jasmine Test Failed',
//      message: 'One or more tests failed, see the cli for details.'
//    }));
});
