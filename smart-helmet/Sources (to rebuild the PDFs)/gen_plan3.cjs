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
  monitor: '<rect x="-12" y="-10" width="24" height="15" rx="1.5"/><path d="M0,5 V10 M-6,10 H6"/>',
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


const nd = (type, x, y, label, sub, o = {}) => {
  const w = o.w || 112, h = 66;
  return R(x - w / 2, y - h / 2, w, h, { fill: o.dash ? SOFT : '#fff', stroke: o.dash ? GREY : LINE, dash: !!o.dash, sw: o.thick ? 1.8 : 1 }) + ic(type, x, y - 12, 0.9) +
    T(x, y + 11, label, { anchor: 'middle', bold: true, size: 9.5, fill: o.dash ? GREY : INK }) + T(x, y + 23, sub, { anchor: 'middle', size: 8, fill: GREY });
};
const ar = (x1, y1, x2, y2, o = {}) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + INK + '" stroke-width="1.4"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + ' marker-end="url(#ARR)"' + (o.both ? ' marker-start="url(#ARR)"' : '') + '/>';
let sd = '<defs><marker id="ARR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9" fill="none" stroke="' + INK + '" stroke-width="1.5"/></marker></defs>';
sd += R(0.5, 0.5, 679, 289, { rx: 4, stroke: LINE });
sd += '<rect x="1" y="1" width="200" height="288" fill="' + SOFT + '"/>' + T(12, 18, 'IN THE FIELD', { size: 8, fill: GREY, ls: 1.2 });
sd += '<rect x="201" y="1" width="478" height="288" fill="#fff"/>' + T(213, 18, 'SERVERS', { size: 8, fill: GREY, ls: 1.2 });
sd += nd('helmet', 100, 150, 'Helmet', 'sample helmet', { thick: true });
sd += nd('server', 330, 62, 'Supplier address server', 'in China, only answers (not ours)', { w: 150 });
sd += nd('server', 330, 150, 'Our live server', 'in South Africa', { w: 150, thick: true });
sd += nd('server', 330, 244, 'Supplier platform', 'no longer used', { w: 150, dash: true });
sd += nd('server', 500, 150, 'Our database', 'in South Africa', { w: 110 });
sd += nd('monitor', 625, 150, 'Control room', 'screens', { w: 80 });
sd += ar(150, 130, 255, 76, { both: true });
sd += T(102, 62, '1 Where do I report?', { size: 8.5, bold: true }) + T(102, 75, '2 Report to our server', { size: 8.5, bold: true });
sd += ar(156, 150, 253, 150) + T(205, 142, '3 reports', { size: 8.5, bold: true, anchor: 'middle' });
sd += ar(405, 150, 445, 150) + ar(555, 150, 585, 150);
sd += ar(150, 172, 253, 232, { dash: true }) + T(150, 224, 'not used', { size: 8, fill: GREY });
const dgPlan = svg(sd, 290);

/* surface map placeholder */
const sitemap = (x, y, w, h) => {
  let s = R(x, y, w, h, { fill: SOFT });
  s += `<rect x="${x + 14}" y="${y + 18}" width="${w - 28}" height="${h - 36}" rx="6" fill="none" stroke="${GREY}" stroke-dasharray="6 4"/>`;
  s += L(x + 10, y + h * 0.55, x + w - 10, y + h * 0.4, { stroke: MID, sw: 6 }) + L(x + w * 0.45, y + 8, x + w * 0.5, y + h - 8, { stroke: MID, sw: 6 });
  [[0.18, 0.3, 'Main gate'], [0.62, 0.28, 'Shaft 1'], [0.74, 0.72, 'Shaft 2'], [0.3, 0.76, 'Plant']].forEach(([fx, fy, n]) => {
    s += `<rect x="${x + w * fx - 5}" y="${y + h * fy - 5}" width="10" height="10" fill="#fff" stroke="${INK}" stroke-width="1.2"/>` + T(x + w * fx + 9, y + h * fy + 3, n, { size: 8, fill: GREY });
  });
  return s;
};
const mk = (px, py, ring = false) => (ring ? `<circle cx="${px}" cy="${py}" r="11" fill="none" stroke="${INK}" stroke-width="2"/>` : '') + `<circle cx="${px}" cy="${py}" r="6" fill="${INK}"/>`;

