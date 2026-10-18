// Builds the 90Ten Group A5 hand-out flyer, two sides, in 90Ten's own look: white and charcoal, 90Ten red on
// the T, E and N, Jost type, and the circle from the "Ten" in the logo as the big shape. The services are the
// six on the website's "What we build" section, in the site's own words, shortened.
//
//   node design/marketing/flyer-gen.cjs           -> design/marketing/flyer-a5.html         A5, trim size
//   node design/marketing/flyer-gen.cjs --bleed   -> design/marketing/flyer-a5-print.html   A5 + 3 mm bleed + crop marks
// Print each to PDF with Chrome into out/ (give it a few seconds for the Jost font). The -print file is what
// goes to the printer.
const fs = require('fs');
const path = require('path');

const BLEED = process.argv.includes('--bleed');
const B = BLEED ? 3 : 0;          // bleed, mm
const M = BLEED ? 5 : 0;          // crop-mark margin, mm
const T = B + M;
const mm = (n) => `${+n.toFixed(2)}mm`;

const marks = BLEED
  ? [['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']]
      .map(([v, h]) => `<i class="cm h" style="${v}:${T}mm;${h}:0"></i><i class="cm v" style="${h}:${T}mm;${v}:0"></i>`).join('')
  : '';
const open = BLEED ? `<div class="page">${marks}` : '';
const close = BLEED ? '</div>' : '';

