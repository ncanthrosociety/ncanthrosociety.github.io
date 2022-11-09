/**
 * Gulp configuration for `gulp favicons`.
 */

// NPM Modules
const { dest, src } = require('gulp')
const path = require('path')

// Local Modules
const { BUILD_DIR } = require('./common')

// Constants
const FAVICON_DEST = path.join(BUILD_DIR, 'favicons')
const FAVICON_SRC = ['favicons/**/*']

const favicons = () => src(FAVICON_SRC).pipe(dest(FAVICON_DEST))
module.exports.favicons = favicons

module.exports.FAVICONS_WATCH_SRC = FAVICON_SRC