/* screen 1: overview */
const H1 = 400;
const tile = (x, label, val) => R(x, 42, 152, 50, {}) + T(x + 10, 58, label, { size: 8, fill: GREY }) + T(x + 10, 82, val, { size: 18, bold: true });
let s1 = frame(H1) + tile(12, 'HELMETS ONLINE', '24') + tile(176, 'ALARMS', '2') + tile(340, 'NOT SEEN FOR 5 MINUTES', '1') + tile(504, 'BATTERY LOW', '3');
{
  const x = 12, y = 104, w = 420, h = 284;
  s1 += sitemap(x, y, w, h) + T(x + 12, y + 14, 'MAP', { size: 8, fill: GREY, ls: 1.2 });
  [[0.22, 0.42], [0.35, 0.6], [0.55, 0.36], [0.68, 0.5], [0.8, 0.62], [0.28, 0.26], [0.5, 0.74]].forEach(([fx, fy]) => { s1 += mk(x + w * fx, y + h * fy); });
  s1 += mk(x + w * 0.76, y + h * 0.78, true);
  s1 += T(x + 12, y + h - 6, 'Each filled circle is a helmet. A ring means an alarm. Positions come from the helmet GPS.', { size: 8, fill: GREY });
  s1 += badge(2, x + w - 20, y + 16) + badge(1, 166, 48);
  const ax = 444, aw = 224;
  s1 += R(ax, y, aw, h) + T(ax + 10, y + 16, 'ALARMS', { size: 8, fill: GREY, ls: 1.2 }) + badge(3, ax + aw - 18, y + 16);
  [['SOS', 'Peter Dlamini', 'Near Shaft 2', '10:42'], ['Fall', 'Sipho Mokoena', 'Near the plant', '10:31'], ['Helmet off', 'Thabo Nkosi', 'Near the main gate', '10:12']].forEach((r, i) => {
    const ry = y + 30 + i * 80;
    s1 += R(ax + 8, ry, aw - 16, 70, { fill: i === 0 ? SOFT : '#fff', stroke: i === 0 ? INK : LINE, sw: i === 0 ? 1.6 : 1 });
    s1 += ic('alarm', ax + 28, ry + 22, 0.9) + T(ax + 46, ry + 20, r[0], { bold: true, size: 10 }) + T(ax + aw - 18, ry + 20, r[3], { anchor: 'end', size: 9, fill: GREY });
    s1 += T(ax + 18, ry + 42, r[1], { size: 9.5 }) + T(ax + 18, ry + 57, r[2], { size: 8.5, fill: GREY });
  });
}
s1 = svg(s1, H1);

