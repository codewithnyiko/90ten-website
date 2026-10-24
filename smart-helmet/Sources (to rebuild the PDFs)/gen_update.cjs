const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'pdf_build');
const base = fs.readFileSync(path.join(dir, 'doc12.html'), 'utf8');

let head = base.slice(0, base.indexOf('<div class="content">'));
head = head.replace(/<title>[^<]*<\/title>/, '<title>Smart Helmet: Questions, Update 1</title>');
head = head.replace(/<h1 style="margin-top:7mm">[^<]*<\/h1>/, '<h1 style="margin-top:7mm">Smart Helmet: Questions, Update 1</h1>');
head = head.replace(/<p class="sub">[^<]*<\/p>/, '<p class="sub">What the supplier document already answers and what we still need to clarify.</p>');
head = head.replace('</style>', '  table.s { font-size: 8.9pt; } table.s th:nth-child(1) { width: 6%; } table.s th:nth-child(2) { width: 21%; } table.s th:nth-child(3) { width: 37%; }\n  table.s td { padding: 5px 8px; vertical-align: top; }\n  .tag { display: block; border: 0; padding: 0; margin: 0 0 3px; font-weight: 700; font-size: 8pt; letter-spacing: .06em; text-transform: uppercase; }\n</style>');

const r = (n, q, doc, open) => `<tr><td class="n">${n}</td><td class="qq"><b>${q}</b></td><td>${doc}</td><td>${open}</td></tr>`;
const status = `<table class="q s"><thead><tr><th>No.</th><th>Question</th><th>What the document says</th><th>Still to clarify</th></tr></thead>
${r(1, 'Our own server', '<span class="tag">Partly answered.</span> Two ways to change where the helmet reports. Solution 1 uses the admin login on the supplier platform. Solution 2 works on camera models and we build one small address page (pp3 and 4).', 'The steps for Modification Method 1 and 2. The admin login. Whether anything else still calls the supplier.')}
${r(2, 'A written list of messages', '<span class="tag">Answered.</span> The Interface Document lists the helmet messages and the server replies (pp3 to 43).', 'A version and a date. How we are told when it changes (p2 says messages differ by software version).')}
${r(3, 'The map', '<span class="tag">Partly answered.</span> Positions use the Gaode system GCJ-02 (pp19 and 20 and 30).', 'Whether positions are shifted in South Africa. We will test with a helmet.')}
${r(4, 'Beacons', '<span class="tag">Partly answered.</span> Every report lists all Bluetooth devices heard (p15). A setting turns beacon scanning on (p6).', 'What f_id and f_key and bt_beacon do (p19). How the helmet picks the beacons it uses.')}
${r(5, 'Save and send later', '<span class="tag">Partly answered.</span> ca_backup_data is the offline location upload (p2). It is named and not described.', 'The message format. How long it is kept. Whether alarms go first.')}
${r(6, 'Alarms with no signal', '<span class="tag">Open.</span> The document does not say.', 'What happens to an SOS or a fall with no signal.')}
${r(7, 'Danger zone warnings', '<span class="tag">Mostly answered.</span> Alarm types 17 and 18 are entering and leaving a Bluetooth beacon area (p20).', 'How we mark a beacon as a zone beacon.')}
${r(8, 'Who sends updates', '<span class="tag">Partly answered.</span> Update details are in the start-up reply for each helmet so we can decide for each one (pp3 and 5 and 8).', 'What changes in each update. Whether a helmet checks only at start-up.')}
${r(9, 'Our own updates and software', '<span class="tag">Open.</span> Only a check number is listed (pp5 and 8). Nothing about a secret stamp or our own app.', 'Whether the helmet accepts software from us. Whether we may install our own app.')}
${r(10, 'Video during an SOS call', '<span class="tag">Partly answered.</span> The SOS button opens a call room (p21). Calls need a call server (p39). Live video starts by a command (p37).', 'Whether video starts by itself when SOS is pressed.')}
${r(11, 'Wi-Fi', '<span class="tag">Partly answered.</span> The server can ask for nearby Wi-Fi and tell the helmet to join one. Camera models only (pp41 to 43).', 'Whether it remembers several networks and moves between them on its own. Whether it works on Wi-Fi alone.')}
</table>`;

const nq = (n, q, why) => `<tr><td class="n">${n}</td><td class="qq">${q}</td><td>${why}</td></tr>`;
const newq = `<table class="q"><thead><tr><th>No.</th><th>Question</th><th>Why we ask</th></tr></thead>
${nq('A', 'What do f_id and f_key and bt_beacon in our reply to a location report contain? How do we use them?', 'They are in the reply to every report (p19) and are not explained. They may be how the helmet learns which beacons to use.')}
${nq('B', 'What is the format of ca_backup_data and get_user_fence?', 'The document names them and says they can be left alone (p2). We need them for data saved with no signal and for fences.')}
${nq('C', 'What are Modification Method 1 and 2 and what do we need to do them?', 'Solution 2 depends on them (p4). They are never described.')}
${nq('D', 'Can we change a helmet setting while it is on or only when it starts up?', 'The settings come in the start-up reply (p3). Only recording and a few commands are pushed live (p27).')}
${nq('E', 'What may we put in sip_info if we have no call server yet?', 'The login reply cannot leave it empty (p13). We do not want to use the supplier details in the example.')}
${nq('F', 'Is our model a high-end helmet with a camera?', 'Solution 2 and the Wi-Fi commands work only on those (pp4 and 41). The login reply shows the type as cap_type 2 (p12).')}
</table>`;

const html = head + `<div class="content">
<h2>Where we are on each question</h2>
<p class="lead">The numbers match the Software Questions document. The supplier document answers some of them fully and some only in part.</p>
${status}
</div>

<div class="pg">
<h2>What we have heard from Imperium</h2>
<div class="box"><b>The documents</b><p>They were compiled and reviewed with the supplier because the supplier did not have one single document with all the necessary information.</p></div>
<div class="box"><b>The certificates</b><p>Imperium proposed keeping the hardware certificates separate for now so we stay focused on the software. We agreed and asked that they stay in view because no mine will accept the helmet without them.</p></div>
<div class="box"><b>The prototype</b><p>Imperium asked how soon we can have a prototype of the software. Our answer depends on when we get a sample helmet and its admin login.</p></div>
<div class="box"><b>Other answers</b><p>Answers received on the other questions are added here.</p></div>
<h2>New questions from reading the document</h2>
<p class="lead">These came up when we went through the Interface Document page by page.</p>
${newq}
</div>

<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'doc15.html'), html);
console.log('wrote doc15.html ' + html.length);
