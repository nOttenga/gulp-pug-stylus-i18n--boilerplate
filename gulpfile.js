var gulp           = require('gulp');
var stylus         = require('gulp-stylus');
var concat         = require('gulp-concat');
var uglify         = require('gulp-uglify');
var rename         = require('gulp-rename');
// var pug         = require('gulp-pug');
var pugI18n        = require('gulp-i18n-pug');
var cleanCSS       = require('gulp-clean-css');
var del            = require('del');
var postcss        = require('gulp-postcss');
// var sourcemaps  = require('gulp-sourcemaps');
var autoprefixer   = require('autoprefixer');
var lost           = require('lost');
var imageOptim     = require('gulp-imageoptim');
var webpack        = require('webpack-stream');
var htmlbeautify   = require('gulp-html-beautify');

var paths = {
  styles: {
    src: 'src/styles/main.styl',
    watch: 'src/styles/**/*.styl',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts/'
  },
  html: {
    src: 'src/templates/*.pug',
    watch: 'src/templates/**/*.pug',
    dest: 'dist/'
  },
  i18n: {
    src: 'src/translations/*.json',
  },
  images: {
    src: 'src/assets/img/**/*',
    dest: 'dist/assets/img'
  }
};

// this is just to delete folders before compiling
function clean() {
  return del([ 'dist/styles', 'dist/scripts', 'dist/assets/img' ]);
}


function styles() {
  return gulp.src(paths.styles.src)
    .pipe(stylus({
      'include css': true,
      compress: false
    }))
    .pipe(postcss([
      lost(),
      autoprefixer()
    ]))
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src)
        // .pipe(uglify()) // add this in production
        // .pipe(webpack()) // when webpack will work
        .pipe(gulp.dest(paths.scripts.dest));
}

function html() {
  // return gulp.src(paths.html.src)
  //       .pipe(pug({
  //         pretty: true // remove this in production
  //       }))
  //       .pipe(gulp.dest(paths.html.dest));
  const options = {
    i18n: {
      dest: paths.html.dest,
      locales: paths.i18n.src,
      localeExtension: false,
      pretty: true
    }
  }
  return gulp.src(paths.html.src)
    .pipe(pugI18n(options))
    .pipe(gulp.dest(paths.html.dest))
}


 
function htmlBeautify() {
  var options = {
    indentSize: 2
  };
  return gulp.src('dist/it/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('dist/it/'))
};

function imagesOptim() {
  return gulp.src(paths.images.src)
        .pipe(imageOptim.optimize())
        .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.html.watch, html);
  gulp.watch(paths.images.src, imagesOptim);
}


var build = gulp.series(clean, gulp.parallel(styles, scripts, html, htmlBeautify, imagesOptim));


exports.clean        = clean;
exports.styles       = styles;
exports.scripts      = scripts;
exports.html         = html;
exports.imagesOptim  = imagesOptim;
exports.watch        = watch;
exports.build        = build;
exports.htmlBeautify = htmlBeautify;

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;