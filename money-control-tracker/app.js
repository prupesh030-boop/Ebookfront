(function () {
  var modal = document.getElementById('modal');
  var closeBtn = document.getElementById('modalClose');
  function openModal() { modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; if (window.fbq) window.fbq('track','InitiateCheckout',{value:199,currency:'INR'}); }
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  document.querySelectorAll('[data-buy]').forEach(function (b) { b.addEventListener('click', openModal); });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  document.querySelectorAll('.faq').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq').forEach(function (f) { f.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });
  (function () {
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function nextReset() { var now = new Date(); var t = new Date(now); t.setHours(3,0,0,0); if (now >= t) t.setDate(t.getDate()+1); return t; }
    function set(id,val){ var el=document.getElementById(id); if(el) el.textContent=val; }
    function tick(){ var diff = nextReset()-new Date(); if(diff<0) diff=0; set('cdH',pad(Math.floor(diff/3600000))); set('cdM',pad(Math.floor((diff%3600000)/60000))); set('cdS',pad(Math.floor((diff%60000)/1000))); set('cdHm',document.getElementById('cdH').textContent); set('cdMm',document.getElementById('cdM').textContent); set('cdSm',document.getElementById('cdS').textContent); }
    tick(); setInterval(tick,1000);
  })();
  (function () {
    var el = document.getElementById('buyCount'); if(!el) return;
    var BASE=217, PER_DAY=25, CYCLE=3, DAY=86400000;
    var anchor = new Date(2026,8,15,2,0,0,0);
    function dayStart(d){ var t=new Date(d); t.setHours(2,0,0,0); return t; }
    function calc(now){ if(now<anchor) return BASE; var s=dayStart(now); var a=dayStart(anchor); var d=Math.floor((s-a)/DAY); var c=((d%CYCLE)+CYCLE)%CYCLE; var base=BASE+c*PER_DAY; var f=(now-s)/DAY; return base+Math.round(Math.max(0,Math.min(1,f))*PER_DAY); }
    function fmt(n){ return n.toLocaleString('en-IN'); }
    el.textContent = fmt(calc(new Date())); setInterval(function(){ el.textContent=fmt(calc(new Date())); },30000);
  })();
  document.getElementById('year').textContent = new Date().getFullYear();
  if (window.fbq) window.fbq('track','ViewContent',{content_name:'Money Control Tracker',value:199,currency:'INR'});
})();
