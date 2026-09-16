// Order modal — opens Cashfree payment form directly.
(function () {
  var modal = document.getElementById('modal');
  var closeBtn = document.getElementById('modalClose');
  var sticky = document.getElementById('stickyBar');

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-buy]').forEach(function (b) {
    b.addEventListener('click', openModal);
  });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // FAQ accordion
  document.querySelectorAll('.faq').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq').forEach(function (f) { f.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });

  // Sticky bar — always visible (better for mobile conversion)
  if (sticky) sticky.classList.add('show');

  // Offer countdown — PC (hero) + mobile (header), resets daily at 3 AM
  (function () {
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function nextReset() {
      var now = new Date();
      var t = new Date(now);
      t.setHours(3, 0, 0, 0);
      if (now >= t) t.setDate(t.getDate() + 1);
      return t;
    }
    function set(id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    }
    function tick() {
      var now = new Date();
      var diff = nextReset() - now;
      if (diff < 0) diff = 0;
      var h = pad(Math.floor(diff / 3600000));
      var m = pad(Math.floor((diff % 3600000) / 60000));
      var s = pad(Math.floor((diff % 60000) / 1000));
      set('cdH', h); set('cdM', m); set('cdS', s);
      set('cdHm', h); set('cdMm', m); set('cdSm', s);
    }
    tick();
    setInterval(tick, 1000);
  })();

  // Purchase count — 3-day cycle from 15 Sep 2026 2AM: 217→292, then reset
  (function () {
    var el = document.getElementById('buyCount');
    if (!el) return;
    var BASE = 217, PER_DAY = 25, CYCLE_DAYS = 3, DAY = 86400000;
    var anchor = new Date(2026, 8, 15, 2, 0, 0, 0);
    function dayStart(d) {
      var t = new Date(d);
      t.setHours(2, 0, 0, 0);
      return t;
    }
    function calc(now) {
      if (now < anchor) return BASE;
      var start = dayStart(now);
      if (now < start) start = new Date(start.getTime() - DAY);
      var anchorDay = dayStart(anchor);
      if (anchor > anchorDay) anchorDay = new Date(anchorDay.getTime() - DAY);
      var daysSince = Math.floor((dayStart(start).getTime() - anchorDay.getTime()) / DAY);
      var cycleDay = ((daysSince % CYCLE_DAYS) + CYCLE_DAYS) % CYCLE_DAYS;
      var base = BASE + cycleDay * PER_DAY;
      var frac = (now - start) / DAY;
      if (frac < 0) frac = 0;
      if (frac > 1) frac = 1;
      return base + Math.round(frac * PER_DAY);
    }
    function fmt(n) { return n.toLocaleString('en-IN'); }
    function animateTo(target) {
      var dur = 1500, t0 = null;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    function tick() {
      el.textContent = fmt(calc(new Date()));
    }
    animateTo(calc(new Date()));
    setInterval(tick, 30000);
  })();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
