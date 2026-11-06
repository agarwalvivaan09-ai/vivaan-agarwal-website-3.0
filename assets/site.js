/* =====================================================================
   site.js — progressive enhancement. Every page works without it.
   ===================================================================== */
(function () {
  "use strict";

  var doc = document, root = doc.documentElement, body = doc.body;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- Toast ---------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = doc.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-shown"); }, 2200);
  }

  /* ---------- Theme toggle ---------- */
  function setTheme(t, save) {
    var apply = function () { root.setAttribute("data-theme", t); };
    if (doc.startViewTransition && !reduce) doc.startViewTransition(apply); else apply();
    if (save) { try { localStorage.setItem("theme", t); } catch (e) {} }
    $$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute("content", t === "dark" ? "#0e0e0d" : "#f2efe8"); });
  }
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  });
  if (window.matchMedia) {
    var mqDark = matchMedia("(prefers-color-scheme: dark)");
    var follow = function (e) {
      var saved = null; try { saved = localStorage.getItem("theme"); } catch (x) {}
      if (!saved) setTheme(e.matches ? "dark" : "light", false);
    };
    if (mqDark.addEventListener) mqDark.addEventListener("change", follow);
  }

  /* ---------- Header: shadow + hide on scroll down ---------- */
  var header = $(".site-header");
  var lastY = window.pageYOffset, ticking = false;
  var progress = $(".progress"), articleBody = $(".article-body");
  var toTop = $("[data-to-top]");

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.pageYOffset;
      if (header) {
        header.classList.toggle("is-scrolled", y > 8);
        var menuOpen = root.classList.contains("menu-open");
        if (!menuOpen && y > 320 && y > lastY + 4) header.classList.add("is-hidden");
        else if (y < lastY - 4 || y < 320) header.classList.remove("is-hidden");
      }
      if (progress && articleBody) {
        var start = articleBody.offsetTop, end = start + articleBody.offsetHeight - window.innerHeight;
        var p = end > start ? (y - start) / (end - start) : 0;
        progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
      }
      lastY = y;
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $(".menu-btn"), menu = $("#mobile-menu");
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    root.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.querySelector(".lbl").textContent = open ? "Close" : "Menu";
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) { menu.removeAttribute("inert"); header && header.classList.remove("is-hidden"); }
    else menu.setAttribute("inert", "");
  }
  if (menuBtn && menu) {
    menu.setAttribute("inert", "");
    menuBtn.addEventListener("click", function () { setMenu(!root.classList.contains("menu-open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    var mqWide = matchMedia("(min-width: 861px)");
    var closeWide = function () { if (mqWide.matches) setMenu(false); };
    if (mqWide.addEventListener) mqWide.addEventListener("change", closeWide);
  }

  /* ---------- Search palette (⌘K / Ctrl+K / "/") ---------- */
  var INDEX = window.SITE_INDEX || [];
  var pal = null, palInput, palList, palItems = [], palSel = 0, lastFocus = null;

  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function score(item, q) {
    if (!q) return item.p || 1;
    var t = norm(item.t), s = norm(item.s + " " + (item.k || "")), sc = 0;
    var words = q.split(/\s+/).filter(Boolean);
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (t.indexOf(w) === 0) sc += 12;
      else if (t.indexOf(" " + w) > -1) sc += 9;
      else if (t.indexOf(w) > -1) sc += 6;
      else if (s.indexOf(w) > -1) sc += 3;
      else return 0;
    }
    return sc + (item.p || 0) * .1;
  }
  function renderPalette() {
    var q = norm(palInput.value.trim());
    var res = INDEX.map(function (it) { return { it: it, sc: score(it, q) }; })
      .filter(function (r) { return r.sc > 0; })
      .sort(function (a, b) { return b.sc - a.sc; });
    if (!q) res = res.slice(0, 40);
    var groups = {}, order = [];
    res.forEach(function (r) { var g = r.it.g; if (!groups[g]) { groups[g] = []; order.push(g); } groups[g].push(r.it); });
    if (!q) order.sort(function (a, b) { return ["Pages", "Work", "Writing", "Elsewhere"].indexOf(a) - ["Pages", "Work", "Writing", "Elsewhere"].indexOf(b); });
    palList.innerHTML = "";
    palItems = [];
    if (!res.length) {
      var li = doc.createElement("li"); li.className = "grp"; li.textContent = "No results for “" + palInput.value + "”";
      palList.appendChild(li);
    }
    order.forEach(function (g) {
      var h = doc.createElement("li"); h.className = "grp"; h.textContent = g; h.setAttribute("role", "presentation");
      palList.appendChild(h);
      groups[g].forEach(function (it) {
        var li = doc.createElement("li"); li.setAttribute("role", "presentation");
        var a = doc.createElement("a");
        a.href = it.u; a.setAttribute("role", "option"); a.id = "pal-" + palItems.length;
        if (/^https?:/.test(it.u)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
        var left = doc.createElement("span");
        var t = doc.createElement("span"); t.className = "t"; t.textContent = it.t;
        var s = doc.createElement("span"); s.className = "s"; s.textContent = it.s || "";
        left.appendChild(t); if (it.s) left.appendChild(s);
        var k = doc.createElement("span"); k.className = "k"; k.textContent = it.m || "";
        a.appendChild(left); a.appendChild(k);
        a.addEventListener("mousemove", function () { select(palItems.indexOf(a), false); });
        li.appendChild(a); palList.appendChild(li); palItems.push(a);
      });
    });
    select(0, false);
  }
  function select(i, scroll) {
    if (!palItems.length) return;
    palSel = (i + palItems.length) % palItems.length;
    palItems.forEach(function (a, j) { a.setAttribute("aria-selected", j === palSel ? "true" : "false"); });
    palInput.setAttribute("aria-activedescendant", palItems[palSel].id);
    if (scroll !== false) palItems[palSel].scrollIntoView({ block: "nearest" });
  }
  function buildPalette() {
    pal = doc.createElement("div");
    pal.className = "palette"; pal.hidden = true;
    pal.setAttribute("role", "dialog"); pal.setAttribute("aria-modal", "true"); pal.setAttribute("aria-label", "Search the site");
    pal.innerHTML =
      '<div class="palette-backdrop" data-close></div>' +
      '<div class="palette-box">' +
        '<div class="palette-input"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
        '<input type="search" placeholder="Search pages, projects, essays…" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="pal-list" autocomplete="off" spellcheck="false"></div>' +
        '<ul class="palette-list" id="pal-list" role="listbox"></ul>' +
        '<div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>' +
      '</div>';
    body.appendChild(pal);
    palInput = $("input", pal); palList = $(".palette-list", pal);
    palInput.addEventListener("input", renderPalette);
    palInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); select(palSel + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); select(palSel - 1); }
      else if (e.key === "Enter" && palItems[palSel]) { e.preventDefault(); palItems[palSel].click(); closePalette(); }
    });
    pal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closePalette();
      else if (e.target.closest("a")) closePalette();
    });
  }
  function openPalette() {
    if (!pal) buildPalette();
    lastFocus = doc.activeElement;
    pal.hidden = false; root.classList.add("palette-open");
    palInput.value = ""; renderPalette();
    palInput.focus();
    setMenu(false);
  }
  function closePalette() {
    if (!pal || pal.hidden) return;
    pal.hidden = true; root.classList.remove("palette-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$("[data-open-search]").forEach(function (b) { b.addEventListener("click", openPalette); });
  doc.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); pal && !pal.hidden ? closePalette() : openPalette(); }
    else if (e.key === "/" && !typing) { e.preventDefault(); openPalette(); }
    else if (e.key === "Escape") {
      if (pal && !pal.hidden) closePalette();
      else if (root.classList.contains("menu-open")) { setMenu(false); menuBtn && menuBtn.focus(); }
    }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $$(".kbd-mod").forEach(function (k) { k.textContent = "⌘K"; });
  else $$(".kbd-mod").forEach(function (k) { k.textContent = "Ctrl K"; });

  /* ---------- Reveal on scroll + count-up + gauge ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    if (reduce || isNaN(target)) return;
    var t0 = null, dur = 1600;
    var fmt = function (v) { return v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
    var step = function (ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(target * e);
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = fmt(0);
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-in");
        if (el.hasAttribute("data-count")) countUp(el);
        if (el.classList.contains("gauge")) el.classList.add("is-on");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .12 });
    $$(".reveal, [data-count], .gauge").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    $$(".gauge").forEach(function (el) { el.classList.add("is-on"); });
  }

  /* ---------- Tile spotlight ---------- */
  if (window.matchMedia && matchMedia("(hover: hover)").matches) {
    $$(".tile").forEach(function (t) {
      t.addEventListener("pointermove", function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty("--mx", (e.clientX - r.left) + "px");
        t.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Rotating "now" line ---------- */
  var rot = $("[data-rotate]");
  if (rot && !reduce) {
    var items = rot.getAttribute("data-rotate").split("|"), ri = 0;
    setInterval(function () {
      rot.classList.add("is-out");
      setTimeout(function () { ri = (ri + 1) % items.length; rot.textContent = items[ri]; rot.classList.remove("is-out"); }, 350);
    }, 3200);
  }

  /* ---------- Filters (work + writing) ---------- */
  $$("[data-filter-group]").forEach(function (group) {
    var list = $(group.getAttribute("data-filter-group"));
    if (!list) return;
    var search = $(group.getAttribute("data-search") || "#__none");
    var empty = $(group.getAttribute("data-empty") || "#__none");
    var chips = $$(".chip", group);
    var current = "all";
    function apply() {
      var q = search ? norm(search.value.trim()) : "";
      var shown = 0;
      $$("[data-cat]", list).forEach(function (row) {
        var catOk = current === "all" || (" " + row.getAttribute("data-cat") + " ").indexOf(" " + current + " ") > -1;
        var txtOk = !q || norm(row.textContent).indexOf(q) > -1;
        var ok = catOk && txtOk;
        row.hidden = !ok;
        if (ok) shown++;
      });
      $$("[data-year-group]", list.parentNode).forEach(function (g) {
        g.hidden = !$$("[data-cat]:not([hidden])", g).length;
      });
      if (empty) empty.hidden = shown > 0;
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        current = c.getAttribute("data-value");
        chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        apply();
        if (history.replaceState) history.replaceState(null, "", current === "all" ? location.pathname : "#" + current);
      });
    });
    if (search) search.addEventListener("input", apply);
    var h = (location.hash || "").slice(1);
    var pre = chips.filter(function (c) { return c.getAttribute("data-value") === h; })[0];
    if (pre) pre.click();
  });

  /* ---------- Case-study contents: scroll spy ---------- */
  var tocLinks = $$(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var secs = tocLinks.map(function (a) { return doc.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    secs.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Copy buttons (email, link) ---------- */
  function copy(text, msg) {
    var done = function () { toast(msg); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    else fallback();
    function fallback() {
      var ta = doc.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", "");
      ta.className = "sr-only"; body.appendChild(ta); ta.select();
      try { doc.execCommand("copy"); done(); } catch (e) { toast(text); }
      body.removeChild(ta);
    }
  }
  $$("[data-copy]").forEach(function (b) {
    b.hidden = false;
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      copy(v === "url" ? location.href : v, v === "url" ? "Link copied" : "Copied " + v);
    });
  });
  $$("[data-share]").forEach(function (b) {
    if (!navigator.share) return;
    b.hidden = false;
    b.addEventListener("click", function () {
      navigator.share({ title: doc.title, url: location.href }).catch(function () {});
    });
  });

  /* ---------- Kolkata clock ---------- */
  var clock = $("[data-clock]");
  if (clock && window.Intl) {
    var fmtT = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    var tick = function () { clock.textContent = "Kolkata " + fmtT.format(new Date()) + " IST"; };
    tick(); setInterval(tick, 30000);
  }

  /* ---------- External links: always safe ---------- */
  $$('a[target="_blank"]').forEach(function (a) {
    var rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
    ["noopener", "noreferrer"].forEach(function (t) { if (rel.indexOf(t) < 0) rel.push(t); });
    a.setAttribute("rel", rel.join(" "));
  });
})();
