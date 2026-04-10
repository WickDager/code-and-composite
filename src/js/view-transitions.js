/* ============================================
   VIEW-TRANSITIONS.JS — Page-to-page
   transitions using the View Transitions API
   Graceful degradation: no-op in unsupported
   browsers.
   ============================================ */

(function () {
  'use strict';

  // Check support
  if (!document.startViewTransition) return;

  // Intercept same-origin link clicks
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//')) return;
    if (link.getAttribute('target') === '_blank') return;
    if (link.getAttribute('download') !== null) return;

    // Only intercept internal links
    var url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) return;

    e.preventDefault();
    document.startViewTransition(function () {
      window.location.href = href;
    });
  });
})();
