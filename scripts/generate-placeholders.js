<script>
// Generate SVG placeholder images as PNG data URIs
// These are simple gradient/colour placeholders for development
(function() {
  var images = {
    // OG images
    '/public/images/og/og-home.jpg': { w: 1200, h: 630, bg: '#534AB7', text: 'Code & Composite' },
    '/public/images/og/og-prompt-enhancer.jpg': { w: 1200, h: 630, bg: '#7F77DD', text: 'Prompt Enhancer' },
    '/public/images/og/og-icon-system.jpg': { w: 1200, h: 630, bg: '#1D9E75', text: 'SVG Icon System' },
    '/public/images/og/og-token-editor.jpg': { w: 1200, h: 630, bg: '#D85A30', text: 'Token Editor' },
    '/public/images/og/og-contrast-checker.jpg': { w: 1200, h: 630, bg: '#BA7517', text: 'Contrast Checker' },
    '/public/images/og/og-figma-to-code.jpg': { w: 1200, h: 630, bg: '#378ADD', text: 'Figma to Code' },
    '/public/images/og/og-motion-playground.jpg': { w: 1200, h: 630, bg: '#D4537E', text: 'Motion Playground' },
    '/public/images/og/og-component-library.jpg': { w: 1200, h: 630, bg: '#534AB7', text: 'Component Library' },
    '/public/images/og/og-responsive-inspector.jpg': { w: 1200, h: 630, bg: '#1D9E75', text: 'Responsive Inspector' },
    '/public/images/og/og-work.jpg': { w: 1200, h: 630, bg: '#3C3489', text: 'Work' },
    '/public/images/og/og-ai-lab.jpg': { w: 1200, h: 630, bg: '#D85A30', text: 'AI Lab' },

    // AI Lab images
    '/public/images/ai-lab/datacenter-v5.jpg': { w: 800, h: 500, bg: '#1a1a2e', text: 'Data Centre v5' },
    '/public/images/ai-lab/ui-bg-abstract.jpg': { w: 800, h: 500, bg: '#2d2d44', text: 'Abstract UI BG' },
    '/public/images/ai-lab/liquid-type-poster.jpg': { w: 600, h: 800, bg: '#333355', text: 'Liquid Type' },
    '/public/images/ai-lab/negative-space-mountain.jpg': { w: 800, h: 500, bg: '#e8e6de', text: 'Negative Space' },
    '/public/images/ai-lab/ai-ui-concept.jpg': { w: 450, h: 800, bg: '#ffffff', text: 'UI Concept' },
    '/public/images/ai-lab/prompt-dissector-demo.jpg': { w: 800, h: 500, bg: '#2a2a3e', text: 'Prompt Demo' },

    // Design archive images
    '/public/images/design-archive/double-exposure-01.jpg': { w: 600, h: 750, bg: '#2a2a2a', text: 'Double Exposure' },
    '/public/images/design-archive/brand-identity-fintech.jpg': { w: 800, h: 600, bg: '#378ADD', text: 'Fintech Brand' },
    '/public/images/design-archive/magazine-spread.jpg': { w: 800, h: 600, bg: '#f0efe9', text: 'Magazine Spread' },
    '/public/images/design-archive/mobile-app-ui.jpg': { w: 450, h: 800, bg: '#111110', text: 'Mobile App UI' },
    '/public/images/design-archive/data-viz-climate.jpg': { w: 800, h: 600, bg: '#1D9E75', text: 'Climate Data Viz' },
    '/public/images/design-archive/logo-teardown-apple.jpg': { w: 600, h: 600, bg: '#f7f6f3', text: 'Apple Teardown' },
    '/public/images/design-archive/brand-identity-coffee.jpg': { w: 800, h: 600, bg: '#BA7517', text: 'Coffee Brand' },
    '/public/images/design-archive/poster-brutalist.jpg': { w: 600, h: 900, bg: '#1a1a18', text: 'Brutalist Poster' },
    '/public/images/design-archive/dashboard-design-system.jpg': { w: 800, h: 600, bg: '#534AB7', text: 'Dashboard DS' },
    '/public/images/design-archive/logo-teardown-nike.jpg': { w: 600, h: 600, bg: '#1a1a18', text: 'Nike Teardown' }
  };

  console.log('Placeholder image generator: ' + Object.keys(images).length + ' images defined.');
  console.log('Replace these with real images before production deploy.');
})();
</script>
