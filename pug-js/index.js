/**
 * @module pug-js
 *
 * Pug javascript locals. This file does not get reloaded via gulp-watch. If it
 * changes, be sure to restart gulp.
 */


/**
 * @typedef {Object} Event
 *
 * @property {boolean}  recurring         Whether or not the event happens on some schedule.
 * @property {String}   title             Event title.
 * @property {Object}   [img]             Event image.
 * @property {String}   img.src           Event image src attribute (image file path).
 * @property {String}   img.alt           Event image alt text.
 * @property {Object}   [reg]             Registration options.
 * @property {String}   reg.link          Registration link.
 * @property {Object[]} [reg.options]     Registration options.
 * @property {String}   reg.options.type  Registration type.
 * @property {String}   reg.options.price Registration price per person.
 * @property {Object[]} times             List of event times.
 * @property {Date}     times[].start     Event start datetime. Should include a timezone.
 * @property {Date}     times[].end       Event end datetime. Should include a timezone.
 * @property {boolean}  times[].allDay    If true, the time will be ignored and only the date considered. Events will be
 *                                        sorted as if they begin and end at midnight.
 * @property {boolean}  timeTBD           If true, the event dates will be considered "to be determined." They will be used
 *                                        for sorting and placing the event on the page, but will not be in the rendered
 *                                        output.
 * @property {Object}   address           Address information.
 * @property {String}   address.link      Address link (Either to Google Maps or a web address.).
 * @property {String}   address.text      Address text.
 * @property {String[]} [highlights]      Additional list items to highlight in the header list.
 * @property {String}   info              Event file for the more info link.
 * @property {Object[]} [buttons]         Extra event link buttons.
 * @property {string}   buttons[].link    Button link.
 * @property {string}   buttons[].text    Button text.
 * @property {String}   description       Event description. Will be rendered as markdown.
 */


// Current datetime.
const now = exports.now = new Date()

/**
 * Determine if two datetimes refer to the same day.
 *
 * @param   {Date}    d1 First date object.
 * @param   {Date}    d2 Second date object.
 *
 * @returns {boolean}    True iff the dates refer to thee same day.
 */
const isSameDay = exports.isSameDay = function(d1, d2) {
  return d1.getDay() === d2.getDay()
    && d1.getMonth() === d2.getMonth()
    && d1.getFullYear() === d2.getFullYear()
}

/**
 * Determine if a datetime is in the past.
 *
 * @param   {Date}    d Datetime.
 *
 * @returns {boolean}   True iff d occurred before now.
 */
const isPast = exports.isPast = function(d) { return d < now }

/**
 * Determine if an event occurred in the past.
 *
 * @param   {Event}   e Event.
 * @returns {boolean}   True iff the event has ended.
 */
const isPastEvent = exports.isPastEvent = function(e) {
  if (!e.times) return true
  for (const time of e.times) {
    if (time.allDay && !isPast(new Date(time.end.getFullYear(), time.end.getMonth(), time.end.getDay(), 11, 59, 59))) {
      return false
    }
    if (!isPast(time.end)) return false
  }
  return true
}

/**
 * Compare two events based on their listed times.
 *
 * This function is for use with Array.sort.
 *
 * @param   {Event}  e1 First event.
 * @param   {Event}  e2 Second event.
 *
 * @returns {number}    Negative if e1 is before e2, 0 if they compare the same, and positive if e1 is after e2.
 */
const compareEventTimes = exports.compareEventTimes = function(e1, e2) {

  // Sort events without times to the start.
  if (!e1.times?.length && !e2.times?.length) return 0
  else if (!e1.times.length) return -1
  else if (!e2.times.length) return 1

  // Get the last end time from e1.
  let max1 = e1.times.reduce((a, time) => time.end > a.end ? time : a, {end: 0})
  if (max1.allDay) {
    max1 = new Date(max1.end.getFullYear(), max1.end.getMonth(), max1.end.getDate(), 11, 59, 59)
  }
  else {
    max1 = max1.end
  }

  // Get the last end time from e2.
  let max2 = e2.times.reduce((a, time) => time.end > a.end ? time : a, {end: 0})
  if (max2.allDay) {
    max2 = new Date(max2.end.getFullYear(), max2.end.getMonth(), max2.end.getDate(), 11, 59, 59)
  }
  else {
    max2 = max2.end
  }

  // Compare.
  return max1 - max2

}


// Markdown renderer.
exports.markdown = require('jstransformer-markdown-it')