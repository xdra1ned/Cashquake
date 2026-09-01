import fs from 'fs';
import path from 'path';

function writeWavHeader(numChannels: number, sampleRate: number, bitsPerSample: number, numSamples: number): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = (numSamples * numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

const sampleRate = 22050;
const outputDir = path.resolve(__dirname, '../client/public/themes/mystic_fantasy/audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Synthesize mystic-bgm-gameplay.wav (Seamless 8.0-second ambient enchanted fantasy loop, ~75 BPM)
const bgmDuration = 8.0;
const bgmNumSamples = Math.floor(sampleRate * bgmDuration);
const bgmBuffer = Buffer.alloc(bgmNumSamples * 2);

for (let i = 0; i < bgmNumSamples; i++) {
  const t = i / sampleRate;

  // Chord Progression: Dm9 (0-2s), Bbmaj7 (2-4s), Cmaj7 (4-6s), Am7 (6-8s)
  let rootFreq = 73.42; // D2
  let chordFreqs = [293.66, 349.23, 440.0, 523.25, 659.25]; // D4, F4, A4, C5, E5
  if (t >= 2.0 && t < 4.0) {
    rootFreq = 58.27; // Bb1
    chordFreqs = [233.08, 293.66, 349.23, 440.0, 587.33]; // Bb3, D4, F4, A4, D5
  } else if (t >= 4.0 && t < 6.0) {
    rootFreq = 65.41; // C2
    chordFreqs = [261.63, 329.63, 392.0, 493.88, 587.33]; // C4, E4, G4, B4, D5
  } else if (t >= 6.0) {
    rootFreq = 55.0; // A1
    chordFreqs = [220.0, 261.63, 329.63, 392.0, 493.88]; // A3, C4, E4, G4, B4
  }

  // Warm Acoustic Celtic Bass Resonance (Sub Sine + Warm 2nd Harmonic)
  const bassSine = Math.sin(2.0 * Math.PI * rootFreq * t);
  const bassWarmth = Math.sin(4.0 * Math.PI * rootFreq * t) * 0.25;
  const bass = (bassSine + bassWarmth) * 0.22;

  // Ethereal Mystic Choir / Pad (Rich additive sines with slow chorus modulation)
  let pad = 0;
  for (const freq of chordFreqs) {
    const padLfo = 1.0 + 0.003 * Math.sin(2.0 * Math.PI * 0.5 * t);
    const wave = Math.sin(2.0 * Math.PI * freq * padLfo * t) + 0.3 * Math.sin(4.0 * Math.PI * freq * t);
    pad += wave * 0.045;
  }
  const padTremolo = 0.85 + 0.15 * Math.sin(2.0 * Math.PI * 1.2 * t);
  pad *= padTremolo;

  // Enchanted Harp Arpeggio (8th notes: 2.5 Hz)
  const harpStep = Math.floor((t * 2.5) % chordFreqs.length);
  const harpFreq = chordFreqs[harpStep];
  const harpTime = (t * 2.5) % 1.0;
  const harpEnv = Math.exp(-harpTime * 4.5);
  const harpWave = (Math.sin(2.0 * Math.PI * harpFreq * t) + 0.35 * Math.sin(4.0 * Math.PI * harpFreq * t)) * harpEnv * 0.12;

  // Celestial Wind Chimes / Starlight Glimmer (Subtle high sparkling tones)
  const bellTime = (t * 1.25) % 1.0;
  const bellFreq = 1760.0 + ((Math.floor(t * 1.25) % 3) * 220.0);
  const bellEnv = Math.exp(-bellTime * 6.0);
  const bell = Math.sin(2.0 * Math.PI * bellFreq * t) * bellEnv * 0.035;

  let mixed = (bass + pad + harpWave + bell) * 0.88;

  // Boundary crossfade for 100% seamless zero-click loop
  const fadeDuration = 0.05;
  const fadeSamples = Math.floor(sampleRate * fadeDuration);
  if (i < fadeSamples) {
    const factor = i / fadeSamples;
    mixed *= factor;
  } else if (i > bgmNumSamples - fadeSamples) {
    const factor = (bgmNumSamples - i) / fadeSamples;
    mixed *= factor;
  }

  mixed = Math.max(-1.0, Math.min(1.0, mixed));
  const sample16 = Math.floor(mixed * 32767);
  bgmBuffer.writeInt16LE(sample16, i * 2);
}

fs.writeFileSync(
  path.join(outputDir, 'mystic-bgm-gameplay.wav'),
  Buffer.concat([writeWavHeader(1, sampleRate, 16, bgmNumSamples), bgmBuffer])
);
console.log('✓ Generated mystic-bgm-gameplay.wav');

// 2. Synthesize mystic-grimoire-open.wav (Parchment page flutter + mystical bell resonance)
const grimDuration = 0.4;
const grimSamples = Math.floor(sampleRate * grimDuration);
const grimBuffer = Buffer.alloc(grimSamples * 2);

for (let i = 0; i < grimSamples; i++) {
  const t = i / sampleRate;
  // Rustle envelope + Chime frequencies: E5 (659Hz) -> B5 (987Hz) -> E6 (1318Hz)
  const rustle = (Math.random() * 2 - 1) * Math.exp(-t * 15.0) * 0.15;
  const chimeFreq = t < 0.12 ? 659.25 : t < 0.24 ? 987.77 : 1318.51;
  const chime = Math.sin(2.0 * Math.PI * chimeFreq * t) * Math.exp(-t * 5.0) * 0.35;
  const mixed = Math.max(-1.0, Math.min(1.0, rustle + chime));
  grimBuffer.writeInt16LE(Math.floor(mixed * 32767), i * 2);
}
fs.writeFileSync(
  path.join(outputDir, 'mystic-grimoire-open.wav'),
  Buffer.concat([writeWavHeader(1, sampleRate, 16, grimSamples), grimBuffer])
);
console.log('✓ Generated mystic-grimoire-open.wav');

// 3. Synthesize mystic-crystal-shimmer.wav (300ms high-frequency ethereal crystal shimmer)
const crystDuration = 0.3;
const crystSamples = Math.floor(sampleRate * crystDuration);
const crystBuffer = Buffer.alloc(crystSamples * 2);

for (let i = 0; i < crystSamples; i++) {
  const t = i / sampleRate;
  const vibrato = 8.0 * Math.sin(2.0 * Math.PI * 18.0 * t);
  const freq = 1567.98 + vibrato; // G6
  const env = Math.exp(-t * 7.0);
  const wave = (Math.sin(2.0 * Math.PI * freq * t) + 0.4 * Math.sin(4.0 * Math.PI * freq * t)) * env * 0.4;
  crystBuffer.writeInt16LE(Math.floor(Math.max(-1, Math.min(1, wave)) * 32767), i * 2);
}
fs.writeFileSync(
  path.join(outputDir, 'mystic-crystal-shimmer.wav'),
  Buffer.concat([writeWavHeader(1, sampleRate, 16, crystSamples), crystBuffer])
);
console.log('✓ Generated mystic-crystal-shimmer.wav');

// 4. Synthesize mystic-rune-pulse.wav (250ms resonant elemental burst chord)
const runeDuration = 0.25;
const runeSamples = Math.floor(sampleRate * runeDuration);
const runeBuffer = Buffer.alloc(runeSamples * 2);

for (let i = 0; i < runeSamples; i++) {
  const t = i / sampleRate;
  const env = Math.exp(-t * 9.0);
  const wave = (Math.sin(2.0 * Math.PI * 440.0 * t) + Math.sin(2.0 * Math.PI * 554.37 * t) + Math.sin(2.0 * Math.PI * 659.25 * t)) * 0.25 * env;
  runeBuffer.writeInt16LE(Math.floor(Math.max(-1, Math.min(1, wave)) * 32767), i * 2);
}
fs.writeFileSync(
  path.join(outputDir, 'mystic-rune-pulse.wav'),
  Buffer.concat([writeWavHeader(1, sampleRate, 16, runeSamples), runeBuffer])
);
console.log('✓ Generated mystic-rune-pulse.wav');

// 5. Synthesize mystic-fountain-ripple.wav (350ms gentle melodic water ripple with harmonic chime)
const fountDuration = 0.35;
const fountSamples = Math.floor(sampleRate * fountDuration);
const fountBuffer = Buffer.alloc(fountSamples * 2);

for (let i = 0; i < fountSamples; i++) {
  const t = i / sampleRate;
  const sweepFreq = 523.25 + 300.0 * Math.sin(2.0 * Math.PI * 6.0 * t);
  const env = Math.exp(-t * 6.5);
  const waterNoise = (Math.random() * 2 - 1) * Math.exp(-t * 12.0) * 0.08;
  const chime = Math.sin(2.0 * Math.PI * sweepFreq * t) * env * 0.35;
  const mixed = Math.max(-1.0, Math.min(1.0, chime + waterNoise));
  fountBuffer.writeInt16LE(Math.floor(mixed * 32767), i * 2);
}
fs.writeFileSync(
  path.join(outputDir, 'mystic-fountain-ripple.wav'),
  Buffer.concat([writeWavHeader(1, sampleRate, 16, fountSamples), fountBuffer])
);
console.log('✓ Generated mystic-fountain-ripple.wav');

// 6. Synthesize mystic-wisp-chime.wav (180ms sparkling high-frequency fairy chime)
const wispDuration = 0.18;
const wispSamples = Math.floor(sampleRate * wispDuration);
const wispBuffer = Buffer.alloc(wispSamples * 2);

for (let i = 0; i < wispSamples; i++) {
  const t = i / sampleRate;
  const freq = 2093.0 + 500.0 * (t / wispDuration); // C7 ascending
  const env = Math.exp(-t * 12.0);
  const wave = Math.sin(2.0 * Math.PI * freq * t) * env * 0.35;
  wispBuffer.writeInt16LE(Math.floor(Math.max(-1, Math.min(1, wave)) * 32767), i * 2);
}
fs.writeFileSync(
  path.join(outputDir, 'mystic-wisp-chime.wav'),
  Buffer.concat([writeWavHeader(1, sampleRate, 16, wispSamples), wispBuffer])
);
console.log('✓ Generated mystic-wisp-chime.wav');

// Write AUDIO_ATTRIBUTION.md
const attributionContent = `# Audio Licensing & Provenance: Mystic Fantasy Realm Theme

All audio assets for the Mystic Fantasy Realm (\`mystic_fantasy\`) theme in Cashquake are custom procedural audio files generated dynamically and cleanly synthesized directly from first principles.

## File Manifest & Attribution

| File | Duration | Format | Description | Provenance & License |
|------|----------|--------|-------------|----------------------|
| \`audio/mystic-bgm-gameplay.wav\` | 8.0s (Loop) | 22.05kHz 16-bit Mono WAV | Ambient enchanted fantasy loop (acoustic bass, ethereal choir pad, celtic harp arpeggio, celestial bell chimes) | Procedural Original (CC0 1.0 Universal - Public Domain) |
| \`audio/mystic-grimoire-open.wav\` | 0.40s | 22.05kHz 16-bit Mono WAV | Parchment page flutter and ascending mystical bell chime | Procedural Original (CC0 1.0 Universal - Public Domain) |
| \`audio/mystic-crystal-shimmer.wav\` | 0.30s | 22.05kHz 16-bit Mono WAV | High-frequency ethereal crystal shimmer with vibrato | Procedural Original (CC0 1.0 Universal - Public Domain) |
| \`audio/mystic-rune-pulse.wav\` | 0.25s | 22.05kHz 16-bit Mono WAV | Resonant elemental burst chord | Procedural Original (CC0 1.0 Universal - Public Domain) |
| \`audio/mystic-fountain-ripple.wav\` | 0.35s | 22.05kHz 16-bit Mono WAV | Gentle harmonic water ripple with harmonic chime | Procedural Original (CC0 1.0 Universal - Public Domain) |
| \`audio/mystic-wisp-chime.wav\` | 0.18s | 22.05kHz 16-bit Mono WAV | High-frequency fairy sparkle chime | Procedural Original (CC0 1.0 Universal - Public Domain) |

## Independent Audio Channel Architecture
All sound effects execute on dedicated, isolated Web Audio channels and will NEVER restart or interrupt the continuous background music.
`;

fs.writeFileSync(path.join(outputDir, '../AUDIO_ATTRIBUTION.md'), attributionContent);
console.log('✓ Created AUDIO_ATTRIBUTION.md');
