# Redesign notes (v4, branch `redesign`)

## The new look ("midnight sun")
- Palette (exact): #003135 deep · #024950 teal · #964734 rust · #0FA4AF signal · #AFDDE5 ice. One dark theme.
- Type: Instrument Serif for every heading, Instrument Sans for text, Geist Mono for small labels and the ticker. No italics.
- Home opens on an interactive scene: a low sun over layered mountains and water. It reacts to the mouse and sinks as you
  scroll. Your river photo sits beside your name. The footer ends with a setting sun.
- A soft light follows the cursor on desktop. Respects reduced-motion.
- Every link uses the same prominent style: a teal pill with an arrow (↗ for other sites, → for pages on this site).
  Case studies open with a row of big link buttons (live sites, apps, papers, code).
- Home is structured as a portfolio: projects (each with key results, a case study and a live link), three essays to
  start with, a short about, contact.
- Fonts are self-hosted in `assets/fonts/` (SIL Open Font License), so the strict Content-Security-Policy still holds.

## Files
- `assets/site.css` – the whole design system (replaces `style.css` + `upgrades.css`, both removed).
- `assets/site.js` – all behaviour (replaces `script.js`). Every page still works with JavaScript off.
- `assets/theme.js` – tiny script that marks the page as JavaScript-enabled before first paint.
- `assets/search-index.js` – the data behind ⌘K search. **Add new essays/projects here too.**

## Structure changes
- **Research + Projects → one `work.html`** with filters (Research / Build / Ventures / Industry).
  `research.html` and `projects.html` now redirect there, so old links keep working.
- Navigation: Work · Writing · About, with a Contact button. Home is the logo.
- Fixed a broken link on the old home page (`PolicyResearch.html` did not exist; it now points to the Nikore research).

## New UX
- ⌘K / Ctrl+K (or "/") search palette across pages, projects and all essays.
- Home: midnight-sun scene, ticker of key figures, project cards with links, essay picks.
- Work and Writing: filter chips; Writing also has instant search, year groups and reading times.
- Case studies: fact box, numbered sections, sticky "On this page" contents with scroll-spy, "Next project" card.
- Essays: reading progress bar, drop cap, reading time, share / copy-link, older/newer navigation.
- About: story with pull quote, focus areas, a dated journey timeline.
- Contact: large email, copy-to-clipboard, quick links.
- Footer on every page: "Let's talk" call to action and a live Kolkata clock.
- Phones: full-screen menu, 44px+ tap targets, safe-area aware, no sideways scrolling (tested on iPhone SE, iPhone 13, Pixel 7).
- Respects reduced-motion; cross-page view transitions in browsers that support them.

## Still needs you
1. **Zenodo DOI** for the HFRI paper: add it to `research-hfri.html` (hero buttons and the "Cite as" box).
2. **Howrah Forgings PDFs** (product-report, cost-analysis, calcutta-steel-letter, howrah-forgings-letter,
   howrah-forgings-certificate) were never in the repo, so their broken links were removed. Upload them and add links back.
3. **404 page** uses `/vivaan-dev/` as its base path (as before). Change the `<base href>` in `404.html` if the site is served from another path.
4. Submit `sitemap.xml` (updated) in Google Search Console.
