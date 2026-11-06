/* Runs before first paint: applies the saved theme so the page never flashes. */
(function () {
  var d = document.documentElement;
  d.classList.add("js");
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") { d.setAttribute("data-theme", t); return; }
  } catch (e) {}
  if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) d.setAttribute("data-theme", "dark");
  else d.setAttribute("data-theme", "light");
})();
