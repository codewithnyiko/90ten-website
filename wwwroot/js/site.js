(function () {
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.18 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }
})();

// Contact form: sends the enquiry to the site and shows the answer
(function () {
  var form = document.getElementById('enquiry');
  if (!form) { return; }
  var note = document.getElementById('note');
  var btn  = document.getElementById('send');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name  = document.getElementById('f-name').value.trim();
    var email = document.getElementById('f-email').value.trim();
    var msg   = document.getElementById('f-msg').value.trim();
    if (!name || !email) { note.textContent = 'Add your name and email so we can reply.'; return; }
    btn.disabled = true;
    note.textContent = 'Sending...';
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, need: document.getElementById('f-need').value, message: msg, website: document.getElementById('f-web').value })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok) { note.textContent = 'Thank you. We got your message and sent a confirmation to your email.'; form.reset(); }
        else { note.textContent = x.d.error || 'We could not send that just now. Please email us at hello@90tengroup.co.za.'; }
      })
      .catch(function () { note.textContent = 'We could not send it just now. Please email us instead.'; })
      .then(function () { btn.disabled = false; });
  });
})();
