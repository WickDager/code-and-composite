/* ============================================
   PROMPT-ENHANCER.JS — Template-based prompt
   enhancement with tone presets
   ============================================ */

(function () {
  'use strict';

  var inputEl = document.getElementById('pe-input');
  var outputEl = document.getElementById('pe-output');
  var copyBtn = document.getElementById('pe-copy');
  var clearBtn = document.getElementById('pe-clear');
  var toneButtons = document.querySelectorAll('.pe-tone-btn');
  var toast = document.getElementById('pe-toast');
  var selectedTone = 'cinematic';

  if (!inputEl || !outputEl) return;

  var tonePresets = {
    cinematic: {
      prefix: 'Cinematic scene:',
      additions: 'dramatic lighting, shallow depth of field, film grain, anamorphic lens flare, colour graded in DaVinci Resolve, shot on ARRI Alexa'
    },
    product: {
      prefix: 'Product photography:',
      additions: 'studio lighting, clean white background, sharp focus on product, minimalist composition, commercial grade, 85mm lens'
    },
    editorial: {
      prefix: 'Editorial illustration:',
      additions: 'sophisticated colour palette, editorial composition, New York Times style, layered typography, editorial lighting'
    },
    technical: {
      prefix: 'Technical illustration:',
      additions: 'precise linework, technical accuracy, blueprint aesthetic, annotated callouts, isometric perspective, engineering-grade detail'
    }
  };

  function enhancePrompt() {
    var raw = inputEl.value.trim();
    if (!raw) {
      outputEl.textContent = '';
      return;
    }

    var tone = tonePresets[selectedTone];
    var enhanced = tone.prefix + ' ' + raw + '. ' + tone.additions;
    outputEl.textContent = enhanced;
  }

  function setTone(tone) {
    selectedTone = tone;
    toneButtons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-tone') === tone;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
    enhancePrompt();
  }

  inputEl.addEventListener('input', enhancePrompt);

  toneButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTone(btn.getAttribute('data-tone'));
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = outputEl.textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showToast('Copied to clipboard ✓');
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      inputEl.value = '';
      outputEl.textContent = '';
      inputEl.focus();
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }

  // Init with first tone active
  setTone('cinematic');
})();
