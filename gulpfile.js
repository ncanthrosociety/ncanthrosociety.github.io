/**
 * Gulp configuration file.
 *
 * @module gulpfile
 */

// Set the process timezone. This ensures that all dates are rendered relative to eastern time, which is the official
// timezone for NCAS.
process.env.TZ = 'America/New_York'

// NPM Modules
const { parallel, series, watch } = require('gulp')

// Local Modules
const clean = require('./lib/gulp/clean')
const favicons = require('./lib/gulp/favicons')
const img = require('./lib/gulp/img')
const javascript = require('./lib/gulp/javascript')
const lint = require('./lib/gulp/lint')
const pug = require('./lib/gulp/pug')
const scss = require('./lib/gulp/scss')
const serve = require('./lib/gulp/serve')
const vendor = require('./lib/gulp/vendor')

// Export all sub-tasks.
module.exports = {
  ...clean,
  ...favicons,
  ...img,
  ...javascript,
  ...lint,
  ...pug,
  ...scss,
  ...serve,
  ...vendor
}

// Export the default and watch tasks.
const defaultTask = series(
  clean.clean,
  parallel(lint.lint, pug['compile-pug'], scss.scss, javascript.js, vendor.vendor, img.img, favicons.favicons)
)
module.exports.default = defaultTask

const watchTask = series(
  defaultTask,
  parallel(
    () => {
      watch(javascript.JS_WATCH_SRC, javascript.js)
      watch(pug.PUG_WATCH_SRC, pug.pug)
      watch(scss.SCSS_WATCH_SRC, scss.scss)
      watch(img.IMG_WATCH_SRC, img.img)
      watch(favicons.FAVICONS_WATCH_SRC, favicons.favicons)
      watch(vendor.VENDOR_WATCH_SRC, vendor.vendor)
    },
    serve.serve
  )
)
module.exports.watch = watchTask
