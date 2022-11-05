/**
 * Gulp configuration file.
 *
 * @module gulpfile
 */

// Set the process timezone. This ensures that all dates are rendered relative to eastern time, which is the official
// timezone for NCAS.
process.env.TZ = 'America/New_York'

// NPM Modules
const _ = require('lodash')
const clean = require('gulp-clean')
const cleanCSS = require('gulp-clean-css')
const composer = require('gulp-uglify/composer')
const eslint = require('gulp-eslint')
const express = require('express')
const { finished } = require('node:stream/promises')
const fs = require('fs')
const gulp = require('gulp')
const gulpStylelint = require('gulp-stylelint')
const header = require('gulp-header')
const path = require('path')
const pug = require('gulp-pug')
const pugjs = require('./pug-js')
const pugLinter = require('gulp-pug-linter')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))
const uglifyes = require('uglify-es')
const yaml = require('yaml')

// Local Modules
const pkg = require('./package.json')

// Compose uglify for es6
const uglify = composer(uglifyes, console)

// Compiled source headers
const BANNER_TEXT = [
  '<%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)',
  `Copyright ${(new Date()).getFullYear()} <%= pkg.author %>`
]
const BANNER_HTML = `<!--\n    ${BANNER_TEXT.join('\n    ')}\n-->\n`
const BANNER_CSS = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */\n`
const BANNER_JS = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */\n`

// Gulp task constants

// Clean.
const CLEAN_TASK = 'clean'

// Build.
const BUILD_DIR = path.join(__dirname, 'build')

// Pug
const EVENTS_DATA = 'data/events.yaml'
const HTML_DEST = BUILD_DIR
const PUG_SRC = [
  '**/*.pug',
  '!node_modules/**/*.pug',
  '!mixins/**/*.pug',
  '!base.pug',
  '!events.pug',
  '!events/events-archive.pug'
]
const PUG_SRC_EVENTS = ['events.pug']
const PUG_SRC_EVENTS_ARCHIVE = ['events/events-archive.pug']
const PUG_TASK = 'pug'
const PUG_WATCH_SRC = ['**/*.pug', '!node_modules/**/*.pug', 'data/events.yaml']

// CSS
const CSS_DEST = path.join(BUILD_DIR, 'css')
const CSS_TASK = 'css'
const SCSS_SRC = ['css/main.scss']
const SCSS_WATCH_SRC = ['css/**/*.scss']

// JS
const JS_DEST = path.join(BUILD_DIR, 'js')
const JS_SRC = ['js/**/*.js', '!js/**/*.min.js']
const JS_TASK = 'js'

// Vendor
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
const VENDOR_SRC = _.concat(BOOTSTRAP_SRC, FA_SRC, JQUERY_SRC, EASING_SRC)
const VENDOR_BOOTSTRAP_TASK = 'vendor-bootstrap'
const VENDOR_EASING_TASK = 'vendor-easing'
const VENDOR_FA_TASK = 'vendor-fa'
const VENDOR_JQUERY_TASK = 'vendor-jquery'
const VENDOR_LODASH_TASK = 'vendor-lodash'
const VENDOR_TASK = 'vendor'

// Images.
const IMG_DEST = path.join(BUILD_DIR, 'img')
const IMG_SRC = ['img/**/*']
const IMG_TASK = 'images'

// Favicons.
const FAVICON_DEST = path.join(BUILD_DIR, 'favicons')
const FAVICON_SRC = ['favicons/**/*']
const FAVICON_TASK = 'favicons'

// Lint
const LINT_JS_TASK = 'lint-js'
const LINT_PUG_TASK = 'lint-pug'
const LINT_SCSS_TASK = 'lint-scss'
const LINT_TASK = 'lint'
const JS_LINT_SRC = _.concat('*.js', JS_SRC)
const PUG_LINT_SRC = [...PUG_SRC, ...PUG_SRC_EVENTS, ...PUG_SRC_EVENTS_ARCHIVE]
const SCSS_LINT_SRC = SCSS_SRC

