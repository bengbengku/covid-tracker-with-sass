'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
const minify = require('gulp-minify');
 
sass.compiler = require('node-sass');

gulp.task('minify-js', function() {
    return gulp.src(['./*.js', '!./gulpfile.js'])
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
  gulp.watch('./stylesheets/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('sass', 'watch'));