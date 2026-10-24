const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'pdf_build');
const INK = '#17181a', GREY = '#8a8e94', LINE = '#b9bbbe', SOFT = '#f1f2f3', MID = '#dcdde0';

const icons = {
  helmet: '<path d="M-11,5 A11 11 0 0 1 11,5 Z M-14,5 H14"/><circle cx="0" cy="-2" r="2.4"/>',
  beacon: '<circle r="3.5"/><path d="M-9,-6 A11 11 0 0 0 -9,6 M9,-6 A11 11 0 0 1 9,6"/>',
  alarm: '<path d="M0,-11 L11,9 H-11 Z M0,-4 V3"/><circle cx="0" cy="6.2" r="0.8"/>',
  battery: '<rect x="-11" y="-6" width="19" height="12" rx="2"/><path d="M11,-2 V2"/>',
  search: '<circle cx="-2" cy="-2" r="7"/><path d="M3,3 L10,10"/>',
  server: '<rect x="-11" y="-11" width="22" height="9" rx="1.5"/><rect x="-11" y="2" width="22" height="9" rx="1.5"/><path d="M-7,-6.5 H-3 M-7,6.5 H-3"/>'
};
const ic = (t, x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icons[t]}</g>`;
const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 3}" fill="${o.fill || '#fff'}" stroke="${o.stroke || LINE}"${o.dash ? ' stroke-dasharray="5 4"' : ''}${o.sw ? ` stroke-width="${o.sw}"` : ''}/>`;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 9}" fill="${o.fill || INK}"${o.bold ? ' font-weight="700"' : ''} text-anchor="${o.anchor || 'start'}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${s}</text>`;
const L = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke || LINE}" stroke-width="${o.sw || 1}"${o.dash ? ' stroke-dasharray="4 3"' : ''}/>`;
const badge = (n, x, y) => `<g><circle cx="${x}" cy="${y}" r="8" fill="${INK}"/><text x="${x}" y="${y + 3.4}" font-size="9.5" font-weight="700" fill="#fff" text-anchor="middle">${n}</text></g>`;
const dot = (x, y, filled = true) => `<circle cx="${x}" cy="${y}" r="4" fill="${filled ? INK : '#fff'}" stroke="${INK}" stroke-width="1.3"/>`;
const svg = (inner, h) => `<svg viewBox="0 0 680 ${h}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Calibri, Arial, sans-serif">${inner}</svg>`;
const frame = (h, right = 'Server connected   10:42') =>
  R(0.5, 0.5, 679, h - 1, { rx: 4, stroke: INK }) +
  `<path d="M0.5,30 V4.5 A4 4 0 0 1 4.5,0.5 H675.5 A4 4 0 0 1 679.5,4.5 V30 Z" fill="${INK}"/>` +
  T(14, 19.5, 'Control room', { fill: '#fff', bold: true, size: 10 }) + T(110, 19.5, 'Demo mine', { fill: '#cfd1d4' }) +
  T(666, 19.5, right, { fill: '#cfd1d4', anchor: 'end' });
const minimap = (x, y, w, h, trail = true) => {
  const lv = [y + 22, y + 58, y + 94, y + 130].filter(v => v < y + h - 6);
  let s = R(x, y, w, h, { fill: SOFT });
  s += L(x + 28, y + 14, x + 28, y + h - 10, { stroke: GREY, sw: 2 });
  lv.forEach((v, i) => { s += L(x + 28, v, x + w - 14, v, { stroke: GREY, sw: 1.4 }) + T(x + 6, v - 4, ['Surf.', 'L1', 'L2', 'L3'][i], { size: 7.5, fill: GREY }); });
  return { s, lv };
};