// Serve task
const ENV_SERVE_HOST = 'NCAS_SERVE_HOST'
const ENV_SERVE_PORT = 'NCAS_SERVE_PORT'
const SERVE_TASK = 'serve'
const SERVE_ROOT = BUILD_DIR
const SERVE_PORT = 3000
const SERVE_HOST = 'localhost'

// Default
const DEFAULT_TASK = 'default'

// Watch
const WATCH_TASK = 'watch'

// Gulp task definitions

// Clean tasks.
gulp.task(CLEAN_TASK, () => {
  return gulp
    .src(BUILD_DIR, { read: false, allowEmpty: true })
    .pipe(clean())
})

// Linter tasks
gulp.task(LINT_SCSS_TASK, () => {
  return gulp
    .src(SCSS_LINT_SRC)
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [{ formatter: 'string', console: true }]
    }))
})

gulp.task(LINT_JS_TASK, () => gulp.src(JS_LINT_SRC).pipe(eslint()).pipe(eslint.format()))

gulp.task(LINT_PUG_TASK, () => {
  return gulp
    .src(PUG_LINT_SRC)
    .pipe(pugLinter({ reporter: 'default', failAfterError: false }))
})

gulp.task(LINT_TASK, gulp.parallel(LINT_SCSS_TASK, LINT_JS_TASK, LINT_PUG_TASK))

