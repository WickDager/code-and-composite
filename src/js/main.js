/* ============================================
   MAIN.JS — Entry point
   - Injects nav/footer components
   - Initialises dark mode toggle
   - IntersectionObserver for fade-in
   - Loads featured projects & AI Lab teasers
   ============================================ */

(function () {
  'use strict';

  /* ---- Component injection ---- */
  async function loadComponent(selector, path) {
    try {
      const res = await fetch(path);
      const html = await res.text();
      const el = document.querySelector(selector);
      if (el) el.innerHTML = html;
    } catch (err) {
      console.warn('Failed to load component:', path, err);
    }
  }

  /* ---- Dark mode ---- */
  function initDarkMode() {
    const html = document.documentElement;
    const STORAGE_KEY = 'cc-theme';

    function getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
      html.classList.remove('dark', 'light');
      html.classList.add(theme);
    }

    // Determine initial theme
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      applyTheme(stored);
    } else {
      applyTheme(getSystemTheme());
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Toggle button — delegate since nav is loaded async
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('#theme-toggle');
      if (!btn) return;

      const current = html.classList.contains('dark') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  /* ---- IntersectionObserver for fade-in ---- */
  function initFadeIn() {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Featured projects (index.html) ---- */
  async function loadFeaturedProjects() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    try {
      const res = await fetch('/src/data/projects.json');
      const projects = await res.json();
      const featured = projects.filter(function (p) { return p.featured; }).slice(0, 3);

      grid.innerHTML = featured.map(function (project) {
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
    } catch (err) {
      console.warn('Failed to load featured projects:', err);
    }
  }

  /* ---- AI Lab teaser (index.html) ---- */
  async function loadAiLabTeaser() {
    var strip = document.getElementById('ai-lab-teaser');
    if (!strip) return;

    try {
      var res = await fetch('/src/data/ai-lab.json');
      var items = await res.json();
      var teaserItems = items.slice(0, 4);

      strip.innerHTML = teaserItems.map(function (item) {
        return (
          '<div class="teaser-strip__item">' +
            '<div class="card card--image">' +
              '<img class="card__img" src="' + escapeHtml(item.src) + '" alt="' + escapeHtml(item.alt) + '" loading="lazy">' +
              '<div class="card__body">' +
                '<p class="card__label">' + escapeHtml(item.tool) + '</p>' +
                '<p class="card__title">' + escapeHtml(item.title) + '</p>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    } catch (err) {
      console.warn('Failed to load AI Lab teaser:', err);
    }
  }

  /* ---- Utility: escape HTML to prevent XSS ---- */
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---- Mobile nav toggle ---- */
  function initMobileNav() {
    document.addEventListener('click', function (e) {
      var toggle = e.target.closest('.site-nav__toggle');
      if (toggle) {
        var links = document.querySelector('.site-nav__links');
        if (links) links.classList.toggle('open');
      }
    });
  }

  /* ---- Init everything ---- */
  document.addEventListener('DOMContentLoaded', function () {
    // Load components
    loadComponent('#nav-container', '/components/nav.html');
    loadComponent('#footer-container', '/components/footer.html');

    // Init features
    initDarkMode();
    initFadeIn();
    initMobileNav();
    loadFeaturedProjects();
    loadAiLabTeaser();
  });
})();
