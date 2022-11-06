/**
 * Gulp configuration for `gulp lint` and friends.
 *
 * @module lib/gulp/lint
 */

// NPM Modules
const { parallel } = require('gulp')

// Local Modules
const pug = require('./pug')
const javascript = require('./javascript')
const scss = require('./scss')

module.exports.lint = parallel(pug['lint-pug'], javascript['lint-js'], scss['lint-scss'])
