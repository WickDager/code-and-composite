/* ============================================
   RESPONSIVE-INSPECTOR.JS — iframe width slider
   with breakpoint overlay
   ============================================ */

(function () {
  'use strict';

  var slider = document.getElementById('ri-slider');
  var preview = document.getElementById('ri-preview');
  var label = document.getElementById('ri-label');
  var widthDisplay = document.getElementById('ri-width');
  var urlInput = document.getElementById('ri-url');
  var goBtn = document.getElementById('ri-go');
  var iframe = document.getElementById('ri-iframe');

  if (!slider || !preview) return;

  var breakpoints = [
    { name: 'Mobile', max: 480 },
    { name: 'Tablet', max: 768 },
    { name: 'Laptop', max: 1024 },
    { name: 'Desktop', max: 9999 }
  ];

  function updateWidth() {
    var w = slider.value;
    preview.style.width = w + 'px';
    if (widthDisplay) widthDisplay.textContent = w + 'px';

    var bp = breakpoints.find(function (b) { return parseInt(w) <= b.max; });
    if (label) label.textContent = bp ? bp.name : 'Desktop';
  }

  slider.addEventListener('input', updateWidth);
  updateWidth();

  if (goBtn && urlInput && iframe) {
    goBtn.addEventListener('click', function () {
      var url = urlInput.value.trim();
      if (!url) return;
      if (url.indexOf('http') !== 0) url = 'https://' + url;
      iframe.src = url;
    });
  }
})();
