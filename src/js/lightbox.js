/* ============================================
   LIGHTBOX.JS — Fancybox 3 init + caption
   Loads Fancybox from cdnjs only if a
   gallery exists on the current page.
   ============================================ */

(function () {
  'use strict';

  function initLightbox() {
    // Check if there are gallery items on this page
    var galleryLinks = document.querySelectorAll('[data-fancybox="gallery"]');
    if (!galleryLinks.length) return;

    // Load Fancybox CSS
    var cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css';
    document.head.appendChild(cssLink);

    // Load Fancybox JS
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js';
    // Fancybox 3 requires jQuery — load it first
    var jQuery = document.createElement('script');
    jQuery.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    jQuery.onload = function () {
      document.head.appendChild(script);
      script.onload = function () {
        $('[data-fancybox="gallery"]').fancybox({
          caption: function (instance, item) {
            return $(this).data('caption') || '';
          },
          loop: true,
          infobar: true,
          buttons: ['zoom', 'slideShow', 'fullScreen', 'thumbs', 'close'],
          transitionEffect: 'fade',
          image: { preload: false }
        });
      };
    };
    document.head.appendChild(jQuery);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