/* screen 2: one worker */
const H2 = 420;
let s2 = frame(H2);
{
  s2 += R(12, 42, 200, 366) + R(20, 50, 184, 22, { fill: SOFT }) + ic('search', 34, 61, 0.55) + T(46, 65, 'Find a person or helmet', { size: 8.5, fill: GREY });
  [['Peter Dlamini', 'Near Shaft 2  10:42', 1, true], ['Sipho Mokoena', 'Near the plant  10:31', 1, false], ['Thabo Nkosi', 'Near the main gate  10:12', 0, false], ['Lerato Khumalo', 'Near Shaft 1  10:40', 1, false], ['Johan Botha', 'Near the main gate  10:38', 1, false], ['Mpho Sithole', 'Near Shaft 2  10:41', 1, false]].forEach((r, i) => {
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
  const rows = [['08:03', 'Main gate', ''], ['08:20', 'Near the plant', ''], ['08:31', 'Near Shaft 1', ''], ['09:05', 'Near Shaft 2', ''], ['09:40', 'Near Shaft 2', ''], ['10:42', 'Near Shaft 2', 'last seen']];
  rows.forEach((r, i) => {
    const ry = 134 + i * 44;
    if (i < rows.length - 1) s2 += L(x + 70, ry, x + 70, ry + 44, { stroke: INK, sw: 1.4 });
    s2 += T(x + 14, ry + 4, r[0], { size: 9.5, bold: true }) + dot(x + 70, ry, i === rows.length - 1) + T(x + 86, ry + 4, r[1], { size: 10 });
    if (r[2] === 'last seen') s2 += R(x + 190, ry - 9, 66, 18, { fill: INK, stroke: INK }) + T(x + 223, ry + 3, r[2], { size: 8, anchor: 'middle', fill: '#fff', bold: true });
  });
  s2 += badge(2, x + 226, 108) + badge(3, x + 270, 268);
  s2 += T(x + 290, 96, 'ON THE MAP', { size: 7.5, fill: GREY, ls: 1 }) + sitemap(x + 290, 102, 140, 288);
  s2 += `<path d="M${x + 310},170 L${x + 340},200 L${x + 370},230 L${x + 400},300" fill="none" stroke="${INK}" stroke-width="2"/>` + mk(x + 400, 300) + badge(4, x + 420, 96);
}
s2 = svg(s2, H2);

/* screen 3: alarm and last seen */
const H3 = 410;
let s3 = frame(H3);
{
  s3 += R(12, 42, 656, 66, { fill: INK, stroke: INK }) + ic('alarm', 38, 75, 1.4).replace(new RegExp(INK, 'g'), '#fff');
  s3 += T(66, 66, 'SOS from Peter Dlamini', { fill: '#fff', bold: true, size: 15 }) + T(66, 88, 'Last place: near Shaft 2 at 10:42', { fill: '#cfd1d4', size: 9.5 });
  s3 += R(470, 62, 90, 28, { fill: '#fff', stroke: '#fff' }) + T(515, 80, 'Acknowledge', { anchor: 'middle', bold: true, size: 9 });
  s3 += R(568, 62, 90, 28, { fill: INK, stroke: '#fff' }) + T(613, 80, 'Open trail', { anchor: 'middle', bold: true, size: 9, fill: '#fff' });
  s3 += badge(1, 22, 52);
  s3 += R(12, 120, 212, 278) + T(24, 140, 'LAST SEEN', { size: 8, fill: GREY, ls: 1.2 });
  [['Place', 'Near Shaft 2'], ['Time', '10:42'], ['Last report', '10:42'], ['Battery', '78%'], ['Movement', 'Not moving for 3 minutes']].forEach((r, i) => {
    s3 += T(24, 164 + i * 36, r[0], { size: 8, fill: GREY }) + T(24, 178 + i * 36, r[1], { size: 10, bold: i < 2 });
    s3 += L(24, 186 + i * 36, 212, 186 + i * 36);
  });
  s3 += badge(2, 208, 132);
  s3 += R(236, 120, 212, 278) + T(248, 140, 'WHO IS NEARBY', { size: 8, fill: GREY, ls: 1.2 });
  [['Mpho Sithole', '40 m away  10:41'], ['Lerato Khumalo', '120 m away  10:40'], ['Johan Botha', '300 m away  10:38']].forEach((r, i) => {
    const ry = 154 + i * 52;
    s3 += R(246, ry, 192, 44, {}) + dot(260, ry + 22) + T(274, ry + 19, r[0], { bold: true, size: 9.5 }) + T(274, ry + 34, r[1], { size: 8.5, fill: GREY });
  });
  s3 += R(246, 318, 192, 70, { fill: SOFT, dash: true }) + T(342, 338, 'NEXT VERSION', { size: 8, anchor: 'middle', fill: GREY, ls: 1 }) + T(342, 356, 'Underground trail from beacons', { size: 9, anchor: 'middle', bold: true }) + T(342, 372, 'once we know which beacons work', { size: 8.5, anchor: 'middle', fill: GREY });
  s3 += badge(3, 432, 132);
  s3 += R(460, 120, 208, 278) + T(472, 140, 'ON THE MAP', { size: 8, fill: GREY, ls: 1.2 });
  s3 += sitemap(472, 152, 184, 190) + `<path d="M500,190 L530,230 L570,260 L610,290" fill="none" stroke="${INK}" stroke-width="2.4"/>` + mk(610, 290, true);
  s3 += T(472, 362, 'Search a name or helmet to find', { size: 8.5, fill: GREY }) + T(472, 376, 'where anyone was last seen.', { size: 8.5, fill: GREY }) + badge(4, 646, 132);
}
s3 = svg(s3, H3);

/* screen 4: setup and bluetooth test */
const H4 = 400;
let s4 = frame(H4, 'Setup');
{
  [['Helmets', 0, false], ['Bluetooth test', 1, true], ['Server', 2, false]].forEach(([n, i, on]) => {
    s4 += R(14 + i * 126, 42, 122, 28, { fill: on ? INK : '#fff', stroke: INK }) + T(75 + i * 126, 60, n, { anchor: 'middle', bold: true, size: 9.5, fill: on ? '#fff' : INK });
  });
  s4 += R(392, 42, 150, 28, { fill: '#fff', stroke: LINE, dash: true }) + T(467, 60, 'Beacons (next version)', { anchor: 'middle', size: 9, fill: GREY });
  s4 += badge(1, 560, 56);
  const cols = [['BEACON ADDRESS', 24], ['NAME IT SENDS', 190], ['SIGNAL', 360], ['LAST HEARD', 440], ['HEARD BY', 540]];
  s4 += R(12, 82, 656, 30, { fill: SOFT, stroke: LINE });
  cols.forEach(c => { s4 += T(c[1], 101, c[0], { size: 8, fill: GREY, ls: 1 }); });
  [['56:33:21:66:BF:01', 'C23106A.LS.BV02', '-44', '10:41', '1 helmet'], ['CE:72:11:33:77:F7', 'E09', '-58', '10:41', '1 helmet'], ['08:27:00:03:22:D3', 'TXBeacon', '-73', '10:40', '2 helmets'], ['C0:46:19:C8:03:3A', 'JBL WAVE FLEX-LE', '-86', '10:38', '1 helmet']].forEach((r, i) => {
    const ry = 112 + i * 34;
    s4 += L(12, ry + 34, 668, ry + 34);
    s4 += T(24, ry + 21, r[0], { size: 9 }) + T(190, ry + 21, r[1], { size: 9, bold: true }) + T(360, ry + 21, r[2], { size: 9 }) + T(440, ry + 21, r[3], { size: 9 }) + T(540, ry + 21, r[4], { size: 9 });
  });
  s4 += badge(2, 656, 98);
  s4 += R(12, 262, 656, 120, { fill: SOFT, dash: true }) + T(24, 282, 'HOW WE USE THIS', { size: 8, fill: GREY, ls: 1.2 });
  s4 += T(24, 304, 'Put a beacon next to a helmet and watch for it in this list.', { size: 10 }) + T(24, 322, 'If it appears the helmet can hear it. If it does not the helmet cannot use that beacon.', { size: 10 });
  s4 += T(24, 346, 'This answers question 4 by testing and does not depend on the supplier.', { size: 10, bold: true }) + T(24, 366, 'Phones and speakers show up too and can be ignored. The names above are the examples in the Interface Document.', { size: 8.5, fill: GREY });
  s4 += badge(3, 652, 276);
}
s4 = svg(s4, H4);

const list = items => `<ol class="nt">${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
const box = (t, p) => `<div class="box"><b>${t}</b><p>${p}</p></div>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Smart Helmet: Version 1 Plan and Wireframes</title>
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
  <h1 style="margin-top:7mm">Smart Helmet: Version 1 Plan and Wireframes</h1>
  <p class="sub">How our system gets the helmet data and replaces the supplier screens. What we build first and the screens we need.</p>
  <div class="meta">
    <span>Prepared for <b>Thella Group Services and Imperium Corporate</b></span>
    <span>Prepared by <b>90Ten Group</b></span>
    <span>20 October 2026</span>
    <span>Version 1</span>
  </div>
</div>

<div class="content">
<h2>Where we are today</h2>
<p class="lead">The helmet is set up by the supplier. When it switches on it asks the supplier's address server in China where to report and then sends everything there. Their control room screens are old and hard to use so we replace them. These are the steps to get the helmet's data to our own server.</p>
<table class="q"><thead><tr><th>Step</th><th>What happens</th><th>What we need</th></tr></thead>
<tr><td class="n">1</td><td class="qq"><b>Now: a pretend helmet.</b> We build our server and a pretend helmet that sends the same messages as the real one from the Interface Document. We can build and test everything while we wait.</td><td>Nothing from the supplier. We can start now.</td></tr>
<tr><td class="n">2</td><td class="qq"><b>A real helmet.</b> The helmet still asks the supplier's address server first. With the admin login we change the two addresses it gets back to ours. Then it reports to our server (Interface Document p3).</td><td>A sample helmet and its admin login.</td></tr>
<tr><td class="n">3</td><td class="qq"><b>Later: our own address server.</b> Camera models can be changed to ask our address server instead of the supplier's (Solution 2, pp3 and 4). We build one small page that answers with our two addresses. Nothing then goes to China for the address.</td><td>The steps for the two ways to change the address inside the helmet (question 1). After version 1.</td></tr>
</table>
<div class="box"><b>Easy to change</b><p>The helmet only needs two addresses. Going from step 2 to step 3 changes where the helmet asks for them. Our server and our screens stay the same. We want camera models and the document says step 3 works on those.</p></div>
<div class="box dark"><b>Version 1 is steps 1 and 2</b><p>It proves that our server can receive the helmet and that the control room can see where a worker is. Underground comes in version 2. Workers also need to be tracked on the surface so this is useful on its own.</p></div>
</div>

<div class="pg">
<h2>How our system works in version 1</h2>
<p class="lead">The helmet still asks the supplier where to report. The supplier's server only answers with our addresses. The reports go to us.</p>
<div class="dg">${dgPlan}</div>
<p class="lead">As far as we know nothing else goes to China. We will check this with a network test on the sample helmet.</p>
<h2>What we build and how we know it works</h2>
<table class="q"><thead><tr><th>No.</th><th>What we build</th><th>How we know it works</th></tr></thead>
<tr><td class="n">1</td><td class="qq">Our live server. It accepts the helmet's login and its report every 10 seconds.</td><td>The pretend helmet connects and its position appears in a log.</td></tr>
<tr><td class="n">2</td><td class="qq">The database. It keeps every report: position and battery and alarms and nearby Bluetooth devices.</td><td>The reports are still there after a restart.</td></tr>
<tr><td class="n">3</td><td class="qq">The control room screens on the next pages.</td><td>The pretend helmet moves on the map.</td></tr>
<tr><td class="n">4</td><td class="qq">Alarms.</td><td>An SOS from the pretend helmet shows on screens 1 and 3.</td></tr>
<tr><td class="n">5</td><td class="qq">The Bluetooth test list.</td><td>A real beacon beside a helmet appears in the list.</td></tr>
<tr><td class="n">6</td><td class="qq">Connect the real helmet.</td><td>Its position matches where it really is.</td></tr>
</table>
</div>

<div class="pg">
<h2>Screen 1: Overview</h2>
<p class="lead">The first thing the control room sees. It answers: is everyone fine and what needs attention?</p>
<div class="dg">${s1}</div>
${list(['Four numbers at the top. A glance shows if anything is wrong.', 'The map of the site. Each filled circle is a helmet and a ring is an alarm. Positions come from the helmet GPS so this works above ground only.', 'The alarms list. The newest alarm is at the top. Tapping one opens screen 3.'])}
</div>

<div class="pg">
<h2>Screen 2: One worker</h2>
<p class="lead">Pick a worker to see where they have been today from the helmet GPS.</p>
<div class="dg">${s2}</div>
${list(['A list of workers with a search box. A filled dot means the helmet is online. An empty dot means it has not been seen.', 'Where the worker has been today with the time. The last line is where they were last seen.', 'The black tag marks the last time the helmet reported.', 'The same route drawn on the map. The map depends on question 3 because the helmet may report positions in a Chinese map system.'])}
</div>

<div class="pg">
<h2>Screen 3: Alarm and last seen</h2>
<p class="lead">What opens when an alarm comes in. It is also how the control room finds out where someone was last seen.</p>
<div class="dg">${s3}</div>
${list(['The alarm bar. Who it is and where they were last seen. Two buttons: acknowledge or open the trail.', 'The last seen card. The place and the time and the battery. If a worker stops moving it says for how long.', 'Who is close to the worker by GPS. They can be called first. The dashed box shows what comes in the next version once the beacons are confirmed.', 'The way the worker came on the map. The search finds anyone by name.'])}
</div>

<div class="pg">
<h2>Screen 4: Setup and Bluetooth test</h2>
<p class="lead">Where we check which beacons the helmet can hear and where helmets report. This is how we find out what works before we build the underground part.</p>
<div class="dg">${s4}</div>
${list(['Tabs for helmets and the Bluetooth test and the server. The server tab shows the address the helmets report to, which is our own. The beacons tab is for the next version.', 'Every Bluetooth device the helmets hear with its signal strength. The helmet report lists all of them.', 'How we use it. We put a real beacon next to a helmet and see if it shows up. That tells us which beacons work.'])}
<div class="box dark"><b>What version 1 depends on</b><p>A sample helmet and its admin login on the supplier's platform so we can point it to our server. Question 3 on the map. The underground trail in the next version also depends on question 4 on beacons and the Bluetooth test on screen 4 can answer it. Everything else in this document can be built from the Interface Document.</p></div>
</div>

<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'doc12.html'), html);
console.log('wrote doc12.html ' + html.length);
