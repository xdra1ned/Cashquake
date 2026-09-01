import fs from 'fs';
import path from 'path';

// Helper to write a 16-bit mono WAV file
function writeWavFile(filePath: string, sampleRate: number, samples: Float32Array) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // audio format (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples as 16-bit integers
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    // Clamp sample to [-1, 1]
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
    buffer.writeInt16LE(Math.round(intSample), offset);
    offset += 2;
  }

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${filePath} (${buffer.length} bytes)`);
}

const SAMPLE_RATE = 44100;
const outputDir = path.join(process.cwd(), 'client', 'public', 'themes', 'anime_akiba', 'audio');

// 1. Anime Akiba District Background Music (8.0s seamless loop, 125 BPM upbeat anime/arcade vibe)
function generateAnimeAkibaBgm(): Float32Array {
  const duration = 8.0;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  // Musical elements:
  // Key: C Major (C4, E4, G4, B4, C5) / A minor / F major / G major (Classic J-pop IV-V-iii-vi / I-V-vi-IV progression)
  // Chord progression across 8s:
  // 0-2s: F Maj7 (F, A, C, E)
  // 2-4s: G Maj (G, B, D, G)
  // 4-6s: E min7 (E, G, B, D)
  // 6-8s: A min (A, C, E, A)

  const chords = [
    { start: 0, end: 2, root: 174.61, notes: [349.23, 440.0, 523.25, 659.25] }, // F4, A4, C5, E5
    { start: 2, end: 4, root: 196.00, notes: [392.00, 493.88, 587.33, 783.99] }, // G4, B4, D5, G5
    { start: 4, end: 6, root: 164.81, notes: [329.63, 392.00, 493.88, 587.33] }, // E4, G4, B4, D5
    { start: 6, end: 8, root: 220.00, notes: [440.00, 523.25, 659.25, 880.00] }, // A4, C5, E5, A5
  ];

  // Upbeat 125 BPM (1 beat = 0.48s)
  const beatLen = 0.48;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;

    const chordIdx = Math.min(3, Math.floor(t / 2));
    const chord = chords[chordIdx];

    // 1. Warm Synth Bass (Bouncy 8th notes)
    const bassBeat = (t % (beatLen / 2)) / (beatLen / 2);
    const bassEnv = Math.exp(-bassBeat * 4);
    const bassFreq = chord.root;
    const bassWave = Math.sin(2 * Math.PI * bassFreq * t) + 0.3 * Math.sin(4 * Math.PI * bassFreq * t);
    sample += 0.22 * bassWave * bassEnv;

    // 2. Playful Arpeggiator (16th notes: 0.12s per note)
    const arpBeat = (t % (beatLen / 4)) / (beatLen / 4);
    const arpNoteIdx = Math.floor((t % beatLen) / (beatLen / 4)) % chord.notes.length;
    const arpFreq = chord.notes[arpNoteIdx];
    const arpEnv = Math.exp(-arpBeat * 6);
    // Square/triangle blend for cute anime/chiptune bell tone
    const arpSquare = Math.sign(Math.sin(2 * Math.PI * arpFreq * t)) * 0.5;
    const arpSine = Math.sin(2 * Math.PI * arpFreq * t) * 0.5;
    sample += 0.14 * (arpSquare + arpSine) * arpEnv;

    // 3. Cheerful Pad Chords (soft warm saw/sine blend)
    chord.notes.forEach((freq) => {
      const padSine = Math.sin(2 * Math.PI * freq * t);
      const padWarm = Math.sin(2 * Math.PI * (freq * 0.999) * t) + Math.sin(2 * Math.PI * (freq * 1.001) * t);
      sample += 0.03 * (padSine + padWarm);
    });

    // 4. Subtle Drum Groove (Bouncy Kick on 1 & 3, Crisp Snare on 2 & 4, Hi-hat on 8ths)
    const measureTime = t % (beatLen * 4);
    const beatInMeasure = Math.floor(measureTime / beatLen);
    const timeInBeat = measureTime % beatLen;

    // Kick (Beats 0 & 2)
    if (beatInMeasure === 0 || beatInMeasure === 2) {
      if (timeInBeat < 0.12) {
        const kickFreq = 120 * Math.exp(-timeInBeat * 25) + 45;
        const kickEnv = Math.exp(-timeInBeat * 18);
        sample += 0.22 * Math.sin(2 * Math.PI * kickFreq * timeInBeat) * kickEnv;
      }
    }

    // Snare (Beats 1 & 3)
    if (beatInMeasure === 1 || beatInMeasure === 3) {
      if (timeInBeat < 0.15) {
        const noise = (Math.random() * 2 - 1) * Math.exp(-timeInBeat * 22);
        const snap = Math.sin(2 * Math.PI * 220 * timeInBeat) * Math.exp(-timeInBeat * 30);
        sample += 0.15 * (noise + snap);
      }
    }

    // Hi-hat (every 8th note)
    const eighthTime = t % (beatLen / 2);
    if (eighthTime < 0.05) {
      const hatNoise = (Math.random() * 2 - 1) * Math.exp(-eighthTime * 60);
      sample += 0.06 * hatNoise;
    }

    // Master subtle crossfade for seamless zero-gap loop
    let masterEnv = 1;
    const fadeLen = 0.05;
    if (t < fadeLen) {
      masterEnv = t / fadeLen;
    } else if (t > duration - fadeLen) {
      masterEnv = (duration - t) / fadeLen;
    }

    samples[i] = sample * masterEnv * 0.85;
  }

  return samples;
}

// 2. Anime Billboard Sparkle Shimmer (0.35s)
function generateAnimeBillboardSfx(): Float32Array {
  const duration = 0.35;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6 sparkle arpeggio
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    notes.forEach((freq, idx) => {
      const noteStart = idx * 0.06;
      if (t >= noteStart) {
        const dt = t - noteStart;
        const env = Math.exp(-dt * 14);
        const sine = Math.sin(2 * Math.PI * freq * dt);
        const shimmer = Math.sin(2 * Math.PI * (freq * 2) * dt) * 0.3;
        s += (sine + shimmer) * env * 0.25;
      }
    });
    samples[i] = s;
  }
  return samples;
}

// 3. Gachapon Machine Turn & Drop (0.45s)
function generateGachaponSfx(): Float32Array {
  const duration = 0.45;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;

    // Mechanical crank clicks (0.0s - 0.2s)
    [0.02, 0.08, 0.14].forEach((clickTime) => {
      if (t >= clickTime && t < clickTime + 0.03) {
        const dt = t - clickTime;
        s += (Math.random() * 2 - 1) * Math.exp(-dt * 120) * 0.4;
      }
    });

    // Plastic capsule hollow drop (0.22s)
    if (t >= 0.22) {
      const dt = t - 0.22;
      const thud = Math.sin(2 * Math.PI * 160 * Math.exp(-dt * 15) * dt) * Math.exp(-dt * 20);
      const click = Math.sin(2 * Math.PI * 800 * dt) * Math.exp(-dt * 35);
      s += (thud * 0.5 + click * 0.3);
    }

    // Happy prize chime (0.28s)
    if (t >= 0.28) {
      const dt = t - 0.28;
      const chime = Math.sin(2 * Math.PI * 1046.5 * dt) * Math.exp(-dt * 10);
      s += chime * 0.35;
    }

    samples[i] = s * 0.8;
  }
  return samples;
}

// 4. Japanese Candy Cab Arcade Coin / Combo (0.40s)
function generateArcadeSfx(): Float32Array {
  const duration = 0.40;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  // 16-bit rising chime: B4 -> E5 -> G#5 -> B5
  const notes = [493.88, 659.25, 830.61, 987.77];
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    notes.forEach((freq, idx) => {
      const start = idx * 0.07;
      if (t >= start) {
        const dt = t - start;
        const env = Math.exp(-dt * 12);
        const square = Math.sign(Math.sin(2 * Math.PI * freq * dt)) * 0.25;
        const sine = Math.sin(2 * Math.PI * freq * dt) * 0.25;
        s += (square + sine) * env;
      }
    });
    samples[i] = s * 0.75;
  }
  return samples;
}

// 5. Maid Cafe Door Chime (0.35s)
function generateCafeChimeSfx(): Float32Array {
  const duration = 0.35;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  // Sweet 2-tone melodic doorbell: G5 -> C6
  const tones = [
    { start: 0, freq: 783.99 },
    { start: 0.12, freq: 1046.50 },
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    tones.forEach((tone) => {
      if (t >= tone.start) {
        const dt = t - tone.start;
        const env = Math.exp(-dt * 8);
        const bell = Math.sin(2 * Math.PI * tone.freq * dt) + 0.3 * Math.sin(4 * Math.PI * tone.freq * dt);
        s += bell * env * 0.35;
      }
    });
    samples[i] = s;
  }
  return samples;
}

// 6. Japanese Vending Machine Dispense (0.35s)
function generateVendingSfx(): Float32Array {
  const duration = 0.35;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;

    // Button click beep (0.0s)
    if (t < 0.06) {
      s += Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 30) * 0.3;
    }

    // Mechanical internal motor hum (0.06s - 0.18s)
    if (t >= 0.06 && t < 0.18) {
      const dt = t - 0.06;
      s += (Math.sin(2 * Math.PI * 180 * dt) + (Math.random() * 2 - 1) * 0.2) * 0.2;
    }

    // Cold metallic can drop thud (0.18s)
    if (t >= 0.18) {
      const dt = t - 0.18;
      const thud = Math.sin(2 * Math.PI * 90 * Math.exp(-dt * 15) * dt) * Math.exp(-dt * 18);
      const rattle = (Math.random() * 2 - 1) * Math.exp(-dt * 40) * 0.3;
      s += (thud * 0.6 + rattle * 0.4);
    }

    samples[i] = s * 0.85;
  }
  return samples;
}

// 7. Yamanote Train Station Arrival Chime & Hum (0.50s)
function generateTrainArrivalSfx(): Float32Array {
  const duration = 0.50;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  // 3-note classic melodic Japanese platform departure chime: C5 -> E5 -> G5 -> C6
  const melody = [
    { start: 0.0, freq: 523.25 },
    { start: 0.10, freq: 659.25 },
    { start: 0.20, freq: 783.99 },
    { start: 0.30, freq: 1046.50 },
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;

    // Melodic bells
    melody.forEach((note) => {
      if (t >= note.start) {
        const dt = t - note.start;
        const env = Math.exp(-dt * 9);
        const bell = Math.sin(2 * Math.PI * note.freq * dt) + 0.2 * Math.sin(2 * Math.PI * (note.freq * 2) * dt);
        s += bell * env * 0.25;
      }
    });

    // Subtle electric train rail hum in background
    if (t >= 0.15) {
      const dt = t - 0.15;
      const trainHum = Math.sin(2 * Math.PI * 110 * dt) * Math.min(1, dt * 4) * Math.exp(-dt * 3);
      s += trainHum * 0.15;
    }

    samples[i] = s * 0.85;
  }
  return samples;
}

// Execute synthesis
console.log('Synthesizing Anime Akiba audio suite...');
writeWavFile(path.join(outputDir, 'anime-akiba-bgm-gameplay.wav'), SAMPLE_RATE, generateAnimeAkibaBgm());
writeWavFile(path.join(outputDir, 'anime-billboard-cycle.wav'), SAMPLE_RATE, generateAnimeBillboardSfx());
writeWavFile(path.join(outputDir, 'anime-gachapon-turn.wav'), SAMPLE_RATE, generateGachaponSfx());
writeWavFile(path.join(outputDir, 'anime-arcade-coin.wav'), SAMPLE_RATE, generateArcadeSfx());
writeWavFile(path.join(outputDir, 'anime-cafe-chime.wav'), SAMPLE_RATE, generateCafeChimeSfx());
writeWavFile(path.join(outputDir, 'anime-vending-drop.wav'), SAMPLE_RATE, generateVendingSfx());
writeWavFile(path.join(outputDir, 'anime-train-arrival.wav'), SAMPLE_RATE, generateTrainArrivalSfx());

console.log('All Anime Akiba audio assets generated successfully!');
