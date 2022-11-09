/**
 * Gulp configuration for `gulp scss` and friends.
 *
 * @module lib/gulp/scss
 */

// NPM Modules
const { dest, parallel, src } = require('gulp')
const cleanCSS = require('gulp-clean-css')
const header = require('gulp-header')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))
const gulpStylelint = require('gulp-stylelint')

// Local Modules
const { BANNER_TEXT, BUILD_DIR } = require('./common')
const pkg = require('../../package.json')
const path = require('path')

// Constants
const BANNER_CSS = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */\n`
const SCSS_DEST = path.join(BUILD_DIR, 'css')
const SCSS_SRC = ['scss/main.scss']
const SCSS_WATCH_SRC = ['scss/**/*.scss']

const compileScss = () =>
  src(SCSS_SRC)
    .pipe(sass.sync({ outputStyle: 'expanded' })
      .on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(header(BANNER_CSS, { pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(SCSS_DEST))
module.exports['compile-scss'] = compileScss

const lintScss = () =>
  src(SCSS_SRC)
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [{ formatter: 'string', console: true }]
    }))
module.exports['lint-scss'] = lintScss

module.exports.scss = parallel(compileScss, lintScss)

module.exports.SCSS_WATCH_SRC = SCSS_WATCH_SRC
