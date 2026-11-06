/* =========================================================
   site behaviour — progressive enhancement only.
   The site works fully without this file.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Mark the current page in the navigation */
  (function markCurrentPage() {
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (file === "") file = "index.html";

    // Sub-pages belong to a section in the nav.
    var section = file;
    if (/^post\d+\.html$/.test(file)) section = "writing.html";
    if (/^(arbor|elevatex|mist|techseva|howrah-forgings)\.html$/.test(file)) section = "projects.html";

    var links = document.querySelectorAll("nav ul a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute("href") || "").toLowerCase();
      if (href === section || (section === "index.html" && href === "./")) {
        links[i].setAttribute("aria-current", "page");
      }
    }
  })();

  /* 1b. Phone menu: a toggle button collapses the nav links on small
         screens. Without JS the links simply stay visible. */
  (function phoneMenu() {
    var nav = document.querySelector("nav");
    var list = nav && nav.querySelector("ul");
    if (!nav || !list) return;

    if (!list.id) list.id = "primary-menu";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-toggle";
    btn.setAttribute("aria-controls", list.id);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
    btn.innerHTML = '<span class="nav-toggle-bars" aria-hidden="true"></span>';
    nav.insertBefore(btn, list);
    nav.classList.add("has-toggle");

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    btn.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    // Close after choosing a link, on Escape, on outside tap, or when
    // the screen grows past the phone breakpoint.
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        btn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false);
    });
    if (window.matchMedia) {
      var mq = window.matchMedia("(min-width: 769px)");
      var onChange = function () { if (mq.matches) setOpen(false); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  })();

  /* 2. Safety net: external new-tab links always get noopener */
  (function hardenLinks() {
    var links = document.querySelectorAll('a[target="_blank"]');
    for (var i = 0; i < links.length; i++) {
      var rel = (links[i].getAttribute("rel") || "").split(/\s+/).filter(Boolean);
      ["noopener", "noreferrer"].forEach(function (token) {
        if (rel.indexOf(token) === -1) rel.push(token);
      });
      links[i].setAttribute("rel", rel.join(" "));
    }
  })();

  /* 3. Scroll reveal — only for blocks that start below the fold,
        so there is never a flash on first paint */
  (function reveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    var selector = [
      ".area-card", ".featured-card", ".currently", ".writing-card",
      ".project-card", ".arbor-feature", ".arbor-profile", ".metric"
    ].join(",");
    var items = document.querySelectorAll(selector);
    if (!items.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < items.length; i++) {
      if (items[i].getBoundingClientRect().top > vh) {
        items[i].classList.add("reveal");
        io.observe(items[i]);
      }
    }
  })();

  /* 4. Reading progress bar on article pages */
  var bar = null;
  var article = document.querySelector(".article");
  if (article) {
    bar = document.createElement("div");
    bar.className = "read-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
  }

  /* 5. Back-to-top button */
  var topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "back-to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.textContent = "\u2191";
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  document.body.appendChild(topBtn);

  /* One throttled scroll handler drives both */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var vh = window.innerHeight || document.documentElement.clientHeight;

      topBtn.classList.toggle("is-shown", y > 700);

      if (bar && article) {
        var start = article.offsetTop;
        var end = start + article.offsetHeight - vh;
        var p = end > start ? (y - start) / (end - start) : 0;
        bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
