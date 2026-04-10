/* ============================================
   ICON-SYSTEM.JS — SVG icon search, colour
   picker, and download
   ============================================ */

(function () {
  'use strict';

  var searchInput = document.getElementById('ic-search');
  var colorPicker = document.getElementById('ic-color');
  var grid = document.getElementById('ic-grid');
  var icons = [
    { name: 'Home', path: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>' },
    { name: 'User', path: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>' },
    { name: 'Settings', path: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' },
    { name: 'Search', path: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>' },
    { name: 'Heart', path: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>' },
    { name: 'Star', path: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>' },
    { name: 'Arrow', path: '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>' },
    { name: 'Download', path: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>' }
  ];

  var currentColor = '#1a1a18';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderIcons(filter) {
    if (!grid) return;
    var q = (filter || '').toLowerCase().trim();
    var filtered = q ? icons.filter(function (ic) { return ic.name.toLowerCase().indexOf(q) !== -1; }) : icons;

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>No icons match "' + escapeHtml(q) + '"</p></div>';
      return;
    }

    grid.innerHTML = filtered.map(function (ic) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="' + currentColor + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + ic.path + '</svg>';
      return (
        '<div class="ic-card">' +
          '<div class="ic-card__preview">' + svg + '</div>' +
          '<p class="ic-card__name">' + escapeHtml(ic.name) + '</p>' +
          '<button class="btn btn--ghost btn--sm ic-download" data-name="' + escapeHtml(ic.name) + '" type="button" aria-label="Download ' + escapeHtml(ic.name) + ' icon">Download</button>' +
        '</div>'
      );
    }).join('');

    // Bind download buttons
    grid.querySelectorAll('.ic-download').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = btn.getAttribute('data-name');
        var icon = icons.find(function (ic) { return ic.name === name; });
        if (!icon) return;
        var svgContent = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + currentColor + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + icon.path + '</svg>';
        var blob = new Blob([svgContent], { type: 'image/svg+xml' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = name.toLowerCase() + '.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderIcons(searchInput.value);
    });
  }

  if (colorPicker) {
    colorPicker.addEventListener('input', function () {
      currentColor = colorPicker.value;
      renderIcons(searchInput ? searchInput.value : '');
    });
  }

  renderIcons('');
})();
