/**
 * Gulp configuration file.
 *
 * @module gulpfile
 */


// NPM Modules
const _              = require('lodash');
const cleanCSS       = require('gulp-clean-css');
const composer       = require('gulp-uglify/composer');
const gulp           = require('gulp');
const header         = require('gulp-header');
const merge          = require('merge-stream');
const pug            = require('gulp-pug');
const rename         = require('gulp-rename');
const sass           = require('gulp-sass');
const uglifyes       = require('uglify-es');


// Local Modules
const pkg            = require('./package.json');


// Compose uglify for es6
const uglify         = composer(uglifyes, console);


// Compiled source headers
const BANNER_TEXT    = [
    `<%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)`,
    `Copyright ${(new Date()).getFullYear()} <%= pkg.author %>`
];
const BANNER_HTML    = `<!--\n    ${BANNER_TEXT.join('\n    ')}\n-->\n`;
const BANNER_CSS     = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */\n`;
const BANNER_JS      = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */\n`;


// Gulp constants
const BOOTSTRAP_DEST = './vendor/bootstrap';
const BOOTSTRAP_SRC  = [
    './node_modules/bootstrap/dist/**/*',
    '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
    '!./node_modules/bootstrap/dist/css/bootstrap-reboot*',
];

const CSS_DEST       = './src/css';
const CSS_TASK       = 'css';

const DEFAULT_TASK   = 'default';

const EASING_DEST    = './vendor/jquery-easing';
const EASING_SRC     = ['./node_modules/jquery.easing/*.js',];

const FA_SRC         = [
    './node_modules/@fortawesome/**/*',
    '!./node_modules/@fortawesome/**/package.json',  // Contains metadata we don't care about that messes with diffs.
];
const FA_DEST        = './vendor';

const HTML_DEST      = './';

const JQUERY_DEST    = './vendor/jquery';
const JQUERY_SRC     = [
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js',
];

const JS_DEST        = ['./src/js'];
const JS_SRC         = ['./src/js/*.js', '!./src/js/*.min.js',];
const JS_TASK        = 'js';

const PUG_SRC        = ['index.pug',];
const PUG_TASK       = 'pug';
const PUG_WATCH_SRC  = ['index.pug', 'src/**/*.pug',];

const SCSS_SRC       = ['./src/css/main.scss',];
const SCSS_WATCH_SRC = ['src/css/**/*.scss',];

const VENDOR_SRC     = _.concat(BOOTSTRAP_SRC, FA_SRC, JQUERY_SRC, EASING_SRC);
const VENDOR_TASK    = 'vendor';

const WATCH_TASK     = 'watch';


// Pug compile to html
gulp.task(PUG_TASK, gulp.series(() => {

    return gulp.src(PUG_SRC)
        .pipe(pug())
        .pipe(header(BANNER_HTML, { pkg }))
        .pipe(gulp.dest(HTML_DEST));

}));


// Compile SCSS
gulp.task(CSS_TASK, () => {

    return gulp.src(SCSS_SRC)
        .pipe(sass.sync({ outputStyle: 'expanded' })
        .on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(header(BANNER_CSS, { pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(CSS_DEST));

});


// Javascript
gulp.task(JS_TASK, () => {

    return gulp.src(JS_SRC)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(header(BANNER_JS, { pkg }))
        .pipe(gulp.dest(JS_DEST));

});


// Copy third party libraries from /node_modules into /vendor
gulp.task(VENDOR_TASK, () => {

    return merge(

        // Bootstrap
        gulp.src(BOOTSTRAP_SRC).pipe(gulp.dest(BOOTSTRAP_DEST)),

        // Font Awesome 5
        gulp.src(FA_SRC).pipe(gulp.dest(FA_DEST)),

        // jQuery
        gulp.src(JQUERY_SRC).pipe(gulp.dest(JQUERY_DEST)),

        // jQuery Easing
        gulp.src(EASING_SRC).pipe(gulp.dest(EASING_DEST)),

    );

});


// Default task
gulp.task(DEFAULT_TASK, gulp.parallel(PUG_TASK, CSS_TASK, JS_TASK, VENDOR_TASK));


// Gulp watch
gulp.task(WATCH_TASK, gulp.series(DEFAULT_TASK, () => {

    gulp.watch(PUG_WATCH_SRC, gulp.series(PUG_TASK));
    gulp.watch(SCSS_WATCH_SRC, gulp.series(CSS_TASK));
    gulp.watch(JS_SRC, gulp.series(JS_TASK));
    gulp.watch(VENDOR_SRC, gulp.series(VENDOR_TASK));

}));