/* screen 1: overview */
const H1 = 400;
const tile = (x, label, val) => R(x, 42, 152, 50, {}) + T(x + 10, 58, label, { size: 8, fill: GREY }) + T(x + 10, 82, val, { size: 18, bold: true });
let s1 = frame(H1) + tile(12, 'HELMETS ONLINE', '24') + tile(176, 'ALARMS', '2') + tile(340, 'NOT SEEN FOR 5 MINUTES', '1') + tile(504, 'BATTERY LOW', '3');
{
  const x = 12, y = 104, w = 420, h = 284;
  s1 += R(x, y, w, h) + T(x + 10, y + 16, 'MINE LAYOUT', { size: 8, fill: GREY, ls: 1.2 });
  const lv = [y + 52, y + 112, y + 172, y + 232];
  s1 += L(x + 70, y + 36, x + 70, y + h - 14, { stroke: GREY, sw: 3 });
  ['Surface', 'Level 1', 'Level 2', 'Level 3'].forEach((n, i) => {
    s1 += L(x + 70, lv[i], x + w - 20, lv[i], { stroke: GREY, sw: 2 }) + T(x + 10, lv[i] + 3, n, { size: 8.5, fill: GREY });
  });
  [[150, 1], [250, 1], [350, 1], [150, 2], [260, 2], [370, 2], [190, 3], [320, 3]].forEach(([bx, l]) => {
    s1 += `<circle cx="${x + bx}" cy="${lv[l]}" r="3.4" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`;
  });
  // helmets
  [[180, 1], [300, 1], [120, 2], [310, 2], [250, 3], [90, 0]].forEach(([hx, l]) => { s1 += `<circle cx="${x + hx}" cy="${lv[l]}" r="6" fill="${INK}"/>`; });
  s1 += `<circle cx="${x + 370}" cy="${lv[2]}" r="11" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="${x + 370}" cy="${lv[2]}" r="6" fill="${INK}"/>`;
  s1 += T(x + 10, y + h - 8, 'Dots are beacons. Each filled circle is a helmet. A ring means an alarm.', { size: 8, fill: GREY });
  s1 += badge(2, x + w - 20, y + 16);
  s1 += badge(1, 166, 48);
  // alarms
  const ax = 444, aw = 224;
  s1 += R(ax, y, aw, h) + T(ax + 10, y + 16, 'ALARMS', { size: 8, fill: GREY, ls: 1.2 }) + badge(3, ax + aw - 18, y + 16);
  [['SOS', 'Peter Dlamini', 'Level 2, west tunnel', '10:42'], ['Fall', 'Sipho Mokoena', 'Level 1, station', '10:31'], ['Helmet off', 'Thabo Nkosi', 'Level 3, east tunnel', '10:12']].forEach((r, i) => {
    const ry = y + 30 + i * 80;
    s1 += R(ax + 8, ry, aw - 16, 70, { fill: i === 0 ? SOFT : '#fff', stroke: i === 0 ? INK : LINE, sw: i === 0 ? 1.6 : 1 });
    s1 += ic('alarm', ax + 28, ry + 22, 0.9) + T(ax + 46, ry + 20, r[0], { bold: true, size: 10 }) + T(ax + aw - 18, ry + 20, r[3], { anchor: 'end', size: 9, fill: GREY });
    s1 += T(ax + 18, ry + 42, r[1], { size: 9.5 }) + T(ax + 18, ry + 57, r[2], { size: 8.5, fill: GREY });
  });
}
s1 = svg(s1, H1);

