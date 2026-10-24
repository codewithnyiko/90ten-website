const fs = require('fs');
let s = fs.readFileSync('gen_wf2.cjs', 'utf8');
const rep = (x, y) => { if (!s.includes(x)) console.error('MISSING ' + x.slice(0, 70)); s = s.split(x).join(y); };

rep("  server: '<rect", "  monitor: '<rect x=\"-12\" y=\"-10\" width=\"24\" height=\"15\" rx=\"1.5\"/><path d=\"M0,5 V10 M-6,10 H6\"/>',\n  plug: '<path d=\"M-5,-10 V-3 M5,-10 V-3 M-9,-3 H9 V3 A9 9 0 0 1 -9,3 Z M0,10 V13\"/>',\n  server: '<rect");

const diag = `
const nd = (type, x, y, label, sub, o = {}) => {
  const w = o.w || 112, h = 66;
  return R(x - w / 2, y - h / 2, w, h, { fill: o.dash ? SOFT : '#fff', stroke: o.dash ? GREY : (o.thick ? INK : LINE), dash: !!o.dash, sw: o.thick ? 1.8 : 1 }) + ic(type, x, y - 12, 0.9) +
    T(x, y + 11, label, { anchor: 'middle', bold: true, size: 9.5, fill: o.dash ? GREY : INK }) + T(x, y + 23, sub, { anchor: 'middle', size: 8, fill: GREY });
};
const ar = (x1, y1, x2, y2, o = {}) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (o.dash ? GREY : INK) + '" stroke-width="1.4"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + ' marker-end="url(#ARR)"/>';
let sd = '<defs><marker id="ARR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9" fill="none" stroke="' + INK + '" stroke-width="1.5"/></marker></defs>';
sd += R(0.5, 0.5, 679, 289, { rx: 4, stroke: LINE });
sd += '<rect x="1" y="1" width="130" height="288" fill="' + SOFT + '"/>' + T(12, 18, 'IN THE FIELD', { size: 8, fill: GREY, ls: 1.2 });
sd += T(143, 18, 'THE DATA SOURCE', { size: 8, fill: GREY, ls: 1.2 }) + T(413, 18, 'OURS', { size: 8, fill: GREY, ls: 1.2 });
sd += L(405, 28, 405, 280, { stroke: GREY, dash: true });
sd += nd('helmet', 66, 150, 'Helmet', 'reports as it does now', { thick: true });
sd += nd('server', 215, 85, 'Supplier platform', 'in China, today', { w: 130, thick: true });
sd += nd('server', 215, 215, 'Our live server', 'in South Africa, later', { w: 130, dash: true });
sd += nd('plug', 355, 85, 'Supplier', 'connector', { w: 84, thick: true });
sd += nd('plug', 355, 215, 'Our server', 'connector', { w: 84, dash: true });
sd += nd('server', 490, 150, 'Our data layer', 'one set of answers', { w: 110, thick: true });
sd += nd('monitor', 622, 150, 'Our screens', 'control room', { w: 88, thick: true });
sd += ar(100, 130, 148, 100) + ar(100, 172, 148, 200, { dash: true });
sd += ar(280, 85, 313, 85) + ar(280, 215, 313, 215, { dash: true });
sd += ar(397, 92, 435, 135) + ar(397, 208, 435, 165, { dash: true });
sd += ar(545, 150, 576, 150);
sd += T(355, 150, 'swap here later', { size: 8.5, bold: true, anchor: 'middle' }) + L(330, 156, 380, 156, { stroke: INK });
const dgPlan = svg(sd, 290);
`;
rep('/* surface map placeholder */', diag + '\n/* surface map placeholder */');

rep('Smart Helmet: Control Room, Surface Version', 'Smart Helmet: Version 1 Plan and Wireframes');
rep('A wireframe of the first version of our software. It starts on the surface with GPS. The underground trail comes next.', 'We replace the supplier screens now and still use their servers for the data until we get feedback. The way we get the data stays easy to change.');

const a = s.indexOf('<h2>What the first version will do</h2>');
const b = s.indexOf('<div class="pg">\n<h2>Screen 1');
const nc = `<h2>Where we are today</h2>
<p class="lead">The helmet reports to the supplier's servers in China and their control room screens show it. Those screens are old and hard to use. We replace the screens now. For the data we still call the supplier's servers until we get feedback on the way forward.</p>
<table class="q"><thead><tr><th>Step</th><th>What happens</th><th>What we need</th></tr></thead>
<tr><td class="n">1</td><td class="qq"><b>Now: our screens on their data.</b> We build our own control room screens. A connector reads the helmets' positions and alarms from the supplier's platform.</td><td>Access to the supplier's platform data with its documentation. See the question below.</td></tr>
<tr><td class="n">2</td><td class="qq"><b>While we wait: a pretend source.</b> It sends the same kind of data so we can build and test before access arrives.</td><td>Nothing from the supplier. We can start now.</td></tr>
<tr><td class="n">3</td><td class="qq"><b>Later: our own server.</b> The helmets report to our server (Interface Document pp3 and 4). We swap the connector and the screens stay the same.</td><td>The steps from the supplier (question 1).</td></tr>
</table>
<div class="box"><b>The question we must ask first</b><p>Does the supplier platform have an API to read the helmets' positions and alarms and history? Can we have the documentation and a test account? Are we allowed to build our own screens on it?</p></div>
<div class="box dark"><b>One rule: easy to change</b><p>The screens never talk to the supplier directly. They only talk to our own data layer. Only the connector knows where the data comes from. Moving to our own server later means changing one part and not the screens.</p></div>
</div>

<div class="pg">
<h2>How our system works in version 1</h2>
<p class="lead">The helmet keeps reporting as it does today. The connector reads from the supplier platform. Later we swap it for the connector to our own server.</p>
<div class="dg">\${dgPlan}</div>
<h2>What we build and how we know it works</h2>
<table class="q"><thead><tr><th>No.</th><th>What we build</th><th>How we know it works</th></tr></thead>
<tr><td class="n">1</td><td class="qq">The data layer. One set of answers for the screens such as who is online and where is this worker and what alarms are open.</td><td>The screens work on pretend data.</td></tr>
<tr><td class="n">2</td><td class="qq">The pretend source that feeds the data layer.</td><td>A pretend helmet moves on the map and sends an SOS.</td></tr>
<tr><td class="n">3</td><td class="qq">Our control room screens on the next pages.</td><td>Each screen answers its question.</td></tr>
<tr><td class="n">4</td><td class="qq">The supplier connector. It needs access to their platform data.</td><td>A real helmet shows on our screen.</td></tr>
<tr><td class="n">5</td><td class="qq">The Bluetooth test list. It needs the platform to give us the nearby devices.</td><td>A real beacon beside a helmet appears in the list.</td></tr>
<tr><td class="n">6</td><td class="qq">Later: the connector to our own server.</td><td>The same screens work with no change.</td></tr>
</table>
</div>

`;
s = s.slice(0, a) + nc + s.slice(b);
rep('What this first version depends on', 'What version 1 depends on');
rep('A sample helmet and its admin login on the supplier\'s platform so we can point it to our server.', 'Access to the supplier platform data and its documentation.');
rep('doc9.html', 'doc11.html');
fs.writeFileSync('gen_plan2.cjs', s);
console.log('ok');
