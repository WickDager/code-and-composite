# Code & Composite

> Front-end development × graphic design portfolio. Pure HTML, CSS, vanilla JavaScript.

## Project overview

A static portfolio site designed to impress **two audiences** simultaneously:

- **IT hiring managers** — clean code, performance, accessibility, WCAG compliance, design tokens
- **Creative directors** — visual design, AI art direction, Photoshop/Illustrator/Figma work

**No framework. No build tool.** Just HTML, CSS, and vanilla JS served as static files on Vercel.

**Live site:** [codeandcomposite.com](https://codeandcomposite.com) (replace with your domain)

---

## How to run locally

```bash
# Install dev dependency (just a local dev server)
npm install

# Start the dev server on port 3000
npm run dev
# Or directly:
npx serve . -l 3000
```

Then open `http://localhost:3000/pages/` in your browser.

---

## Folder structure

```
code-and-composite/
├── public/                      # Static assets (served at root)
│   ├── fonts/                   # Self-hosted fonts
│   ├── images/
│   │   ├── og/                  # Open Graph images (1200×630)
│   │   ├── ai-lab/              # AI Lab images
│   │   └── design-archive/      # Design work images
│   ├── favicon.svg              # Favicon
│   ├── site.webmanifest         # PWA manifest
│   └── feed.xml                 # RSS feed (generated)
├── src/
│   ├── css/
│   │   ├── tokens.css           # All CSS custom properties (colours, type, spacing)
│   │   ├── global.css           # Reset, typography, grain overlay, skip-link
│   │   ├── layout.css           # Nav, footer, grid system, breakpoints
│   │   ├── components.css       # Buttons, badges, cards, command palette, forms
│   │   ├── animations.css       # Keyframes, View Transitions API, reduced motion
│   │   └── dark-mode.css        # prefers-color-scheme + html.dark overrides
│   ├── js/
│   │   ├── main.js              # Entry point: nav/footer injection, dark mode, fade-in
│   │   ├── command-palette.js   # ⌘K search modal with keyboard navigation
│   │   ├── skill-filter.js      # Tag filtering on work grid + URL sync
│   │   ├── lightbox.js          # Fancybox 3 lazy-load init
│   │   ├── view-transitions.js  # Page-to-page transitions (Chrome 111+)
│   │   └── projects/
│   │       ├── token-editor.js       # Live design token editor
│   │       ├── contrast-checker.js   # WCAG AA/AAA checker
│   │       ├── prompt-enhancer.js    # Prompt enhancement tool
│   │       ├── icon-system.js        # SVG icon system
│   │       ├── motion-playground.js  # CSS animation demos
│   │       └── responsive-inspector.js
│   └── data/                    # All content as JSON
│       ├── projects.json        # Work items: title, tags, URL, audience
│       ├── design-archive.json  # Gallery items: tool, category, caption
│       ├── ai-lab.json          # AI images: prompt, versions, categories
│       ├── blog-posts.json      # Post list: slug, title, date, tags
│       ├── stack.json           # My Stack page: tools + one-liners
│       └── bookmarks.json       # Curated resource links
├── pages/                       # HTML pages
│   ├── index.html               # Homepage: hero, featured work, about, AI teaser
│   ├── work/                    # Work section
│   │   ├── index.html           # Project grid with skill tag filter
│   │   ├── token-editor/        # Live Design Token Editor
│   │   ├── contrast-checker/    # WCAG Contrast Checker
│   │   ├── prompt-enhancer/     # AI Prompt Enhancer
│   │   ├── icon-system/         # SVG Icon System
│   │   ├── figma-to-code/       # Figma-to-Code Showcase
│   │   ├── motion-playground/   # CSS Animation demos
│   │   └── component-library/   # Mini component library
│   ├── design/
│   │   ├── index.html           # Design archive (masonry gallery)
│   │   ├── it/                  # /it deep-link — filtered for IT hiring managers
│   │   └── design-role/         # /design deep-link — filtered for creative directors
│   ├── ai-lab/
│   │   └── index.html           # Synthetic Studio with before/after slider
│   ├── blog/
│   │   ├── index.html           # Post list + TIL feed
│   │   └── how-i-built-the-token-editor/
│   ├── toolbox/
│   │   └── index.html           # Hub: live tools + My Stack + Bookmarks
│   └── resume/
│       └── index.html           # Resume + contact form (Formspree)
├── components/                  # Reusable HTML partials (injected by JS)
│   ├── nav.html                 # Fixed navigation bar
│   ├── footer.html              # 3-column footer with links
│   └── command-palette.html     # ⌘K modal template
├── scripts/
│   ├── generate-rss.js          # Reads blog-posts.json → writes public/feed.xml
│   └── generate-placeholders.js # Lists all placeholder image paths
├── vercel.json                  # Vercel config: rewrites, security headers, cache
├── package.json
└── README.md
```

---

## How to add a new project

1. Add an entry to `src/data/projects.json`:

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "slug": "my-new-project",
  "tags": ["JavaScript", "CSS"],
  "description": "A brief description of what this project demonstrates.",
  "url": "/pages/work/my-new-project/",
  "og_image": "/public/images/og/og-my-new-project.jpg",
  "audience": ["it", "design"],
  "featured": false
}
```

2. Create the page directory: `pages/work/my-new-project/index.html`
3. Add an OG image: `public/images/og/og-my-new-project.jpg`
4. If it has interactive JS, add a file in `src/js/projects/my-new-project.js`

The work grid, command palette, and skill filter will pick it up automatically.

---

## How to update blog posts

1. Add an entry to `src/data/blog-posts.json`:

```json
{
  "slug": "my-new-post",
  "title": "My New Post Title",
  "date": "2026-04-10",
  "tags": ["CSS", "TIL"],
  "description": "A short summary of the post.",
  "url": "/pages/blog/my-new-post/",
  "reading_time": "3 min read"
}
```

2. Create the page: `pages/blog/my-new-post/index.html`
3. Regenerate the RSS feed:

```bash
npm run generate-rss
# or
node scripts/generate-rss.js
```

---

## How to deploy to Vercel

### Option A: Git push (recommended)

1. Push the repo to GitHub
2. In Vercel, import the repo
3. Vercel auto-detects the static site — no build command needed
4. Set your custom domain in Vercel settings

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Environment variables

Set these in Vercel → Project Settings → Environment Variables:

| Variable | Description |
|---|---|
| `FORMSPREE_ID` | Your Formspree form ID (replace `YOUR_FORMSPREE_ID` in `pages/resume/index.html`) |

### Before production deploy

1. **Replace all placeholder images** with real screenshots/exports
2. **Update the Formspree endpoint** in `pages/resume/index.html` with your real form ID
3. **Generate OG images** — one per project page (1200×630px)
4. **Update the canonical URL** in all page `<head>` sections
5. **Run Lighthouse audit** — target 95+ on all categories

---

## Security

### Implemented security measures

- **Content Security Policy** — strict `default-src 'self'` with explicit allowances for Google Fonts, cdnjs (Fancybox/jQuery), and Formspree
- **Security headers** via `vercel.json`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` blocking camera/microphone/geolocation
- **Contact form**: honeypot field (`_gotcha`), client-side validation, 30-second rate limit, fetch API (no form POST)
- **All external links**: `rel="noopener noreferrer"` + `target="_blank"`
- **Input sanitisation**: all user input rendered via `textContent`, never `innerHTML`
- **Meta tags**: CSP, referrer policy, X-Content-Type-Options, Permissions-Policy on every HTML page

### Cache strategy

- Static assets (`/public/fonts/*`, `/public/images/*`): `Cache-Control: public, max-age=31536000, immutable`
- HTML pages: `Cache-Control: no-cache`

---

## Accessibility

- Skip-to-content link (first focusable element on every page)
- All interactive elements reachable by keyboard
- Focus trap in command palette modal
- `aria-label` on all icon-only buttons (dark mode toggle, close buttons)
- `aria-pressed` on filter pills
- `aria-live="polite"` on dynamic content regions (contrast ratio, command palette results)
- `prefers-reduced-motion` respected — all animations disabled for users who prefer reduced motion
- All text passes WCAG AA against its background (enforced by design tokens)
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` used correctly

---

## Performance

- **Zero render-blocking resources** — all JS loaded with `defer`
- **Critical CSS inlined** on `index.html` above-the-fold content
- **Google Fonts** loaded with `font-display: swap`
- **Images**: `loading="lazy"` on all images below the fold
- **No frameworks** — total JS payload is under 30KB uncompressed
- **CSS loaded in `<head>`**, JS before `</body>`

---

## License

MIT
