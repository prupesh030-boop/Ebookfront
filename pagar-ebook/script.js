// Pagar ebook — modal, FAQ, timer, social proof
(function () {
  var modal = document.getElementById('modal');
  var closeBtn = document.getElementById('modalClose');
  var sticky = document.getElementById('stickyBar');

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.fbq) window.fbq('track', 'InitiateCheckout', {value: 199, currency: 'INR', content_name: 'Pagar Ebook'});
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-buy]').forEach(function (b) { b.addEventListener('click', openModal); });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.faq').forEach(function (item) {
    item.querySelector('.faq-q').addEventListener('click', function () {
      var was = item.classList.contains('open');
      document.querySelectorAll('.faq').forEach(function (f) { f.classList.remove('open'); });
      if (!was) item.classList.add('open');
    });
  });

  if (sticky) {
    window.addEventListener('scroll', function () {
      sticky.classList.toggle('show', window.scrollY > 480);
    }, {passive: true});
    sticky.classList.toggle('show', window.scrollY > 480);
  }

  // Countdown — resets daily 3 AM
  (function () {
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function nextReset() { var n = new Date(), t = new Date(n); t.setHours(3,0,0,0); if (n >= t) t.setDate(t.getDate()+1); return t; }
    function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
    function tick() {
      var diff = Math.max(nextReset() - new Date(), 0);
      set('cdH', pad(Math.floor(diff/3600000)));
      set('cdM', pad(Math.floor((diff%3600000)/60000)));
      set('cdS', pad(Math.floor((diff%60000)/1000)));
    }
    tick(); setInterval(tick, 1000);
  })();

  // Buyer count — 217 base, reuse pattern
  (function () {
    var el = document.getElementById('buyCount');
    if (!el) return;
    var BASE = 217, PER_DAY = 25, CYCLE = 3, DAY = 86400000;
    var anchor = new Date(2026, 8, 15, 2, 0, 0, 0);
    function dayStart(d){ var t = new Date(d); t.setHours(2,0,0,0); return t; }
    function calc(now) {
      if (now < anchor) return BASE;
      var s = dayStart(now);
      var aDay = dayStart(anchor);
      var days = Math.floor((s - aDay) / DAY);
      var cd = ((days % CYCLE) + CYCLE) % CYCLE;
      var frac = Math.min(Math.max((now - s) / DAY, 0), 1);
      return BASE + cd * PER_DAY + Math.round(frac * PER_DAY);
    }
    function fmt(n){ return n.toLocaleString('en-IN'); }
    var target = calc(new Date()), t0 = null;
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1500, 1), e = 1 - Math.pow(1-p, 3);
      el.textContent = fmt(Math.round(target * e));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    setInterval(function(){ el.textContent = fmt(calc(new Date())); }, 30000);
  })();

  document.getElementById('year').textContent = new Date().getFullYear();
  if (window.fbq) window.fbq('track', 'ViewContent', {content_name: 'Pagar Ebook', value: 199, currency: 'INR'});
})();
