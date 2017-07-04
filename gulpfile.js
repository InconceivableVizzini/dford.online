var gulp = require('gulp'),
  path = require('path'),
  babel = require('gulp-babel'),
  webpack = require('webpack-stream'),
  sass = require('gulp-sass'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  livereload = require('gulp-livereload'),
  del = require('del');

var excluded_folders = ['node_modules/'];

gulp.task('clean', function() {
  return del('dist/*');
});

gulp.task('styles', function() {
  return gulp.src('style/**/*.{css,scss,sass}')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('bundled.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/assets/css'));
});
gulp.task('scripts', function() {
  return gulp.src('js/**/*.js')
    //.pipe(babel({presets: ['es2015']}))
    .pipe(webpack({
      module: {
	loaders: [
	  { test: /\.js$/,
	    exclude: [/node_modules/, './js/vendor'],
	    loader: 'babel-loader',
	    query: { presets: ['es2015'] }
	  },
	  {
	    test: /\.(glsl|vs|fs)$/, loader: 'shader',
	  }
	]
      }
    }))
    .pipe(concat('bundled.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));
});
gulp.task('favico', function() {
    return gulp.src('favicon.ico')
	.pipe(gulp.dest('dist/'));
});
gulp.task('graphics', ['favico'], function() {
    return gulp.src('img/*.{png,gif,jpg,svg}')
	.pipe(gulp.dest('dist/assets/img'));
});
gulp.task('audio', function() {
    return gulp.src('snd/*.{mp3,ogg}')
	.pipe(gulp.dest('dist/assets/snd'));
});
gulp.task('markup', function() {
    return gulp.src(['**/*.{html,}', '!node_modules/**/*'])
	.pipe(gulp.dest('dist/'));
});
gulp.task('fonts', function() {
    return gulp.src('font/*.{otf,ttf}')
	.pipe(gulp.dest('dist/assets/font'));
});
gulp.task('default', ['clean'], function() {
    gulp.start('markup', 'styles', 'scripts', 'graphics', 'fonts', 'audio');
});
