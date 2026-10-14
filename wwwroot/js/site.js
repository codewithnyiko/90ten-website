(function () {
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.18 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }
})();

// Contact form: sends the enquiry through EmailJS and shows the answer.
// The public key is meant to be in the page. Never put the private key or a password here.
var EMAILJS = {
  publicKey: 'PxZhbQn6j5TP6eKoA',
  serviceId: 'service_1yft1c9',
  enquiryTemplate: 'template_w23sskl'   // goes to hello@90tengroup.co.za
  // Customer Confirmation (template_xj6a478) is linked as the Auto-Reply in EmailJS
};
function send(template, params) {
  return fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: EMAILJS.serviceId, template_id: template, user_id: EMAILJS.publicKey, template_params: params })
  }).then(function (r) { if (!r.ok) { throw new Error('send failed'); } });
}
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
    if (document.getElementById('f-web').value) { btn.disabled = false; return; }
    var params = {
      name: name,
      email: email,
      service: document.getElementById('f-need').value,
      message: msg || '(no message)'
    };
    // One call only: the Web Contact template's Auto-Reply tab sends the Customer Confirmation.
    send(EMAILJS.enquiryTemplate, params)
      .then(function () { note.textContent = 'Thank you. We got your message and sent a confirmation to your email.'; form.reset(); })
      .catch(function () { note.textContent = 'We could not send that just now. Please email us at hello@90tengroup.co.za.'; })
      .then(function () { btn.disabled = false; });
  });
})();
