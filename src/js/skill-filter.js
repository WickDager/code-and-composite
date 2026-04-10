/* ============================================
   SKILL-FILTER.JS — Tag filtering on work grid
   - Reads unique tags from projects.json
   - Renders tag pills
   - Filters grid on click
   - Updates URL ?tag= for shareability
   ============================================ */

(function () {
  'use strict';

  var projects = [];
  var activeTag = 'All';

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getUniqueTags(projs) {
    var tagSet = {};
    projs.forEach(function (p) {
      p.tags.forEach(function (t) { tagSet[t] = true; });
    });
    return ['All'].concat(Object.keys(tagSet).sort());
  }

  function renderFilter(tags) {
    var container = document.getElementById('skill-filter-container');
    if (!container) return;

    container.innerHTML = tags.map(function (tag) {
      var isActive = tag === activeTag ? ' active' : '';
      return '<button class="tag-pill' + isActive + '" data-tag="' + escapeHtml(tag) + '" type="button" aria-pressed="' + (tag === activeTag) + '">' + escapeHtml(tag) + '</button>';
    }).join('');

    container.addEventListener('click', function (e) {
      var pill = e.target.closest('.tag-pill');
      if (!pill) return;
      var tag = pill.getAttribute('data-tag');
      setActiveTag(tag);
    });
  }

  function renderProjects(filtered) {
    var grid = document.getElementById('projects-grid');
    var empty = document.getElementById('empty-state');
    if (!grid) return;

    if (filtered.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    grid.style.display = '';
    if (empty) empty.style.display = 'none';

    grid.innerHTML = filtered.map(function (project) {
      var tags = project.tags.map(function (t) {
        return '<span class="project-card__tag">' + escapeHtml(t) + '</span>';
      }).join('');

      return (
        '<a href="' + escapeHtml(project.url) + '" class="project-card">' +
          '<img class="project-card__img" src="' + escapeHtml(project.og_image) + '" alt="' + escapeHtml(project.title) + ' preview" loading="lazy">' +
          '<div class="project-card__body">' +
            '<h3 class="project-card__title">' + escapeHtml(project.title) + '</h3>' +
            '<p class="project-card__desc">' + escapeHtml(project.description) + '</p>' +
            '<div class="project-card__tags">' + tags + '</div>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }

  function setActiveTag(tag) {
    activeTag = tag;

    // Update pills
    document.querySelectorAll('.tag-pill').forEach(function (pill) {
      var pillTag = pill.getAttribute('data-tag');
      var isActive = pillTag === tag;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-pressed', isActive);
    });

    // Filter projects
    var filtered = tag === 'All'
      ? projects
      : projects.filter(function (p) { return p.tags.indexOf(tag) !== -1; });

    renderProjects(filtered);

    // Update URL
    var url = new URL(window.location);
    if (tag === 'All') {
      url.searchParams.delete('tag');
    } else {
      url.searchParams.set('tag', tag);
    }
    window.history.replaceState({}, '', url);
  }

  function initFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var tag = params.get('tag');
    if (tag) activeTag = tag;
  }

  async function init() {
    initFromUrl();

    try {
      var res = await fetch('/src/data/projects.json');
      projects = await res.json();
      var tags = getUniqueTags(projects);
      renderFilter(tags);

      var filtered = activeTag === 'All'
        ? projects
        : projects.filter(function (p) { return p.tags.indexOf(activeTag) !== -1; });

      renderProjects(filtered);
    } catch (err) {
      console.warn('Failed to load projects for skill filter:', err);
    }
  }

  // Expose reset function globally
  window.resetFilter = function () {
    setActiveTag('All');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
