var gulp     = require('gulp');
var stylus   = require('gulp-stylus');
var concat   = require('gulp-concat');
var uglify   = require('gulp-uglify');
var rename   = require('gulp-rename');
var pug      = require('gulp-pug');
var pugI18n      = require('gulp-i18n-pug');
var cleanCSS = require('gulp-clean-css');
var del      = require('del');

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
  }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([ 'dist/styles', 'dist/scripts' ]);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(stylus())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src)
        // .pipe(uglify()) // add this in production
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
      locales: `${paths.html.dest}/translations/*.json`,
      localeExtension: false
    }
  }
  return gulp.src(paths.html.src)
    .pipe(pugI18n(options))
    .pipe(gulp.dest(paths.html.dest))
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.html.watch, html);
}


var build = gulp.series(clean, gulp.parallel(styles, scripts, html));


exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.watch = watch;
exports.build = build;

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;