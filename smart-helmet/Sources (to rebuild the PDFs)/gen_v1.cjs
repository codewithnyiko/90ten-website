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
let s1 = frame(H1) + tile(12, 'WORKERS ON SHIFT', '24') + tile(176, 'ALARMS', '2') + tile(340, 'NOT SEEN FOR 5 MINUTES', '1') + tile(504, 'LOW BATTERY', '3');
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
  [['Start recording', 0, 0], ['Stop recording', 1, 0], ['Join Wi-Fi', 2, 0]].forEach(([n, c, r]) => {
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
  s6 += R(12, 82, 330, 30, { fill: SOFT }) + T(24, 101, 'DEVICE NUMBER', { size: 8, fill: GREY, ls: 1 }) + T(150, 101, 'ISSUED TO', { size: 8, fill: GREY, ls: 1 }) + T(270, 101, 'STATUS', { size: 8, fill: GREY, ls: 1 });
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
const list = items => '<ol class="nt">' + items.map(i => '<li>' + i + '</li>').join('') + '</ol>';
const box = (t, p) => '<div class="box"><b>' + t + '</b><p>' + p + '</p></div>';


const page = (title, lead, svgx, notes) => '<div class="pg">\n<h2>' + title + '</h2>\n<p class="lead">' + lead + '</p>\n<div class="dg">' + svgx + '</div>\n' + list(notes) + '\n</div>\n';
const sumTable = '<table class="q"><thead><tr><th>No.</th><th>Screen</th><th>What it does</th><th>When</th></tr></thead>' +
  [['1', 'Overview', 'Workers on shift and where they are on a map. Open alarms.', 'Version 1'],
   ['2', 'Sign in', 'At the lamp room we link a worker to a helmet for a shift.', 'Version 1'],
   ['3', 'Shift view', 'Who is seen and who is not. Helmets nobody signed for.', 'Version 1'],
   ['4', 'Headcount', 'Everyone signed in by where they were last seen. Mark people safe.', 'Version 1'],
   ['5', 'One worker', 'Their day and commands to the helmet.', 'Version 1'],
   ['6', 'Alarm and last seen', 'What happened and where and who is nearby.', 'Version 1'],
   ['7', 'Helmets and settings', 'Which helmets may log in. Alarm settings for each one.', 'Version 1'],
   ['8', 'Bluetooth test', 'Every Bluetooth device the helmets hear.', 'Version 1'],].map(r => '<tr><td class="n">' + r[0] + '</td><td class="qq">' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>').join('') + '</table>';

const out = "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><title>Smart Helmet: What We Can Achieve Now, Version 2</title>\n<link rel=\"stylesheet\" href=\"style3.css\">\n<style>\n  body { font-size: 10pt; line-height: 1.4; }\n  table { font-size: 9.4pt; }\n  .band h1 { font-size: 22pt; }\n  .band { padding: 9mm 19mm 6mm; margin-bottom: 4mm; }\n  .band .sub { margin-bottom: 4mm; }\n  .band .meta { gap: 6mm; font-size: 8.6pt; flex-wrap: nowrap; white-space: nowrap; }\n  h2 { margin: 10px 0 5px; padding-top: 7px; }\n  table td, table th { padding: 5.5px 9px; }\n  .content { padding-bottom: 10mm; }\n  .pg { page-break-before: always; padding: 16mm 19mm 0; }\n  .box { border: 1px solid #b9bbbe; padding: 8px 12px; margin: 8px 0; font-size: 10pt; }\n  .box b, .col b { font-size: 8.3pt; letter-spacing: .1em; text-transform: uppercase; color: #5d6167; }\n  .box p { margin: 3px 0; }\n  .box.dark { background: #17181a; color: #fff; border-color: #17181a; }\n  .box.dark b { color: #fff; }\n  .lead { color: #5d6167; margin: 2px 0 8px; }\n  .cols { display: flex; gap: 10px; margin: 8px 0; }\n  .col { flex: 1; border-top: 1px solid #17181a; padding-top: 5px; font-size: 9.6pt; }\n  .col ul { margin: 4px 0 0; padding-left: 16px; }\n  .col li { margin: 3px 0; }\n  .dg { margin: 6px 0 8px; }\n  ol.nt { margin: 4px 0 0; padding-left: 0; list-style: none; font-size: 9.6pt; }\n  ol.nt li { margin: 5px 0; padding-left: 26px; position: relative; counter-increment: n; }\n  ol.nt li::before { content: counter(n); position: absolute; left: 0; top: 1px; width: 16px; height: 16px; border-radius: 50%; background: #17181a; color: #fff; font-size: 8.5pt; font-weight: 700; text-align: center; line-height: 16px; }\n  ol.nt { counter-reset: n; }\n  .tag { display: inline-block; border: 1px solid #17181a; padding: 1px 8px; font-size: 8.5pt; font-weight: 700; margin-bottom: 4px; }\n</style>\n</head><body>\n\n<div class=\"band\">\n  <img class=\"logo\" src=\"logo-white.svg\" alt=\"90Ten Group\">\n  <h1 style=\"margin-top:7mm\">Smart Helmet: What We Can Achieve Now</h1>\n  <p class=\"sub\">Wireframes of what we can build now. Workers are linked to helmets and shifts.</p>\n  <div class=\"meta\">\n    <span>Prepared for <b>Thella Group Services and Imperium Corporate</b></span>\n    <span>Prepared by <b>90Ten Group</b></span>\n    <span>20 October 2026</span>\n    <span>Version 2</span>\n  </div>\n</div>\n\n" + '<div class="content">\n' +
'<h2>What we can build now</h2>\n<p class="lead">We say worker on the screens. The helmet is the device the worker carries. A worker and a helmet are linked for one shift at a time. Names and times are sample data.</p>\n' + sumTable +
'<div class="cols"><div class="col"><b>Not here yet</b><ul><li>The underground trail</li><li>Data saved with no signal</li><li>Fences</li><li>Live video and calls</li></ul></div><div class="col"><b>Ideas for later</b><ul><li>Face check at sign in</li><li>Attendance and daily reports</li><li>Visitors and contractors</li><li>A message to all helmets</li></ul></div></div>\n' +
'</div>\n' +
page('Screen 1: Overview', 'The first thing the control room sees.', s1, ['Four numbers at the top. Workers on shift means signed in with a helmet.', 'The site map. Each filled circle is a worker and a ring is an alarm. Positions come from the helmet GPS.', 'The alarms list. The newest is at the top.']) +
page('Screen 2: Sign in', 'At the lamp room we link a worker to a helmet for this shift. The link is our own record.', s8, ['Find the worker by name or employee number. We load the worker list once from the mine.', 'Type or scan the helmet number. The screen shows if the helmet is seen now and its battery. Both come from the helmet report (pp15 to 18). The report also says if the helmet is worn so we can show that too.', 'Pick the shift and the section.', 'Sign in links this worker and this helmet for this shift. Return ends the link when the helmet comes back.', 'Everyone signed in today. The same helmet can go to another worker on the next shift and the history keeps who had it.']) +
page('Screen 3: Shift view', 'Who is seen and who is not. This is where the control room finds problems early.', s9, ['Pick the shift.', 'Workers signed in whose helmet reported in the last 5 minutes. A worn check shows a helmet that is not on the head.', 'Workers signed in whose helmet has not reported. We show the last place and the time. Underground the helmet may simply have no signal so this is a prompt to check and not an alarm.', 'A helmet that reports but nobody is signed in to it. We can link it to a worker on the spot.', 'Workers who handed their helmet back.']) +
page('Screen 4: Headcount', 'For a muster or an evacuation. It shows everyone signed in by where they were last seen.', s10, ['The numbers and a button to print the list.', 'Groups by the place each worker was last seen. The last group is people we have not seen.', 'The workers in the chosen group with the time they were last seen.', 'A supervisor ticks each person as safe at the muster point.']) +
page('Screen 5: One worker', 'Pick a worker to see their day and to send the helmet a command.', s2n, ['A list of workers with a search box. A filled dot means the helmet is seen.', 'Where the worker has been today with the time.', 'The same route on the map.', 'Commands in v1.00: start or stop recording and join a Wi-Fi network (pp27 and 42). Photos and messages need our file server so they come later.']) +
page('Screen 6: Alarm and last seen', 'What opens when an alarm comes in.', s3, ['The alarm bar with two buttons.', 'The last seen card with place and time and battery.', 'Who is close to the worker by GPS. The dashed box shows what comes later.', 'The way the worker came on the map.']) +
page('Screen 7: Helmets and settings', 'Which helmets may log in and how each one behaves.', s6, ['Add a helmet by its device number.', 'Only helmets in the list can log in. The document has no password so this is our own check (p10). The list also shows who each helmet is issued to.', 'Settings from the helmet start-up reply: alarm temperature and helmet off delay and no movement time and picture quality and beacon scanning and positioning and video upload (pp6 and 7).', 'The helmet reads these when it switches on so a change reaches it at the next start-up (p3).']) +
page('Screen 8: Bluetooth test', 'Every Bluetooth device the helmets hear. This is how we find out which beacons work.', s4, ['The tabs. The beacons tab is for the next version.', 'Every Bluetooth device the helmets hear with signal strength (p15).', 'How we use it: put a real beacon beside a helmet and see if it shows up.']) +
'<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>\n</body></html>';
fs.writeFileSync(path.join(dir, 'doc18.html'), out);
console.log('wrote doc18.html ' + out.length);