// Pug compile to html
gulp.task(
  PUG_TASK,
  gulp.parallel(
    () => {
      return gulp
        .src(PUG_SRC)
        .pipe(pug({
          basedir: __dirname
        }))
        .pipe(header(BANNER_HTML, { pkg }))
        .pipe(gulp.dest(HTML_DEST))
    },
    async () => {
      // Load all events data.
      const events = yaml.parse(fs.readFileSync(EVENTS_DATA).toString('utf-8'))

      // Bucket each event by the years that it starts in.
      const eventsByYear = {}
      for (const event of events) {
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
      const pastEvents = []
      for (const event of featuredEvents) {
        if (event.recurring) recurringEvents.push(event)
        else if (!pugjs.isPastEvent(event)) upcomingEvents.push(event)
        else pastEvents.push(event)
      }
      upcomingEvents.sort(pugjs.compareEventTimes) // Sort ascending.
      pastEvents.sort((a, b) => pugjs.compareEventTimes(b, a)) // Sort descending.

      // Container for all gulp streams.
      const streams = []

      // Push a stream for the featured /events page.
      streams.push(
        gulp
          .src(PUG_SRC_EVENTS)
          .pipe(pug({
            basedir: __dirname,
            locals: {
              recurringEvents,
              upcomingEvents,
              pastEvents,
              eventYears: Object.keys(eventsByYear).sort((a, b) => {
                return parseInt(b) - parseInt(a)
              }),
              ...pugjs
            }
          }))
          .pipe(header(BANNER_HTML, { pkg }))
          .pipe(gulp.dest(HTML_DEST))
      )

      // Push a stream for each /events/yyyy archive page.
      for (const year of Object.keys(eventsByYear)) {
        streams.push(finished(
          gulp
            .src(PUG_SRC_EVENTS_ARCHIVE)
            .pipe(pug({
              basedir: __dirname,
              locals: {
                year: year,
                events: eventsByYear[year],
                ...pugjs
              }
            }))
            .pipe(header(BANNER_HTML, { pkg }))
            .pipe(rename({
              basename: year
            }))
            .pipe(gulp.dest(path.join(HTML_DEST, 'events')))
        ))
      }

      // Combine all streams and return.
      return Promise.all(streams)
    }
  )
)

// Compile SCSS
gulp.task(CSS_TASK, () => {
  return gulp
    .src(SCSS_SRC)
    .pipe(sass.sync({ outputStyle: 'expanded' })
      .on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(header(BANNER_CSS, { pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(CSS_DEST))
})

// Javascript
gulp.task(JS_TASK, () => {
  return gulp
    .src(JS_SRC)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(BANNER_JS, { pkg }))
    .pipe(gulp.dest(JS_DEST))
})

// Copy third party libraries from /node_modules into /vendor
gulp.task(VENDOR_BOOTSTRAP_TASK, () => gulp.src(BOOTSTRAP_SRC).pipe(gulp.dest(BOOTSTRAP_DEST)))

gulp.task(VENDOR_LODASH_TASK, () => gulp.src(LODASH_SRC).pipe(gulp.dest(LODASH_DEST)))

gulp.task(VENDOR_FA_TASK, () => gulp.src(FA_SRC).pipe(gulp.dest(FA_DEST)))

gulp.task(VENDOR_JQUERY_TASK, () => gulp.src(JQUERY_SRC).pipe(gulp.dest(JQUERY_DEST)))

gulp.task(VENDOR_EASING_TASK, () => gulp.src(EASING_SRC).pipe(gulp.dest(EASING_DEST)))

gulp.task(
  VENDOR_TASK,
  gulp.parallel(VENDOR_BOOTSTRAP_TASK, VENDOR_LODASH_TASK, VENDOR_FA_TASK, VENDOR_JQUERY_TASK, VENDOR_EASING_TASK)
)

// Copy images into the build dir.
gulp.task(IMG_TASK, () => gulp.src(IMG_SRC).pipe(gulp.dest(IMG_DEST)))

// Copy favicons into the build dir.
gulp.task(FAVICON_TASK, () => gulp.src(FAVICON_SRC).pipe(gulp.dest(FAVICON_DEST)))

// Serve files over a local http server
// If a static file is not found, the server is configured to search for files with the `.html` extension. This allows
// urls to be specified without an extension, which mirrors GitHub's default behavior. Other servers, such as nginx,
// support similar functionality.
//
// https://expressjs.com/en/api.html.
// https://stackoverflow.com/a/38238001
gulp.task(SERVE_TASK, () => {
  const host = process.env[ENV_SERVE_HOST] || SERVE_HOST
  const port = process.env[ENV_SERVE_PORT] || SERVE_PORT
  const app = express()
  app.use(express.static(SERVE_ROOT, { extensions: ['html'], redirect: false }))
  app.use((req, res, next) => {
    const dirPath = path.join(SERVE_ROOT, req.path)
    const filePath = `${dirPath}.html`
    const indexPath = path.join(dirPath, 'index.html')

    // Static content serving automatically adds the .html extension if needed. However, express does not handle the
    // situation where a file and directory have the same name (excluding the .html file extension). In this case,
    // prefer the file over the directory. Send the 404 page as a last resort.
    let status
    let resultPath
    if (fs.existsSync(dirPath) &&
        fs.statSync(dirPath).isDirectory() &&
        fs.existsSync(filePath) &&
        fs.statSync(filePath).isFile()) {
      status = 200
      resultPath = filePath
    } else if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      status = 200
      resultPath = indexPath
    } else {
      status = 404
      resultPath = path.join(SERVE_ROOT, '404.html')
    }

    res.status(status).sendFile(path.relative(SERVE_ROOT, resultPath), { root: SERVE_ROOT })
  })
  app.listen(port, host)
  console.log(`Serving website on http://${host}:${port}`)
})

// Default task
gulp.task(DEFAULT_TASK, gulp.series(
  CLEAN_TASK,
  gulp.parallel(LINT_TASK, PUG_TASK, CSS_TASK, JS_TASK, VENDOR_TASK, IMG_TASK, FAVICON_TASK)
))

// Gulp watch
gulp.task(WATCH_TASK, gulp.series(
  DEFAULT_TASK,
  gulp.parallel(
    () => {
      gulp.watch(SCSS_LINT_SRC, gulp.series(LINT_SCSS_TASK))
      gulp.watch(JS_LINT_SRC, gulp.series(LINT_JS_TASK))
      gulp.watch(PUG_LINT_SRC, gulp.series(LINT_PUG_TASK))
      gulp.watch(PUG_WATCH_SRC, gulp.series(PUG_TASK))
      gulp.watch(SCSS_WATCH_SRC, gulp.series(CSS_TASK))
      gulp.watch(JS_SRC, gulp.series(JS_TASK))
      gulp.watch(VENDOR_SRC, gulp.series(VENDOR_TASK))
      gulp.watch(IMG_SRC, gulp.series(IMG_TASK))
      gulp.watch(FAVICON_SRC, gulp.series(FAVICON_TASK))
    },
    SERVE_TASK
  )
))