/* screen 2: helmet and trail */
const H2 = 420;
let s2 = frame(H2);
{
  s2 += R(12, 42, 200, 366) + R(20, 50, 184, 22, { fill: SOFT }) + ic('search', 34, 61, 0.55) + T(46, 65, 'Find a person or helmet', { size: 8.5, fill: GREY });
  [['Peter Dlamini', 'Level 2, west tunnel  10:42', 1, true], ['Sipho Mokoena', 'Level 1, station  10:31', 1, false], ['Thabo Nkosi', 'Level 3, east tunnel  10:12', 0, false], ['Lerato Khumalo', 'Shaft station  10:40', 1, false], ['Johan Botha', 'Surface gate  10:38', 1, false], ['Mpho Sithole', 'Level 1, west tunnel  10:41', 1, false]].forEach((r, i) => {
    const ry = 82 + i * 52;
    s2 += R(20, ry, 184, 46, { fill: r[3] ? SOFT : '#fff', stroke: r[3] ? INK : LINE, sw: r[3] ? 1.6 : 1 }) + dot(32, ry + 16, !!r[2]) + T(44, ry + 19, r[0], { bold: true, size: 9.5 }) + T(32, ry + 36, r[1], { size: 8, fill: GREY });
  });
  s2 += badge(1, 196, 90);
  const x = 224;
  s2 += R(x, 42, 444, 366) + T(x + 14, 66, 'Peter Dlamini', { bold: true, size: 14 }) + T(x + 14, 82, 'Helmet 866652020618592', { size: 8.5, fill: GREY });
  s2 += R(x + 250, 52, 56, 24, { fill: SOFT }) + dot(x + 262, 64) + T(x + 270, 67, 'Online', { size: 8 });
  s2 += R(x + 312, 52, 60, 24, { fill: SOFT }) + ic('battery', x + 326, 64, 0.55) + T(x + 338, 67, '78%', { size: 8 });
  s2 += R(x + 378, 52, 56, 24, { fill: SOFT }) + T(x + 386, 67, '10:42', { size: 8 });
  s2 += T(x + 14, 112, 'WHERE THIS WORKER HAS BEEN TODAY', { size: 8, fill: GREY, ls: 1.2 });
  const rows = [['08:03', 'Surface gate', ''], ['08:20', 'Shaft station', ''], ['08:31', 'Level 1, station', ''], ['09:05', 'Level 2, east tunnel', 'sent 09:58'], ['09:40', 'Level 2, west tunnel', 'sent 09:58'], ['10:42', 'Level 2, west tunnel', 'last seen']];
  rows.forEach((r, i) => {
    const ry = 134 + i * 44;
    if (i < rows.length - 1) s2 += L(x + 70, ry, x + 70, ry + 44, { stroke: INK, sw: 1.4 });
    s2 += T(x + 14, ry + 4, r[0], { size: 9.5, bold: true }) + dot(x + 70, ry, i === rows.length - 1) + T(x + 86, ry + 4, r[1], { size: 10 });
    if (r[2] === 'sent 09:58') s2 += R(x + 230, ry - 9, 66, 18, { fill: MID, stroke: GREY }) + T(x + 263, ry + 3, r[2], { size: 8, anchor: 'middle' });
    if (r[2] === 'last seen') s2 += R(x + 230, ry - 9, 66, 18, { fill: INK, stroke: INK }) + T(x + 263, ry + 3, r[2], { size: 8, anchor: 'middle', fill: '#fff', bold: true });
  });
  s2 += badge(2, x + 226, 108) + badge(3, x + 308, 270);
  const m = minimap(x + 320, 100, 110, 290);
  s2 += T(x + 320, 96, 'ON THE LAYOUT', { size: 7.5, fill: GREY, ls: 1 }) + m.s;
  s2 += `<path d="M${x + 348},${m.lv[0]} L${x + 348},${m.lv[1]} L${x + 348},${m.lv[2]} L${x + 392},${m.lv[2]}" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="1 0"/><circle cx="${x + 392}" cy="${m.lv[2]}" r="5" fill="${INK}"/>` + badge(4, x + 420, 96);
}
s2 = svg(s2, H2);

