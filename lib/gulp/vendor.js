/***
 * Gulp configuration for `gulp vendor` and friends.
 *
 * @module lib/gulp/vendor
 */

// NPM Modules
const { dest, parallel, src } = require('gulp')
const _ = require('lodash')
const path = require('path')

// Local Modules
const { BUILD_DIR } = require('./common')

// Constants
const BOOTSTRAP_DEST = path.join(BUILD_DIR, 'vendor/bootstrap')
const BOOTSTRAP_SRC = [
  './node_modules/bootstrap/dist/**/*',
  '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
  '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
]
const EASING_DEST = path.join(BUILD_DIR, 'vendor/jquery-easing')
const EASING_SRC = ['./node_modules/jquery.easing/*.js']
const FA_DEST = path.join(BUILD_DIR, 'vendor')
const FA_SRC = [
  './node_modules/@fortawesome/**/*',
  '!./node_modules/@fortawesome/**/package.json' // Contains metadata we don't care about that messes with diffs.
]
const JQUERY_DEST = path.join(BUILD_DIR, 'vendor/jquery')
const JQUERY_SRC = [
  './node_modules/jquery/dist/*',
  '!./node_modules/jquery/dist/core.js'
]
const LODASH_DEST = path.join(BUILD_DIR, 'vendor/lodash')
const LODASH_SRC = [
  './node_modules/lodash/lodash.min.js'
]
const VENDOR_WATCH_SRC = _.concat(BOOTSTRAP_SRC, FA_SRC, JQUERY_SRC, EASING_SRC)

const vendorBootstrap = () => src(BOOTSTRAP_SRC).pipe(dest(BOOTSTRAP_DEST))
module.exports['vendor-bootstrap'] = vendorBootstrap

const vendorLodash = () => src(LODASH_SRC).pipe(dest(LODASH_DEST))
module.exports['vendor-lodash'] = vendorLodash

const vendorFontAwesome = () => src(FA_SRC).pipe(dest(FA_DEST))
module.exports['vendor-font-awesome'] = vendorFontAwesome

const vendorJQuery = () => src(JQUERY_SRC).pipe(dest(JQUERY_DEST))
module.exports['vendor-jquery'] = vendorJQuery

const vendorJQueryEasing = () => src(EASING_SRC).pipe(dest(EASING_DEST))
module.exports['vendor-jquery-easing'] = vendorJQueryEasing

module.exports.vendor = parallel(
  vendorBootstrap, vendorLodash, vendorFontAwesome, vendorJQuery, vendorJQueryEasing
)

module.exports.VENDOR_WATCH_SRC = VENDOR_WATCH_SRC
