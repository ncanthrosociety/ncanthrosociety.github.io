/***
 * Gulp configuration for `gulp img`.
 *
 * @module lib/gulp/img
 */

// NPM Modules
const { dest, src } = require('gulp')
const path = require('path')

// Local Modules
const { BUILD_DIR } = require('./common')

// Constants
const IMG_DEST = path.join(BUILD_DIR, 'img')
const IMG_SRC = ['img/**/*']

const img = () => src(IMG_SRC).pipe(dest(IMG_DEST))
module.exports.img = img

module.exports.IMG_WATCH_SRC = IMG_SRC
