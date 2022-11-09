/**
 * Gulp configuration for `gulp js` and friends.
 *
 * @module lib/gulp/javascript
 */

// NPM Modules
const { dest, parallel, src } = require('gulp')
const eslint = require('gulp-eslint')
const rename = require('gulp-rename')
const header = require('gulp-header')
const composer = require('gulp-uglify/composer')
const path = require('path')
const uglifyes = require('uglify-es')

// Local Modules
const { BANNER_TEXT, BUILD_DIR } = require('./common')
const pkg = require('../../package.json')

// Constants
const BANNER_JS = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */\n`
const JS_DEST = path.join(BUILD_DIR, 'js')
const JS_SRC = ['js/**/*.js', '!js/**/*.min.js']
const JS_LINT_SRC = [...JS_SRC, '*.js', 'lib/**/*.js']
const JS_WATCH_SRC = [...JS_SRC, '*.js', 'lib/**/*.js']
const uglify = composer(uglifyes, console)

const compileJs = () =>
  src(JS_SRC)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(BANNER_JS, { pkg }))
    .pipe(dest(JS_DEST))
module.exports['compile-js'] = compileJs

const lintJS = () =>
  src(JS_LINT_SRC)
    .pipe(eslint())
    .pipe(eslint.format())
module.exports['lint-js'] = lintJS

module.exports.js = parallel(compileJs, lintJS)

module.exports.JS_WATCH_SRC = JS_WATCH_SRC
