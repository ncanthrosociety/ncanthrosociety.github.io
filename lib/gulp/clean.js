/**
 * Gulp configuration for `gulp clean`.
 *
 * @module lib/gulp/clean
 */

// NPM Modules
const gulpClean = require('gulp-clean')
const { src } = require('gulp')

// Local Modules
const { BUILD_DIR } = require('./common')

// Clean tasks.
const clean = () =>
  src(BUILD_DIR, { read: false, allowEmpty: true })
    .pipe(gulpClean())
module.exports.clean = clean
