const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, 'gen_env_code.txt'), 'utf8');
const head = JSON.parse(fs.readFileSync(path.join(__dirname, 'gen_env_head.json'), 'utf8'));
let body = fs.readFileSync(path.join(__dirname, 'gen_env_body.txt'), 'utf8');
eval(code + '; globalThis.__dg = dgEnv;');
body = body.replace('${dgEnv}', globalThis.__dg);
fs.writeFileSync(path.join(__dirname, 'pdf_build', 'doc17.html'), head + body);
console.log('wrote doc17.html');
