// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('style/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('style'));
});

// Concatenate & Minify CSS
gulp.task('css', function() {
  return gulp.src('style/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('style'))
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('style'));
});


// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('style/*.scss', ['sass', 'css']);
});

// Default Task
gulp.task('default', ['sass', 'css', 'watch']);
