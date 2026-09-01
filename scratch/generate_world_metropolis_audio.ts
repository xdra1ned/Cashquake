import fs from 'fs';
import path from 'path';

// Output Directory
const outputDir = path.resolve(__dirname, '../client/public/themes/world_tour/audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const SAMPLE_RATE = 22050; // 22.05 kHz for high-quality, lightweight assets

function writeWavFile(filename: string, samples: Float32Array) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (SAMPLE_RATE * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
    buffer.writeInt16LE(Math.floor(intSample), offset);
    offset += 2;
  }

  const fullPath = path.join(outputDir, filename);
  fs.writeFileSync(fullPath, buffer);
  console.log(`Generated: ${filename} (${buffer.length} bytes)`);
}

// 1. Seamless Background Music Loop: Sophisticated Lo-Fi Metropolitan Lounge (8 measures, 90 BPM)
function generateMetropolisBgm(): Float32Array {
  const bpm = 90;
  const beatSec = 60 / bpm;
  const totalBeats = 16; // 4 measures of 4/4
  const duration = totalBeats * beatSec;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const out = new Float32Array(totalSamples);

  // Chord Progression: Dmaj7 -> Bm7 -> Em7 -> A7sus4 (Urban sophisticated jazz-hop feel)
  const chords = [
    { root: 146.83, notes: [293.66, 369.99, 440.0, 554.37] }, // Dmaj7: D4, F#4, A4, C#5
    { root: 123.47, notes: [246.94, 293.66, 369.99, 440.0] }, // Bm7: B3, D4, F#4, A4
    { root: 164.81, notes: [329.63, 392.0, 493.88, 587.33] }, // Em7: E4, G4, B4, D5
    { root: 110.0, notes: [293.66, 329.63, 440.0, 587.33] },  // A7sus4: D4, E4, A4, D5
  ];

  for (let chordIdx = 0; chordIdx < 4; chordIdx++) {
    const chord = chords[chordIdx];
    const chordStartSample = Math.floor(chordIdx * 4 * beatSec * SAMPLE_RATE);
    const chordEndSample = Math.floor((chordIdx + 1) * 4 * beatSec * SAMPLE_RATE);

    for (let i = chordStartSample; i < chordEndSample; i++) {
      const t = (i - chordStartSample) / SAMPLE_RATE;
      const beatProgress = (t / beatSec) % 1;

      // 1. Electric Piano / Vibraphone Chords (gentle bell-sine harmonics)
      let epiano = 0;
      for (const freq of chord.notes) {
        const decay = Math.exp(-t * 0.7);
        epiano += Math.sin(2 * Math.PI * freq * t) * decay * 0.08;
        epiano += Math.sin(2 * Math.PI * (freq * 2) * t) * decay * 0.02;
      }

      // 2. Smooth Upright Bassline (warm triangle/sine sub-bass on beats 1 and 3)
      const bassBeat = Math.floor(t / beatSec);
      const bassT = t - bassBeat * beatSec;
      const bassEnv = Math.exp(-bassT * 3.5);
      const bassFreq = bassBeat % 2 === 0 ? chord.root : chord.root * 1.5;
      const bass = (Math.sin(2 * Math.PI * bassFreq * t) + 0.3 * Math.sin(2 * Math.PI * bassFreq * 2 * t)) * bassEnv * 0.16;

      // 3. Subtle Lo-Fi Percussion (soft brushed hi-hat and gentle rim click)
      let perc = 0;
      // Hi-hat on 8th notes
      const eighthProgress = ((t / (beatSec / 2)) % 1);
      if (eighthProgress < 0.15) {
        perc += (Math.random() * 2 - 1) * Math.exp(-eighthProgress * 30) * 0.02;
      }
      // Gentle rim click on beats 2 and 4
      if ((bassBeat === 1 || bassBeat === 3) && bassT < 0.08) {
        perc += Math.sin(2 * Math.PI * 800 * bassT) * Math.exp(-bassT * 50) * 0.05;
      }

      out[i] = epiano + bass + perc;
    }
  }

  // Crossfade boundary (first 100ms and last 100ms) for perfectly seamless 0-click looping
  const fadeLen = Math.floor(0.1 * SAMPLE_RATE);
  for (let i = 0; i < fadeLen; i++) {
    const factor = i / fadeLen;
    out[i] = out[i] * factor + out[totalSamples - fadeLen + i] * (1 - factor);
  }

  return out;
}

// 2. City Financial Terminal Sound (crisp modern corporate confirmation chime)
function generateTerminalSound(): Float32Array {
  const duration = 0.35;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const out = new Float32Array(numSamples);
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 -> E5 -> G5 -> C6

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;
    notes.forEach((freq, idx) => {
      const noteStart = idx * 0.05;
      if (t >= noteStart) {
        const noteT = t - noteStart;
        const env = Math.exp(-noteT * 12);
        sample += Math.sin(2 * Math.PI * freq * noteT) * env * 0.12;
      }
    });
    out[i] = sample;
  }
  return out;
}

// 3. Metro Station Announcement Chime (pleasant 2-tone melodic transit chime)
function generateMetroChime(): Float32Array {
  const duration = 0.55;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const out = new Float32Array(numSamples);
  const notes = [659.25, 783.99]; // E5 -> G5

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;
    // Note 1: E5 (0.0s)
    if (t < 0.22) {
      const env = Math.exp(-t * 6);
      sample += Math.sin(2 * Math.PI * notes[0] * t) * env * 0.18;
      sample += Math.sin(2 * Math.PI * (notes[0] * 2) * t) * env * 0.05;
    }
    // Note 2: G5 (0.22s)
    if (t >= 0.22) {
      const t2 = t - 0.22;
      const env = Math.exp(-t2 * 5);
      sample += Math.sin(2 * Math.PI * notes[1] * t2) * env * 0.2;
      sample += Math.sin(2 * Math.PI * (notes[1] * 2) * t2) * env * 0.06;
    }
    out[i] = sample;
  }
  return out;
}

// 4. Traffic Signal Click / Pedestrian Tick
function generateTrafficBeep(): Float32Array {
  const duration = 0.1;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const out = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 40);
    const freq = 1200;
    out[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.15;
  }
  return out;
}

// Run Generators
console.log('Generating World Metropolis procedural audio assets...');
writeWavFile('metropolis-bgm-gameplay.wav', generateMetropolisBgm());
writeWavFile('metropolis-terminal-confirm.wav', generateTerminalSound());
writeWavFile('metropolis-metro-chime.wav', generateMetroChime());
writeWavFile('metropolis-traffic-beep.wav', generateTrafficBeep());
console.log('✅ World Metropolis audio generation complete!\n');
