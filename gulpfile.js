var gulp = require('gulp'),

    sourcemaps = require('gulp-sourcemaps'),

    useref = require('gulp-useref'),

    lazypipe = require('lazypipe'),

    gulpif = require('gulp-if'),

    uglify = require('gulp-uglify'),
    
    cleanCss = require('gulp-clean-css'),

    htmlmin = require('gulp-html-minifier'),

    browserSync = require('browser-sync').create();

gulp.task('copyData', function () {

  return gulp.src('app/data/*.csv').pipe(gulp.dest('dist/data/'));

});

gulp.task('copyFonts', function () {
  
  return gulp.src('app/fonts/*.*').pipe(gulp.dest('dist/fonts/'));

});

gulp.task('build', ['copyData','copyFonts'], function () {

  return gulp.src('app/*.html')

    .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))

    .pipe(gulpif('*.js', uglify()))
    
    .pipe(gulpif('*.css', cleanCss()))

    .pipe(sourcemaps.write('maps'))

    .pipe(gulpif('*.html', htmlmin( {collapseWhitespace: true, removeComments: true})))

    .pipe(gulp.dest('dist/'));

});

gulp.task('browserSync', function() {

  browserSync.init({
    server: {
      baseDir: './'
    },
  });

});

gulp.task('watch', ['browserSync'], function() {

  gulp.watch(['app/css/*.css', 'app/js/*.js', 'app/*.html'], browserSync.reload);

});