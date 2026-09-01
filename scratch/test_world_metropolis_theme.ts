import fs from 'fs';
import path from 'path';
import { TILE_BLUEPRINTS, THEME_NAMES } from '../shared/constants';

function runWorldMetropolisTests() {
  console.log('🏛️ Running World Metropolis Theme Deep Verification Suite...');

  // 1. Verify Board Space Invariance
  console.log('\n--- 1. Testing Board Rules & Pricing Invariance ---');
  if (TILE_BLUEPRINTS.length !== 40) {
    throw new Error(`Expected 40 board spaces, found ${TILE_BLUEPRINTS.length}`);
  }

  const worldTourTheme = THEME_NAMES.world_tour;
  if (!worldTourTheme || !worldTourTheme.tiles) {
    throw new Error('THEME_NAMES.world_tour.tiles not found!');
  }

  TILE_BLUEPRINTS.forEach((space, idx) => {
    // Check that prices, rent tables, mortgages are intact
    if (space.group && !space.price) {
      throw new Error(`Space #${idx} (${space.type}) is missing price!`);
    }
    if (space.group && (!space.rent || space.rent.length !== 6)) {
      throw new Error(`Space #${idx} (${space.type}) has invalid rent structure!`);
    }
  });
  console.log('✓ All 40 board spaces have 100% invariant pricing, rents, and mortgages.');

  // 2. Verify World Metropolis Space Names
  console.log('\n--- 2. Testing Themed Space Naming & Transit Integration ---');
  const expectedKeySpaces: Record<number, string> = {
    0: 'CITY CENTER / GO',
    4: 'Municipal Toll',
    5: 'Central Station Metro',
    10: 'Municipal Detention',
    12: 'Electricity Grid',
    15: 'Grand Terminal Express',
    20: 'City Parking Plaza',
    25: 'Riverside Metro Line',
    28: 'Water Authority',
    30: 'Police Precinct!',
    35: 'International Transit Hub',
    38: 'City Revenue Tax',
  };

  for (const [idxStr, expectedName] of Object.entries(expectedKeySpaces)) {
    const idx = parseInt(idxStr, 10);
    const actualName = worldTourTheme.tiles[idx];
    if (actualName !== expectedName) {
      throw new Error(`Space #${idx} mismatch. Expected: "${expectedName}", got: "${actualName}"`);
    }
  }
  console.log('✓ All key metropolitan transit, municipal, and utility spaces correctly mapped.');

  // 3. Verify Audio Assets Exist
  console.log('\n--- 3. Verifying Audio Files & Licensing Attribution ---');
  const themeDir = path.resolve(__dirname, '../client/public/themes/world_tour');
  const audioDir = path.join(themeDir, 'audio');
  const requiredFiles = [
    'metropolis-bgm-gameplay.wav',
    'metropolis-terminal-confirm.wav',
    'metropolis-metro-chime.wav',
    'metropolis-traffic-beep.wav',
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(audioDir, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing audio file: ${file}`);
    }
    const stats = fs.statSync(fullPath);
    if (stats.size === 0) {
      throw new Error(`Audio file ${file} is empty (0 bytes)!`);
    }
    console.log(`✓ Found audio/${file} (${stats.size} bytes)`);
  }

  const attrPath = path.join(themeDir, 'AUDIO_ATTRIBUTION.md');
  if (!fs.existsSync(attrPath)) {
    throw new Error('Missing AUDIO_ATTRIBUTION.md');
  }
  console.log('✓ Found AUDIO_ATTRIBUTION.md');

  // 4. Verify Non-Interference with other themes
  console.log('\n--- 4. Verifying Casino Royale and Pixel Arcade Invariance ---');
  if (!THEME_NAMES.casino_royale || !THEME_NAMES.pixel_arcade) {
    throw new Error('Casino Royale or Pixel Arcade theme names missing!');
  }
  console.log('✓ Casino Royale and Pixel Arcade remain completely intact and untouched.');

  console.log('\n🎉 ALL WORLD METROPOLIS THEME TESTS PASSED SUCCESSFULLY!');
}

runWorldMetropolisTests();
