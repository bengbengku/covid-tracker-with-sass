'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./stylesheets/new-style.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});
 
gulp.task('watch', function () {
  gulp.watch('./stylesheets/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('sass', 'watch'));