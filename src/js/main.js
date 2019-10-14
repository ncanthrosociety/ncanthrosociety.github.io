/**
 * @module main
 */
/* global jQuery */

/**
 * Self-invoking function to configure smooth scrolling.
 */
(($) => {
  // Navbar constants
  const NAV_SELECTOR = '#navbar'
  const NAV_OFFSET = 100
  const SHRINK_CLASS = 'navbar-shrink'

  /**
   * Collapse navbar if greater than some offset from the top.
   */
  function navbarCollapse () {
    const nav = $(NAV_SELECTOR)
    if (nav.offset().top > NAV_OFFSET) {
      nav.addClass(SHRINK_CLASS)
    } else {
      nav.removeClass(SHRINK_CLASS)
    }
  }

  // Configure smooth scrolling
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    const locationPathname = location.pathname.replace(/^\//, '')
    const thisPathname = this.pathname.replace(/^\//, '')

    if (locationPathname === thisPathname && location.hostname === this.hostname) {
      let target = $(this.hash)
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']')

      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 70)
        }, 1000, 'easeInOutExpo')
        return false
      }
    }
  })

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide')
  })

  // NOTE: Disabled for now due to short content length.
  // // Activate scrollspy to add active class to navbar items on scroll
  // $('body').scrollspy({ target: '#navbar', offset: NAV_OFFSET })
  $('section').hover(
    function() {
      $(`.nav-link[href$='#${$(this).attr('id')}']`).toggleClass('active');
    }
  )

  // Collapse now if page is not at top
  navbarCollapse()

  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse)
})(jQuery)
