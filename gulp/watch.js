'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

gulp.task('watch', ['markups', 'inject', 'csv'], function () {
  gulp.watch([
    paths.src + '/*.html',
    paths.src + '/{app,components}/**/*.less',
    paths.src + '/{app,components}/**/*.js',
    paths.src + '/{app,components}/**/*.coffee',
    'bower.json'
  ], ['inject']);
  gulp.watch(paths.src + '/{app,components}/**/*.jade', ['markups']);
});