/* screen 3: alarm and missing person */
const H3 = 410;
let s3 = frame(H3, 'Server connected   10:42');
{
  s3 += R(12, 42, 656, 66, { fill: INK, stroke: INK }) + ic('alarm', 38, 75, 1.4).replace(new RegExp(INK, 'g'), '#fff');
  s3 += T(66, 66, 'SOS from Peter Dlamini', { fill: '#fff', bold: true, size: 15 }) + T(66, 88, 'Last place: Level 2, west tunnel at 10:42', { fill: '#cfd1d4', size: 9.5 });
  s3 += R(470, 62, 90, 28, { fill: '#fff', stroke: '#fff' }) + T(515, 80, 'Acknowledge', { anchor: 'middle', bold: true, size: 9 });
  s3 += R(568, 62, 90, 28, { fill: INK, stroke: '#fff' }) + T(613, 80, 'Open trail', { anchor: 'middle', bold: true, size: 9, fill: '#fff' });
  s3 += badge(1, 22, 52);
  // last seen card
  s3 += R(12, 120, 212, 278) + T(24, 140, 'LAST SEEN', { size: 8, fill: GREY, ls: 1.2 });
  [['Place', 'Level 2, west tunnel'], ['Time', '10:42'], ['Signal lost', '10:44'], ['Battery', '78%'], ['Speed', 'Not moving for 3 minutes']].forEach((r, i) => {
    s3 += T(24, 164 + i * 36, r[0], { size: 8, fill: GREY }) + T(24, 178 + i * 36, r[1], { size: 10, bold: i < 2 });
    s3 += L(24, 186 + i * 36, 212, 186 + i * 36);
  });
  s3 += badge(2, 208, 132);
  // nearby card
  s3 += R(236, 120, 212, 278) + T(248, 140, 'WHO WAS NEAR THIS BEACON', { size: 8, fill: GREY, ls: 1.2 });
  [['Mpho Sithole', '10:38 to 10:41'], ['Thabo Nkosi', '10:20 to 10:30'], ['Lerato Khumalo', '10:05 to 10:15']].forEach((r, i) => {
    const ry = 154 + i * 52;
    s3 += R(246, ry, 192, 44, {}) + dot(260, ry + 22) + T(274, ry + 19, r[0], { bold: true, size: 9.5 }) + T(274, ry + 34, r[1], { size: 8.5, fill: GREY });
  });
  s3 += R(246, 318, 192, 70, { fill: SOFT, dash: true }) + T(342, 336, 'DANGER ZONE CHECK', { size: 8, anchor: 'middle', fill: GREY, ls: 1 }) + T(342, 356, 'Face zone entered 10:30', { size: 9.5, anchor: 'middle', bold: true }) + T(342, 372, 'Blast planned 11:00', { size: 8.5, anchor: 'middle', fill: GREY });
  s3 += badge(3, 432, 132);
  // layout card
  s3 += R(460, 120, 208, 278) + T(472, 140, 'THE WAY HE CAME', { size: 8, fill: GREY, ls: 1.2 });
  const m = minimap(472, 152, 184, 190);
  s3 += m.s + `<path d="M500,${m.lv[0]} L500,${m.lv[2]} L610,${m.lv[2]}" fill="none" stroke="${INK}" stroke-width="2.4"/><circle cx="610" cy="${m.lv[2]}" r="12" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="610" cy="${m.lv[2]}" r="5.5" fill="${INK}"/>`;
  s3 += T(472, 362, 'Search a name or helmet to find', { size: 8.5, fill: GREY }) + T(472, 376, 'where anyone was last seen.', { size: 8.5, fill: GREY }) + badge(4, 646, 132);
}
s3 = svg(s3, H3);

/* screen 4: setup */
const H4 = 380;
let s4 = frame(H4, 'Setup');
{
  ['Beacons', 'Helmets', 'Server'].forEach((n, i) => {
    s4 += R(14 + i * 112, 42, 108, 28, { fill: i === 0 ? INK : '#fff', stroke: INK }) + T(68 + i * 112, 60, n, { anchor: 'middle', bold: true, size: 9.5, fill: i === 0 ? '#fff' : INK });
  });
  s4 += badge(1, 336, 56);
  s4 += R(556, 44, 112, 24, { fill: INK, stroke: INK }) + T(612, 60, 'Add a beacon', { anchor: 'middle', fill: '#fff', bold: true, size: 9 });
  const cols = [['BEACON ADDRESS', 24], ['NAME WE GIVE IT', 220], ['LEVEL', 400], ['AREA', 490]];
  s4 += R(12, 82, 656, 30, { fill: SOFT, stroke: LINE });
  cols.forEach(c => { s4 += T(c[1], 101, c[0], { size: 8, fill: GREY, ls: 1 }); });
  [['08:27:00:03:22:D3', 'W2 West tunnel', 'Level 2', 'West tunnel'], ['56:33:21:66:BF:01', 'S1 Shaft station', 'Level 1', 'Station'], ['CE:72:11:33:77:F7', 'E3 East tunnel', 'Level 3', 'East tunnel'], ['C2:51:11:38:41:F6', 'F1 Edge of face zone', 'Level 2', 'Face zone']].forEach((r, i) => {
    const ry = 112 + i * 34;
    s4 += L(12, ry + 34, 668, ry + 34);
    s4 += T(24, ry + 21, r[0], { size: 9 }) + T(220, ry + 21, r[1], { size: 9, bold: true }) + T(400, ry + 21, r[2], { size: 9 }) + T(490, ry + 21, r[3], { size: 9 });
  });
  s4 += badge(2, 656, 98);
  s4 += R(12, 262, 656, 106, { fill: SOFT, dash: true }) + T(24, 282, 'NEW BEACONS HEARD BY HELMETS, NOT NAMED YET', { size: 8, fill: GREY, ls: 1.2 });
  [['8D:1D:C4:95:E9:33', 'Heard by 3 helmets, strongest signal on Level 2'], ['E0:CA:04:D5:EB:42', 'Heard by 1 helmet on the surface']].forEach((r, i) => {
    const ry = 292 + i * 36;
    s4 += R(24, ry, 632, 30, {}) + T(36, ry + 19, r[0], { size: 9 }) + T(220, ry + 19, r[1], { size: 8.5, fill: GREY }) + R(580, ry + 5, 66, 20, { fill: INK, stroke: INK }) + T(613, ry + 18.5, 'Name it', { anchor: 'middle', fill: '#fff', bold: true, size: 8.5 });
  });
  s4 += badge(3, 652, 276);
}
s4 = svg(s4, H4);