// Icons are the website's own (wwwroot/index.html, "What we build"), so the flyer and the site match.
const SERVICES = [
  ['Mobile apps', 'One app for Android and iOS. Fast, and works on weak data.',
    '<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M11 18.2h2"/>'],
  ['Web portals', 'Member and customer portals that work on any phone.',
    '<rect x="3" y="4.5" width="18" height="15" rx="2.2"/><path d="M3 9.2h18M7 6.9h.01M10 6.9h.01"/>'],
  ['Back office systems', 'The admin side your staff use every day.',
    '<rect x="3.5" y="4" width="17" height="6.5" rx="1.6"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.6"/><path d="M7 7.2h.01M7 16.7h.01"/>'],
  ['Payments and integrations', 'Card and EFT payments, SMS and WhatsApp, connected properly.',
    '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3 10h18M7 15h3"/>'],
  ['Support and care', 'After launch we stay. We fix, improve and keep it running.',
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>'],
  ['Consulting', 'We help you decide what is worth building, in what order.',
    '<circle cx="6.5" cy="6.8" r="2.3"/><circle cx="17.5" cy="6.8" r="2.3"/><path d="M2.8 16.5v-3a3.7 3.7 0 0 1 7.4 0v3"/><path d="M13.8 16.5v-3a3.7 3.7 0 0 1 7.4 0v3"/><path d="M1.8 16.5h20.4M5 16.5v4.2M19 16.5v4.2"/>'],
];

// --front=<name> picks the front; the back never changes. The mosaic is the chosen front (flyer-a5.html);
// the others build as flyer-a5-<name>.html for comparison.
const FRONT = (process.argv.find((a) => a.startsWith('--front=')) || '--front=mosaic').slice(8);
const C = { coral: '#ef6f5e', amber: '#f5b041', teal: '#1fa59a', indigo: '#3949ab', sky: '#4fb8e8', red: '#B33432' };
// --palette=brand calms the shapes down to 90Ten red, charcoal and greys.
const PALETTE = (process.argv.find((x) => x.startsWith('--palette=')) || '--palette=colour').slice(10);
if (PALETTE === 'brand') Object.assign(C, { coral: '#B33432', amber: '#a3a3ab', teal: '#2d2d30', indigo: '#5c5d63', sky: '#d4d4d9' });
// --tiles=<set> colours the T, E and N tiles: colour (three colours), red, charcoal, or brand (red, charcoal, grey).
const TILESET = (process.argv.find((x) => x.startsWith('--tiles=')) || '--tiles=colour').slice(8);
const TENCOL = { colour: [C.coral, C.teal, C.indigo], red: ['#B33432', '#B33432', '#B33432'], charcoal: ['#2d2d30', '#2d2d30', '#2d2d30'], brand: ['#B33432', '#2d2d30', '#6b6c72'] }[TILESET] || [C.coral, C.teal, C.indigo];
const LOCK = `<div class="lock"><img src="../../wwwroot/img/logo-dark.png" alt="90Ten Group"><div class="bar"></div>
    <div class="stack"><span><b>T</b>ailored.</span><span><b>E</b>ngineered.</span><span><b>N</b>urtured.</span></div></div>`;
// Bauhaus-style tiles: each is one solid colour and one simple shape.
const TILES = [
  [C.coral, '50%'], [C.amber, '100% 0 0 0'], [C.teal, '4mm'], [C.indigo, '0 0 100% 0'],
  [C.sky, '0 100% 0 0'], [C.red, '50%'], [C.amber, '0 0 0 100%'], [C.teal, '50% 50% 0 0'],
  [C.indigo, '4mm'], [C.teal, '0 0 50% 50%'], [C.coral, '100% 0 0 0'], [C.amber, '50%'],
];
// Concentric bands, outermost first, so each sits on the one before it.
const ARCS = [[150, C.indigo], [128, C.teal], [106, C.amber], [84, C.coral], [62, C.red], [40, '#2d2d30']];
const FRONTS = {
  mosaic: `<section class="side front cf">
  <div class="mosaic">${TILES.map(([c, r]) => `<i style="background:${c};border-radius:${r}"></i>`).join('')}</div>
  ${LOCK}
  <div class="spacer"></div>
  <h1>Custom software<br>and mobile apps<br>for any business.</h1>
  <p class="web" style="margin-top:7mm">90tengroup.co.za</p>
</section>`,
  arcs: `<section class="side front cf">
  <div class="arcs">${ARCS.map(([d, c]) => `<i style="width:${d}mm;height:${d}mm;left:${(150 - d) / 2}mm;top:${(150 - d) / 2}mm;background:${c}"></i>`).join('')}</div>
  ${LOCK}
  <div class="spacer"></div>
  <h1 style="font-size:36pt">Custom<br>software<br>and mobile<br>apps.</h1>
  <p class="sub">Built around your business.</p>
  <p class="web" style="margin-top:7mm">90tengroup.co.za</p>
</section>`,
  phone: `<section class="side front cf">
  <i class="dot" style="width:16mm;height:16mm;background:${C.amber};right:${mm(66 + B)};bottom:${mm(70 + B)}"></i>
  <i class="dot" style="width:9mm;height:9mm;background:${C.teal};right:${mm(18 + B)};bottom:${mm(116 + B)}"></i>
  <i class="dot" style="width:6mm;height:6mm;background:${C.coral};right:${mm(76 + B)};bottom:${mm(40 + B)}"></i>
  <div class="phone"><div class="scr"><div class="top"></div>
    <div class="tiles"><i style="background:${C.coral}"></i><i style="background:${C.amber}"></i><i style="background:${C.teal}"></i><i style="background:${C.sky}"></i></div>
    <div class="bar2"></div></div></div>
  ${LOCK}
  <h1 style="margin-top:20mm;font-size:32pt">Apps your<br>people<br>will use.</h1>
  <p class="sub" style="max-width:62mm">Custom software and mobile apps for any business.</p>
  <div class="spacer"></div>
  <p class="web">90tengroup.co.za</p>
</section>`,
  // a row of the mosaic over what T, E and N stand for: the two favourites together
  mosaicten: `<section class="side front cf">
  <div class="mosaic" style="margin-bottom:7mm">${TILES.slice(0, 4).map(([c, r]) => `<i style="background:${c};border-radius:${r}"></i>`).join('')}</div>
  <img src="../../wwwroot/img/logo-dark.png" alt="90Ten Group" style="width:30mm;height:auto;display:block">
  <h1 style="margin-top:6mm;font-size:21pt;line-height:1.12">Custom software and<br>mobile apps for any business.</h1>
  <div class="spacer"></div>
  <div class="tenrows sm">
    <div class="tr"><span class="tile" style="background:${TENCOL[0]}">T</span><div><h3>Tailored</h3><p>Built around your business, not squeezed into an off-the-shelf product.</p></div></div>
    <div class="tr"><span class="tile" style="background:${TENCOL[1]}">E</span><div><h3>Engineered</h3><p>Built properly by developers with over 30 years of experience together.</p></div></div>
    <div class="tr"><span class="tile" style="background:${TENCOL[2]}">N</span><div><h3>Nurtured</h3><p>Looked after once it is live: supported, updated and improved.</p></div></div>
  </div>
  <p class="web" style="margin-top:6mm">90tengroup.co.za</p>
</section>`,
  // what the T, E and N in the name stand for, each on its own colour tile
  ten: `<section class="side front cf">
  <img src="../../wwwroot/img/logo-dark.png" alt="90Ten Group" style="width:34mm;height:auto;display:block">
  <h1 style="margin-top:9mm;font-size:24pt;line-height:1.1">Custom software and<br>mobile apps for any business.</h1>
  <div class="spacer"></div>
  <div class="tenrows">
    <div class="tr"><span class="tile" style="background:${TENCOL[0]}">T</span><div><h3>Tailored</h3><p>Built around your business, not squeezed into an off-the-shelf product.</p></div></div>
    <div class="tr"><span class="tile" style="background:${TENCOL[1]}">E</span><div><h3>Engineered</h3><p>Built properly by developers with over 30 years of experience together.</p></div></div>
    <div class="tr"><span class="tile" style="background:${TENCOL[2]}">N</span><div><h3>Nurtured</h3><p>Looked after once it is live: supported, updated and improved.</p></div></div>
  </div>
  <p class="web" style="margin-top:8mm">90tengroup.co.za</p>
</section>`,
  // colour bars rising from the bottom edge, like a growth chart; they bleed off the bottom
  bars: `<section class="side front cf">
  ${LOCK}
  <h1 style="margin-top:16mm;font-size:32pt">Custom software<br>and mobile apps<br>for any business.</h1>
  <p class="web" style="margin-top:6mm">90tengroup.co.za</p>
  <div class="bars">${[[34, C.indigo], [52, C.teal], [44, C.amber], [70, C.coral], [60, C.sky], [86, C.red]]
    .map(([h, c]) => `<i style="height:${h + B}mm;background:${c}"></i>`).join('')}</div>
</section>`,
  // scattered circles in the top half, hand-placed so none touches the logo or the words
  dots: `<section class="side front cf">
  ${[[38, 8, 6, C.coral], [22, 52, 4, C.amber], [30, 84, 20, C.teal], [14, 118, 10, C.sky], [46, 110, 40, C.indigo],
     [12, 30, 44, C.amber], [18, 72, 58, C.red], [9, 128, 68, C.coral], [26, 10, 66, C.sky], [11, 52, 82, C.teal],
     [7, 96, 80, C.amber], [16, 120, 92, C.coral]]
    .map(([d, x, y, c]) => `<i class="dot" style="width:${d}mm;height:${d}mm;left:${mm(x + B)};top:${mm(y + B)};background:${c}"></i>`).join('')}
  <div class="spacer"></div>
  ${LOCK}
  <h1 style="margin-top:9mm">Custom software<br>and mobile apps<br>for any business.</h1>
  <p class="web" style="margin-top:6mm">90tengroup.co.za</p>
</section>`,
  // the ring around "Ten" in the logo, made of five colour segments, with the logo inside
  ring: `<section class="side front cf" style="align-items:center;text-align:center">
  <div class="cring"><svg viewBox="0 0 100 100" aria-hidden="true">${[C.coral, C.amber, C.teal, C.sky, C.indigo]
    .map((c, i) => `<circle cx="50" cy="50" r="40" fill="none" stroke="${c}" stroke-width="13" stroke-dasharray="46.3 205" stroke-dashoffset="${-(i * 50.27)}" transform="rotate(-90 50 50)"/>`).join('')}</svg>
    <img src="../../wwwroot/img/logo-dark.png" alt="90Ten Group"></div>
  <p class="ten"><b>T</b>ailored. <b>E</b>ngineered. <b>N</b>urtured.</p>
  <h1 style="margin-top:6mm;font-size:24pt;font-weight:600;line-height:1.15">Custom software and<br>mobile apps for any business.</h1>
  <div class="spacer"></div>
  <p class="web">90tengroup.co.za</p>
</section>`,
  white: `<section class="side front">
  <div class="disc"></div>
  <div class="head">
    <img class="logo" src="../../wwwroot/img/logo.png" alt="90Ten Group">
    <div class="bar"></div>
    <div class="stack"><span><b>T</b>ailored.</span><span><b>E</b>ngineered.</span><span><b>N</b>urtured.</span></div>
  </div>
  <div class="hero">
    <div class="eyebrow">A South African software company</div>
    <h1>Custom software.<br><em>Mobile apps.</em><br>Built for you.</h1>
    <p class="sub">We design and build software for businesses in any sector.</p>
    <div class="chips"><span>Android</span><span>iOS</span><span>Web</span></div>
  </div>
  <div class="disc-text">
    <h2>Apps your people<br><em>will use.</em></h2>
    <p>One app on Android and iOS, built and supported by one team.</p>
  </div>
  <div class="web">90tengroup.co.za<span>Midrand, South Africa</span></div>
</section>`,
};

// --light: the same front on white, with the dark logo and charcoal type, for a flyer that is not so dark
const LIGHT = process.argv.includes('--light');
let FRONT_HTML = FRONTS[FRONT] || FRONTS.white;
if (LIGHT) FRONT_HTML = FRONT_HTML.replace('class="side front cf', 'class="side front cf light').split('logo-dark.png').join('logo.png');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>90Ten Group flyer</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800&display=swap">
<style>
  :root{--char:#2d2d30;--char2:#3a3b40;--red:#B33432;--red-on-dark:#e0524f;--muted:#b9b9c0;--grey:#5c5c63;--line:#e4e4e8;}
  *{box-sizing:border-box;margin:0;padding:0;}
  html{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  body{font-family:'Jost','Segoe UI',sans-serif;color:var(--char);background:#e9ebee;}
  @page{size:${148 + 2 * T}mm ${210 + 2 * T}mm;margin:0;}
  .side{width:${mm(148 + 2 * B)};height:${mm(210 + 2 * B)};position:relative;overflow:hidden;margin:0 auto 8mm;
        page-break-after:always;display:flex;flex-direction:column;}
  .side:last-child{page-break-after:auto;margin-bottom:0;}
  @media print{body{background:#fff;} .side{margin:0;}}
  .eyebrow{font-size:8pt;letter-spacing:.26em;text-transform:uppercase;font-weight:700;color:var(--red);}

  /* ---------- front: white, the logo's circle comes in from the corner ---------- */
  .front{background:#fff;padding:${mm(14 + B)} ${mm(13 + B)} ${mm(12 + B)};}
  .front > *{position:relative;z-index:1;}
  .head{display:flex;align-items:center;gap:5mm;}
  .head .logo{height:23mm;width:auto;display:block;}
  .head .bar{width:.6mm;align-self:stretch;background:var(--line);}
  .head .stack{display:flex;flex-direction:column;font-size:12.5pt;font-weight:500;letter-spacing:.03em;line-height:1.22;}
  .head .stack b{color:var(--red);font-weight:700;}
  .hero{margin-top:17mm;}
  .hero h1{margin-top:3mm;font-size:35pt;font-weight:700;line-height:1.03;letter-spacing:-.015em;}
  .hero h1 em{font-style:normal;color:var(--red);}
  .hero .sub{margin-top:5mm;max-width:80mm;font-size:11.5pt;line-height:1.45;color:var(--grey);}
  .chips{display:flex;gap:2mm;margin-top:6mm;}
  .chips span{font-size:9pt;font-weight:600;border:.35mm solid var(--char);border-radius:10mm;padding:1mm 3.5mm;}
  /* the circle bleeds off the bottom-right corner; its text sits well inside the round edge */
  .disc{position:absolute;z-index:0;width:124mm;height:124mm;border-radius:50%;background:var(--char);
        right:${mm(-34 + B)};bottom:${mm(-34 + B)};}
  .disc-text{position:absolute;z-index:1;left:${mm(74 + B)};top:${mm(150 + B)};width:62mm;color:#fff;}
  .disc-text h2{font-size:16pt;font-weight:700;line-height:1.1;}
  .disc-text h2 em{font-style:normal;color:var(--red-on-dark);}
  .disc-text p{margin-top:2.5mm;font-size:9pt;line-height:1.45;color:var(--muted);}
  .front .web{position:absolute;z-index:1;left:${mm(13 + B)};bottom:${mm(12 + B)};font-size:10pt;font-weight:600;}
  .front .web span{display:block;font-size:7.5pt;font-weight:500;color:var(--grey);letter-spacing:.04em;}

  /* ---------- back: charcoal, the services, then a white contact panel ---------- */
  .back{background:var(--char);color:#fff;}
  .build{flex:1;padding:${mm(13 + B)} ${mm(13 + B)} ${mm(8)};display:flex;flex-direction:column;}
  .build .eyebrow{color:var(--red-on-dark);}
  .build h2{margin-top:2mm;font-size:24pt;font-weight:700;line-height:1.05;}
  .build .lead{margin-top:2.5mm;font-size:10pt;line-height:1.45;color:var(--muted);max-width:110mm;}
  .grid{margin-top:6mm;display:grid;grid-template-columns:1fr 1fr;gap:5mm 6mm;}
  .svc{border-top:.4mm solid var(--char2);padding-top:3mm;display:flex;gap:3mm;align-items:flex-start;}
  /* the website's ringed icons */
  .svc .ring{flex:none;width:9mm;height:9mm;border-radius:50%;border:.45mm solid #fff;color:#fff;
             display:flex;align-items:center;justify-content:center;}
  .svc .ring svg{width:4.6mm;height:4.6mm;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
  .svc h3{font-size:11pt;font-weight:700;line-height:1.15;}
  .svc p{margin-top:1mm;font-size:8.5pt;line-height:1.4;color:var(--muted);}
  .with{margin-top:auto;padding-top:6mm;}
  .with .eyebrow{color:#9a9aa2;}
  .words{display:flex;flex-wrap:wrap;gap:.5mm 2.5mm;margin-top:2mm;font-size:12pt;font-weight:500;}
  .words i{font-style:normal;color:rgba(255,255,255,.3);}
  .words .y{color:var(--red-on-dark);font-weight:700;}

  .contact{background:#fff;color:var(--char);padding:${mm(7)} ${mm(13 + B)} ${mm(7 + B)};}
  .contact .cols{display:flex;justify-content:space-between;gap:6mm;align-items:flex-start;}
  .contact h2{font-size:16pt;font-weight:700;line-height:1.05;}
  .contact .reply{margin-top:1.5mm;font-size:8.5pt;color:var(--grey);}
  .contact .reach{text-align:right;font-size:10pt;font-weight:600;line-height:1.5;}
  .contact .reach span{display:block;font-size:7.5pt;font-weight:500;color:var(--grey);}
  /* Kereke on the left, who makes it on the right */
  .ours{margin-top:5mm;padding-top:4mm;border-top:.3mm solid var(--line);display:flex;align-items:center;
        justify-content:space-between;gap:4mm;}
  .ours .k{display:flex;flex-direction:column;gap:1.2mm;}
  .ours .k img{height:6mm;width:auto;display:block;align-self:flex-start;}
  .ours .k span{font-size:8.5pt;color:var(--grey);}
  .ours .by{display:flex;align-items:center;gap:2.5mm;font-size:8pt;color:var(--grey);}
  .ours .by img{height:11mm;width:auto;display:block;}
  /* ---------- colourful fronts (--front=mosaic|arcs|phone): charcoal, solid vector shapes, no gradients ---------- */
  .cf{background:var(--char);color:#fff;padding:${mm(13 + B)} ${mm(13 + B)} ${mm(11 + B)};}
  .cf > *{position:relative;z-index:1;}
  .cf .lock{display:flex;align-items:center;gap:4mm;}
  .cf .lock img{width:30mm;height:auto;display:block;}
  .cf .lock .bar{width:.6mm;align-self:stretch;background:rgba(255,255,255,.25);}
  .cf .lock .stack{display:flex;flex-direction:column;font-size:12pt;font-weight:500;letter-spacing:.03em;line-height:1.2;}
  .cf .lock .stack b{color:var(--red-on-dark);font-weight:700;}
  .cf h1{font-size:30pt;font-weight:700;line-height:1.05;letter-spacing:-.015em;}
  .cf .sub{margin-top:3mm;font-size:12pt;line-height:1.45;color:var(--muted);}
  /* in flow here, not pinned to the corner like the white front's address */
  .cf .web{position:relative;left:auto;bottom:auto;font-size:10pt;font-weight:600;letter-spacing:.04em;color:var(--muted);}
  .cf .spacer{flex:1;}

  .mosaic{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-bottom:8mm;}
  .mosaic i{display:block;aspect-ratio:1;}

  .arcs{position:absolute;z-index:0;right:${mm(-84 + B)};top:${mm(-56 + B)};width:150mm;height:150mm;}
  .arcs i{position:absolute;border-radius:50%;}

  .phone{position:absolute;z-index:0;width:62mm;height:124mm;right:${mm(-6 + B)};bottom:${mm(-30 + B)};border-radius:10mm;
         background:#45464b;padding:3mm;transform:rotate(-8deg);}
  .phone .scr{width:100%;height:100%;border-radius:7.5mm;background:#f7f7f8;overflow:hidden;display:flex;flex-direction:column;gap:2.5mm;}
  .phone .top{background:#3949ab;height:22mm;}
  .phone .tiles{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm;padding:0 3.5mm;}
  .phone .tiles i{display:block;height:17mm;border-radius:3mm;}
  .phone .bar2{margin:1mm 3.5mm 0;height:9mm;border-radius:4.5mm;background:#2d2d30;}
  .dot{position:absolute;z-index:0;border-radius:50%;}

  .tenrows{display:flex;flex-direction:column;gap:5mm;}
  .tr{display:flex;align-items:center;gap:5mm;}
  .tr .tile{flex:none;width:27mm;height:27mm;border-radius:5mm;display:flex;align-items:center;justify-content:center;
            font-size:40pt;font-weight:800;color:#fff;line-height:1;}
  .tr h3{font-size:16pt;font-weight:700;line-height:1.1;}
  .tr p{margin-top:1.2mm;font-size:10.5pt;line-height:1.4;color:var(--muted);}

  /* light fronts: white page, charcoal type; the colour shapes stay as they are */
  .cf.light{background:#fff;color:var(--char);}
  .cf.light .lock .bar{background:var(--line);}
  .cf.light .lock .stack b,.cf.light .ten b{color:var(--red);}
  .cf.light .sub,.cf.light .web,.cf.light .tr p{color:var(--grey);}
  .tenrows.sm{gap:4mm;}
  .tenrows.sm .tile{width:21mm;height:21mm;font-size:30pt;border-radius:4mm;}
  .tenrows.sm h3{font-size:14pt;}
  .tenrows.sm p{font-size:9.5pt;}

  .bars{position:absolute;z-index:0;left:${mm(13 + B)};right:${mm(13 + B)};bottom:0;display:flex;align-items:flex-end;gap:3mm;}
  .bars i{flex:1;display:block;border-radius:4mm 4mm 0 0;}

  .cring{position:relative;width:104mm;height:104mm;margin-top:4mm;flex:none;display:flex;align-items:center;justify-content:center;}
  .cring svg{position:absolute;inset:0;width:100%;height:100%;}
  .cring img{position:relative;width:42mm;height:auto;display:block;}
  .cf .ten{margin-top:9mm;font-size:13pt;font-weight:500;letter-spacing:.06em;}
  .cf .ten b{color:var(--red-on-dark);font-weight:700;}
  ${BLEED ? `
  .page{position:relative;width:${148 + 2 * T}mm;height:${210 + 2 * T}mm;overflow:hidden;background:#fff;
        margin:0 auto 8mm;page-break-after:always;}
  .page:last-of-type{page-break-after:auto;}
  @media print{.page{margin:0;}}
  .page .side{position:absolute;left:${M}mm;top:${M}mm;margin:0;}
  .cm{position:absolute;background:#000;}
  .cm.h{width:${M - 1}mm;height:.25mm;}
  .cm.v{width:.25mm;height:${M - 1}mm;}` : ''}
</style>
</head>
<body>

${open}${FRONT_HTML}${close}

${open}<section class="side back">
  <div class="build">
    <div class="eyebrow">What we build</div>
    <h2>One team, from design<br>to care after launch.</h2>
    <p class="lead">The design, the apps, the servers and the support, all from the people who built it.</p>
    <div class="grid">
      ${SERVICES.map(([t, d, ic]) => `<div class="svc"><span class="ring"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></span><div><h3>${t}</h3><p>${d}</p></div></div>`).join('\n      ')}
    </div>
    <div class="with">
      <div class="eyebrow">We work with</div>
      <div class="words"><span>Logistics</span><i>/</i><span>Health</span><i>/</i><span>Churches</span><i>/</i><span>Hospitality</span><i>/</i><span>Mining</span><i>/</i><span class="y">Yours</span></div>
    </div>
  </div>
  <div class="contact">
    <div class="cols">
      <div><h2>Tell us what<br>you need.</h2></div>
      <div class="reach">082 899 4774<span>Call or WhatsApp us</span>hello@90tengroup.co.za<span>Email us</span></div>
    </div>
    <div class="ours">
      <div class="k"><img src="../../wwwroot/img/kereke-logo.png" alt="Kereke"><span>The ministry operations platform</span></div>
      <div class="by">A product of<img src="../../wwwroot/img/logo.png" alt="90Ten Group"></div>
    </div>
  </div>
</section>${close}

</body>
</html>
`;

const tag = FRONT === 'mosaic' && !LIGHT && PALETTE === 'colour' ? '' : '-' + FRONT + (LIGHT ? '-light' : '') + (PALETTE !== 'colour' ? '-' + PALETTE : '') + (TILESET !== 'colour' ? '-tiles-' + TILESET : '');
const out = path.join(__dirname, 'flyer-a5' + tag + (BLEED ? '-print' : '') + '.html');
fs.writeFileSync(out, html, 'utf8');
console.log('wrote ' + out);
