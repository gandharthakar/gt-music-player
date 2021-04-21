
const gulp  = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');

// Function For Convesion Of SASS Into Plain CSS.
gulp.task('convert-css', async function() {
	gulp.src(['public/sass/styles.scss'])
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('public/css'));
});

//Watch Task For Conversion Of SASS Into Plain CSS
gulp.task('sass-watch', function() {
    gulp.watch('public/sass/**/*.scss', gulp.series('convert-css'));
});