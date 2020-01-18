/**
 * Gulp configuration file.
 *
 * @module gulpfile
 */

// NPM Modules
const _ = require('lodash')
const cleanCSS = require('gulp-clean-css')
const composer = require('gulp-uglify/composer')
const eslint = require('gulp-eslint')
const express = require('express')
const gulp = require('gulp')
const gulpStylelint = require('gulp-stylelint')
const header = require('gulp-header')
const pug = require('gulp-pug')
const pugLinter = require('gulp-pug-linter')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const uglifyes = require('uglify-es')

// Local Modules
const pkg = require('./package.json')

// Compose uglify for es6
const uglify = composer(uglifyes, console)

// Compiled source headers
const BANNER_TEXT = [
  '<%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)',
  `Copyright ${(new Date()).getFullYear()} <%= pkg.author %>`
]
const BANNER_HTML = `<!--\n    ${BANNER_TEXT.join('\n    ')}\n-->\n`
const BANNER_CSS = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */\n`
const BANNER_JS = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */\n`

// Gulp task constants

// Pug
const HTML_DEST = './'

const PUG_SRC = ['*.pug']
const PUG_TASK = 'pug'
const PUG_WATCH_SRC = ['*.pug', 'src/**/*.pug']

// CSS
const CSS_DEST = 'css'
const CSS_TASK = 'css'
const SCSS_SRC = ['css/main.scss']
const SCSS_WATCH_SRC = ['css/**/*.scss']

// JS
const JS_DEST = ['js']
const JS_SRC = ['js/*.js', '!js/*.min.js']
const JS_TASK = 'js'

// Vendor
const BOOTSTRAP_DEST = './vendor/bootstrap'
const BOOTSTRAP_SRC = [
  './node_modules/bootstrap/dist/**/*',
  '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
  '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
]
const EASING_DEST = './vendor/jquery-easing'
const EASING_SRC = ['./node_modules/jquery.easing/*.js']
const FA_DEST = './vendor'
const FA_SRC = [
  './node_modules/@fortawesome/**/*',
  '!./node_modules/@fortawesome/**/package.json' // Contains metadata we don't care about that messes with diffs.
]
const JQUERY_DEST = './vendor/jquery'
const JQUERY_SRC = [
  './node_modules/jquery/dist/*',
  '!./node_modules/jquery/dist/core.js'
]
const VENDOR_SRC = _.concat(BOOTSTRAP_SRC, FA_SRC, JQUERY_SRC, EASING_SRC)
const VENDOR_BOOTSTRAP_TASK = 'vendor-bootstrap'
const VENDOR_FA_TASK = 'vendor-fa'
const VENDOR_JQUERY_TASK = 'vendor-jquery'
const VENDOR_EASING_TASK = 'vendor-easing'
const VENDOR_TASK = 'vendor'

// Lint
const LINT_JS_TASK = 'lint-js'
const LINT_PUG_TASK = 'lint-pug'
const LINT_SCSS_TASK = 'lint-scss'
const LINT_TASK = 'lint'
const JS_LINT_SRC = ['*.js', 'src/**/*.js', '!src/**/*.min.js']
const PUG_LINT_SRC = ['index.pug', 'src/**/*.pug']
const SCSS_LINT_SRC = ['src/**/*.scss']

// Serve task
const SERVE_TASK = 'serve'
const SERVE_ROOT = __dirname
const SERVE_PORT = 3000

// Default
const DEFAULT_TASK = 'default'

// Watch
const WATCH_TASK = 'watch'

// Gulp task definitions

// Linter tasks
gulp.task(LINT_SCSS_TASK, () => {
  return gulp
    .src(SCSS_LINT_SRC)
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [{ formatter: 'string', console: true }]
    }))
})

gulp.task(LINT_JS_TASK, () => gulp.src(JS_LINT_SRC).pipe(eslint()).pipe(eslint.format()))

gulp.task(LINT_PUG_TASK, () => {
  return gulp
    .src(PUG_LINT_SRC)
    .pipe(pugLinter({ reporter: 'default', failAfterError: false }))
})

gulp.task(LINT_TASK, gulp.parallel(LINT_SCSS_TASK, LINT_JS_TASK, LINT_PUG_TASK))

// Pug compile to html
gulp.task(PUG_TASK, () => {
  return gulp
    .src(PUG_SRC)
    .pipe(pug())
    .pipe(header(BANNER_HTML, { pkg }))
    .pipe(gulp.dest(HTML_DEST))
})

// Compile SCSS
gulp.task(CSS_TASK, () => {
  return gulp
    .src(SCSS_SRC)
    .pipe(sass.sync({ outputStyle: 'expanded' })
      .on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(header(BANNER_CSS, { pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(CSS_DEST))
})

// Javascript
gulp.task(JS_TASK, () => {
  return gulp
    .src(JS_SRC)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(BANNER_JS, { pkg }))
    .pipe(gulp.dest(JS_DEST))
})

// Copy third party libraries from /node_modules into /vendor
gulp.task(VENDOR_BOOTSTRAP_TASK, () => gulp.src(BOOTSTRAP_SRC).pipe(gulp.dest(BOOTSTRAP_DEST)))

gulp.task(VENDOR_FA_TASK, () => gulp.src(FA_SRC).pipe(gulp.dest(FA_DEST)))

gulp.task(VENDOR_JQUERY_TASK, () => gulp.src(JQUERY_SRC).pipe(gulp.dest(JQUERY_DEST)))

gulp.task(VENDOR_EASING_TASK, () => gulp.src(EASING_SRC).pipe(gulp.dest(EASING_DEST)))

gulp.task(VENDOR_TASK, gulp.parallel(VENDOR_BOOTSTRAP_TASK, VENDOR_FA_TASK, VENDOR_JQUERY_TASK, VENDOR_EASING_TASK))

// Serve files over a local http server
gulp.task(SERVE_TASK, () => {
  const app = express()
  app.use(express.static(SERVE_ROOT))
  app.listen(SERVE_PORT)
  console.log(`Serving website on http://localhost:${SERVE_PORT}`)
})

// Default task
gulp.task(DEFAULT_TASK, gulp.parallel(LINT_TASK, PUG_TASK, CSS_TASK, JS_TASK, VENDOR_TASK))

// Gulp watch
gulp.task(WATCH_TASK, gulp.series(
  DEFAULT_TASK,
  gulp.parallel(
    () => {
      gulp.watch(SCSS_LINT_SRC, gulp.series(LINT_SCSS_TASK))
      gulp.watch(JS_LINT_SRC, gulp.series(LINT_JS_TASK))
      gulp.watch(PUG_LINT_SRC, gulp.series(LINT_PUG_TASK))
      gulp.watch(PUG_WATCH_SRC, gulp.series(PUG_TASK))
      gulp.watch(SCSS_WATCH_SRC, gulp.series(CSS_TASK))
      gulp.watch(JS_SRC, gulp.series(JS_TASK))
      gulp.watch(VENDOR_SRC, gulp.series(VENDOR_TASK))
    },
    SERVE_TASK
  )
))
