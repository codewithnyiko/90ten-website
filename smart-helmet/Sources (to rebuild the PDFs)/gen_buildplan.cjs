const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'pdf_build');
let base = fs.readFileSync(path.join(dir, 'doc12.html'), 'utf8');

const headEnd = base.indexOf('<div class="content">');
let head = base.slice(0, headEnd);
head = head.replace(/<title>[^<]*<\/title>/, '<title>Smart Helmet: What We Can Build on Our Own Servers</title>');
head = head.replace(/<h1 style="margin-top:7mm">[^<]*<\/h1>/, '<h1 style="margin-top:7mm">Smart Helmet: What We Can Build on Our Own Servers</h1>');
head = head.replace(/<p class="sub">[^<]*<\/p>/, '<p class="sub">From the supplier\'s Interface Document. This is a plan and nothing is built yet.</p>');
head = head.replace('</style>', '  table.q th:nth-child(1) { width: 24%; } table.q th:nth-child(3) { width: 23%; }\n  .band h1 { font-size: 20pt; }\n</style>');

const row = (a, b, c) => `<tr><td class="qq"><b>${a}</b></td><td>${b}</td><td>${c}</td></tr>`;
const table = (cols, rows) => `<table class="q"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>\n${rows.join('\n')}\n</table>`;

const servers = table(['Part', 'What it does', 'When'], [
  row('Address server', 'Tells each helmet where to report. One small web page (pp3 and 4).', 'Version 1'),
  row('Live server', 'Keeps the live connection with every helmet. Takes the login and the reports and the alarms and sends commands back (pp10 to 21).', 'Version 1'),
  row('Data store', 'Keeps every report and alarm so the control room can show history.', 'Version 1'),
  row('Control room app', 'Our own screens for the control room, replacing the supplier screens.', 'Version 1'),
  row('File server', 'Receives the photos and audio and video that helmets upload (pp22 to 34).', 'Version 3'),
  row('Video server', 'Receives live video from a helmet (p37).', 'Version 4'),
  row('Call server', 'Lets the control room talk to a helmet on a video call (p39).', 'Version 4')
]);

const caps = table(['What the helmet does', 'What the document gives us', 'Can we build it?'], [
  row('1 Find our server', 'The helmet asks an address and gets two addresses back. The reply also holds its settings such as alarm temperature and how long before a removed helmet alarms (pp3 to 6).', '<td class="yn">Yes</td>'.replace(/<\/?td[^>]*>/g, '') + ''),
  row('2 Log in', 'The helmet sends its device number and we reply with its details (pp10 to 14). The login uses only the device number so our server must check a list of allowed numbers.', 'Yes'),
  row('3 Report position and status every 10 seconds', 'Position and accuracy and battery and whether it is worn and 4G or Wi-Fi and signal and SIM and memory card and temperature (pp15 to 19). Positions use the Gaode map system (question 3).', 'Yes'),
  row('4 Alarms', 'SOS and fall and helmet off and silent and temperature and fence and near electricity and altitude (p20). The SOS button sends its own message with a call room number (p21).', 'Yes'),
  row('5 Bluetooth beacons', 'Every report lists the Bluetooth devices the helmet hears with signal strength and time (p15). A setting turns scanning on (p6). Alarms exist for entering and leaving a beacon (p20). Three fields in our reply are not explained: f_id and f_key and bt_beacon (p19).', 'Partly. We can read and keep the list. How the helmet picks beacons is not explained.'),
  row('6 Data saved with no signal', 'The document names ca_backup_data as the offline upload and does not describe it (p2).', 'Not yet. We need the format.'),
  row('7 Fences', 'get_user_fence and the fence status fields are named but not described (pp2 and 18).', 'Not yet. We need the format.')
]);

const caps2 = table(['What the helmet does', 'What the document gives us', 'Can we build it?'], [
  row('8 Commands to the helmet', 'Start and stop recording and take a photo (p27). Ask for nearby Wi-Fi and tell it to join one (pp41 to 43). Play audio (p25). Change the volume (p11).', 'Yes'),
  row('9 Photos and audio and video files', 'The helmet uploads to our address by HTTP. We can ask for the list of videos it holds and choose which to send (pp22 to 34).', 'Yes. It needs our file server.'),
  row('10 Live video', 'We send a start command with an address to stream to (p37).', 'Later. It needs our video server.'),
  row('11 Video calls', 'The helmet uses a standard call system so it needs a call server (p39).', 'Later. It needs our call server.'),
  row('12 Software updates', 'Our reply to a helmet can hold a new software address and a check number (pp5 and 8). Each helmet asks for itself (p3) so we can decide for each one.', 'Yes to send. How a helmet accepts it is questions 8 and 9.')
]);

const phases = table(['Version', 'What we build', 'What it needs'], [
  row('Version 1: surface', 'Address server and live server and data store. Screens for the overview and one worker and alarms and setup. A Bluetooth test list.', 'Nothing. We can start. A real helmet needs its admin login.'),
  row('Version 2: underground', 'Beacon names and the trail with times. The offline upload.', 'Answers to questions 4 and 5.'),
  row('Version 3: control and files', 'Commands and photos and audio and video and the Wi-Fi setting.', 'Our file server.'),
  row('Version 4: live video and calls', 'Live video and video calls.', 'Our video server and call server.'),
  row('Updates', 'Sending software updates to chosen helmets.', 'Answers to questions 8 and 9.')
]);

const html = head + `<div class="content">
<h2>What runs on our own servers</h2>
<p class="lead">Once a helmet is told our address it talks only to us. These are the parts we run in South Africa. The supplier's servers are not needed after that.</p>
${servers}
<div class="box dark"><b>One thing to add ourselves</b><p>The helmet logs in with its device number only and there is no password (p10). Our live server will keep a list of allowed device numbers and refuse the rest.</p></div>
</div>

<div class="pg">
<h2>What the document lets us build</h2>
<p class="lead">Each line is something the helmet does and what the document says about it. Page numbers are from the Interface Document.</p>
${caps}
</div>

<div class="pg">
<h2>What the document lets us build, continued</h2>
${caps2}
<h2>The order we would build it in</h2>
${phases}
</div>

<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'doc13.html'), html);
console.log('wrote doc13.html ' + html.length);
