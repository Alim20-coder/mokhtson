(function () {
  "use strict";

  var WHATSAPP_NUMBER = "966570495349"; // 0570495349 بصيغة دولية

  document.addEventListener("DOMContentLoaded", function () {
    buildPortfolio();
    initCounters();
    initReveal();
    initBackToTop();
    initContactForm();
    initYear();
  });

  /* ---------------------------------------------------------
     1) بناء معرض الأعمال ديناميكيًا: p1.png ... p20.png
  --------------------------------------------------------- */
  var WORK_META = [
    { cat: "fridge", label: "صيانة ثلاجة" },
    { cat: "washer", label: "إصلاح غسالة" },
    { cat: "ac", label: "تركيب وصيانة مكيف" },
    { cat: "dishwasher", label: "صيانة غسالة أطباق" }
  ];

  function buildPortfolio() {
    var grid = document.getElementById("workGrid");
    if (!grid) return;
    var frag = document.createDocumentFragment();

    for (var i = 1; i <= 20; i++) {
      var meta = WORK_META[i % WORK_META.length];
      var col = document.createElement("div");
      col.className = "work-item";
      col.setAttribute("data-cat", meta.cat);

      var link = document.createElement("a");
      link.href = "https://wa.me/" + WHATSAPP_NUMBER;
      link.target = "_blank";
      
      var img = document.createElement("img");
      img.src = "Css/p (" + i + ").png";
      img.alt = meta.label + " - تكنوفيكس رقم " + i;
      img.loading = "lazy";
      img.decoding = "async";
      link.appendChild(img);

      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.textContent = meta.label + " #" + i;

      col.appendChild(link);
      col.appendChild(overlay);
      frag.appendChild(col);
    }
    grid.appendChild(frag);
  }

  function initFilters() {
    var btns = document.querySelectorAll("[data-filter]");
    var items = function () { return document.querySelectorAll(".work-item"); };

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var val = btn.getAttribute("data-filter");
        items().forEach(function (it) {
          var show = val === "all" || it.getAttribute("data-cat") === val;
          it.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------------------------------------------------------
     2) عداد الإحصائيات المتحرك
  --------------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    var run = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString("ar");
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("ar") + (el.getAttribute("data-suffix") || "");
      }
      requestAnimationFrame(step);
    };

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (c) { obs.observe(c); });
  }

  /* ---------------------------------------------------------
     3) ظهور العناصر عند التمرير
  --------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------------------------------------
     4) زر العودة لأعلى
  --------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 500);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     5) نموذج التواصل → إرسال مباشر إلى واتساب
  --------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("cf-name").value.trim();
      var phone = document.getElementById("cf-phone").value.trim();
      var service = document.getElementById("cf-service");
      var serviceLabel = service.options[service.selectedIndex].text;
      var area = document.getElementById("cf-area");
      var areaLabel = area.options[area.selectedIndex].text;
      var msg = document.getElementById("cf-message").value.trim();

      if (!name || !phone || !service.value) {
        showFormNote("من فضلك أكمل الاسم ورقم الجوال ونوع الخدمة.", true);
        return;
      }

      var text =
        "مرحباً تكنوفيكس، أرغب في طلب خدمة:\n" +
        "▪ الاسم: " + name + "\n" +
        "▪ الجوال: " + phone + "\n" +
        "▪ الخدمة المطلوبة: " + serviceLabel + "\n" +
        "▪ المنطقة: " + areaLabel +
        (msg ? "\n▪ تفاصيل إضافية: " + msg : "");

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
      showFormNote("جاري تحويلك إلى واتساب...", false);
      window.open(url, "_blank");
      form.reset();
    });
  }

  function showFormNote(message, isError) {
    var note = document.getElementById("formNote");
    if (!note) return;
    note.textContent = message;
    note.style.color = isError ? "#E14545" : "#1C7C8C";
  }

  /* ---------------------------------------------------------
     6) سنة الفوتر التلقائية
  --------------------------------------------------------- */
  function initYear() {
    var y = document.getElementById("yearNow");
    if (y) y.textContent = new Date().getFullYear();
  }
})();