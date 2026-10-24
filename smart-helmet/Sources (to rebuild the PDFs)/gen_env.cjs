const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'gen_plan3.cjs'), 'utf8');
// helpers and the architecture node and arrow functions from the earlier plan generator
let pre = src.slice(0, src.indexOf('const list = '));
pre = pre.replace(/fs\.writeFileSync\([^\n]*\n/g, '');

const dir2 = path.join(__dirname, 'pdf_build');
const base = fs.readFileSync(path.join(dir2, 'doc12_v.html'), 'utf8');
let head = base.slice(0, base.indexOf('<div class="content">'));
head = head.replace(/<title>[^<]*<\/title>/, '<title>Smart Helmet: How v1.00 Works in the Existing Environment</title>');
head = head.replace(/<h1 style="margin-top:7mm">[^<]*<\/h1>/, '<h1 style="margin-top:7mm;font-size:20pt">Smart Helmet: How v1.00 Works in the Existing Environment</h1>');
head = head.replace(/<p class="sub">[^<]*<\/p>/, '<p class="sub">How the application works while the helmets still use the supplier\'s existing servers.</p>');

const code = `
const dgEnv = (() => {
  let d = '<defs><marker id="EAR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9" fill="none" stroke="' + INK + '" stroke-width="1.5"/></marker></defs>';
  const arr = (x1, y1, x2, y2, o) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + ((o && o.dash) ? GREY : INK) + '" stroke-width="1.4"' + ((o && o.dash) ? ' stroke-dasharray="5 4"' : '') + ' marker-end="url(#EAR)"' + ((o && o.both) ? ' marker-start="url(#EAR)"' : '') + '/>';
  d += R(0.5, 0.5, 679, 279, { rx: 4, stroke: LINE });
  d += '<rect x="1" y="1" width="130" height="278" fill="' + SOFT + '"/>' + T(12, 18, 'IN THE FIELD', { size: 8, fill: GREY, ls: 1.2 });
  d += T(143, 18, 'EXISTING (SUPPLIER)', { size: 8, fill: GREY, ls: 1.2 }) + L(340, 28, 340, 270, { stroke: GREY, dash: true }) + T(352, 18, 'CLIENT SERVERS, SOUTH AFRICA', { size: 8, fill: GREY, ls: 1.2 });
  d += nd('helmet', 66, 140, 'Helmet', 'as it is today', { w: 100, thick: true });
  d += nd('server', 245, 72, 'Address server', 'hm.equiinet.cn', { w: 130 });
  d += nd('server', 245, 214, 'Supplier platform', 'set once with the admin login', { w: 160, dash: true });
  d += nd('server', 410, 140, 'Live server', 'login and reports', { w: 104, thick: true });
  d += nd('server', 530, 140, 'Data store', 'every report', { w: 100, thick: true });
  d += nd('monitor', 628, 140, 'Screens', 'control room', { w: 76, thick: true });
  d += arr(110, 118, 185, 88, { both: true });
  d += T(70, 82, '1 Where do I report?', { size: 8.5, bold: true }) + T(70, 94, '2 Report to the client', { size: 8.5, bold: true });
  d += arr(245, 181, 245, 106, { dash: true });
  d += arr(116, 140, 357, 140) + T(236, 132, '3 login and reports', { size: 8.5, bold: true, anchor: 'middle' });
  d += arr(462, 140, 478, 140) + arr(580, 140, 590, 140);
  return svg(d, 280);
})();
`;

const row = (a, b, c) => '<tr><td class="qq"><b>' + a + '</b></td><td>' + b + '</td><td>' + c + '</td></tr>';
const tbl = (cols, rows) => '<table class="q"><thead><tr>' + cols.map(c => '<th>' + c + '</th>').join('') + '</tr></thead>' + rows.join('') + '</table>';
const numrow = (n, a, b) => '<tr><td class="n">' + n + '</td><td class="qq">' + a + '</td><td>' + b + '</td></tr>';
const ntbl = (cols, rows) => '<table class="q"><thead><tr><th>No.</th>' + cols.map(c => '<th>' + c + '</th>').join('') + '</tr></thead>' + rows.join('') + '</table>';

const body = `
<div class="content">
<h2>What the existing environment is</h2>
<p class="lead">v1.00 does not change the helmet. It uses what is already there and changes only where the helmet sends its reports.</p>
${tbl(['Part', 'Who has it', 'What we do with it'], [
  row('The helmet', 'The supplier made it. It has a SIM card for 4G.', 'Nothing. It stays as it is.'),
  row('The address server', 'The supplier. It sits at hm.equiinet.cn and is built into the helmet (p3).', 'Nothing. The helmet still asks it where to report.'),
  row('The supplier platform', 'The supplier. We get an admin login for the helmets.', 'We log in once and change the two addresses to the client\'s server (p3).'),
  row('The mobile network', 'The SIM card on each helmet.', 'Nothing. The helmet reports over 4G on the surface.'),
  row('The client\'s servers', 'The client\'s. They run in South Africa.', 'They receive the reports and keep them and show them.')
])}
<div class="box dark"><b>What changes and what does not</b><p>What changes is the two addresses the helmet is told to report to. What does not change is the helmet itself and its software and the supplier address server it asks first.</p></div>
</div>

<div class="pg">
<h2>How a helmet reaches the client's server</h2>
<p class="lead">The helmet first asks the supplier's address server where to report. The answer is the client's server. From then on the reports go there.</p>
<div class="dg">\${dgEnv}</div>
${ntbl(['What happens', 'In the supplier document'], [
  numrow(1, 'The helmet switches on and asks the address server where to report.', 'p3'),
  numrow(2, 'The address server answers with the two addresses we set. They point to the client\'s server.', 'pp3 and 4'),
  numrow(3, 'The helmet opens a live link to the live server and logs in with its device number.', 'p10'),
  numrow(4, 'It sends a report every 10 seconds with its position and battery and the Bluetooth devices it hears.', 'pp15 to 19'),
  numrow(5, 'If an alarm happens it sends the alarm at once.', 'pp20 and 21'),
  numrow(6, 'The data store keeps every report and the screens show it.', 'New work')
])}
</div>


<div class="pg">
<h2>The data we get from the helmet</h2>
<p class="lead">The helmet keeps a live link open and sends its data to us. We do not have to ask for it. A report arrives every 10 seconds (pp15 to 19).</p>
${tbl(['What the helmet sends', 'What it tells us', 'Where we use it in v1.00'], [
  row('Position (x_point and y_point)', 'Where the worker is. The system is Gaode (question 3).', 'Overview and one worker and alarm'),
  row('Position quality (c_accuracy and gps and gps_level)', 'How far to trust the position. Whether it comes from GPS or the mobile network.', 'Map and last seen'),
  row('Battery (bat_l and charging)', 'Battery percent and whether it is charging.', 'Overview low battery and sign in'),
  row('Worn or not (is_weared)', 'Whether the helmet is on the head.', 'Sign in and shift view'),
  row('Network (net_type and net_strenth)', '4G or Wi-Fi and how strong.', 'One worker'),
  row('Bluetooth devices (bt_signal_info)', 'Every device the helmet hears with signal strength and time.', 'Bluetooth test'),
  row('Alarms (ca_sos)', 'Which alarm: SOS and fall and helmet off and others, with the position (p20).', 'Alarm screen and overview'),
  row('SOS button (ca_sip_sos)', 'The worker pressed SOS. It also asks for a call room (p21).', 'Alarm screen')
])}
<h2>What we send back to the helmet</h2>
${tbl(['What we send', 'What it does', 'When it reaches the helmet'], [
  row('Replies to login and to each report', 'The helmet needs these to carry on (pp10 and 19).', 'At once'),
  row('Settings in the start-up reply', 'Alarm temperature and helmet off delay and no movement time and beacon scanning and others (pp3 to 7).', 'When the helmet next starts up'),
  row('Start or stop recording', 'Starts or stops the video recording on the helmet (p27).', 'At once'),
  row('Join a Wi-Fi network', 'Tells the helmet which Wi-Fi to join (pp41 to 43).', 'At once')
])}
<div class="box"><b>Hosting</b><p>v1.00 is built and tested on a 90Ten test server with sample data. It is then installed on the client's own servers in South Africa and the data stays there.</p></div>
</div>

<div class="pg">
<h2>A shift from start to end</h2>
<p class="lead">What happens in v1.00 during one shift for one worker.</p>
${tbl(['When', 'What happens', 'Where'], [
  row('Before the shift', 'At the lamp room the worker is linked to a helmet and a shift. The screen shows if the helmet is seen and its battery.', 'Sign in screen'),
  row('Shift starts', 'The helmet is switched on and asks where to report and logs in to the client server.', 'Helmet and live server'),
  row('During the shift', 'The helmet reports every 10 seconds. The control room sees the worker on the map and who is seen and who is not.', 'Overview and shift view'),
  row('An alarm', 'A fall or an SOS reaches the server at once. The control room sees who and where and when. A video call needs a call server so it comes in a later version.', 'Alarm screen'),
  row('A headcount', 'The control room lists everyone signed in by where they were last seen and ticks people safe.', 'Headcount screen'),
  row('Shift ends', 'The worker hands the helmet back and it is returned in the sign in screen. The history keeps who had it.', 'Sign in screen')
])}
<div class="box"><b>Not in v1.00</b><p>The underground trail and data saved with no signal and fences and live video and video calls. They come in later versions.</p></div>
</div>

<div class="pg">
<h2>What we depend on</h2>
${tbl(['What', 'Why', 'Status'], [
  row('A sample helmet', 'Imperium has two helmets in South Africa. We need one in hand to build the application because we have to test it. Without one we can only test with a pretend helmet.', 'Needed first'),
  row('The admin login on the supplier platform', 'It is how we change the two addresses on the supplier platform (p3).', 'Needed'),
  row('The supplier address server being reachable', 'The helmet asks it first every time it starts. If it cannot be reached the helmet may not learn where to report. Changing the address inside the helmet later removes this.', 'To confirm'),
  row('Secure connections', 'The addresses in the example are plain http and ws (p4). We need to know if the helmet accepts secure addresses.', 'To confirm'),
  row('The SIM card data', 'The helmet reports over 4G. Someone pays for the data.', 'To confirm'),
  row('The map', 'Positions use the Gaode system (question 3). We test with a helmet.', 'To confirm')
])}
<h2>What could go wrong and what we do</h2>
${tbl(['What', 'What we do', 'When'], [
  row('The supplier address server is down', 'The helmet may not report. This is the reason to move to an address server of the client.', 'Before wide use'),
  row('A helmet is not in the allowed list', 'The live server refuses it. It shows in the shift view as a helmet nobody signed for.', 'v1.00'),
  row('A helmet has no signal', 'It shows as not seen with the last place and time. On the surface this is a prompt to check.', 'v1.00'),
  row('Underground there is no signal', 'We cannot see the worker. Data saved with no signal is not described yet.', 'v2.00')
])}

</div>

<div class="foot"><span>Confidential. Prepared by 90Ten Group. 20 October 2026.</span><span>Smart Helmet v1.00</span></div>
</body></html>`;

// the body above uses template pieces, so build it with plain concatenation instead
fs.writeFileSync(path.join(__dirname, 'gen_env_body.txt'), body);
fs.writeFileSync(path.join(__dirname, 'gen_env_head.json'), JSON.stringify(head));
fs.writeFileSync(path.join(__dirname, 'gen_env_code.txt'), pre + code);
console.log('parts written');
