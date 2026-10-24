const fs = require('fs');
let g = fs.readFileSync('gen_now.cjs', 'utf8');

// pull the html head out of the old tail
const m = g.match(/const out = ("(?:[^"\\]|\\.)*") \+ '<div class="content">/);
let head = JSON.parse(m[1]);
head = head.replace(/<title>[^<]*<\/title>/, '<title>Smart Helmet: What We Can Achieve Now, Version 2</title>');
head = head.replace(/<p class="sub">[^<]*<\/p>/, '<p class="sub">Wireframes of what we can build now. Workers are linked to helmets and shifts.</p>');
head = head.replace('<span>Version 1</span>', '<span>Version 2</span>');

// words: workers first
g = g.split('HELMETS ONLINE').join('WORKERS ON SHIFT');
g = g.split('BATTERY LOW').join('LOW BATTERY');
g = g.split("T(150, 101, 'NAME'").join("T(150, 101, 'ISSUED TO'");

const cut = g.indexOf('const list = ');
const tailStart = g.indexOf('const page = (');
const pre = g.slice(0, cut);

const newScreens = `
/* sign in at the lamp room */
const H8 = 420;
let s8 = frame(H8, 'Lamp room');
{
  const box = (x, y, w, h, n, label) => R(x, y, w, h) + T(x + 12, y + 18, label, { size: 8, fill: GREY, ls: 1.2 }) + badge(n, x + w - 16, y + 16);
  s8 += box(12, 42, 372, 112, 1, '1  WORKER');
  s8 += R(24, 70, 348, 24, { fill: SOFT }) + ic('search', 38, 82, 0.55) + T(50, 86, 'Find by name or employee number', { size: 8.5, fill: GREY });
  s8 += R(24, 102, 348, 44, { fill: SOFT, stroke: INK, sw: 1.4 }) + T(34, 120, 'Peter Dlamini', { bold: true, size: 10 }) + T(34, 136, 'Employee 10482  Drill operator  Shaft 2 crew', { size: 8.5, fill: GREY });
  s8 += box(12, 162, 372, 104, 2, '2  HELMET');
  s8 += R(24, 188, 348, 24, { fill: '#fff', stroke: LINE }) + T(34, 204, '866652020618592', { size: 9.5, bold: true }) + T(250, 204, 'Type or scan the number', { size: 8, fill: GREY });
  s8 += dot(34, 238) + T(44, 242, 'Seen now', { size: 9 }) + ic('battery', 130, 238, 0.55) + T(142, 242, 'Battery 78%', { size: 9 }) + T(240, 242, 'Not worn yet', { size: 9, fill: GREY });
  s8 += box(12, 274, 372, 86, 3, '3  SHIFT');
  [['Day 06:00 to 14:00', true], ['Afternoon 14:00 to 22:00', false], ['Night 22:00 to 06:00', false]].forEach((p, i) => {
    s8 += R(24 + i * 118, 302, 112, 26, { fill: p[1] ? INK : '#fff', stroke: INK }) + T(80 + i * 118, 319, p[0], { anchor: 'middle', size: 7.6, bold: true, fill: p[1] ? '#fff' : INK });
  });
  s8 += T(24, 349, 'Section', { size: 8, fill: GREY }) + R(70, 335, 160, 20, { fill: '#fff', stroke: LINE }) + T(78, 349.5, 'Shaft 2', { size: 9 });
  s8 += R(12, 368, 372, 40, { fill: INK, stroke: INK }) + T(198, 393, 'Sign in', { anchor: 'middle', bold: true, size: 12, fill: '#fff' }) + badge(4, 366, 380);
  s8 += R(396, 42, 272, 366) + T(408, 60, 'SIGNED IN TODAY', { size: 8, fill: GREY, ls: 1.2 }) + T(654, 60, '24', { size: 12, bold: true, anchor: 'end' }) + badge(5, 640, 78);
  [['Peter Dlamini', '8592', '06:02'], ['Sipho Mokoena', '0370', '06:05'], ['Thabo Nkosi', '5716', '06:07'], ['Lerato Khumalo', '9402', '06:10'], ['Johan Botha', '3037', '06:12'], ['Mpho Sithole', '1288', '06:15']].forEach((r, i) => {
    const ry = 92 + i * 50;
    s8 += R(406, ry, 252, 44) + T(416, ry + 19, r[0], { bold: true, size: 9.5 }) + T(416, ry + 35, 'Helmet ending ' + r[1] + '  in at ' + r[2], { size: 8, fill: GREY }) + R(596, ry + 12, 52, 20, { fill: '#fff', stroke: INK }) + T(622, ry + 26, 'Return', { anchor: 'middle', size: 8, bold: true });
  });
}
s8 = svg(s8, H8);

/* shift view */
const H9 = 410;
let s9 = frame(H9, 'Shift view');
{
  [['Day 06:00 to 14:00', 14, 170, true], ['Afternoon', 190, 90, false], ['Night', 286, 70, false]].forEach(t => {
    s9 += R(t[1], 42, t[2], 26, { fill: t[3] ? INK : '#fff', stroke: INK }) + T(t[1] + t[2] / 2, 59, t[0], { anchor: 'middle', bold: true, size: 9, fill: t[3] ? '#fff' : INK });
  });
  s9 += badge(1, 380, 55);
  // seen
  s9 += R(12, 80, 212, 150) + T(24, 98, 'SIGNED IN AND SEEN', { size: 8, fill: GREY, ls: 1.2 }) + T(24, 140, '22', { size: 34, bold: true }) + T(24, 160, 'Reported in the last 5 minutes', { size: 8.5, fill: GREY }) + T(24, 196, 'Not worn: 1', { size: 9.5, bold: true }) + T(24, 212, 'Sipho Mokoena, helmet not on the head', { size: 8, fill: GREY }) + badge(2, 208, 92);
  // not seen
  s9 += R(236, 80, 432, 150) + T(248, 98, 'SIGNED IN BUT NOT SEEN', { size: 8, fill: GREY, ls: 1.2 }) + T(654, 98, '2', { size: 14, bold: true, anchor: 'end' }) + badge(3, 618, 92);
  [['Thabo Nkosi', 'Last seen near the main gate at 10:12', '32 minutes ago'], ['Mpho Sithole', 'Last seen near Shaft 2 at 10:30', '14 minutes ago']].forEach((r, i) => {
    const ry = 112 + i * 56;
    s9 += R(246, ry, 412, 50, { fill: i === 0 ? SOFT : '#fff', stroke: i === 0 ? INK : LINE }) + T(258, ry + 20, r[0], { bold: true, size: 10 }) + T(258, ry + 38, r[1], { size: 8.5, fill: GREY }) + T(648, ry + 30, r[2], { size: 9, bold: true, anchor: 'end' });
  });
  // unknown
  s9 += R(12, 242, 432, 78) + T(24, 260, 'HELMET SEEN BUT NOBODY SIGNED IN', { size: 8, fill: GREY, ls: 1.2 }) + T(430, 260, '1', { size: 14, bold: true, anchor: 'end' }) + badge(4, 396, 254);
  s9 += R(22, 270, 412, 40, { fill: SOFT, dash: true }) + T(34, 287, 'Helmet 866652021983037', { bold: true, size: 9.5 }) + T(34, 302, 'Near the plant at 10:40', { size: 8.5, fill: GREY }) + R(340, 280, 86, 22, { fill: INK, stroke: INK }) + T(383, 295, 'Link to a worker', { anchor: 'middle', size: 8, bold: true, fill: '#fff' });
  // signed out
  s9 += R(456, 242, 212, 78) + T(468, 260, 'SIGNED OUT TODAY', { size: 8, fill: GREY, ls: 1.2 }) + T(468, 296, '12', { size: 24, bold: true }) + T(520, 296, 'Last helmet back 05:58', { size: 8.5, fill: GREY }) + badge(5, 652, 256);
  s9 += T(14, 346, 'Counts update by themselves as the helmets report.', { size: 9, fill: GREY });
}
s9 = svg(s9, H9);

/* headcount */
const H10 = 420;
let s10 = frame(H10, 'Headcount');
{
  [['SIGNED IN', '24'], ['SEEN', '22'], ['NOT SEEN', '2'], ['MARKED SAFE', '9']].forEach((t, i) => {
    s10 += R(12 + i * 138, 42, 130, 48) + T(22 + i * 138, 58, t[0], { size: 8, fill: GREY, ls: 1 }) + T(22 + i * 138, 82, t[1], { size: 18, bold: true });
  });
  s10 += R(566, 50, 102, 32, { fill: INK, stroke: INK }) + T(617, 70, 'Print the list', { anchor: 'middle', bold: true, size: 9.5, fill: '#fff' }) + badge(1, 550, 56);
  s10 += R(12, 100, 200, 296) + T(24, 118, 'WHERE THEY WERE LAST SEEN', { size: 8, fill: GREY, ls: 1.1 }) + badge(2, 198, 114);
  [['Near the main gate', '3', false], ['Near the plant', '5', false], ['Near Shaft 1', '6', false], ['Near Shaft 2', '8', true], ['Not seen', '2', false]].forEach((r, i) => {
    const ry = 130 + i * 52;
    s10 += R(20, ry, 184, 44, { fill: r[2] ? SOFT : '#fff', stroke: r[2] ? INK : LINE, sw: r[2] ? 1.6 : 1 }) + T(30, ry + 26, r[0], { size: 9.5, bold: r[2] }) + T(192, ry + 28, r[1], { size: 15, bold: true, anchor: 'end' });
  });
  s10 += R(224, 100, 444, 296) + T(236, 118, 'NEAR SHAFT 2', { size: 8, fill: GREY, ls: 1.1 }) + badge(3, 654, 114);
  s10 += L(236, 126, 656, 126) + T(236, 142, 'WORKER', { size: 7.5, fill: GREY, ls: 1 }) + T(440, 142, 'LAST SEEN', { size: 7.5, fill: GREY, ls: 1 }) + T(556, 142, 'SAFE', { size: 7.5, fill: GREY, ls: 1 }) + badge(4, 640, 138);
  [['Peter Dlamini', '10:42', false], ['Mpho Sithole', '10:30', false], ['Lerato Khumalo', '10:40', true], ['Johan Botha', '10:38', true], ['Sipho Mokoena', '10:31', true], ['Amanda Zulu', '10:36', false], ['Joseph Ndlovu', '10:41', true], ['Karabo Mahlangu', '10:39', false]].forEach((r, i) => {
    const ry = 152 + i * 29;
    s10 += L(236, ry + 28, 656, ry + 28) + T(236, ry + 19, r[0], { size: 9.5, bold: true }) + T(440, ry + 19, r[1], { size: 9.5 }) + R(556, ry + 6, 16, 16, { fill: r[2] ? INK : '#fff', stroke: INK }) + (r[2] ? '<path d="M559,' + (ry + 14) + ' L563,' + (ry + 18) + ' L569,' + (ry + 10) + '" fill="none" stroke="#fff" stroke-width="2"/>' : '');
  });
}
s10 = svg(s10, H10);
`;

