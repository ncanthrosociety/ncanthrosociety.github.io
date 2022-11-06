/**
 * Shared gulp build definitions.
 *
 * @module lib/gulp/common
 */

// NPM Modules
const path = require('path')

// Constants
const BANNER_TEXT = [
  '<%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)',
  `Copyright ${(new Date()).getFullYear()} <%= pkg.author %>`
]
const EVENTS_DATA = 'data/events.yaml'
const PROJECT_ROOT = path.resolve(path.join(__dirname, '../../'))
const BUILD_DIR = path.join(PROJECT_ROOT, 'build')

// Exports.
module.exports = {
  BANNER_TEXT,
  BUILD_DIR,
  EVENTS_DATA,
  PROJECT_ROOT
}
