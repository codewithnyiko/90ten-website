const fs = require('fs');
const src = fs.readFileSync('gen_wf2.cjs', 'utf8');

// everything before the list helper holds helpers and the surface screens s1 to s4
const cut = src.indexOf('const list = ');
let code = src.slice(0, cut);

// head of the old html template (styles and band) up to the content block
const tStart = src.indexOf('const html = `');
const tEnd = src.indexOf('<div class="content">', tStart);
let head = src.slice(tStart + 'const html = `'.length, tEnd);
head = head.replace(/<title>[^<]*<\/title>/, '<title>Smart Helmet: What We Can Achieve Now, Wireframes</title>');
head = head.replace(/<h1 style="margin-top:7mm">[^<]*<\/h1>/, '<h1 style="margin-top:7mm">Smart Helmet: What We Can Achieve Now</h1>');
head = head.replace(/<p class="sub">[^<]*<\/p>/, '<p class="sub">Wireframes of everything the supplier document lets us build on our own servers today.</p>');

const extra = `
/* screen 2 with commands */
const H2n = 420;
let s2n = frame(H2n);
{
  s2n += R(12, 42, 200, 366) + R(20, 50, 184, 22, { fill: SOFT }) + ic('search', 34, 61, 0.55) + T(46, 65, 'Find a person or helmet', { size: 8.5, fill: GREY });
  [['Peter Dlamini', 'Near Shaft 2  10:42', 1, true], ['Sipho Mokoena', 'Near the plant  10:31', 1, false], ['Thabo Nkosi', 'Near the main gate  10:12', 0, false], ['Lerato Khumalo', 'Near Shaft 1  10:40', 1, false], ['Johan Botha', 'Near the main gate  10:38', 1, false], ['Mpho Sithole', 'Near Shaft 2  10:41', 1, false]].forEach((r, i) => {
    const ry = 82 + i * 52;
    s2n += R(20, ry, 184, 46, { fill: r[3] ? SOFT : '#fff', stroke: r[3] ? INK : LINE, sw: r[3] ? 1.6 : 1 }) + dot(32, ry + 16, !!r[2]) + T(44, ry + 19, r[0], { bold: true, size: 9.5 }) + T(32, ry + 36, r[1], { size: 8, fill: GREY });
  });
  s2n += badge(1, 196, 90);
  const x = 224;
  s2n += R(x, 42, 444, 366) + T(x + 14, 66, 'Peter Dlamini', { bold: true, size: 14 }) + T(x + 14, 82, 'Helmet 866652020618592', { size: 8.5, fill: GREY });
  s2n += R(x + 250, 52, 56, 24, { fill: SOFT }) + dot(x + 262, 64) + T(x + 270, 67, 'Online', { size: 8 });
  s2n += R(x + 312, 52, 60, 24, { fill: SOFT }) + ic('battery', x + 326, 64, 0.55) + T(x + 338, 67, '78%', { size: 8 });
  s2n += R(x + 378, 52, 56, 24, { fill: SOFT }) + T(x + 386, 67, '4G', { size: 8 });
  s2n += T(x + 14, 110, 'WHERE THIS WORKER HAS BEEN TODAY', { size: 8, fill: GREY, ls: 1.2 });
  const rows = [['08:20', 'Near the plant', ''], ['08:31', 'Near Shaft 1', ''], ['09:05', 'Near Shaft 2', ''], ['10:42', 'Near Shaft 2', 'last seen']];
  rows.forEach((r, i) => {
    const ry = 134 + i * 38;
    if (i < rows.length - 1) s2n += L(x + 70, ry, x + 70, ry + 38, { stroke: INK, sw: 1.4 });
    s2n += T(x + 14, ry + 4, r[0], { size: 9.5, bold: true }) + dot(x + 70, ry, i === rows.length - 1) + T(x + 86, ry + 4, r[1], { size: 10 });
    if (r[2] === 'last seen') s2n += R(x + 190, ry - 9, 66, 18, { fill: INK, stroke: INK }) + T(x + 223, ry + 3, r[2], { size: 8, anchor: 'middle', fill: '#fff', bold: true });
  });
  s2n += badge(2, x + 226, 106);
  s2n += sitemap(x + 290, 100, 140, 190) + '<path d="M' + (x + 310) + ',150 L' + (x + 345) + ',190 L' + (x + 400) + ',250" fill="none" stroke="' + INK + '" stroke-width="2"/>' + mk(x + 400, 250) + badge(3, x + 420, 96);
  // command strip
  s2n += R(x + 12, 304, 420, 92, { fill: SOFT }) + T(x + 24, 322, 'SEND A COMMAND TO THIS HELMET', { size: 8, fill: GREY, ls: 1.2 }) + badge(4, x + 418, 318);
  [['Take a photo', 0, 0], ['Start recording', 1, 0], ['Stop recording', 2, 0], ['Play a message', 0, 1], ['Join Wi-Fi', 1, 1]].forEach(([n, c, r]) => {
    s2n += R(x + 24 + c * 130, 332 + r * 30, 122, 24, { fill: '#fff', stroke: INK }) + T(x + 85 + c * 130, 348 + r * 30, n, { anchor: 'middle', size: 9, bold: true });
  });
}
s2n = svg(s2n, H2n);

/* screen 4: photos and videos */
const H5 = 420;
let s5 = frame(H5);
{
  s5 += R(12, 42, 656, 28, { fill: '#fff' }) + R(14, 42, 100, 28, { fill: INK, stroke: INK }) + T(64, 60, 'Photos', { anchor: 'middle', bold: true, size: 9.5, fill: '#fff' }) + R(118, 42, 140, 28, { fill: '#fff', stroke: INK }) + T(188, 60, 'Videos on helmets', { anchor: 'middle', bold: true, size: 9.5 }) + badge(1, 280, 56);
  s5 += T(14, 92, 'PHOTOS TAKEN BY HELMETS', { size: 8, fill: GREY, ls: 1.2 });
  [['Peter Dlamini', '10:41'], ['Peter Dlamini', '10:12'], ['Sipho Mokoena', '09:58'], ['Thabo Nkosi', '09:20'], ['Lerato Khumalo', '09:05'], ['Johan Botha', '08:47'], ['Mpho Sithole', '08:30'], ['Peter Dlamini', '08:21']].forEach((p, i) => {
    const cx = 12 + (i % 4) * 166, cy = 100 + Math.floor(i / 4) * 116;
    s5 += R(cx, cy, 158, 108) + '<rect x="' + (cx + 6) + '" y="' + (cy + 6) + '" width="146" height="66" fill="' + SOFT + '" stroke="' + LINE + '"/>' + L(cx + 6, cy + 6, cx + 152, cy + 72, { stroke: MID }) + L(cx + 152, cy + 6, cx + 6, cy + 72, { stroke: MID }) + T(cx + 8, cy + 88, p[0], { size: 9, bold: true }) + T(cx + 8, cy + 100, p[1] + '  near Shaft 2', { size: 8, fill: GREY });
  });
  s5 += badge(2, 650, 92);
  s5 += T(14, 342, 'VIDEOS STORED ON THE SELECTED HELMET', { size: 8, fill: GREY, ls: 1.2 }) + badge(3, 648, 338);
  [['20261020104423.mp4', 'On the helmet'], ['20261020094012.mp4', 'Uploaded']].forEach((v, i) => {
    const ry = 350 + i * 28;
    s5 += R(12, ry, 656, 24) + T(24, ry + 16, v[0], { size: 9 }) + T(300, ry + 16, v[1], { size: 9, fill: GREY });
    if (i === 0) s5 += R(580, ry + 3, 80, 18, { fill: INK, stroke: INK }) + T(620, ry + 15.5, 'Send to us', { anchor: 'middle', size: 8.5, bold: true, fill: '#fff' });
  });
}
s5 = svg(s5, H5);

/* screen 5: helmets and settings */
const H6 = 420;
let s6 = frame(H6, 'Setup');
{
  [['Helmets', 0, true], ['Bluetooth test', 1, false], ['Server', 2, false]].forEach(([n, i, on]) => {
    s6 += R(14 + i * 126, 42, 122, 28, { fill: on ? INK : '#fff', stroke: INK }) + T(75 + i * 126, 60, n, { anchor: 'middle', bold: true, size: 9.5, fill: on ? '#fff' : INK });
  });
  s6 += R(560, 42, 108, 28, { fill: INK, stroke: INK }) + T(614, 60, 'Add a helmet', { anchor: 'middle', bold: true, size: 9.5, fill: '#fff' }) + badge(1, 548, 56);
  s6 += R(12, 82, 330, 30, { fill: SOFT }) + T(24, 101, 'DEVICE NUMBER', { size: 8, fill: GREY, ls: 1 }) + T(150, 101, 'NAME', { size: 8, fill: GREY, ls: 1 }) + T(270, 101, 'STATUS', { size: 8, fill: GREY, ls: 1 });
  [['866652020618592', 'Peter Dlamini', 'Online', true], ['866652020900370', 'Sipho Mokoena', 'Online', false], ['866652021005716', 'Thabo Nkosi', 'Not seen', false], ['866652020699402', 'Lerato Khumalo', 'Online', false], ['866652021983037', 'Johan Botha', 'Online', false]].forEach((r, i) => {
    const ry = 112 + i * 36;
    s6 += R(12, ry, 330, 36, { fill: r[3] ? SOFT : '#fff', stroke: r[3] ? INK : LINE, sw: r[3] ? 1.6 : 1 }) + T(24, ry + 22, r[0], { size: 8.5 }) + T(150, ry + 22, r[1], { size: 9, bold: true }) + dot(270, ry + 18, r[2] === 'Online') + T(280, ry + 22, r[2], { size: 8.5 });
  });
  s6 += T(12, 312, 'Only helmets in this list can log in.', { size: 8.5, fill: GREY }) + badge(2, 330, 98);
  s6 += R(356, 82, 312, 312) + T(368, 102, 'SETTINGS FOR PETER DLAMINI', { size: 8, fill: GREY, ls: 1.2 }) + badge(3, 654, 98);
  [['Alarm temperature', '70 C'], ['Helmet off alarm after', '10 seconds'], ['No movement alarm every', '45 minutes'], ['Picture quality', '1080p'], ['Bluetooth beacon scanning', 'On'], ['Positioning', 'GPS and Beidou'], ['Upload videos', 'With Wi-Fi']].forEach((r, i) => {
    const ry = 112 + i * 32;
    s6 += T(368, ry + 12, r[0], { size: 9 }) + R(530, ry, 126, 22, { fill: '#fff', stroke: LINE }) + T(540, ry + 15, r[1], { size: 9, bold: true });
  });
  s6 += R(368, 344, 140, 36, { fill: INK, stroke: INK }) + T(438, 366, 'Save settings', { anchor: 'middle', bold: true, size: 9.5, fill: '#fff' });
  s6 += T(516, 358, 'Reaches the helmet', { size: 8.5, fill: GREY }) + T(516, 370, 'when it next starts up.', { size: 8.5, fill: GREY }) + badge(4, 654, 360);
}
s6 = svg(s6, H6);

/* screen 6: updates */
const H7 = 400;
let s7 = frame(H7, 'Updates');
{
  s7 += R(12, 42, 656, 92, { fill: SOFT }) + T(24, 60, 'NEW SOFTWARE', { size: 8, fill: GREY, ls: 1.2 }) + badge(1, 654, 56);
  [['Version', 'v2.7.9', 24], ['Download address', 'https://updates.example/helmet.apk', 130], ['Check number (MD5)', '2vr6e1blu9d80d1qffg9go5o9p', 440]].forEach(r => {
    s7 += T(r[2], 80, r[0], { size: 8, fill: GREY }) + R(r[2], 86, r[0] === 'Version' ? 90 : (r[0] === 'Download address' ? 296 : 216), 24, { fill: '#fff', stroke: LINE }) + T(r[2] + 8, 102, r[1], { size: 9 });
  });
  s7 += R(12, 144, 656, 28, { fill: SOFT }) + T(24, 163, 'WORKER', { size: 8, fill: GREY, ls: 1 }) + T(200, 163, 'SOFTWARE NOW', { size: 8, fill: GREY, ls: 1 }) + T(380, 163, 'SEND THE UPDATE', { size: 8, fill: GREY, ls: 1 }) + T(560, 163, 'STATUS', { size: 8, fill: GREY, ls: 1 });
  [['Peter Dlamini', 'v2.7.8', true, 'Waiting'], ['Sipho Mokoena', 'v2.7.8', false, ''], ['Thabo Nkosi', 'v2.7.6', false, ''], ['Lerato Khumalo', 'v2.7.8', false, '']].forEach((r, i) => {
    const ry = 172 + i * 34;
    s7 += L(12, ry + 34, 668, ry + 34) + T(24, ry + 21, r[0], { size: 9.5, bold: true }) + T(200, ry + 21, r[1], { size: 9.5 });
    s7 += R(380, ry + 9, 16, 16, { fill: r[2] ? INK : '#fff', stroke: INK }) + (r[2] ? '<path d="M383,' + (ry + 17) + ' L387,' + (ry + 21) + ' L393,' + (ry + 13) + '" fill="none" stroke="#fff" stroke-width="2"/>' : '') + T(404, ry + 21, r[2] ? 'Test on this one first' : '', { size: 8.5 });
    s7 += T(560, ry + 21, r[3], { size: 9, fill: GREY });
  });
  s7 += badge(2, 656, 158) + badge(3, 520, 189);
  s7 += R(12, 318, 220, 36, { fill: INK, stroke: INK }) + T(122, 340, 'Send to the selected helmets', { anchor: 'middle', bold: true, size: 9.5, fill: '#fff' }) + badge(4, 246, 336);
  s7 += R(260, 318, 408, 70, { fill: SOFT, dash: true }) + T(272, 338, 'BEFORE WE USE THIS', { size: 8, fill: GREY, ls: 1.2 }) + T(272, 356, 'A helmet may only accept software it trusts. We must find out first', { size: 9 }) + T(272, 372, 'if it accepts software from us. This is questions 8 and 9.', { size: 9, bold: true });
}
s7 = svg(s7, H7);
`;

