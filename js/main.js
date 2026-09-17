/* J&J Home Solution — site interactions */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var scrim = document.querySelector(".nav-scrim");

  /* ---------- Header state ---------- */
  function onScroll() {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    var bt = document.querySelector(".back-top");
    if (bt) bt.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  function closeNav() {
    nav.classList.remove("open");
    scrim.classList.remove("show");
    navToggle.classList.remove("active");
    document.body.style.overflow = "";
  }
  function openNav() {
    nav.classList.add("open");
    scrim.classList.add("show");
    navToggle.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      nav.classList.contains("open") ? closeNav() : openNav();
    });
  }
  if (scrim) scrim.addEventListener("click", closeNav);
  document.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Testimonial carousel ---------- */
  (function () {
    var track = document.querySelector(".carousel-track");
    if (!track) return;
    var cards = track.children;
    var dotsWrap = document.querySelector(".carousel-dots");
    var i = 0;
    var timer;
    var dots = [];
    for (var c = 0; c < cards.length; c++) {
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Go to review " + (c + 1));
      if (c === 0) d.classList.add("active");
      d.addEventListener("click", function (idx) { return function () { go(idx); restart(); }; }(c));
      dotsWrap.appendChild(d);
      dots.push(d);
    }
    function go(n) {
      i = (n + cards.length) % cards.length;
      track.style.transform = "translateX(-" + (i * 100) + "%)";
      dots.forEach(function (d, k) { d.classList.toggle("active", k === i); });
    }
    function next() { go(i + 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 7000); }
    restart();
  })();

  /* ---------- Gallery filter + lightbox ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var gItems = document.querySelectorAll(".g-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      gItems.forEach(function (item) {
        var match = f === "all" || item.getAttribute("data-cat") === f;
        item.style.display = match ? "" : "none";
      });
    });
  });

  (function () {
    var lb = document.querySelector(".lightbox");
    if (!lb) return;
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb-cap");
    var prev = lb.querySelector(".lb-prev");
    var next = lb.querySelector(".lb-next");
    var close = lb.querySelector(".lb-close");
    var group = Array.prototype.filter.call(gItems, function (g) { return g.style.display !== "none"; });
    var cur = 0;

    function syncGroup() {
      group = Array.prototype.filter.call(gItems, function (g) { return g.style.display !== "none"; });
    }
    function show(n) {
      if (!group.length) return;
      cur = (n + group.length) % group.length;
      var img = group[cur].querySelector("img");
      var cap = group[cur].querySelector(".g-cap");
      lbImg.src = img.getAttribute("data-full") || img.src;
      lbImg.alt = img.alt || "";
      lbCap.textContent = cap ? cap.textContent.trim() : "";
    }
    function open(item) {
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      syncGroup();
      cur = group.indexOf(item);
      show(cur);
    }
    function closeLb() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
    gItems.forEach(function (item) {
      item.addEventListener("click", function () { open(item); });
    });
    close.addEventListener("click", closeLb);
    prev.addEventListener("click", function () { show(cur - 1); });
    next.addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    window.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  })();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = "";
      });
      if (!open) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Contact form -> email compose ---------- */
  (function () {
    var form = document.querySelector("#estimate-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#f-name").value.trim();
      var phone = form.querySelector("#f-phone").value.trim();
      var email = form.querySelector("#f-email").value.trim();
      var svc = form.querySelector("#f-service").value;
      var msg = form.querySelector("#f-msg").value.trim();
      var subject = "Estimate Request — " + (svc !== "Other / Not sure yet" ? svc : "General Inquiry");
      var body = "Name: " + name + "%0D%0APhone: " + phone +
        "%0D%0AEmail: " + email + "%0D%0AService(s): " + svc +
        "%0D%0A%0D%0AProject details:%0D%0A" + msg;
      var href = "mailto:jjhomesolutionnc@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + body;
      window.location.href = href;
      var success = document.querySelector(".form-success");
      if (success) success.classList.add("show");
    });
  })();

  /* ---------- Footer year ---------- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();