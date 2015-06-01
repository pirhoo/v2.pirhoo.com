'use strict';

var gulp = require('gulp'),
  sizeOf = require('image-size'),
       _ = require("lodash");

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('resize', function() {
  return gulp.src(paths.src + '/assets/images/thumbnails/*.{png,jpg}')
    .pipe($.filter(function(image) {
      return sizeOf(image.path).width !== 150
    }))
    .pipe($.imageResize({
      width : 150,
      upscale: true
    }))
    .pipe(gulp.dest(paths.src + '/assets/images/thumbnails/'));
});


gulp.task('partials', ['markups'], function () {
  return gulp.src([
    paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/serve/{app,components}/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'pirhoo'
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('../bootstrap/fonts', 'fonts'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src([paths.src + '/**/*.{ico,txt}', paths.src + '/CNAME'])
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});


gulp.task('csv:trainings', function(){
  return gulp.src(['src/assets/csv/trainings.csv'])
    .pipe($.convert({ from: 'csv', to: 'json' }))
    .pipe($.jsonEditor(function(data) {
      return {
        hours_count: _.reduce(data, function(sum, training) {
          return sum + training.duration  * 8;
        }, 0),
        countries_count: _.keys( _.countBy(data, "country") ).length,
        customers_count: _.keys( _.countBy(data, "customer") ).length,
        category_count: _.countBy(data, "category"),
        months_count: _.countBy(data, function(commit) {
          var date = new Date(Date.parse(commit.date_start));
          return date.getFullYear() + "-" + ("0"+ (date.getMonth() + 1) ).slice(-2) + "-01";
        }),
        older_training: _.min(data, function(training) {
          return new Date( Date.parse(training.date_start) )
        }),
        newer_training: _.max(data, function(training) {
          return new Date( Date.parse(training.date_start) )
        })
      };
    }))
    .pipe(gulp.dest('.tmp/serve/assets/json/'))
    .pipe(gulp.dest('dist/assets/json/'));
});

gulp.task('csv:commits', function(){
  return gulp.src(['src/assets/csv/commits.csv'])
    .pipe($.convert({ from: 'csv', to: 'json' }))
    .pipe($.jsonEditor(function(data) {
      return {
        commits_count: data.length,
        repositories_count: _.keys( _.countBy(data, "repository") ).length,
        months_count: _.countBy(data, function(commit) {
          var date = new Date(commit.timestamp * 1000);
          return date.getFullYear() + "-" + ("0"+ (date.getMonth() + 1) ).slice(-2) + "-01";
        }),
        older_commit: _.min(data, "timestamp"),
        newer_commit: _.max(data, "timestamp")
      };
    }))
    .pipe(gulp.dest('.tmp/serve/assets/json/'))
    .pipe(gulp.dest('dist/assets/json/'));
});


gulp.task('csv:projects', function(){
  return gulp.src(['src/assets/csv/projects.csv'])
    .pipe($.convert({ from: 'csv', to: 'json' }))
    .pipe(gulp.dest('.tmp/serve/assets/json/'))
    .pipe(gulp.dest('dist/assets/json/'));
});

gulp.task('csv:awards', function(){
  return gulp.src(['src/assets/csv/awards.csv'])
    .pipe($.convert({ from: 'csv', to: 'json' }))
    .pipe($.jsonEditor(function(data) {
      return {
        awards_count: data.length,
        countries_count: _.keys( _.countBy(data, "country") ).length,
        projects_count: _.keys( _.countBy(data, "project") ).length
      };
    }))
    .pipe(gulp.dest('.tmp/serve/assets/json/'))
    .pipe(gulp.dest('dist/assets/json/'));
});


gulp.task('csv', ["csv:trainings", "csv:commits", "csv:projects", "csv:awards"])

gulp.task('build', ['html', 'images', 'fonts', 'misc', 'csv']);

gulp.task('deploy', ['build'], function() {
  return gulp.src("./dist/**/*").pipe($.ghPages({
    remoteUrl: "git@github.com:Pirhoo/pirhoo.wip.git"
  }));
});