const list = `const list = items => '<ol class="nt">' + items.map(i => '<li>' + i + '</li>').join('') + '</ol>';
const box = (t, p) => '<div class="box"><b>' + t + '</b><p>' + p + '</p></div>';
`;

const body = `
const page = (title, lead, svgx, notes) => '<div class="pg">\\n<h2>' + title + '</h2>\\n<p class="lead">' + lead + '</p>\\n<div class="dg">' + svgx + '</div>\\n' + list(notes) + '\\n</div>\\n';
const sumTable = '<table class="q"><thead><tr><th>No.</th><th>Screen</th><th>What it does</th><th>Document</th></tr></thead>' +
  [['1', 'Overview', 'Who is online and where they are on a map. Open alarms.', 'pp15 to 21'],
   ['2', 'One worker', 'Where this worker has been today. Commands to the helmet.', 'pp15 to 19 and 27 and 41'],
   ['3', 'Alarm and last seen', 'What happened and where and who is nearby.', 'pp20 and 21'],
   ['4', 'Photos and videos', 'Photos the helmets take. Videos stored on a helmet that we can ask for.', 'pp22 to 34'],
   ['5', 'Helmets and settings', 'Which helmets may log in. Alarm settings for each helmet.', 'pp3 to 7 and 10'],
   ['6', 'Updates', 'Send new software to chosen helmets.', 'pp3 and 5 and 8'],
   ['7', 'Bluetooth test', 'Every Bluetooth device the helmets hear.', 'pp6 and 15']].map(r => '<tr><td class="n">' + r[0] + '</td><td class="qq">' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>').join('') + '</table>';

const out = ${JSON.stringify(head)} + '<div class="content">\\n' +
'<h2>What we can achieve now</h2>\\n<p class="lead">Seven screens. Each one only uses things the supplier document describes, running on our own servers. Names and times are sample data.</p>\\n' + sumTable +
'<div class="cols"><div class="col"><b>Not in these screens</b><ul><li>The underground trail with beacon names</li><li>Data saved with no signal</li><li>Fences</li><li>Live video and video calls</li></ul></div><div class="col"><b>Why not</b><ul><li>The document does not describe them yet or they need servers we have not planned for</li></ul></div></div>\\n' +
'</div>\\n' +
page('Screen 1: Overview', 'The first thing the control room sees.', s1, ['Four numbers at the top.', 'The site map. Each filled circle is a helmet and a ring is an alarm. Positions come from the helmet GPS.', 'The alarms list. The newest is at the top.']) +
page('Screen 2: One worker', 'Pick a worker to see their day and to send the helmet a command.', s2n, ['A list of workers with a search box. A filled dot means online.', 'Where the worker has been today with the time.', 'The same route on the map.', 'Commands the helmet understands: take a photo and start or stop recording and play a message and join a Wi-Fi network (pp27 and 25 and 42).']) +
page('Screen 3: Alarm and last seen', 'What opens when an alarm comes in.', s3, ['The alarm bar with two buttons.', 'The last seen card with place and time and battery.', 'Who is close to the worker by GPS. The dashed box shows what comes later.', 'The way the worker came on the map.']) +
page('Screen 4: Photos and videos', 'Everything the helmets send us as files.', s5, ['Two tabs: photos and the videos stored on helmets.', 'Photos the helmets took with the worker and the time. Each photo also carries a position (p30).', 'Videos stay on the helmet until we ask. We see the list and press Send to us (pp31 to 33).']) +
page('Screen 5: Helmets and settings', 'Which helmets may log in and how each one behaves.', s6, ['Add a helmet by its device number.', 'Only helmets in the list can log in. The document has no password so this is our own check (p10).', 'Settings from the helmet start-up reply: alarm temperature and helmet off delay and no movement time and picture quality and beacon scanning and positioning and video upload (pp6 and 7).', 'The helmet reads these when it switches on so a change reaches it at the next start-up (p3).']) +
page('Screen 6: Updates', 'Send new software to chosen helmets.', s7, ['The new software: a version and a download address and a check number (pp5 and 8).', 'Each helmet and the software it runs now. The helmet tells us this when it asks for its settings (p3).', 'Tick one helmet to test first. We can answer each helmet on its own.', 'Send. The helmet gets the update the next time it starts. Whether it accepts our software is not known yet.']) +
page('Screen 7: Bluetooth test', 'Every Bluetooth device the helmets hear. This is how we find out which beacons work.', s4, ['The tabs. The beacons tab is for the next version.', 'Every Bluetooth device the helmets hear with signal strength (p15).', 'How we use it: put a real beacon beside a helmet and see if it shows up.']) +
'<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>\\n</body></html>';
fs.writeFileSync(path.join(dir, 'doc14.html'), out);
console.log('wrote doc14.html ' + out.length);
`;

// code already has fs and path and dir defined at the top of gen_wf2
fs.writeFileSync('gen_now.cjs', code + extra + list + body);
console.log('ok');
