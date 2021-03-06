'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
 
sass.compiler = require('node-sass');

gulp.task('minify-js', function() {
    return gulp.src(['./*.js', '!./gulpfile.js'])
    .pipe(concat('bundle.js')) 
    .pipe(minify({
        noSource: true
    }))
    .pipe(gulp.dest('./build'))
})
 
gulp.task('sass', function () {
  return gulp.src('./stylesheets/new-style.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});
 
gulp.task('watch', function () {
  gulp.watch('./*.js', gulp.series('minify-js'));
  gulp.watch('./stylesheets/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('minify-js','sass', 'watch'));