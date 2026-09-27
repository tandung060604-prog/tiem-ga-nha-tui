import fs from 'node:fs';
import path from 'node:path';

const TRACKS = [
  {
    name: 'bgm_title.mp3',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Daily%20Beetle.mp3',
    title: 'Daily Beetle - Kevin MacLeod (Cozy Title Theme)'
  },
  {
    name: 'bgm_selling.mp3',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3',
    title: 'Carefree - Kevin MacLeod (Upbeat Cooking & Selling Theme)'
  }
];

const OUT_DIR = 'public/assets/audio';

async function downloadTrack(track) {
  const dest = path.join(OUT_DIR, track.name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000000) {
    console.log(`✓ Already exists: ${dest} (${(fs.statSync(dest).size / 1024 / 1024).toFixed(2)} MB)`);
    return;
  }

  console.log(`Downloading ${track.title}...`);
  const res = await fetch(track.url);
  if (!res.ok) {
    throw new Error(`Failed to download ${track.url}: HTTP ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
  console.log(`✓ Saved ${dest} (${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} MB)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const track of TRACKS) {
    await downloadTrack(track);
  }
  console.log('--- ALL BGM DOWNLOADED SUCCESSFULLY ---');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
