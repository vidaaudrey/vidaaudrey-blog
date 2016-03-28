'use strict';

//nav
$('.nav_trigger').click(function() {
    $('body').toggleClass('show_sidebar');
    $('.nav_trigger span').toggleClass('glyphicon-menu-hamburger').toggleClass('glyphicon-remove');
});


//top bar 
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event) {
    didScroll = true;
});

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is 'behind' the navbar.
    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');

    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up').addClass('nav-down');
        }
    }

    // $('.navbar-collapse').removeClass('in');

    lastScrollTop = st;
}

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

//Disqus
var disqus_shortname = 'audreyli';
(function() {
    var s = document.createElement('script');
    s.async = true;
    s.type = 'text/javascript';
    s.src = '//' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
}());


// portfolio page 
// var $grid = $('#grid'),
//     $sizer = $grid.find('.shuffle__sizer');

// $grid.shuffle({
//     itemSelector: '.picture-item',
//     sizer: $sizer
// });

// Sorting options
// $('.sort-options').on('change', function() {
//     var sort = this.value,
//         opts = {};

//     // We're given the element wrapped in jQuery
//     if (sort === 'date-created') {
//         opts = {
//             reverse: true,
//             by: function($el) {
//                 return $el.data('date-created');
//             }
//         };
//     } else if (sort === 'title') {
//         opts = {
//             by: function($el) {
//                 return $el.data('title').toLowerCase();
//             }
//         };
//     }

//     // Filter elements
//     $grid.shuffle('sort', opts);
// });
