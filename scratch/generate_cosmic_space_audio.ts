import fs from 'fs';
import path from 'path';

function createWavHeader(sampleRate: number, numChannels: number, bitsPerSample: number, numSamples: number): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
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

function writePcm16Wav(filePath: string, sampleRate: number, samples: Float32Array) {
  const buffer = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), i * 2);
  }
  const header = createWavHeader(sampleRate, 1, 16, samples.length);
  fs.writeFileSync(filePath, Buffer.concat([header, buffer]));
}

const outDir = path.join(process.cwd(), 'client', 'public', 'themes', 'cosmic_space', 'audio');
fs.mkdirSync(outDir, { recursive: true });

const sampleRate = 44100;

// 1. Cosmic BGM Gameplay (8.0s cinematic deep-space ambient loop)
{
  const duration = 8.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  
  // Cinematic chord progression: Dm -> Bb -> F -> C
  const chordNotes = [
    [146.83, 220.00, 293.66, 440.00], // Dm
    [116.54, 233.08, 293.66, 466.16], // Bb
    [174.61, 220.00, 261.63, 349.23], // F
    [130.81, 196.00, 261.63, 392.00], // C
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const chordIndex = Math.floor((t / duration) * 4) % 4;
    const chord = chordNotes[chordIndex];

    // Deep sub-bass cosmic drone (55Hz root with subtle low-frequency pulsation)
    const subBass = Math.sin(2 * Math.PI * 55 * t) * 0.12 * (1 + 0.1 * Math.sin(2 * Math.PI * 0.5 * t));

    // Warm interstellar synth pad
    let pad = 0;
    for (const freq of chord) {
      const vibrato = 1 + 0.003 * Math.sin(2 * Math.PI * 4 * t);
      pad += (Math.sin(2 * Math.PI * freq * vibrato * t) + 0.4 * Math.sin(4 * Math.PI * freq * t)) * 0.05;
    }

    // Twinkling celestial arpeggio (high chime harmonics)
    const arpT = (t * 2) % 1;
    const arpNote = chord[Math.floor(t * 4) % chord.length] * 2;
    const arpEnv = Math.exp(-arpT * 4);
    const chime = Math.sin(2 * Math.PI * arpNote * t) * arpEnv * 0.035;

    // Atmospheric space hiss / solar wind
    const noise = (Math.random() * 2 - 1) * 0.008;

    samples[i] = subBass + pad + chime + noise;
  }

  // Crossfade boundary for 100% seamless loop
  const fadeLen = Math.floor(sampleRate * 0.15);
  for (let i = 0; i < fadeLen; i++) {
    const frac = i / fadeLen;
    samples[i] = samples[i] * frac + samples[totalSamples - fadeLen + i] * (1 - frac);
  }

  writePcm16Wav(path.join(outDir, 'cosmic-bgm-gameplay.wav'), sampleRate, samples);
}

// 2. Telescope Scan (0.45s soft servo mechanical movement + laser sweep)
{
  const duration = 0.45;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.sin((t / duration) * Math.PI);
    // Mechanical servo motor tone + sweeping laser frequency
    const servo = Math.sin(2 * Math.PI * (180 + 60 * Math.sin(2 * Math.PI * 12 * t)) * t) * 0.2;
    const sweepFreq = 600 + Math.pow(t / duration, 2) * 1600;
    const laser = Math.sin(2 * Math.PI * sweepFreq * t) * 0.15;
    samples[i] = (servo + laser) * env;
  }
  writePcm16Wav(path.join(outDir, 'cosmic-telescope-scan.wav'), sampleRate, samples);
}

// 3. Satellite Relay (0.35s radio telemetry pulse / chirp)
{
  const duration = 0.35;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 8);
    // Multi-frequency digital telemetry pulse
    const f1 = 880 + 440 * Math.floor(t * 20 % 3);
    const pulse = Math.sin(2 * Math.PI * f1 * t) * 0.25;
    const hiss = (Math.random() * 2 - 1) * 0.04 * env;
    samples[i] = (pulse * env) + hiss;
  }
  writePcm16Wav(path.join(outDir, 'cosmic-satellite-relay.wav'), sampleRate, samples);
}

// 4. Docking Clamp (0.40s pneumatic lock + hydraulic confirmation tone)
{
  const duration = 0.40;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 7);
    // Heavy mechanical clamp thud
    const thud = Math.sin(2 * Math.PI * 90 * Math.exp(-t * 12) * t) * 0.35;
    // Hydraulic hiss + chime confirmation
    const hiss = (Math.random() * 2 - 1) * 0.08 * Math.exp(-t * 10);
    const chime = t > 0.15 ? Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-(t - 0.15) * 14) * 0.2 : 0;
    samples[i] = (thud * env) + hiss + chime;
  }
  writePcm16Wav(path.join(outDir, 'cosmic-docking-clamp.wav'), sampleRate, samples);
}

// 5. Astronaut Comms (0.25s radio mic click + comms double-beep)
{
  const duration = 0.25;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Radio squelch click
    const click = t < 0.03 ? (Math.random() * 2 - 1) * 0.3 * Math.exp(-t * 80) : 0;
    // Double beep (1760Hz and 2200Hz)
    let beep = 0;
    if (t >= 0.04 && t < 0.11) {
      beep = Math.sin(2 * Math.PI * 1760 * t) * 0.22;
    } else if (t >= 0.13 && t < 0.20) {
      beep = Math.sin(2 * Math.PI * 2200 * t) * 0.22;
    }
    samples[i] = click + beep;
  }
  writePcm16Wav(path.join(outDir, 'cosmic-astronaut-comms.wav'), sampleRate, samples);
}

// 6. Planetarium Rotate (0.30s soft synthetic orbital resonance tone)
{
  const duration = 0.30;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.sin((t / duration) * Math.PI);
    // Harmonic orbital chords (523.25Hz C5, 659.25Hz E5, 783.99Hz G5, 1046.50Hz C6)
    const chord = (
      Math.sin(2 * Math.PI * 523.25 * t) +
      Math.sin(2 * Math.PI * 659.25 * t) * 0.8 +
      Math.sin(2 * Math.PI * 783.99 * t) * 0.6 +
      Math.sin(2 * Math.PI * 1046.50 * t) * 0.4
    ) * 0.12;
    samples[i] = chord * env;
  }
  writePcm16Wav(path.join(outDir, 'cosmic-planetarium-rotate.wav'), sampleRate, samples);
}

// 7. Asteroid Scan (0.35s directional radar ping + frequency sweep)
{
  const duration = 0.35;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 9);
    // Radar sonar ping with downward sweep
    const sweepFreq = 1800 * Math.exp(-t * 6) + 300;
    const ping = Math.sin(2 * Math.PI * sweepFreq * t) * 0.3;
    const echo = t > 0.08 ? Math.sin(2 * Math.PI * (sweepFreq * 0.7) * t) * Math.exp(-(t - 0.08) * 10) * 0.15 : 0;
    samples[i] = (ping + echo) * env;
  }
  writePcm16Wav(path.join(outDir, 'cosmic-asteroid-scan.wav'), sampleRate, samples);
}

console.log('Cosmic Space procedural audio assets successfully generated in:', outDir);
