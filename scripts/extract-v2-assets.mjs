import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const BRAIN_DIR = 'C:/Users/HP/.gemini/antigravity-ide/brain/3c99997c-6e5d-4a74-847e-121b31486da2';

async function makeTransparent(inputBuffer, threshold = 240) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;
  for (let i = 0; i < pixelCount; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i * 4 + 3] = 0;
    } else if (r >= threshold - 20 && g >= threshold - 20 && b >= threshold - 20) {
      const minVal = Math.min(r, g, b);
      const alpha = Math.max(0, Math.min(255, (255 - minVal) * 8));
      data[i * 4 + 3] = Math.min(data[i * 4 + 3], alpha);
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png();
}

async function run() {
  console.log('--- EXTRACTING V2 ASSETS ---');

  // 1. Title/Landing Cover Background (optimize to 720x1280 or maintain aspect ratio)
  const landingSrc = path.join(BRAIN_DIR, 'landing_vn_chicken_1790442498131.jpg');
  if (fs.existsSync(landingSrc)) {
    await sharp(landingSrc)
      .resize(720, 1280, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toFile('public/assets/ui/landing_vn_bg.jpg');
    console.log('✓ Created public/assets/ui/landing_vn_bg.jpg');
  }

  // 2. Soda Fountain Machine (1024x1024)
  const fountainSrc = path.join(BRAIN_DIR, 'station_soda_fountain_1790442515396.jpg');
  if (fs.existsSync(fountainSrc)) {
    const cropped = await sharp(fountainSrc)
      .extract({ left: 160, top: 120, width: 700, height: 780 })
      .toBuffer();
    const transparent = await makeTransparent(cropped, 240);
    await transparent.resize(256, 285).toFile('public/assets/kitchen/station_soda_fountain.png');
    await transparent.resize(256, 285).toFile('assets-src/kitchen/station_soda_fountain.png');
    console.log('✓ Created station_soda_fountain.png');
  }

  // 3. Sauce Squeeze Bottles (1024x1024)
  const sauceSrc = path.join(BRAIN_DIR, 'sauce_bottles_squeeze_1790442537976.jpg');
  if (fs.existsSync(sauceSrc)) {
    // Tomato Ketchup (left bottle)
    const ketchupCrop = await sharp(sauceSrc)
      .extract({ left: 160, top: 110, width: 240, height: 600 })
      .toBuffer();
    const ketchupTrans = await makeTransparent(ketchupCrop, 240);
    await ketchupTrans.resize(100, 250).toFile('public/assets/kitchen/bottle_ketchup.png');
    await ketchupTrans.resize(100, 250).toFile('assets-src/kitchen/bottle_ketchup.png');
    console.log('✓ Created bottle_ketchup.png');

    // Chili Sauce (right bottle)
    const chiliCrop = await sharp(sauceSrc)
      .extract({ left: 610, top: 110, width: 240, height: 600 })
      .toBuffer();
    const chiliTrans = await makeTransparent(chiliCrop, 240);
    await chiliTrans.resize(100, 250).toFile('public/assets/kitchen/bottle_chili.png');
    await chiliTrans.resize(100, 250).toFile('assets-src/kitchen/bottle_chili.png');
    console.log('✓ Created bottle_chili.png');

    // Dipping dish (center bottom)
    const dishCrop = await sharp(sauceSrc)
      .extract({ left: 390, top: 580, width: 230, height: 160 })
      .toBuffer();
    const dishTrans = await makeTransparent(dishCrop, 240);
    await dishTrans.resize(120, 84).toFile('public/assets/kitchen/sauce_dish.png');
    await dishTrans.resize(120, 84).toFile('assets-src/kitchen/sauce_dish.png');
    console.log('✓ Created sauce_dish.png');
  }

  // 4. Drinks: Cola and 7Up
  const drinksSrc = path.join(BRAIN_DIR, 'drinks_coca_and_7up_1790442556354.jpg');
  if (fs.existsSync(drinksSrc)) {
    // Cola (left)
    const colaCrop = await sharp(drinksSrc)
      .extract({ left: 60, top: 180, width: 420, height: 680 })
      .toBuffer();
    const colaTrans = await makeTransparent(colaCrop, 240);
    await colaTrans.resize(160, 256).toFile('public/assets/food/food_soda.png');
    await colaTrans.resize(160, 256).toFile('assets-src/food/food_soda.png');
    console.log('✓ Created food_soda.png (Coca)');

    // 7Up (right)
    const sevenUpCrop = await sharp(drinksSrc)
      .extract({ left: 510, top: 80, width: 460, height: 780 })
      .toBuffer();
    const sevenUpTrans = await makeTransparent(sevenUpCrop, 240);
    await sevenUpTrans.resize(160, 270).toFile('public/assets/food/food_7up.png');
    await sevenUpTrans.resize(160, 270).toFile('assets-src/food/food_7up.png');
    console.log('✓ Created food_7up.png (7Up)');
  }

  console.log('--- ALL V2 ASSETS EXTRACTED ---');
}

run().catch(console.error);
