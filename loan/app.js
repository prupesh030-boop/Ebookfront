// Order flow — collect name + WhatsApp number, then hand off to WhatsApp.
(function () {
  var WA_NUMBER = '917028250948';
  var modal = document.getElementById('modal');
  var closeBtn = document.getElementById('modalClose');
  var form = document.getElementById('orderForm');
  var step1 = document.getElementById('modalStep1');
  var step2 = document.getElementById('modalStep2');
  var payBtn = document.getElementById('payBtn');
  var sticky = document.getElementById('stickyBar');

  function openModal() {
    step1.hidden = false;
    step2.hidden = true;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var n = document.getElementById('fName');
      if (n) n.focus();
    }, 100);
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
  document.getElementById('doneBtn').addEventListener('click', closeModal);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameEl = document.getElementById('fName');
    var contactEl = document.getElementById('fContact');
    var name = (nameEl.value || '').trim() || 'मित्र';
    var phone = (contactEl.value || '').trim();
    if (!nameEl.value.trim() || !contactEl.checkValidity()) {
      form.reportValidity();
      return;
    }
    payBtn.disabled = true;
    payBtn.textContent = 'नोंद होत आहे…';
    setTimeout(function () {
      var orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('sName').textContent = name;
      document.getElementById('orderId').textContent = orderId;
      var msg = 'नमस्कार, मला कर्ज ईबुक हवी आहे (' + orderId + '). नाव: ' + name + ', WhatsApp: ' + phone;
      document.getElementById('waPay').href =
        'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      step1.hidden = true;
      step2.hidden = false;
      payBtn.disabled = false;
      payBtn.textContent = 'पुढे जा — पेमेंट करा ₹199';
    }, 700);
  });

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

  // Offer countdown — boxes, resets daily at 3 AM
  (function () {
    var hEl = document.getElementById('cdH');
    var mEl = document.getElementById('cdM');
    var sEl = document.getElementById('cdS');
    if (!hEl || !mEl || !sEl) return;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function nextReset() {
      var now = new Date();
      var t = new Date(now);
      t.setHours(3, 0, 0, 0);
      if (now >= t) t.setDate(t.getDate() + 1);
      return t;
    }
    function tick() {
      var now = new Date();
      var diff = nextReset() - now;
      if (diff < 0) diff = 0;
      hEl.textContent = pad(Math.floor(diff / 3600000));
      mEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
      sEl.textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    tick();
    setInterval(tick, 1000);
  })();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
