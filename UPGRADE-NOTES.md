# Redesign notes (v4, branch `redesign`)

## The new look
A clean, professional look: cool off-white and deep navy (dark navy in dark mode) with one cobalt-blue accent.
Type: Manrope (bold headlines), IBM Plex Sans (body), IBM Plex Mono (data, ticker, labels), IBM Plex Serif (essay reading).
No italic accent words. The home page opens with your photo beside your name.
Fonts are self-hosted in `assets/fonts/` (SIL Open Font License), so the strict Content-Security-Policy still holds.

## Files
- `assets/site.css` – the whole design system (replaces `style.css` + `upgrades.css`, both removed).
- `assets/site.js` – all behaviour (replaces `script.js`). Every page still works with JavaScript off.
- `assets/theme.js` – tiny script that applies light/dark before first paint (no flash).
- `assets/search-index.js` – the data behind ⌘K search. **Add new essays/projects here too.**

## Structure changes
- **Research + Projects → one `work.html`** with filters (Research / Build / Ventures / Industry).
  `research.html` and `projects.html` now redirect there, so old links keep working.
- Navigation: Work · Writing · About, with a Contact button. Home is the logo.
- Fixed a broken link on the old home page (`PolicyResearch.html` did not exist; it now points to the Nikore research).

## New UX
- ⌘K / Ctrl+K (or "/") search palette across pages, projects and all essays.
- Light/dark toggle (follows the device until you choose; remembered after).
- Home: your photo in the opening section, rotating "Now" line, live ticker of key figures,
  bento grid of selected work with an HFRI score gauge, count-up stats.
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
