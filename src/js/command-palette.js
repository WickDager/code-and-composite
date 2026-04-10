/* ============================================
   COMMAND-PALETTE.JS — Cmd+K / Ctrl+K search
   - Floating modal with search input
   - Searches projects.json title, tags, desc
   - Keyboard navigation (arrow keys + enter)
   - Focus trap while open
   - ESC to close
   ============================================ */

(function () {
  'use strict';

  var projects = [];
  var results = [];
  var selectedIndex = 0;
  var overlay = null;
  var input = null;
  var resultsEl = null;
  var previousFocus = null;

  var sectionLinks = [
    { title: 'Go to Work', url: '/work/', type: 'section' },
    { title: 'Go to Design', url: '/design/', type: 'section' },
    { title: 'Go to AI Lab', url: '/ai-lab/', type: 'section' },
    { title: 'Go to Blog', url: '/blog/', type: 'section' },
    { title: 'Go to Toolbox', url: '/toolbox/', type: 'section' },
    { title: 'Go to Resume', url: '/resume/', type: 'section' },
    { title: 'Go to Token Editor', url: '/work/token-editor/', type: 'section' },
    { title: 'Go to Contrast Checker', url: '/work/contrast-checker/', type: 'section' }
  ];

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadProjects() {
    try {
      var res = await fetch('/src/data/projects.json');
      projects = await res.json();
    } catch (err) {
      console.warn('Failed to load projects for command palette:', err);
    }
  }

  function buildPalette() {
    // Create overlay element
    overlay = document.createElement('div');
    overlay.className = 'cmd-palette-overlay';
    overlay.id = 'cmd-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Command palette');
    overlay.style.display = 'none';

    overlay.innerHTML =
      '<div class="cmd-palette">' +
        '<div class="cmd-palette__input-wrap">' +
          '<svg class="cmd-palette__search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
          '<input class="cmd-palette__input" id="cmd-input" type="text" placeholder="Search projects, jump to sections…" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Search projects">' +
          '<kbd class="cmd-palette__kbd">ESC</kbd>' +
        '</div>' +
        '<div class="cmd-palette__results" id="cmd-results" role="listbox"></div>' +
        '<div class="cmd-palette__footer">' +
          '<span><kbd>↑↓</kbd> Navigate</span>' +
          '<span><kbd>↵</kbd> Open</span>' +
          '<span><kbd>ESC</kbd> Close</span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    input = document.getElementById('cmd-input');
    resultsEl = document.getElementById('cmd-results');

    // Input event
    input.addEventListener('input', function () {
      selectedIndex = 0;
      performSearch(input.value);
    });

    // Keyboard navigation
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        renderResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        renderResults();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          openResult(results[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });

    // Click outside to close
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    // Click on result
    resultsEl.addEventListener('click', function (e) {
      var item = e.target.closest('.cmd-palette__item');
      if (item) {
        var idx = parseInt(item.getAttribute('data-idx'), 10);
        if (results[idx]) openResult(results[idx]);
      }
    });
  }

  function performSearch(query) {
    var q = query.toLowerCase().trim();

    if (!q) {
      // Show recent/featured projects + sections
      results = sectionLinks.concat(projects.filter(function (p) { return p.featured; }).slice(0, 4));
    } else {
      results = projects.filter(function (p) {
        return (p.title && p.title.toLowerCase().indexOf(q) !== -1) ||
               (p.description && p.description.toLowerCase().indexOf(q) !== -1) ||
               (p.tags && p.tags.some(function (t) { return t.toLowerCase().indexOf(q) !== -1; }));
      });

      // Also match section links
      var sectionMatches = sectionLinks.filter(function (s) {
        return s.title.toLowerCase().indexOf(q) !== -1;
      });
      results = sectionMatches.concat(results);
    }

    selectedIndex = 0;
    renderResults();
  }

  function renderResults() {
    if (!resultsEl) return;

    if (results.length === 0) {
      resultsEl.innerHTML = '<div class="cmd-palette__empty">No results found.</div>';
      return;
    }

    resultsEl.innerHTML = results.map(function (item, idx) {
      var isSelected = idx === selectedIndex;
      var subtitle = item.type === 'section' ? 'Page' : (item.tags || []).join(', ');
      var icon = item.type === 'section' ? '→' : '◆';

      return (
        '<div class="cmd-palette__item' + (isSelected ? ' cmd-palette__item--selected' : '') + '" data-idx="' + idx + '" role="option" aria-selected="' + isSelected + '">' +
          '<span class="cmd-palette__item-icon">' + icon + '</span>' +
          '<div class="cmd-palette__item-text">' +
            '<span class="cmd-palette__item-title">' + escapeHtml(item.title) + '</span>' +
            '<span class="cmd-palette__item-sub">' + escapeHtml(subtitle) + '</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Scroll selected into view
    var selected = resultsEl.querySelector('.cmd-palette__item--selected');
    if (selected) selected.scrollIntoView({ block: 'nearest' });
  }

  function openResult(item) {
    if (item.url) {
      window.location.href = item.url;
    }
    close();
  }

  function open() {
    if (!overlay) return;
    previousFocus = document.activeElement;
    overlay.style.display = 'flex';
    input.value = '';
    performSearch('');
    input.focus();
    document.body.style.overflow = 'hidden';

    // Trap focus
    trapFocus(overlay);
  }

  function close() {
    if (!overlay) return;
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  /* ---- Focus trap ---- */
  function trapFocus(container) {
    var focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    container.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- Global keyboard shortcut ---- */
  document.addEventListener('keydown', function (e) {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay && overlay.style.display !== 'none') {
        close();
      } else {
        open();
      }
    }
  });

  /* ---- Init ---- */
  function init() {
    buildPalette();
    loadProjects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
