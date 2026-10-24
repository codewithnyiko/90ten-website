const fs = require('fs');
let s = fs.readFileSync('gen_wf2.cjs', 'utf8');
const rep = (x, y) => { if (!s.includes(x)) console.error('MISSING ' + x.slice(0, 70)); s = s.split(x).join(y); };

// extra icon
rep("  server: '<rect", "  monitor: '<rect x=\"-12\" y=\"-10\" width=\"24\" height=\"15\" rx=\"1.5\"/><path d=\"M0,5 V10 M-6,10 H6\"/>',\n  server: '<rect");

// architecture diagram
const diag = `
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
`;
rep('/* surface map placeholder */', diag + '\n/* surface map placeholder */');

// band
rep('Smart Helmet: Control Room, Surface Version', 'Smart Helmet: Version 1 Plan and Wireframes');
rep('A wireframe of the first version of our software. It starts on the surface with GPS. The underground trail comes next.', 'How our system gets the helmet data while the helmet still points to the supplier. What we build first and the screens we need.');

// replace content block
const a = s.indexOf('<h2>What the first version will do</h2>');
const b = s.indexOf('<div class="pg">\n<h2>Screen 1');
const newContent = `<h2>Where we are today</h2>
<p class="lead">The helmet is set up by the supplier. When it switches on it asks the supplier's address server in China where to report and then sends everything there. Our system is not part of this yet. These are the steps to change that.</p>
<table class="q"><thead><tr><th>Step</th><th>What happens</th><th>What we need</th></tr></thead>
<tr><td class="n">1</td><td class="qq"><b>Now: a pretend helmet.</b> We build our server and a pretend helmet that sends the same messages as the real one from the Interface Document. We can build and test everything while we wait.</td><td>Nothing from the supplier. We can start now.</td></tr>
<tr><td class="n">2</td><td class="qq"><b>A real helmet.</b> The helmet still asks the supplier's address server first. With the admin login we change the two addresses it gets back to ours. Then it reports to our server (Interface Document p3).</td><td>A sample helmet and its admin login.</td></tr>
<tr><td class="n">3</td><td class="qq"><b>Later: our own address server.</b> The helmet is changed to ask our address server so that nothing goes to China (pp3 and 4).</td><td>The steps from the supplier (question 1). After version 1.</td></tr>
</table>
<div class="box dark"><b>Version 1 is steps 1 and 2</b><p>It proves that our server can receive the helmet and that the control room can see where a worker is. Underground comes in version 2. Workers also need to be tracked on the surface so this is useful on its own.</p></div>
</div>

<div class="pg">
<h2>How our system works in version 1</h2>
<p class="lead">The helmet still asks the supplier where to report. The supplier's server only answers with our addresses. The reports go to us.</p>
<div class="dg">\${dgPlan}</div>
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

`;
s = s.slice(0, a) + newContent + s.slice(b);
// the original content div closed after the dark box; we now close it before the pg and the new first pg is a pg
rep('<div class="content">', '<div class="content">');
// remove the dependency box text about "What this first version depends on" keep but rename
rep('What this first version depends on', 'What version 1 depends on');
rep('doc9.html', 'doc10.html');
fs.writeFileSync('gen_plan.cjs', s);
console.log('ok');
