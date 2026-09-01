import fs from 'fs';
import path from 'path';

function generateCauldronBubbleWav(): Buffer {
  const sampleRate = 44100;
  const duration = 0.55; // 0.55 seconds
  const totalSamples = Math.floor(sampleRate * duration);
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV header
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
  buffer.writeUInt16LE(16, 34); // 16-bit
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Synthesize realistic bubbling liquid + magical vapor sound
  // 4 discrete bubbles with pitch sweeps + water pops
  const bubbles = [
    { start: 0.02, dur: 0.10, startFreq: 300, endFreq: 750, amp: 0.45 },
    { start: 0.12, dur: 0.12, startFreq: 420, endFreq: 920, amp: 0.55 },
    { start: 0.22, dur: 0.14, startFreq: 350, endFreq: 820, amp: 0.60 },
    { start: 0.36, dur: 0.15, startFreq: 480, endFreq: 1100, amp: 0.50 },
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Bubbles
    for (const b of bubbles) {
      if (t >= b.start && t < b.start + b.dur) {
        const bt = (t - b.start) / b.dur;
        const currentFreq = b.startFreq + (b.endFreq - b.startFreq) * Math.pow(bt, 1.8);
        const env = Math.sin(bt * Math.PI); // Smooth bell envelope
        // Sine with slight square water pop
        const wave = Math.sin(2 * Math.PI * currentFreq * t) + 0.2 * Math.sin(4 * Math.PI * currentFreq * t);
        sample += wave * env * b.amp;
      }
    }

    // Gentle magical steam fizz (filtered pink-ish noise)
    const steamEnv = Math.sin((t / duration) * Math.PI) * 0.15;
    const noise = (Math.random() * 2 - 1) * steamEnv;
    sample += noise;

    // Magical harmonic shimmer at end (1200Hz + 1800Hz bell)
    if (t > 0.25) {
      const chimeEnv = Math.exp(-(t - 0.25) * 8) * 0.25;
      const chime = Math.sin(2 * Math.PI * 1318.5 * t) + Math.sin(2 * Math.PI * 1975.5 * t);
      sample += chime * chimeEnv;
    }

    // Master envelope
    const masterEnv = Math.sin((t / duration) * Math.PI);
    sample = Math.max(-1, Math.min(1, sample * masterEnv));

    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const audioDir = path.resolve(__dirname, '../client/public/themes/mystic_fantasy/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

fs.writeFileSync(path.join(audioDir, 'mystic-cauldron-bubble.wav'), generateCauldronBubbleWav());
console.log('✓ Generated mystic-cauldron-bubble.wav successfully');
