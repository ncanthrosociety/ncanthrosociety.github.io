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
    function () {
      $(`.nav-link[href$='#${$(this).attr('id')}']`).addClass('active')
    },
    function () {
      $(`.nav-link[href$='#${$(this).attr('id')}']`).removeClass('active')
    }
  )

  // Collapse the navbar when page is scrolled
  $(window).on('load', navbarCollapse)
  $(window).scroll(navbarCollapse)

  // Set viewport height.
  $(window).on('resize', _.debounce(
    () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`),
    200
  ))

  function navbarOverflow () {
    const nav = $('#navbar')
    const links = $('#navbar-block-links')
    const overflow = $('#navbar-block-links-overflow')
    const toggle = $('#navbar-block-links-overflow-toggle')
    const dropdown = $('#navbar-block-links-overflow-dropdown')

    if (nav.prop('scrollWidth') > nav.outerWidth()) {
      toggle.removeClass('d-none')
      const children = links.children('li:not(:last-of-type)').toArray()
      while (children.length > 0 && nav.prop('scrollWidth') > nav.outerWidth()) {
        const child = $(children.pop())
        child.prependTo(dropdown)
      }
    } else {
      const children = dropdown.children('li').toArray().reverse()
      while (children.length > 0) {
        const child = $(children.pop())
        overflow.before(child)
        if (children.length === 0) {
          toggle.addClass('d-none')
        }
        if (nav.prop('scrollWidth') > nav.outerWidth()) {
          child.prependTo(dropdown)
          toggle.removeClass('d-none')
          break
        }
      }
    }
  }

  const links = $('#navbarResponsive')
  links.css('visibility', 'hidden')
  $(window).on('load', () => {
    navbarOverflow()
    links.css('visibility', 'visible')
  })
  $(window).on('resize', _.debounce(navbarOverflow, 50))
})(jQuery)
