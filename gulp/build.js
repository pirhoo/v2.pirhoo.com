'use strict';

var gulp = require('gulp'),
  sizeOf = require('image-size'),
    slug = require('slug'),
   async = require('async'),
      fs = require('fs'),
 webshot = require('webshot'),
 through = require('through2'),
      gh = require('gh-pages'),
    path = require('path'),
       _ = require("lodash");

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});


var removeHttp = function(str) {
  return str.replace('http://', '').replace('https://', '');
}
var toThumbnailPath = function(str) {
  str = removeHttp(str)
  return 'assets/images/thumbnails/' +  slug(str).toLowerCase() + '.png';
};

gulp.task('resize', function() {
  return gulp.src(paths.src + '/assets/images/thumbnails/*.{png,jpg}')
    .pipe($.filter(function(image) {
      return sizeOf(image.path).width !== 200
    }))
    .pipe($.imageResize({
      width : 200,
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
      // Grount commits by month
      var months_count = _.groupBy(data, function(commit) {
        var date = new Date(commit.timestamp * 1000);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-01";
      });
      // Aggregate commits data by month
      months_count = _.reduce(months_count, function(result, month, key) {
        result[key] = {
          count: month.length,
          repositories: _.countBy(month, 'repository')
        }
        return result;
      }, {});
      return {
        commits_count: data.length,
        repositories_count: _.keys( _.countBy(data, "repository") ).length,
        months_count: months_count,
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
    .pipe($.jsonEditor(function(data) {
      return _.map(data, function(site) {
        site.thumbnail = site.thumbnail || toThumbnailPath(site.url, true);
        return site;
      })
    }))
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

gulp.task('csv:webshots', function() {
  return gulp.src(['src/assets/csv/projects.csv'])
    .pipe($.convert({ from: 'csv', to: 'json' }))
    .pipe(through.obj(function(file, enc, cb) {
      var data = JSON.parse(file.contents);
      // Filter data to only have the website with no screenshot yet
      data = _.filter(data, function(site) {
        var thumbnailPath = 'src/' + toThumbnailPath(site.url);
        return site.thumbnail == '' && !fs.existsSync(thumbnailPath)
      });
      // Async function to iterate over websites
      async.eachSeries(data, function(site, next) {
        // Inform the user
        $.util.log('Screenshoting %s', site.url)
        // Start the screenshot
        webshot( removeHttp(site.url), 'src/' + toThumbnailPath(site.url), {
          // We are not in hurry
          renderDelay: 6000,
          // We need a bigger screen
          windowSize: {
            width: site.width || 1600,
            height: site.height || 900
          }
        }, next);
      }, cb);
    }))
});

gulp.task('csv:sizes', ["csv:webshots"],  function(){
  return gulp.src(['dist/assets/json/projects.json'])
    .pipe($.jsonEditor(function(data) {
      return _.map(data, function(site) {
        return _.extend(site, sizeOf('src/'+ site.thumbnail) );
      });
    }))
    .pipe(gulp.dest('.tmp/serve/assets/json/'))
    .pipe(gulp.dest('dist/assets/json/'));
});


gulp.task('csv', ["csv:trainings", "csv:commits", "csv:projects", "csv:awards", "csv:webshots", "csv:sizes"])

gulp.task('build', ['html', 'images', 'fonts', 'misc', 'csv']);

gulp.task('deploy', function(cb) {
  gh.publish(path.join(process.cwd(), 'dist'), cb);
});
