const fs = require('fs');
const path = require('path');
const here = __dirname;
let code = fs.readFileSync(path.join(here, 'gen_env_code.txt'), 'utf8');
let body = fs.readFileSync(path.join(here, 'gen_env.cjs'), 'utf8');
let head = fs.readFileSync(path.join(here, 'gen_env_head.json'), 'utf8');

const rc = (a, b) => { if (!code.includes(a)) console.error('CODE MISSING ' + a.slice(0, 50)); code = code.split(a).join(b); };
const rb = (a, b) => { if (!body.includes(a)) console.error('BODY MISSING ' + a.slice(0, 50)); body = body.split(a).join(b); };

// diagram wording: the servers are the client's
rc("'OURS, IN SOUTH AFRICA'", "'CLIENT SERVERS, SOUTH AFRICA'");
rc("'Our live server'", "'Live server'");
rc("'Our data store'", "'Data store'");
rc("'Our screens'", "'Screens'");
rc("'2 Report to our server'", "'2 Report to the client server'");

// body wording
rb('The answer is our server. From then on the reports go to us.', 'The answer is the client\'s server. From then on the reports go there.');
rb("row('Our servers', 'Ours. They run in South Africa.', 'They receive the reports and keep them and show them.')", "row('The client\\'s servers', 'The client\\'s. They run in South Africa.', 'They receive the reports and keep them and show them.')");
rb("We log in once and change the two addresses to ours (p3).", "We log in once and change the two addresses to the client\\'s server (p3).");
rb('The address server answers with the two addresses we set. They are ours.', "The address server answers with the two addresses we set. They point to the client\\'s server.");
rb('The helmet opens a live link to our live server and logs in with its device number.', 'The helmet opens a live link to the live server and logs in with its device number.');
rb("numrow(6, 'Our data store keeps every report and our screens show it.', 'Ours')", "numrow(6, 'The data store keeps every report and the screens show it.', 'New work')");
rb("'Our sign in screen'", "'Sign in screen'");
rb("'Helmet and our live server'", "'Helmet and live server'");
rb("'Our overview and shift view'", "'Overview and shift view'");
rb("'Our alarm screen'", "'Alarm screen'");
rb("'Our headcount screen'", "'Headcount screen'");
rb('Our live server refuses it.', 'The live server refuses it.');
rb('A helmet is not in our allowed list', 'A helmet is not in the allowed list');
rb('Changing the address inside the helmet later removes this.', 'Changing the address inside the helmet later removes this.');

// data page after the "How a helmet reaches our server" page
rb('<h2>How a helmet reaches our server</h2>', '<h2>How a helmet reaches the client\'s server</h2>');
const dataPage = `
<div class="pg">
<h2>The data we get from the helmet</h2>
<p class="lead">The helmet keeps a live link open and sends its data to us. We do not have to ask for it. A report arrives every 10 seconds (pp15 to 19).</p>
\${tbl(['What the helmet sends', 'What it tells us', 'Where we use it in v1.00'], [
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
\${tbl(['What we send', 'What it does', 'When it reaches the helmet'], [
  row('Replies to login and to each report', 'The helmet needs these to carry on (pp10 and 19).', 'At once'),
  row('Settings in the start-up reply', 'Alarm temperature and helmet off delay and no movement time and beacon scanning and others (pp3 to 7).', 'When the helmet next starts up'),
  row('Start or stop recording', 'Starts or stops the video recording on the helmet (p27).', 'At once'),
  row('Join a Wi-Fi network', 'Tells the helmet which Wi-Fi to join (pp41 to 43).', 'At once')
])}
<div class="box"><b>Hosting</b><p>v1.00 is built and tested on a 90Ten test server with sample data. It is then installed on the client's own servers in South Africa and the data stays there.</p></div>
</div>
`;
rb('<div class="pg">\n<h2>A shift from start to end</h2>', dataPage + '\n<div class="pg">\n<h2>A shift from start to end</h2>');

// authorship box and footer
rb('<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>', '<div class="foot"><span>Confidential. © 2026 90Ten Group. All rights reserved.</span><span>Smart Helmet v1.00</span></div>');
rb('<h2>What could go wrong and what we do</h2>', '<h2>What could go wrong and what we do</h2>');
rb("  row('Underground there is no signal', 'We cannot see the worker. Data saved with no signal is not described yet.', 'v2.00')\n])}", "  row('Underground there is no signal', 'We cannot see the worker. Data saved with no signal is not described yet.', 'v2.00')\n])}\n<div class=\"box\"><b>Authorship and sources</b><p>Designed and written by 90Ten Group. The workflow and the screens are original work by 90Ten Group. The only supplier material used is the supplier's Interface Document for Device-side Connecting, which stays the property of its owner.</p></div>");

// head: remove nothing, keep
fs.writeFileSync(path.join(here, 'gen_env_code.txt'), code);
fs.writeFileSync(path.join(here, 'gen_env.cjs'), body);
console.log('patched');