const list = items => `<ol class="nt">${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
const box = (t, p) => `<div class="box"><b>${t}</b><p>${p}</p></div>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Smart Helmet: Control Room, First Version</title>
<link rel="stylesheet" href="style3.css">
<style>
  body { font-size: 10pt; line-height: 1.4; }
  table { font-size: 9.4pt; }
  .band h1 { font-size: 22pt; }
  .band { padding: 9mm 19mm 6mm; margin-bottom: 4mm; }
  .band .sub { margin-bottom: 4mm; }
  .band .meta { gap: 6mm; font-size: 8.6pt; flex-wrap: nowrap; white-space: nowrap; }
  h2 { margin: 10px 0 5px; padding-top: 7px; }
  table td, table th { padding: 5.5px 9px; }
  .content { padding-bottom: 10mm; }
  .pg { page-break-before: always; padding: 16mm 19mm 0; }
  .box { border: 1px solid #b9bbbe; padding: 8px 12px; margin: 8px 0; font-size: 10pt; }
  .box b, .col b { font-size: 8.3pt; letter-spacing: .1em; text-transform: uppercase; color: #5d6167; }
  .box p { margin: 3px 0; }
  .box.dark { background: #17181a; color: #fff; border-color: #17181a; }
  .box.dark b { color: #fff; }
  .lead { color: #5d6167; margin: 2px 0 8px; }
  .cols { display: flex; gap: 10px; margin: 8px 0; }
  .col { flex: 1; border-top: 1px solid #17181a; padding-top: 5px; font-size: 9.6pt; }
  .col ul { margin: 4px 0 0; padding-left: 16px; }
  .col li { margin: 3px 0; }
  .dg { margin: 6px 0 8px; }
  ol.nt { margin: 4px 0 0; padding-left: 0; list-style: none; font-size: 9.6pt; }
  ol.nt li { margin: 5px 0; padding-left: 26px; position: relative; counter-increment: n; }
  ol.nt li::before { content: counter(n); position: absolute; left: 0; top: 1px; width: 16px; height: 16px; border-radius: 50%; background: #17181a; color: #fff; font-size: 8.5pt; font-weight: 700; text-align: center; line-height: 16px; }
  ol.nt { counter-reset: n; }
  .tag { display: inline-block; border: 1px solid #17181a; padding: 1px 8px; font-size: 8.5pt; font-weight: 700; margin-bottom: 4px; }
</style>
</head><body>

<div class="band">
  <img class="logo" src="logo-white.svg" alt="90Ten Group">
  <h1 style="margin-top:7mm">Smart Helmet: Control Room, First Version</h1>
  <p class="sub">A wireframe of the first version of our software. A rough layout to agree on before we build.</p>
  <div class="meta">
    <span>Prepared for <b>Thella Group Services and Imperium Corporate</b></span>
    <span>Prepared by <b>90Ten Group</b></span>
    <span>20 October 2026</span>
    <span>Version 1</span>
  </div>
</div>

<div class="content">
<h2>What the first version will do</h2>
<p class="lead">One goal: show that a helmet can report to our own server and that the control room can see where a worker was and when.</p>
<div class="cols">
  <div class="col"><b>It will show</b><ul><li>Which helmets are online</li><li>Where each worker was last seen</li><li>The trail of beacons they passed with the time</li><li>Alarms such as SOS or a fall</li><li>The battery level</li></ul></div>
  <div class="col"><b>It will use</b><ul><li>A sample helmet that reports to our server</li><li>The helmet's own report: battery and the beacons it hears with the time</li><li>A name we give each beacon such as "Level 2, west tunnel"</li></ul></div>
  <div class="col"><b>Not in this version</b><ul><li>Video and photos</li><li>Voice calls</li><li>Sending updates to helmets</li><li>Reports and many mines</li></ul></div>
</div>
<h2>The four screens</h2>
<table class="q"><thead><tr><th>No.</th><th>Screen</th><th>The question it answers</th></tr></thead>
<tr><td class="n">1</td><td class="qq">Overview</td><td>Is everyone fine right now? What needs attention?</td></tr>
<tr><td class="n">2</td><td class="qq">One worker</td><td>Where has this worker been today and when?</td></tr>
<tr><td class="n">3</td><td class="qq">Alarm and missing person</td><td>Where was this worker last seen and who was near?</td></tr>
<tr><td class="n">4</td><td class="qq">Setup</td><td>How do we name the beacons and connect the helmets?</td></tr>
</table>
<div class="box dark"><b>How to read the drawings</b><p>These are rough layouts only. They show what goes where and not the final look. Names and times are sample data. Numbers in black circles are explained under each drawing.</p></div>
</div>

<div class="pg">
<h2>Screen 1: Overview</h2>
<p class="lead">The first thing the control room sees. It answers: is everyone fine and what needs attention?</p>
<div class="dg">${s1}</div>
${list(['Four numbers at the top. A glance shows if anything is wrong.', 'The mine layout with levels. Each filled circle is a helmet and a ring is an alarm. The layout is drawn once for each mine.', 'The alarms list. The newest alarm is at the top. Tapping one opens screen 3.'])}
</div>

<div class="pg">
<h2>Screen 2: One worker</h2>
<p class="lead">Pick a worker to see where they have been today. This is the trail we get from the beacons.</p>
<div class="dg">${s2}</div>
${list(['A list of workers with a search box. A filled dot means the helmet is online. An empty dot means it has not been seen.', 'The trail. Each line is a beacon the worker passed with the time. The last line is where they were last seen.', 'A grey tag means the helmet saved this while it had no signal and sent it later. This is the "save and send later" idea. It depends on question 5.', 'The same trail drawn on the mine layout.'])}
</div>

<div class="pg">
<h2>Screen 3: Alarm and missing person</h2>
<p class="lead">What opens when an alarm comes in. It is also what the control room uses to find someone who has not come out.</p>
<div class="dg">${s3}</div>
${list(['The alarm bar. Who it is and where they were last seen. Two buttons: acknowledge or open the trail.', 'The last seen card. The place and the time the helmet last reported and when the signal was lost.', 'Who was near the same beacon in the last half hour. They can be called first. The danger zone check shows if the worker was in the face zone near blast time. It depends on question 7.', 'The way the worker came on the mine layout. The search at the bottom finds anyone by name.'])}
</div>

<div class="pg">
<h2>Screen 4: Setup</h2>
<p class="lead">Where we tell the system what each beacon is. It is done once for each mine.</p>
<div class="dg">${s4}</div>
${list(['Three tabs: beacons and helmets and the server. The server tab shows the address the helmets report to, which is our own.', 'The beacon list. Each beacon has an address that the helmet reports. We give it a name and say which level and area it is in.', 'New beacons that helmets hear appear here with a button to name them. A walk through the mine finds them all. Phones and speakers show up too and can be ignored.'])}
<div class="box dark"><b>What this first version depends on</b><p>A sample helmet and its admin login on the supplier's platform so we can point it to our server. The answers to questions 1 and 4 on beacons. Question 3 on the map. Everything else in this document can be built from the Interface Document.</p></div>
</div>

<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'doc8.html'), html);
console.log('wrote doc8.html ' + html.length);
