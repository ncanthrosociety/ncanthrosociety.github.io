/**
 * Gulp configuration for `gulp pug`.
 *
 * @module lib/gulp/pug
 */

// NPM Modules
const fs = require('fs')
const { dest, parallel, src } = require('gulp')
const header = require('gulp-header')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const { finished } = require('node:stream/promises')
const path = require('path')
const yaml = require('yaml')

// Local Modules
const { BANNER_TEXT, BUILD_DIR, EVENTS_DATA, PROJECT_ROOT } = require('./common')
const events = require('../events')
const pkg = require('../../package.json')
const pugLinter = require('gulp-pug-linter')

// Constants
const BANNER_HTML = `<!--\n    ${BANNER_TEXT.join('\n    ')}\n-->\n`
const HTML_DEST = BUILD_DIR
const PUG_SRC = [
  'pug/src/**/*.pug',
  '!pug/src/events.pug',
  '!pug/src/events/events-archive.pug'
]
const PUG_SRC_EVENTS = ['pug/src/events.pug']
const PUG_SRC_EVENTS_ARCHIVE = ['pug/src/events/events-archive.pug']
const PUG_LINT_SRC = [...PUG_SRC, ...PUG_SRC_EVENTS, ...PUG_SRC_EVENTS_ARCHIVE]
const PUG_WATCH_SRC = ['pug/**/*.pug', EVENTS_DATA]

// Compile all non-event pug pages.
const compilePugNonEventPages = () =>
  src(PUG_SRC)
    .pipe(pug({
      basedir: PROJECT_ROOT
    }))
    .pipe(header(BANNER_HTML, { pkg }))
    .pipe(dest(HTML_DEST))

// Compile all event pug pages.
const compilePugEventPages = () => {
  // Load all events data.
  const eventsList = yaml.parse(fs.readFileSync(EVENTS_DATA).toString('utf-8'))

  // Bucket each event by the years that it starts in.
  const eventsByYear = {}
  for (const event of eventsList) {
    for (const time of event.times) {
      const year = time.start.getFullYear()
      eventsByYear[year] = eventsByYear[year] || []
      eventsByYear[year].push(event)
    }
  }

  // Feature the last two years of events on the /events page.
  const thisYear = new Date().getFullYear()
  const lastYear = thisYear - 1
  const featuredEvents = [
    ...(eventsByYear[thisYear] || []),
    ...(eventsByYear[lastYear] || [])
  ]

  // Further bucket the featured events into recurring, upcoming, or past. Sort them by date.
  const recurringEvents = []
  const upcomingEvents = []
  const recentEvents = []
  for (const event of featuredEvents) {
    if (event.recurring) recurringEvents.push(event)
    else if (!events.isPastEvent(event)) upcomingEvents.push(event)
    else recentEvents.push(event)
  }
  upcomingEvents.sort(events.compareEventTimes) // Sort ascending.
  recentEvents.sort((a, b) => events.compareEventTimes(b, a)) // Sort descending.

  // Container for all gulp streams.
  const streams = []

  // Push a stream for the featured /events page.
  streams.push(
    src(PUG_SRC_EVENTS)
      .pipe(pug({
        basedir: PROJECT_ROOT,
        locals: {
          recurringEvents,
          upcomingEvents,
          recentEvents,
          eventYears: Object.keys(eventsByYear).sort((a, b) => {
            return parseInt(b) - parseInt(a)
          }),
          ...events
        }
      }))
      .pipe(header(BANNER_HTML, { pkg }))
      .pipe(dest(HTML_DEST))
  )

  // Push a stream for each /events/yyyy archive page.
  for (const year of Object.keys(eventsByYear)) {
    streams.push(finished(
      src(PUG_SRC_EVENTS_ARCHIVE)
        .pipe(pug({
          basedir: PROJECT_ROOT,
          locals: {
            year: year,
            events: eventsByYear[year],
            ...events
          }
        }))
        .pipe(header(BANNER_HTML, { pkg }))
        .pipe(rename({
          basename: year
        }))
        .pipe(dest(path.join(HTML_DEST, 'events')))
    ))
  }

  // Combine all streams and return.
  return Promise.all(streams)
}

const compilePug = parallel(compilePugNonEventPages, compilePugEventPages)
module.exports['compile-pug'] = compilePug

const lintPug = () =>
  src(PUG_LINT_SRC)
    .pipe(pugLinter({ reporter: 'default', failAfterError: false }))
module.exports['lint-pug'] = lintPug

module.exports.pug = parallel(compilePug, lintPug)

module.exports.PUG_WATCH_SRC = PUG_WATCH_SRC
