/* ============================================
   TOKEN-EDITOR.JS — Live Design Token Editor
   - Sliders → CSS custom properties on scoped element
   - Export as CSS :root{} block
   - Export as JSON tokens
   - No innerHTML manipulation
   ============================================ */

(function () {
  'use strict';

  var scope = document.getElementById('preview-scope');
  var toast = document.getElementById('toast');

  if (!scope) return;

  var sliders = {
    hue:      document.getElementById('te-hue'),
    sat:      document.getElementById('te-sat'),
    light:    document.getElementById('te-light'),
    spacing:  document.getElementById('te-spacing'),
    radius:   document.getElementById('te-radius'),
    fontsize: document.getElementById('te-fontsize')
  };

  var valEls = {
    hue:      document.getElementById('te-hue-val'),
    sat:      document.getElementById('te-sat-val'),
    light:    document.getElementById('te-light-val'),
    spacing:  document.getElementById('te-spacing-val'),
    radius:   document.getElementById('te-radius-val'),
    fontsize: document.getElementById('te-fontsize-val')
  };

  function updatePreview() {
    var hue = sliders.hue.value;
    var sat = sliders.sat.value;
    var light = sliders.light.value;
    var spacing = sliders.spacing.value;
    var radius = sliders.radius.value;
    var fontsize = sliders.fontsize.value;

    // Update CSS custom properties on the scoped element
    scope.style.setProperty('--te-hue', hue);
    scope.style.setProperty('--te-sat', sat + '%');
    scope.style.setProperty('--te-light', light + '%');
    scope.style.setProperty('--te-spacing', spacing + 'px');
    scope.style.setProperty('--te-radius', radius + 'px');
    scope.style.setProperty('--te-fontsize', fontsize + 'px');

    // Update value labels
    valEls.hue.textContent = hue + '\u00B0';
    valEls.sat.textContent = sat + '%';
    valEls.light.textContent = light + '%';
    valEls.spacing.textContent = spacing + 'px';
    valEls.radius.textContent = radius + 'px';
    valEls.fontsize.textContent = fontsize + 'px';
  }

  // Bind all sliders
  Object.keys(sliders).forEach(function (key) {
    sliders[key].addEventListener('input', updatePreview);
  });

  // Initialise
  updatePreview();

  /* ---- Toast notification ---- */
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }

  /* ---- Copy CSS :root block ---- */
  var btnCss = document.getElementById('btn-copy-css');
  if (btnCss) {
    btnCss.addEventListener('click', function () {
      var hue = sliders.hue.value;
      var sat = sliders.sat.value;
      var light = sliders.light.value;
      var spacing = sliders.spacing.value;
      var radius = sliders.radius.value;
      var fontsize = sliders.fontsize.value;

      var css = ':root {\n' +
        '  --color-primary: hsl(' + hue + ', ' + sat + '%, ' + light + '%);\n' +
        '  --color-primary-light: hsl(' + hue + ', ' + Math.max(0, sat - 20) + '%, ' + Math.min(95, parseInt(light) + 20) + '%);\n' +
        '  --color-primary-dark: hsl(' + hue + ', ' + sat + '%, ' + Math.max(10, parseInt(light) - 15) + '%);\n' +
        '  --spacing-unit: ' + spacing + 'px;\n' +
        '  --border-radius: ' + radius + 'px;\n' +
        '  --font-size-base: ' + fontsize + 'px;\n' +
        '}';

      navigator.clipboard.writeText(css).then(function () {
        showToast('Copied CSS to clipboard ✓');
      }).catch(function () {
        showToast('Failed to copy — check browser permissions');
      });
    });
  }

  /* ---- Copy JSON tokens ---- */
  var btnJson = document.getElementById('btn-copy-json');
  if (btnJson) {
    btnJson.addEventListener('click', function () {
      var tokens = {
        color: {
          primary: {
            value: 'hsl(' + sliders.hue.value + ', ' + sliders.sat.value + '%, ' + sliders.light.value + '%)',
            type: 'color'
          },
          primaryLight: {
            value: 'hsl(' + sliders.hue.value + ', ' + Math.max(0, sliders.sat.value - 20) + '%, ' + Math.min(95, parseInt(sliders.light.value) + 20) + '%)',
            type: 'color'
          }
        },
        spacing: {
          unit: {
            value: sliders.spacing.value + 'px',
            type: 'dimension'
          }
        },
        borderRadius: {
          default: {
            value: sliders.radius.value + 'px',
            type: 'dimension'
          }
        },
        fontSize: {
          base: {
            value: sliders.fontsize.value + 'px',
            type: 'dimension'
          }
        }
      };

      var json = JSON.stringify(tokens, null, 2);

      navigator.clipboard.writeText(json).then(function () {
        showToast('Copied JSON tokens to clipboard ✓');
      }).catch(function () {
        showToast('Failed to copy — check browser permissions');
      });
    });
  }
})();
