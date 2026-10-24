const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'pdf_build');

const docs = [
  {
    src: 'doc1.html', out: 'new1.html',
    title: 'Smart Helmet: What We Found and What We Need',
    kicker: 'Smart Helmet',
    h1: 'What We Found and<br>What We Need',
    sub: 'What we found in the helmet documents, and what we need to know before going further.',
    swaps: []
  },
  {
    src: 'doc2.html', out: 'new2.html',
    title: 'Smart Helmet: What It Can Do and What Is Not Clear',
    kicker: 'Smart Helmet',
    h1: 'What It Can Do and<br>What Is Not Clear',
    sub: 'What the documents say the helmet does, and what they leave unclear.',
    swaps: [
      ['<li>Which version of Android (the phone system) is inside, and who sends its updates.</li>',
       '<li>Who sends updates for the Android system (the phone system) inside, and which software version our helmets run.</li>'],
      ['<li>The system is Android 10 (Spec Sheet p1; Brochure p2). A helmet advert we saw said Android 11.</li>',
       '<li>The system is Android 10 (Spec Sheet p1; Brochure p2). A helmet advert we saw said Android 11.</li>\n<li>The examples show software version names from different years, 2021 and 2024 (Interface Document pp3 and 10). The Interface Document also says that helmets report different information depending on their software version (p2).</li>\n<li>Each helmet asks for its own settings using its own device number and software version (Interface Document p3). So the server can answer each helmet differently, and updates look as if they go to one helmet at a time, not to all at once. Nothing is said about updating beacons, bracelets or other devices the helmet connects to.</li>'],
      ['<li>Which version is really inside, Android 10 or 11.</li>',
       '<li>Which exact software version is on our sample helmets. The documents say Android 10, and an advert said Android 11. Because the messages differ by software version, the version decides which parts of the Interface Document apply to our helmets.</li>\n<li>Whether an update can change how the helmet behaves, for example the messages it sends or its alarms. If it can, an update could change what our software receives, so we need to be able to test an update before it reaches every helmet.</li>'],
      ['<li>Which version of Android is inside, who sends its updates, and can we control them?</li>',
       '<li>Which Android version and which exact software version are on our sample helmets? Who sends the updates? Can we choose which helmets get an update and when, test it on one helmet first, and keep a helmet on its current version?</li>']
    ]
  }
];

for (const d of docs) {
  let html = fs.readFileSync(path.join(dir, d.src), 'utf8');
  const start = html.indexOf('<h2>');
  const end = html.indexOf('</body>');
  let body = html.slice(start, end);
  for (const [a, b] of d.swaps) {
    if (!body.includes(a)) { console.error('SWAP NOT FOUND in ' + d.src + ': ' + a.slice(0, 70)); process.exitCode = 1; }
    body = body.replace(a, b);
  }
  body = body.replace(/<table>\n(<tr><th>[\s\S]*?<\/tr>)/g, '<table>\n<thead>$1</thead>');
  const out = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${d.title}</title>
<link rel="stylesheet" href="style2.css">
<style>@page { @top-right { content: "${d.title}"; } }</style>
</head><body>

<section class="cover">
  <img class="logo" src="logo-white.svg" alt="90Ten Group">
  <div class="mid">
    <p class="kicker">${d.kicker}</p>
    <h1>${d.h1}</h1>
    <p class="sub">${d.sub}</p>
  </div>
  <table class="meta">
    <tr><td>Prepared for</td><td>Thella Group Services and Imperium Corporate</td></tr>
    <tr><td>Prepared by</td><td>90Ten Group</td></tr>
    <tr><td>Date</td><td>20 October 2026</td></tr>
    <tr><td>Version</td><td>1, for discussion</td></tr>
  </table>
  <p class="conf">Confidential</p>
</section>

<div class="content">
${body}
</div>
</body></html>
`;
  fs.writeFileSync(path.join(dir, d.out), out);
  console.log('wrote ' + d.out + ' (' + out.length + ' chars)');
}
