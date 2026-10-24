const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'pdf_build');
const INK = '#17181a', GREY = '#8a8e94', LINE = '#b9bbbe', BAND = '#eceded';

// line icons, drawn centred on 0,0
const icons = {
  beacon: '<circle r="3.5"/><path d="M-9,-6 A11 11 0 0 0 -9,6 M9,-6 A11 11 0 0 1 9,6 M-13,-9 A16 16 0 0 0 -13,9 M13,-9 A16 16 0 0 1 13,9"/>',
  helmet: '<path d="M-11,5 A11 11 0 0 1 11,5 Z M-14,5 H14"/><circle cx="0" cy="-2" r="2.4"/>',
  wifi: '<path d="M-11,-3 A15 15 0 0 1 11,-3 M-7,1 A9.5 9.5 0 0 1 7,1"/><circle cx="0" cy="6" r="1.8"/>',
  mast: '<path d="M0,-9 L-6,11 M0,-9 L6,11 M-4,3 H4 M-2.4,-3 H2.4"/><path d="M-9,-8 A9 9 0 0 0 -9,-1 M9,-8 A9 9 0 0 1 9,-1"/>',
  server: '<rect x="-11" y="-11" width="22" height="9" rx="1.5"/><rect x="-11" y="2" width="22" height="9" rx="1.5"/><path d="M-7,-6.5 H-3 M-7,6.5 H-3"/>',
  monitor: '<rect x="-12" y="-10" width="24" height="15" rx="1.5"/><path d="M0,5 V10 M-6,10 H6"/>',
  zone: '<path d="M-11,9 L0,-10 L11,9 Z M0,-3 V3"/><circle cx="0" cy="6" r="0.8"/>'
};
function node(type, x, y, label, sub, w = 88) {
  const h = 74;
  return `<g transform="translate(${x},${y})">
  <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="#fff" stroke="${LINE}"/>
  <g transform="translate(0,-14)" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icons[type]}</g>
  <text y="14" text-anchor="middle" font-size="10.5" font-weight="700" fill="${INK}">${label}</text>
  <text y="27" text-anchor="middle" font-size="9" fill="${GREY}">${sub || ''}</text></g>`;
}
function arrow(x1, y1, x2, y2, label, opts = {}) {
  const dash = opts.dash ? ' stroke-dasharray="5 4"' : '';
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (opts.ly || -7);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="1.4"${dash} marker-end="url(#ar)"/>` +
    (label ? `<text x="${mx}" y="${my}" text-anchor="middle" font-size="8.8" fill="${INK}">${label}</text>` : '');
}
let svgN = 0;
function svg(inner, h = 210) {
  const id = 'ar' + (++svgN);
  inner = inner.split('url(#ar)').join('url(#' + id + ')');
  return `<svg viewBox="0 0 680 ${h}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Calibri, Arial, sans-serif">
<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9" fill="none" stroke="${INK}" stroke-width="1.5"/></marker></defs>${inner}</svg>`;
}
function zones(split, h = 210) {
  return `<rect x="0" y="0" width="${split}" height="${h}" fill="${BAND}"/>
<rect x="${split}" y="0" width="${680 - split}" height="${h}" fill="#fff" stroke="${LINE}"/>
<text x="10" y="16" font-size="8.5" letter-spacing="1.4" fill="${GREY}" font-weight="700">UNDERGROUND</text>
<text x="${split + 10}" y="16" font-size="8.5" letter-spacing="1.4" fill="${GREY}" font-weight="700">SURFACE</text>`;
}

const diagBasic = svg(`${zones(388)}
${node('beacon', 50, 120, 'Beacon', 'on the tunnel wall')}
${node('helmet', 185, 120, 'Helmet', 'notes each beacon')}
${node('wifi', 320, 120, 'Signal', 'Wi-Fi point or 4G')}
${node('server', 455, 120, 'Our server', 'in South Africa')}
${node('monitor', 590, 120, 'Control room', 'trail, last place')}
${arrow(94, 120, 139, 120)}${arrow(229, 120, 274, 120)}${arrow(364, 120, 409, 120)}${arrow(499, 120, 544, 120)}
<text x="116" y="108" text-anchor="middle" font-size="8.5" fill="${INK}">Bluetooth</text>
<text x="386" y="108" text-anchor="middle" font-size="8.5" fill="${INK}">only to us</text>`);

