import fs from 'node:fs';

const pkgs = ['silkscreen', 'vt323', 'pixelify-sans', 'tiny5'];

for (const pkg of pkgs) {
  const p = `node_modules/@fontsource/${pkg}/unicode.json`;
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    console.log(`=== ${pkg} ===`);
    for (const [k, v] of Object.entries(data)) {
      console.log(`  ${k}: ${v}`);
    }
  }
}
