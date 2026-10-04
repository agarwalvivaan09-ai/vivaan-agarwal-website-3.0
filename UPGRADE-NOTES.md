# Upgrade notes (round 3)

## What changed
- **Design:** `upgrades.css` now holds a full design layer on top of `style.css` (serif headings, refined type scale,
  one button family, one card style, new nav pills, new footer, responsive polish). `style.css` is untouched.
- **Navigation:** every page (including posts and 404) now uses the same order: Home, About, Research, Writing, Projects, Contact.
  The footer is also identical everywhere and links to the HFRI calculator.
- **New page `research-hfri.html`:** the HFRI research page, built from the live HFRI calculator site and its GitHub README
  (model, formulas, calibration anchors, simulation results, limits, links). Added to `sitemap.xml`.
- **Research page:** HFRI is now a featured banner at the top (the old HFRI card was replaced).
- **Arbor:** the "FRI" section now says HFRI has been implemented into Arbor and links to the research.
- **ElevateX:** subtitle, program wording and official channels (Instagram, LinkedIn, Linktree) aligned with elevate-x.in.
  Existing numbers were kept as they were; the official site's counters were not readable, so no figures were changed.
- **Projects:** HFRI added as a project; ElevateX role corrected to "Founder · Former CEO & Chairman" to match the case study.
- **Home / About:** brand line is now Economics · Finance · Quantitative Research · Entrepreneurship; HFRI featured.
- **PDF renamed:** `Household_Financial_Resilience_Index_Vivaan_Agarwal.pdf` (typo and "(1)" removed; all links updated).
- Removed the empty `images`, `icons`, `fonts` placeholder files.

## Still needs you
1. **Zenodo DOI:** I could not read the DOI from the HFRI site (its links are set by JavaScript). In `research-hfri.html`
   find the `<!-- ZENODO: ... -->` comment in the hero and paste your real DOI button there. Also add the DOI to the cite box.
2. **Email:** the HFRI page uses `agarwalvivaan09@email.com` (the address already on contact.html). Confirm it, then
   update `contact.html` and `research-hfri.html` together if it is different.
3. `howrah-forgings.html` links to 5 PDFs that are not in the repo (product-report, cost-analysis, calcutta-steel-letter,
   howrah-forgings-letter, howrah-forgings-certificate).
4. The calculator itself stays on its own site (the pages' security policy blocks embedding it), so it is linked prominently.
5. Submit `sitemap.xml` in Google Search Console.