const diagA = svg(`${zones(388, 230)}
${node('beacon', 50, 135, 'Beacons', 'in the tunnel')}
${node('helmet', 185, 135, 'Helmet', 'saves the trail')}
${node('wifi', 320, 135, 'Wi-Fi point', 'at the station')}
${node('mast', 455, 62, 'Mobile mast', 'surface, 4G SIM')}
${node('server', 455, 175, 'Our server', 'in South Africa')}
${node('monitor', 590, 175, 'Control room', 'trail, last place')}
${arrow(94, 135, 139, 135)}${arrow(229, 135, 274, 135)}
${arrow(364, 155, 411, 170, '', {})}
<path d="M185,96 Q290,12 411,58" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#ar)"/>
<text x="285" y="38" text-anchor="middle" font-size="8.8" fill="${INK}">on the surface, 4G</text>
${arrow(455, 99, 455, 137, '', {})}
${arrow(499, 175, 544, 175)}`, 230);

const diagB = svg(`${zones(288, 185)}
${node('beacon', 50, 110, 'Beacons', 'in the tunnel')}
${node('helmet', 185, 110, 'Helmet', 'saves each beacon')}
<text x="185" y="165" text-anchor="middle" font-size="8.8" fill="${INK}">with the time, no signal here</text>
${node('mast', 390, 110, 'Mobile mast', 'at the shaft top')}
${node('server', 510, 110, 'Our server', 'in South Africa')}
${node('monitor', 630, 110, 'Control room', 'trail, last place')}
${arrow(94, 110, 139, 110)}
${arrow(229, 110, 344, 110, 'sent later, at the shaft', { dash: true, ly: -8 })}
${arrow(434, 110, 464, 110)}${arrow(554, 110, 584, 110)}`, 185);

const diagC = svg(`${zones(388, 185)}
${node('beacon', 50, 110, 'Beacons', 'in the tunnel')}
${node('helmet', 185, 110, 'Helmet', 'sends as it goes')}
${node('wifi', 320, 110, 'Wi-Fi points', 'in the tunnels')}
${node('server', 455, 110, 'Our server', 'in South Africa')}
${node('monitor', 590, 110, 'Control room', 'live trail, video')}
${arrow(94, 110, 139, 110)}${arrow(229, 110, 274, 110)}${arrow(364, 110, 409, 110)}${arrow(499, 110, 544, 110)}
<text x="386" y="98" text-anchor="middle" font-size="8.5" fill="${INK}">live</text>`, 185);

const diagD = svg(`${zones(422, 215)}
<rect x="12" y="30" width="170" height="165" rx="4" fill="#fff" stroke="${INK}" stroke-dasharray="6 4"/>
<text x="97" y="46" text-anchor="middle" font-size="8.5" letter-spacing="1.2" fill="${INK}" font-weight="700">FACE ZONE</text>
<text x="97" y="58" text-anchor="middle" font-size="8.5" fill="${GREY}">no beacons or Wi-Fi, about 50 m</text>
${node('helmet', 97, 125, 'Helmet', 'saves what it can')}
${node('beacon', 235, 125, 'Last beacon', 'edge of the zone')}
${node('wifi', 360, 125, 'Wi-Fi point', 'at the station')}
${node('server', 485, 125, 'Our server', 'in South Africa')}
${node('monitor', 610, 125, 'Control room', 'trail, last place')}
${arrow(191, 125, 139, 125, '', {})}${arrow(279, 125, 314, 125)}${arrow(404, 125, 439, 125, 'later', { dash: true, ly: -8 })}${arrow(529, 125, 564, 125)}`, 215);

