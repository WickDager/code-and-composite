/* ============================================
   CONTRAST-CHECKER.JS — WCAG AA/AAA checker
   - Two colour pickers → live ratio calc
   - Pass/fail badges for AA/AAA (normal & large)
   - Suggests nearest compliant alternative
   - All DOM manipulation uses textContent
   ============================================ */

(function () {
  'use strict';

  var fgPicker = document.getElementById('cc-fg');
  var bgPicker = document.getElementById('cc-bg');
  var fgText = document.getElementById('cc-fg-text');
  var bgText = document.getElementById('cc-bg-text');
  var preview = document.getElementById('cc-preview');
  var previewTitle = document.getElementById('cc-preview-title');
  var previewBody = document.getElementById('cc-preview-body');
  var previewSmall = document.getElementById('cc-preview-small');
  var ratioEl = document.getElementById('cc-ratio');
  var resultsEl = document.getElementById('cc-results');
  var suggestionEl = document.getElementById('cc-suggestion');

  if (!fgPicker || !bgPicker) return;

  /* ---- Relative luminance (WCAG 2.1 formula) ---- */
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function srgbToLinear(c) {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function luminance(rgb) {
    var r = srgbToLinear(rgb[0]);
    var g = srgbToLinear(rgb[1]);
    var b = srgbToLinear(rgb[2]);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrastRatio(hex1, hex2) {
    var l1 = luminance(hexToRgb(hex1));
    var l2 = luminance(hexToRgb(hex2));
    var lighter = Math.max(l1, l2);
    var darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /* ---- WCAG thresholds ---- */
  // AA normal text: 4.5:1
  // AA large text (18px+ or 14px bold): 3:1
  // AAA normal text: 7:1
  // AAA large text: 4.5:1

  function getBadge(pass) {
    if (pass) {
      return '<span class="badge badge--new">Pass</span>';
    }
    return '<span class="badge badge--hard">Fail</span>';
  }

  /* ---- Suggest compliant alternative ---- */
  function suggestCompliant(fg, bg, targetRatio) {
    var rgb = hexToRgb(fg);
    var bgLum = luminance(hexToRgb(bg));

    // Decide whether to lighten or darken
    var direction = bgLum > 0.5 ? -1 : 1; // if bg is light, darken fg; if bg is dark, lighten fg
    var step = 1;
    var tries = 0;
    var maxTries = 200;

    while (tries < maxTries) {
      var newR = Math.max(0, Math.min(255, rgb[0] + direction * step * 3));
      var newG = Math.max(0, Math.min(255, rgb[1] + direction * step * 2));
      var newB = Math.max(0, Math.min(255, rgb[2] + direction * step * 5));
      var newHex = '#' + ((1 << 24) + (Math.round(newR) << 16) + (Math.round(newG) << 8) + Math.round(newB)).toString(16).slice(1);
      var ratio = contrastRatio(newHex, bg);
      if (ratio >= targetRatio) return newHex.toUpperCase();
      step += 1;
      tries++;
    }

    return null;
  }

  /* ---- Update everything ---- */
  function update() {
    var fg = fgPicker.value;
    var bg = bgPicker.value;

    // Sync text inputs
    fgText.value = fg;
    bgText.value = bg;

    // Update preview
    if (preview) {
      preview.style.backgroundColor = bg;
      preview.style.color = fg;
    }
    if (previewTitle) previewTitle.style.color = fg;
    if (previewBody) previewBody.style.color = fg;
    if (previewSmall) previewSmall.style.color = fg;

    // Calculate ratio
    var ratio = contrastRatio(fg, bg);
    if (ratioEl) ratioEl.textContent = ratio.toFixed(2) + ':1';

    // Results
    var aaNormal = ratio >= 4.5;
    var AALarge = ratio >= 3;
    var aaanormal = ratio >= 7;
    var aaalarge = ratio >= 4.5;

    if (resultsEl) {
      resultsEl.innerHTML =
        '<div class="result-card">' +
          '<p class="result-card__level">AA Normal</p>' +
          '<div class="result-card__badge">' + getBadge(aaNormal) + '</div>' +
          '<p class="result-card__level" style="margin-top:4px">4.5:1 required</p>' +
        '</div>' +
        '<div class="result-card">' +
          '<p class="result-card__level">AA Large</p>' +
          '<div class="result-card__badge">' + getBadge(AALarge) + '</div>' +
          '<p class="result-card__level" style="margin-top:4px">3:1 required</p>' +
        '</div>' +
        '<div class="result-card">' +
          '<p class="result-card__level">AAA Normal</p>' +
          '<div class="result-card__badge">' + getBadge(aaanormal) + '</div>' +
          '<p class="result-card__level" style="margin-top:4px">7:1 required</p>' +
        '</div>' +
        '<div class="result-card">' +
          '<p class="result-card__level">AAA Large</p>' +
          '<div class="result-card__badge">' + getBadge(aaalarge) + '</div>' +
          '<p class="result-card__level" style="margin-top:4px">4.5:1 required</p>' +
        '</div>';
    }

    // Suggestion
    if (suggestionEl) {
      if (!aaNormal) {
        var suggestAA = suggestCompliant(fg, bg, 4.5);
        if (suggestAA) {
          suggestionEl.style.display = '';
          suggestionEl.textContent = 'For AA compliance, try: ' + suggestAA + ' for the foreground colour.';
        }
      } else if (!aaanormal) {
        var suggestAAA = suggestCompliant(fg, bg, 7);
        if (suggestAAA) {
          suggestionEl.style.display = '';
          suggestionEl.textContent = 'For AAA compliance, try: ' + suggestAAA + ' for the foreground colour.';
        }
      } else {
        suggestionEl.style.display = 'none';
      }
    }
  }

  /* ---- Bind events ---- */
  fgPicker.addEventListener('input', update);
  bgPicker.addEventListener('input', update);

  // Allow manual hex input in text fields
  fgText.addEventListener('input', function () {
    var val = fgText.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(val) || /^#[0-9a-fA-F]{3}$/.test(val)) {
      fgPicker.value = val;
      update();
    }
  });

  bgText.addEventListener('input', function () {
    var val = bgText.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(val) || /^#[0-9a-fA-F]{3}$/.test(val)) {
      bgPicker.value = val;
      update();
    }
  });

  // Initial render
  update();
})();