const body = `
const page = (title, lead, svgx, notes) => '<div class="pg">\\n<h2>' + title + '</h2>\\n<p class="lead">' + lead + '</p>\\n<div class="dg">' + svgx + '</div>\\n' + list(notes) + '\\n</div>\\n';
const sumTable = '<table class="q"><thead><tr><th>No.</th><th>Screen</th><th>What it does</th><th>When</th></tr></thead>' +
  [['1', 'Overview', 'Workers on shift and where they are on a map. Open alarms.', 'Version 1'],
   ['2', 'Sign in', 'At the lamp room we link a worker to a helmet for a shift.', 'Version 1'],
   ['3', 'Shift view', 'Who is seen and who is not. Helmets nobody signed for.', 'Version 1'],
   ['4', 'Headcount', 'Everyone signed in by where they were last seen. Mark people safe.', 'Version 1'],
   ['5', 'One worker', 'Their day and commands to the helmet.', 'Version 1'],
   ['6', 'Alarm and last seen', 'What happened and where and who is nearby.', 'Version 1'],
   ['7', 'Helmets and settings', 'Which helmets may log in. Alarm settings for each one.', 'Version 1'],
   ['8', 'Bluetooth test', 'Every Bluetooth device the helmets hear.', 'Version 1'],
   ['9', 'Photos and videos', 'Photos the helmets take. Videos we ask for.', 'Version 3'],
   ['10', 'Updates', 'Send new software to chosen helmets.', 'After questions 8 and 9']].map(r => '<tr><td class="n">' + r[0] + '</td><td class="qq">' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>').join('') + '</table>';

const out = ${'${JSON.stringify(head)}'} + '<div class="content">\\n' +
'<h2>What we can build now</h2>\\n<p class="lead">We say worker on the screens. The helmet is the device the worker carries. A worker and a helmet are linked for one shift at a time. Names and times are sample data.</p>\\n' + sumTable +
'<div class="cols"><div class="col"><b>Not here yet</b><ul><li>The underground trail</li><li>Data saved with no signal</li><li>Fences</li><li>Live video and calls</li></ul></div><div class="col"><b>Ideas for later</b><ul><li>Face check at sign in</li><li>Attendance and daily reports</li><li>Visitors and contractors</li><li>A message to all helmets</li></ul></div></div>\\n' +
'</div>\\n' +
page('Screen 1: Overview', 'The first thing the control room sees.', s1, ['Four numbers at the top. Workers on shift means signed in with a helmet.', 'The site map. Each filled circle is a worker and a ring is an alarm. Positions come from the helmet GPS.', 'The alarms list. The newest is at the top.']) +
page('Screen 2: Sign in', 'At the lamp room we link a worker to a helmet for this shift. The link is our own record.', s8, ['Find the worker by name or employee number. We load the worker list once from the mine.', 'Type or scan the helmet number. The screen shows if the helmet is seen now and its battery. Both come from the helmet report (pp15 to 18). The report also says if the helmet is worn so we can show that too.', 'Pick the shift and the section.', 'Sign in links this worker and this helmet for this shift. Return ends the link when the helmet comes back.', 'Everyone signed in today. The same helmet can go to another worker on the next shift and the history keeps who had it.']) +
page('Screen 3: Shift view', 'Who is seen and who is not. This is where the control room finds problems early.', s9, ['Pick the shift.', 'Workers signed in whose helmet reported in the last 5 minutes. A worn check shows a helmet that is not on the head.', 'Workers signed in whose helmet has not reported. We show the last place and the time. Underground the helmet may simply have no signal so this is a prompt to check and not an alarm.', 'A helmet that reports but nobody is signed in to it. We can link it to a worker on the spot.', 'Workers who handed their helmet back.']) +
page('Screen 4: Headcount', 'For a muster or an evacuation. It shows everyone signed in by where they were last seen.', s10, ['The numbers and a button to print the list.', 'Groups by the place each worker was last seen. The last group is people we have not seen.', 'The workers in the chosen group with the time they were last seen.', 'A supervisor ticks each person as safe at the muster point.']) +
page('Screen 5: One worker', 'Pick a worker to see their day and to send the helmet a command.', s2n, ['A list of workers with a search box. A filled dot means the helmet is seen.', 'Where the worker has been today with the time.', 'The same route on the map.', 'Commands the helmet understands: take a photo and start or stop recording and play a message and join a Wi-Fi network (pp27 and 25 and 42).']) +
page('Screen 6: Alarm and last seen', 'What opens when an alarm comes in.', s3, ['The alarm bar with two buttons.', 'The last seen card with place and time and battery.', 'Who is close to the worker by GPS. The dashed box shows what comes later.', 'The way the worker came on the map.']) +
page('Screen 7: Helmets and settings', 'Which helmets may log in and how each one behaves.', s6, ['Add a helmet by its device number.', 'Only helmets in the list can log in. The document has no password so this is our own check (p10). The list also shows who each helmet is issued to.', 'Settings from the helmet start-up reply: alarm temperature and helmet off delay and no movement time and picture quality and beacon scanning and positioning and video upload (pp6 and 7).', 'The helmet reads these when it switches on so a change reaches it at the next start-up (p3).']) +
page('Screen 8: Bluetooth test', 'Every Bluetooth device the helmets hear. This is how we find out which beacons work.', s4, ['The tabs. The beacons tab is for the next version.', 'Every Bluetooth device the helmets hear with signal strength (p15).', 'How we use it: put a real beacon beside a helmet and see if it shows up.']) +
page('Screen 9: Photos and videos', 'Everything the helmets send us as files. This needs our file server so it comes in version 3.', s5, ['Two tabs: photos and the videos stored on helmets.', 'Photos the helmets took with the worker and the time. Each photo also carries a position (p30).', 'Videos stay on the helmet until we ask. We see the list and press Send to us (pp31 to 33).']) +
page('Screen 10: Updates', 'Send new software to chosen helmets. It needs the answers to questions 8 and 9 first.', s7, ['The new software: a version and a download address and a check number (pp5 and 8).', 'Each helmet and the software it runs now. The helmet tells us this when it asks for its settings (p3).', 'Tick one helmet to test first. We can answer each helmet on its own.', 'Send. The helmet gets the update the next time it starts. Whether it accepts our software is not known yet.']) +
'<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>\\n</body></html>';
fs.writeFileSync(path.join(dir, 'doc16.html'), out);
console.log('wrote doc16.html ' + out.length);
`;

// assemble: everything before the list helper, the new screens, the list helpers, the new body
const listBlock = g.slice(cut, tailStart);
// head is passed in as a JSON literal baked into the new generator
const bodyFixed = body.replace('${JSON.stringify(head)}', JSON.stringify(head).replace(/\$/g, '$$$$'));
fs.writeFileSync('gen_now2.cjs', pre + newScreens + listBlock + bodyFixed);
console.log('ok');