const diagTalk = svg(`
<rect x="0" y="0" width="680" height="250" fill="#fff" stroke="${LINE}"/>
${node('helmet', 90, 125, 'Helmet', 'switches on')}
${node('server', 390, 45, 'Address server', 'hm.equiinet.cn')}
${node('server', 390, 125, 'Their server', 'where it reports now')}
${node('server', 390, 205, 'Our server', 'what we want')}
<path d="M134,100 L346,55" fill="none" stroke="${INK}" stroke-width="1.4" marker-end="url(#ar)" marker-start="url(#ar)"/>
<text x="175" y="44" text-anchor="middle" font-size="9" font-weight="700" fill="${INK}" stroke="#fff" stroke-width="3" paint-order="stroke">1 The helmet asks: where do I report?</text>
<text x="175" y="57" text-anchor="middle" font-size="9" font-weight="700" fill="${INK}" stroke="#fff" stroke-width="3" paint-order="stroke">2 The server answers: report here</text>
${arrow(134, 125, 346, 125, '', {})}
<text x="240" y="114" text-anchor="middle" font-size="9" font-weight="700" fill="${INK}" stroke="#fff" stroke-width="3" paint-order="stroke">3a Today: reports to their server</text>
<path d="M134,150 L346,195" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#ar)"/>
<text x="215" y="207" text-anchor="middle" font-size="9" font-weight="700" fill="${INK}" stroke="#fff" stroke-width="3" paint-order="stroke">3b What we want: reports to our server</text>
<g font-size="9" fill="${INK}">
<text x="448" y="42">Built into the helmet. It gives back two</text><text x="448" y="54">addresses, one for files and one for the live link.</text>
<text x="448" y="122">Where the helmet reports today, unless</text><text x="448" y="134">the address is changed.</text>
<text x="448" y="202">Possible if the address is changed. Then</text><text x="448" y="214">the helmet would report to us.</text></g>`, 250);

const talk = `
<h2>How the helmet talks to a server</h2>
${diagTalk}

<div class="box"><b>In plain words</b><p>Think of a child who must hand a note to a teacher every morning. The child's card says: <i>"First go to the head office and ask which teacher to give it to."</i> The head office answers with a name and the child hands over the note.</p><p>That is how the helmet works now. The head office is the address server and the teacher is the server it reports to. Both are the supplier's, as far as we can tell.</p><p><b style="letter-spacing:0;text-transform:none;font-size:inherit;color:inherit">Idea 1:</b> we change the card so the head office is ours. The child still asks first and our office says: "Give it to our teacher."<br><b style="letter-spacing:0;text-transform:none;font-size:inherit;color:inherit">Idea 2:</b> we write our teacher's name straight on the card. The child goes to our teacher and asks nobody. We do not know if the helmet can do this, so we ask.</p></div>`;

const q = rows => `<table class="q"><thead><tr><th>No.</th><th>Question</th><th>Why we ask</th></tr></thead>\n` +
  rows.map(r => `<tr><td class="n">${r[0]}</td><td class="qq">${r[1]}</td><td>${r[2]}</td></tr>`).join('\n') + '</table>';

