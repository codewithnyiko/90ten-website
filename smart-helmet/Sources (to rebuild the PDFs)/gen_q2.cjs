const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'pdf_build');
const base = fs.readFileSync(path.join(dir, 'doc12_v.html'), 'utf8');

let head = base.slice(0, base.indexOf('<div class="content">'));
head = head.replace(/<title>[^<]*<\/title>/, '<title>Smart Helmet: Updated Questions</title>');
head = head.replace(/<h1 style="margin-top:7mm">[^<]*<\/h1>/, '<h1 style="margin-top:7mm">Smart Helmet: Updated Questions</h1>');
head = head.replace(/<p class="sub">[^<]*<\/p>/, '<p class="sub">What we still need to know now that we understand what the helmet does.</p>');
head = head.replace('Prepared by <b>90Ten Group</b>', 'Designed and prepared by <b>90Ten Group</b>');
head = head.replace('</style>', '  table.s th:nth-child(1) { width: 7%; } table.s th:nth-child(3) { width: 38%; }\n  table.s td { vertical-align: top; }\n</style>');

const q = (rows) => '<table class="q s"><thead><tr><th>No.</th><th>Question</th><th>Why we ask</th></tr></thead>' +
  rows.map(r => '<tr><td class="n">' + r[0] + '</td><td class="qq">' + r[1] + '</td><td>' + r[2] + '</td></tr>').join('') + '</table>';

const A = q([
  ['A1', 'Imperium has two helmets in South Africa. When can we use one to build and test? Please confirm the model and that it is a high-end camera model and give us its admin login on the supplier platform.', 'We need a helmet in hand to build and test. The address change and the Wi-Fi commands work only on camera models.'],
  ['A2', 'The document says messages differ between software versions. Which versions exist and how do the messages differ? Which version are the two helmets in South Africa on?', 'This is critical. If a message changes between versions our software must handle both.'],
  ['A3', 'Does the helmet need the supplier address server every time it starts? Does it remember the last addresses if that server cannot be reached?', 'If the helmet forgets them, a problem on the supplier side stops the helmets from reporting.'],
  ['A4', 'After we change the addresses, does the helmet still call the supplier for anything else, such as update checks or the voice package?', 'The client wants its data to stay in South Africa.'],
  ['A5', 'Does the helmet accept secure addresses (https and wss) or only plain http and ws?', 'The examples use plain addresses. Worker positions should travel securely.'],
  ['A6', 'Are positions in South Africa normal GPS positions or shifted by the Gaode system?', 'A shifted position puts a worker in the wrong place on a normal map.'],
  ['A7', 'Can a helmet setting change while it is on or only at start-up? What should we send in sip_info while we have no call server?', 'The settings arrive at start-up. The login reply cannot leave sip_info empty.']
]);
const D1 = q([
  ['B1', 'Can we talk to the helmet directly, without a server, for example over USB or Bluetooth or the local Wi-Fi? Or does it only talk to a server?', 'The document shows only the server route. We need to know if a direct route exists for setup and testing.'],
  ['B2', 'Can we build our own software for the helmet? If yes, are you willing to give us how the helmet is built (its parts and Android version) and how software can talk to each part, such as the camera and GPS and Bluetooth and buttons and speaker? What does it take to install it on a helmet?', 'Our own software would let us do things the supplier software does not. We would need to know the parts to build on them.']
]);
const B = q([
  ['C1', 'Which Bluetooth beacons does the helmet read? What do f_id and f_key and bt_beacon do and how does the helmet pick the beacons for its enter and leave alarms?', 'These fields are in every reply and are not explained. They decide how we place a worker underground.'],
  ['C2', 'What is the format of ca_backup_data? How long does the helmet keep it and does it send alarms first? What happens to an SOS or a fall with no signal?', 'Underground there is often no signal. This decides if we can show a trail afterwards.'],
  ['C3', 'What is the format of get_user_fence and how is a fence made?', 'We want warnings for danger zones such as near blasting.']
]);
const C = q([
  ['D1', 'What are Modification Method 1 and 2 for changing the address inside the helmet and what do we need to do them?', 'It lets the helmet skip the supplier address server for good.'],
  ['D2', 'Does the helmet check for updates only at start-up? Does an update need a secret stamp (a digital signature)? What changes in each update?', 'An update can change what the helmet sends. We want to test it on one helmet first.'],
  ['D3', 'Does the helmet remember several Wi-Fi networks and move between them on its own? Can it work on Wi-Fi alone with no SIM card? Does video start by itself when SOS is pressed?', 'Some mines have Wi-Fi only in a few places. A call needs a call server.'],
  ['D4', 'Can you give the Interface Document a version and a date and tell us when it changes?', 'We need to know when something changes.']
]);

const html = head + `<div class="content">
<h2>What we now understand</h2>
<div class="box"><p>The helmet asks an address server where to report and then keeps a live link open to the server it is given. It sends a report every 10 seconds with its position and battery and the Bluetooth devices it hears. It sends alarms at once. We can send it commands and settings. The supplier's Interface Document describes all of this and it is enough to build version v1.00. The document also says the messages differ between software versions.</p></div>
<div class="box"><b>No longer asked</b><p>Whether the helmet can report to the client's server (yes, in two ways). Whether there is a written list of messages (yes, the Interface Document). Whether it can warn about beacon areas (yes, alarm types 17 and 18). Whether the server can set Wi-Fi (yes, on camera models).</p></div>
<h2>To build and test v1.00</h2>
${A}
</div>

<div class="pg">
<h2>Talking to the helmet directly and our own software</h2>
${D1}
<h2>For underground, v2.00</h2>
${B}
<h2>Later</h2>
${C}
</div>

<div class="foot"><span>Confidential. Designed and prepared by 90Ten Group. 20 October 2026.</span><span>Smart Helmet v1.00</span></div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'doc19.html'), html);
console.log('wrote doc19.html ' + html.length);
