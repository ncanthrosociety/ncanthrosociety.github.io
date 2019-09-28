/**
 * Self-invoking function to configure smooth scrolling.
 */
(($) => {

    // Navbar constants
    const NAV_SELECTOR = '#mainNav';
    const NAV_OFFSET   = 100;
    const SHRINK_CLASS = 'navbar-shrink';

    /**
     * Collapse navbar if greater than some offset from the top.
     */
    function navbarCollapse() {
        let nav = $(NAV_SELECTOR);
        if (nav.offset().top > NAV_OFFSET) {
            nav.addClass(SHRINK_CLASS);
        } else {
            nav.removeClass(SHRINK_CLASS);
        }
    }

    // Configure smooth scrolling
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {

        let location_pathname = location.pathname.replace(/^\//, '');
        let this_pathname = this.pathname.replace(/^\//, '');

        if (location_pathname === this_pathname  && location.hostname === this.hostname) {

            let target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            if (target.length) {
                $('html, body').animate({
                    scrollTop: (target.offset().top - 70)
                }, 1000, "easeInOutExpo");
                return false;
            }

        }

    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
        $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({ target: '#mainNav', offset: 100 });

    // Collapse now if page is not at top
    navbarCollapse();

    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

})(jQuery);
