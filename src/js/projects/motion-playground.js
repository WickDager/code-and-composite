/* ============================================
   MOTION-PLAYGROUND.JS — Click card to reveal
   CSS animation code
   ============================================ */

(function () {
  'use strict';

  var grid = document.getElementById('mp-grid');
  if (!grid) return;

  grid.addEventListener('click', function (e) {
    var toggle = e.target.closest('.mp-toggle');
    if (!toggle) return;

    var codeBlock = toggle.nextElementSibling;
    if (!codeBlock) return;

    var isVisible = codeBlock.classList.toggle('visible');
    toggle.setAttribute('aria-expanded', isVisible);
    toggle.textContent = isVisible ? 'Hide code ↑' : 'Show code ↓';
  });

  // Keyboard accessibility
  grid.addEventListener('keydown', function (e) {
    var toggle = e.target.closest('.mp-toggle');
    if (!toggle) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    }
  });
})();
