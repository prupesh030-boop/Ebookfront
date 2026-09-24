// Order modal — opens Cashfree payment form directly.
(function () {
  var modal = document.getElementById('modal');
  var closeBtn = document.getElementById('modalClose');
  var sticky = document.getElementById('stickyBar');

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.fbq) window.fbq('track', 'InitiateCheckout', {value: 199, currency: 'INR'});
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

  // Hindi / English toggle — selector-based dictionary, saved in localStorage
  (function () {
    var T = [
      ['.hero-copy .pill', '📘 Simple English Ebook • ⭐ 4.8/5 • 500+ readers', '📘 सरल हिंदी + English ईबुक • ⭐ 4.8/5 • 500+ पाठक'],
      ['.hero-copy h1', 'Confused by the Share Market?<br /><span class="green">Learn it step by step.</span>', 'शेयर मार्केट समझ नहीं आता?<br /><span class="green">Step by step सीखो।</span>'],
      ['.lead', 'From opening a Demat account to picking stocks, reading charts, SIP and risk control — one simple Basic to Advance plan for beginners.', 'Demat अकाउंट खोलने से लेकर सही स्टॉक चुनने, चार्ट पढ़ने, SIP और रिस्क कंट्रोल तक — beginners के लिए एक सरल Basic to Advance प्लान।'],
      ['.offer-text', '🔥 80% OFF — offer ends in:', '🔥 80% OFF — ऑफर समाप्त होने में:'],
      ['.buy-card small', 'people have already grabbed this offer', 'लोग यह ऑफर ले चुके हैं'],
      ['#problems .sec-title', 'Losing money following random tips?', 'Random tips से पैसा गंवा रहे हो?'],
      ['#problems .sec-sub', 'You invest every month… but your portfolio barely grows?', 'हर महीने invest करते हो… पर portfolio बढ़ता नहीं?'],
      ['#whom .sec-title', 'Who is this ebook for?', 'यह ईबुक किसके लिए है?'],
      ['#learn .sec-title', 'What will you learn inside?', 'अंदर क्या सीखोगे?'],
      ['#learn .sec-sub', 'Less theory, more action — every chapter ends with a task.', 'कम theory, ज्यादा action — हर chapter के साथ एक task।'],
      ['#inside .sec-title', 'What do you get for ₹199?', '₹199 में क्या मिलेगा?'],
      ['#reviews .sec-title', 'What readers say', 'पाठक क्या कहते हैं'],
      ['#reviews .sec-sub', 'Early reader feedback (yours could be next)', 'शुरुआती पाठकों की प्रतिक्रिया (अगली आपकी हो सकती है)'],
      ['#note .sec-title', 'Please read before you buy', 'खरीदने से पहले जरूर पढ़ें'],
      ['#faq .sec-title', 'Frequently asked questions', 'अक्सर पूछे जाने वाले सवाल'],
      ['#contact .sec-title', 'Have a doubt? Ask on WhatsApp first', 'सवाल है? पहले WhatsApp पर पूछो']
    ];
    var LISTS = [
      ['#problems .check-list li', [
        'YouTube / Telegram टिप्स पर स्टॉक खरीदते हो और फंस जाते हो',
        'Demat, NSE, BSE, IPO, SIP — terms confusing लगते हैं',
        'Futures & Options से डर लगता है पर risk समझ नहीं आता',
        'कौन सा स्टॉक अच्छा है या महंगा — पता नहीं चलता',
        'मार्केट गिरते ही घबराकर loss में बेच देते हो',
        'Salary आती है, पर monthly investment system नहीं है'
      ]],
      ['#faq .faq-q', [
        'क्या यह छपी हुई किताब है?<span>+</span>',
        'Payment के बाद ईबुक कैसे मिलेगी?<span>+</span>',
        'क्या UPI से payment कर सकते हैं?<span>+</span>',
        'मेरी English basic है। समझ आएगा?<span>+</span>',
        'क्या मुनाफा पक्का मिलेगा?<span>+</span>',
        'Payment किया पर PDF नहीं मिली?<span>+</span>'
      ]],
      ['#faq .faq-a', [
        'नहीं। यह mobile-friendly PDF है। चाहो तो print / xerox भी निकाल सकते हो।',
        '2 मिनट में download link + PDF WhatsApp और Email पर भेजी जाती है।',
        'हां। Google Pay / PhonePe / Paytm UPI, कार्ड और netbanking सब चलता है।',
        'हां, बहुत सरल भाषा में charts और examples के साथ लिखा है।',
        'नहीं। यह सीखने की method है, tip service नहीं। नियमित, अनुशासित action से मदद मिलती है — पर कोई जादुई guarantee नहीं।',
        'WhatsApp — 917028250948 पर payment screenshot भेजो। तुरंत PDF भेज देंगे।'
      ]]
    ];
    var btnEn = document.getElementById('langEn');
    var btnHi = document.getElementById('langHi');
    if (!btnEn || !btnHi) return;
    function apply(lang) {
      var hi = lang === 'hi';
      T.forEach(function (row) {
        document.querySelectorAll(row[0]).forEach(function (el) { el.innerHTML = hi ? row[2] : row[1]; });
      });
      LISTS.forEach(function (entry) {
        var els = document.querySelectorAll(entry[0]);
        els.forEach(function (el, i) { if (entry[1][i]) el.innerHTML = hi ? entry[1][i] : el.getAttribute('data-en') || el.innerHTML; });
      });
      document.documentElement.lang = hi ? 'hi' : 'en';
      document.title = hi ? 'शेयर मार्केट सीखो? | Basic to Advance ईबुक ₹199 - Digital Growth' : 'Confused by Share Market? | Share Market Mastery Hindi Ebook ₹199 - Digital Growth';
      btnEn.classList.toggle('active', !hi);
      btnHi.classList.toggle('active', hi);
      try { localStorage.setItem('sm-lang', lang); } catch (e) {}
    }
    // stash original English for list items once
    LISTS.forEach(function (entry) {
      document.querySelectorAll(entry[0]).forEach(function (el) { el.setAttribute('data-en', el.innerHTML); });
    });
    btnEn.addEventListener('click', function () { apply('en'); });
    btnHi.addEventListener('click', function () { apply('hi'); });
    var saved = null;
    try { saved = localStorage.getItem('sm-lang'); } catch (e) {}
    if (saved === 'en') apply('en'); else apply('hi');
  })();

  // Market tape — gentle illustrative jitter on index values
  (function () {
    var n = document.getElementById('pNifty');
    var s = document.getElementById('pSensex');
    if (!n || !s) return;
    var nv = 24812, sv = 81455;
    function fmt(v) { return v.toLocaleString('en-IN'); }
    setInterval(function () {
      nv += Math.round((Math.random() - 0.42) * 14);
      sv += Math.round((Math.random() - 0.42) * 40);
      n.textContent = fmt(nv);
      s.textContent = fmt(sv);
    }, 2500);
  })();

  document.getElementById('year').textContent = new Date().getFullYear();

  if (window.fbq) window.fbq('track', 'ViewContent', {content_name: 'ShareMarket Hindi Ebook', value: 199, currency: 'INR'});
})();