const Q1 = [
  [1, 'Can the helmet talk only to our own server and never to the supplier\'s computers in China? Can it report straight to our server or must it ask an address server first? How do we set that up?',
    'The helmet now asks hm.equiinet.cn for its settings (Interface Document p3). The supplier says this can be changed.'],
  [2, 'Is there an SDK or written list of the messages the helmet sends and accepts? How will we know when it changes?',
    'We only have a PDF with no date. We want to talk to the helmet from our own server, not through the supplier\'s platform. If they have no online list we will write our own. See below.']
];
const Q2 = [
  [3, 'The documents say the helmet gives its position in a Chinese map system (Gaode). Can it send normal GPS positions that fit maps in South Africa? Can we use our own map and does anything need their map?',
    'Gaode positions are moved slightly on purpose, so they land in the wrong place on a normal map (Interface Document pp19, 20 and 30). The Brochure says Google Maps.'],
  [4, 'Can the helmet read any Bluetooth beacon or only certain makes? Can we tell it which beacons to use, how many and from how far?',
    'We must buy the right beacons. The documents do not say which ones work (Spec Sheet p2).'],
  [5, 'Where there is no signal, does the helmet save the beacons it passes with the time and send them later when it has signal?',
    'Underground there is often no signal. The Spec Sheet says positions are saved (p5) but not how.'],
  [6, 'Do alarms such as SOS, a fall or the helmet coming off still work with no signal? Are they saved and sent first when signal returns?',
    'The Interface Document lists many alarm types. It does not say what happens to them with no signal.'],
  [7, 'Can we set a warning for when a worker goes into or out of an area marked by a beacon, such as near blasting?',
    'The Interface Document lists alarms for entering and leaving a beacon area. We want to use this for danger zones.']
];
const Q3 = [
  [8, 'Who sends software updates to the helmets and how? Is an update sent to all connected helmets at once or can we choose which ones get it and test it on one first? How will we know what changed?',
    'An update can change what the helmet sends (Interface Document p2) and that could break our software. The documents list only a check number for an update (pp5 and 8).'],
  [9, 'Can we send our own updates from our own server? Can we build our own software on top of the existing helmet software? Does an update need a secret stamp (a digital signature)?',
    'We want control of what runs on the helmet. It runs Android (Spec Sheet p1) so we want to know if our own app can run beside theirs and whether the helmet only accepts software from them.'],
  [10, 'Which certificates does the helmet have for South Africa? Can you send us a copy of each?',
    'Mines will ask for proof before any helmet goes underground. We have seen none yet.'],
  [11, 'The helmet is made abroad. Can the supplier send spare parts, such as a camera that is broken or not clear, a battery or a shell? Can a local technician fit them? Can we have a repair guide and the warranty terms?',
    'We cannot send a helmet overseas every time something breaks. The documents show no repair or parts information.'],
  [12, 'Can a mine\'s own lamp be fixed to the helmet? Is there a clip, what does it cost to make one and does the helmet have its own light?',
    'Mines already own lamps. We want to keep them.']
];
const Q4 = [
  [13, 'How well does the camera see in the dark? Can the helmet send video while an SOS call is open?',
    'The control room needs to see what is happening at the time of an alarm.'],
  [14, 'How many hours does the battery last with the camera on? How long can the memory card record?',
    'A shift is long. The helmet must last it.'],
  [15, 'Can the helmet join Wi-Fi points on its own, remember several and work on Wi-Fi alone with no SIM card?',
    'Some mines have no Wi-Fi and some have it only in a few places.']
];

const box = (title, text) => `<div class="box"><b>${title}</b><p>${text}</p></div>`;
const caption = (sees, lost, depends) => `<div class="cap"><div><b>The control room sees</b><p>${sees}</p></div><div><b>What is lost</b><p>${lost}</p></div><div><b>Depends on</b><p>${depends}</p></div></div>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Smart Helmet: Questions and How It Should Work</title>
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
  .box b, .cap b { font-size: 8.3pt; letter-spacing: .1em; text-transform: uppercase; color: #5d6167; }
  .box p, .cap p { margin: 3px 0; }
  .box.dark { background: #17181a; color: #fff; border-color: #17181a; }
  .box.dark b { color: #fff; }
  .ad { font-size: 8.8pt; margin-top: 4px; } .ad td { padding: 3px 6px 3px 0; border: 0; vertical-align: top; } .ad td:first-child { width: 150px; color: #5d6167; }
  .lead { color: #5d6167; margin: 2px 0 8px; }
  .cap { display: flex; gap: 10px; margin: 4px 0 14px; font-size: 9.3pt; }
  .cap > div { flex: 1; border-top: 1px solid #17181a; padding-top: 4px; }
  .dg { margin: 6px 0 2px; }
  h3 { font-size: 11.5pt; margin: 14px 0 0; }
</style>
</head><body>

<div class="band">
  <img class="logo" src="logo-white.svg" alt="90Ten Group">
  <h1 style="margin-top:7mm">Smart Helmet: Questions and How It Should Work</h1>
  <p class="sub">What the helmet supports, why we ask and how it could work in different mines.</p>
  <div class="meta">
    <span>Prepared for <b>Thella Group Services and Imperium Corporate</b></span>
    <span>Prepared by <b>90Ten Group</b></span>
    <span>20 October 2026</span>
    <span>Version 1</span>
  </div>
</div>

<div class="content">
<h2>Our own server and documentation</h2>
${q(Q1)}
${talk}
</div>

<div class="pg">
<h2>Is the helmet forced to use their server?</h2>
<p class="lead">We do not know yet. This is what the Interface Document says (pp3 and 4).</p>
<div class="box"><b>The addresses in the document</b>
<table class="ad"><tr><td>Address server, asked first</td><td>https://hm.equiinet.cn/api/index.php?ctl=config&amp;act=get_config</td></tr>
<tr><td>Files and photos (api_url)</td><td>http://hm.equiinet.cn/api/ (the document's example)</td></tr>
<tr><td>Live link (ws_url)</td><td>ws://47.106.114.236:9511 (the document's example)</td></tr>
<tr><td>Ours would be</td><td>an address of our own, in South Africa</td></tr></table></div>
${box('Way 1: change the addresses on their platform', 'The helmet still asks their address server first. We only change the answer it gets, in their control platform. We would still depend on them.')}
${box('Way 2: change the address inside the helmet', 'The helmet asks our address server instead and we run it. The document says this works only on helmets with a camera and that a helmet without one needs special software put on it. It does not explain how. The two methods it mentions, "Modification Method 1 and 2", are never described.')}
<h2>What "their API" means and why we avoid it</h2>
${box('API', 'Think of a menu in a restaurant. You can only order what is on the menu and the kitchen gives you what you ordered. An API is a menu for a computer: a list of what you can ask it and what it gives back.')}
${box('Their API', 'Their ready-made server and its menu. If we use it, we depend on their server and on how they run it. We want to avoid that.')}
${box('The messages the helmet speaks', 'This is the other thing and it is what we need. It is the list of what the helmet says (where I am, I need help) and what it understands (take a photo). If we have the full list, any server can understand the helmet, including ours.')}
${box('SDK', 'A starter box that comes with the list, like a LEGO set with the pieces and the instructions. It helps us build faster. If they do not have one we will build our own API on our server and give it a version and a date, so everyone can see when something changes.')}
<div class="box dark"><b>What we need from the supplier</b><p>1. The steps to change the address inside the helmet ourselves or to make it report straight to our server, for each helmet we buy.</p><p>2. The full list of messages between the helmet and a server, with examples. If they have no online version we will keep our own, with a version and date.</p><p>3. A promise that nothing else needs their servers to work.</p></div>
</div>

<div class="pg">
<h2>Beacons and data from underground</h2>
${q(Q2)}
<h2>Updates, certificates, repairs and the lamp</h2>
${q(Q3)}
<h2>Camera, battery and connection</h2>
${q(Q4)}
</div>

<div class="pg">
<h2>How we think it should work</h2>
<p class="lead">Each mine is different, but the idea is the same. A beacon says where the worker is, the helmet notes it with the time and sends it to our server when it has signal and the control room sees the trail.</p>
<div class="dg">${diagBasic}</div>
<h3>Mine 1: mobile signal at the shaft and a few Wi-Fi points</h3>
<div class="dg">${diagA}</div>
${caption('The trail from the last Wi-Fi point or from the surface, with the time of each beacon.', 'Live position between the Wi-Fi points. The trail arrives in chunks.', 'Questions 4, 5 and 15.')}
</div>

<div class="pg">
<h2>Other kinds of mine</h2>
<h3>Mine 2: no Wi-Fi at all</h3>
<div class="dg">${diagB}</div>
${caption('The full trail once the worker reaches signal at the shaft top. If a worker does not come out, only what was sent before the signal was lost.', 'Live position underground. The trail of a missing worker stays on the helmet.', 'Questions 5, 6 and 14.')}
<h3>Mine 3: Wi-Fi all along the tunnels</h3>
<div class="dg">${diagC}</div>
${caption('A live trail and live video, because the helmet is always connected.', 'Very little. The cost is building and keeping the Wi-Fi.', 'Questions 1, 13 and 15.')}
</div>

<div class="pg">
<h2>A mine with a face zone</h2>
<p class="lead">Equipment is kept about 50 m from blasting, so the area at the face has no beacons or Wi-Fi. A helmet that is not seen means unknown, not clear.</p>
<h3>Mine 4: beacons and Wi-Fi up to the edge of the face zone</h3>
<div class="dg">${diagD}</div>
${caption('The worker last seen at the beacon on the edge of the face zone, then nothing until they walk back. A warning if they enter the zone at blast time.', 'Everything inside the face zone. We know where the worker was last seen, not where they are.', 'Questions 5, 6 and 7.')}
<div class="box dark"><b>Why this matters</b><p>The answers to questions 4 to 7 decide which of these mines the helmet can serve and how much we must add, such as more beacons or more Wi-Fi points.</p></div>
</div>

<div class="foot"><span>Confidential</span><span>Smart Helmet</span></div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'doc5.html'), html);
console.log('wrote doc5.html ' + html.length);
