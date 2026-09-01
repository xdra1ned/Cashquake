import * as fs from 'fs';
import * as path from 'path';

// Helper to write a 16-bit PCM Mono WAV file
function createWavBuffer(sampleRate: number, samples: Float32Array): Buffer {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF identifier
  buffer.write('RIFF', 0);
  // file length
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  // RIFF type
  buffer.write('WAVE', 8);
  // format chunk identifier
  buffer.write('fmt ', 12);
  // format chunk length
  buffer.writeUInt32LE(16, 16);
  // sample format (1 is PCM)
  buffer.writeUInt16LE(1, 20);
  // channel count (1 = mono)
  buffer.writeUInt16LE(1, 22);
  // sample rate
  buffer.writeUInt32LE(sampleRate, 24);
  // byte rate (sampleRate * 1 channel * 2 bytes/sample)
  buffer.writeUInt32LE(sampleRate * 2, 28);
  // block align (1 channel * 2 bytes)
  buffer.writeUInt16LE(2, 32);
  // bits per sample
  buffer.writeUInt16LE(16, 34);
  // data chunk identifier
  buffer.write('data', 36);
  // data chunk length
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Write samples
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7fff, 44 + i * 2);
  }

  return buffer;
}

// 8-bit waveforms
function squareWave(phase: number, duty = 0.5): number {
  return (phase % (2 * Math.PI)) / (2 * Math.PI) < duty ? 0.7 : -0.7;
}

function triangleWave(phase: number): number {
  const p = (phase % (2 * Math.PI)) / (2 * Math.PI);
  return (p < 0.5 ? 4 * p - 1 : 3 - 4 * p) * 0.7;
}

function whiteNoise(): number {
  return (Math.random() * 2 - 1) * 0.5;
}

const SAMPLE_RATE = 22050; // Classic retro 22.05 kHz

function noteFreq(note: string): number {
  const notes: Record<string, number> = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98
  };
  return notes[note] || 440;
}

export function generatePixelArcadeAudioAssets(outputDir: string) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Dice Roll (8-bit rattle and click)
  {
    const duration = 0.28;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const rattle = Math.sin(t * 70) > 0 ? whiteNoise() * 0.4 : 0;
      const pulse = squareWave(2 * Math.PI * (280 + Math.sin(t * 80) * 100) * t, 0.25) * 0.3;
      const env = Math.max(0, 1 - t / duration);
      samples[i] = (rattle + pulse) * env;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-dice-roll.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 2. Coin Purchase (Classic two-tone chime B5 -> E6)
  {
    const duration = 0.22;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const freq = t < 0.08 ? noteFreq('B5') : noteFreq('E6');
      const env = Math.max(0, 1 - (t % 0.11) / 0.11);
      samples[i] = squareWave(2 * Math.PI * freq * t, 0.5) * env * 0.45;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-coin-purchase.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 3. Payment Descend (Descending arpeggio G5 -> E5 -> C5 -> G4)
  {
    const duration = 0.32;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    const notes = [noteFreq('G5'), noteFreq('E5'), noteFreq('C5'), noteFreq('G4')];
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const noteIdx = Math.min(notes.length - 1, Math.floor(t / 0.075));
      const freq = notes[noteIdx];
      const env = Math.max(0, 1 - t / duration);
      samples[i] = triangleWave(2 * Math.PI * freq * t) * env * 0.5;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-payment-descend.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 4. Build House (8-bit double hammer blip G4 -> C5)
  {
    const duration = 0.24;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const freq = t < 0.1 ? noteFreq('G4') : noteFreq('C5');
      const env = Math.max(0, 1 - (t % 0.12) / 0.12);
      const click = (t < 0.02 || (t > 0.12 && t < 0.14)) ? whiteNoise() * 0.3 : 0;
      samples[i] = (squareWave(2 * Math.PI * freq * t, 0.25) * env * 0.4) + click;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-build-house.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 5. Hotel Upgrade (4-note ascending fanfare C5 -> E5 -> G5 -> C6)
  {
    const duration = 0.45;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    const notes = [noteFreq('C5'), noteFreq('E5'), noteFreq('G5'), noteFreq('C6')];
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const noteIdx = Math.min(notes.length - 1, Math.floor(t / 0.1));
      const freq = notes[noteIdx];
      const env = Math.max(0, 1 - (t - noteIdx * 0.1) / 0.15);
      samples[i] = squareWave(2 * Math.PI * freq * t, 0.5) * env * 0.45;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-hotel-upgrade.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 6. Auction Bid (Crisp retro pulse tap)
  {
    const duration = 0.15;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const freq = 600 - t * 1500;
      const env = Math.max(0, 1 - t / duration);
      samples[i] = (squareWave(2 * Math.PI * Math.max(80, freq) * t, 0.25) * 0.35 + whiteNoise() * 0.15) * env;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-auction-bid.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 7. Bankruptcy / Game Over (4-note subdued cue C4 -> G3 -> E3 -> C3)
  {
    const duration = 0.7;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    const notes = [noteFreq('C4'), noteFreq('G3'), noteFreq('E3'), noteFreq('C3')];
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const noteIdx = Math.min(notes.length - 1, Math.floor(t / 0.16));
      const freq = notes[noteIdx];
      const env = Math.max(0, 1 - t / duration);
      samples[i] = triangleWave(2 * Math.PI * freq * t) * env * 0.55;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-bankruptcy-gameover.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 8. Victory Fanfare (Celebratory retro fanfare)
  {
    const duration = 0.85;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    const notes = [noteFreq('C5'), noteFreq('C5'), noteFreq('E5'), noteFreq('G5'), noteFreq('C6'), noteFreq('G5'), noteFreq('C6')];
    const timings = [0, 0.09, 0.18, 0.27, 0.38, 0.52, 0.64, 0.85];
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      let noteIdx = 0;
      for (let j = 0; j < timings.length - 1; j++) {
        if (t >= timings[j] && t < timings[j + 1]) {
          noteIdx = j;
          break;
        }
      }
      const freq = notes[noteIdx] || noteFreq('C6');
      const noteStart = timings[noteIdx];
      const noteDuration = (timings[noteIdx + 1] || duration) - noteStart;
      const env = Math.max(0, 1 - (t - noteStart) / (noteDuration * 1.1));
      samples[i] = (squareWave(2 * Math.PI * freq * t, 0.5) * 0.4 + triangleWave(2 * Math.PI * (freq / 2) * t) * 0.2) * env;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-victory-fanfare.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 9. Chat Blip (High crisp 8-bit chirp A5 -> D6, 70ms)
  {
    const duration = 0.08;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const freq = t < 0.035 ? noteFreq('A5') : noteFreq('D6');
      const env = Math.max(0, 1 - t / duration);
      samples[i] = squareWave(2 * Math.PI * freq * t, 0.5) * env * 0.4;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-chat-blip.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 10. Button Tap (Crisp 8-bit UI click 35ms)
  {
    const duration = 0.04;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const freq = 900 - t * 8000;
      const env = Math.max(0, 1 - t / duration);
      samples[i] = squareWave(2 * Math.PI * Math.max(100, freq) * t, 0.25) * env * 0.3;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-button-tap.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 11. Token Hop (8-bit hop sweep F4 -> A4, 50ms)
  {
    const duration = 0.06;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const freq = 350 + (t / duration) * 200;
      const env = Math.max(0, 1 - t / duration);
      samples[i] = triangleWave(2 * Math.PI * freq * t) * env * 0.45;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-token-hop.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 12. BGM Gameplay: Energetic unobtrusive 8-bit chiptune loop (4.8s seamless loop at 125 BPM)
  {
    const duration = 4.8; // 8 measures of 2/4 at 100 BPM
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    const melodyNotes = ['C5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'G5', 'E5', 'G5', 'C6', 'B5', 'A5', 'G5', 'D5', 'C5'];
    const bassNotes = ['C3', 'G3', 'A3', 'F3', 'C3', 'G3', 'F3', 'G3'];

    const noteLen = duration / melodyNotes.length;
    const bassLen = duration / bassNotes.length;

    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const mIdx = Math.floor(t / noteLen) % melodyNotes.length;
      const mFreq = noteFreq(melodyNotes[mIdx]);
      const mEnv = Math.max(0.15, 1 - ((t % noteLen) / noteLen) * 0.8);
      const mLead = squareWave(2 * Math.PI * mFreq * t, 0.25) * mEnv * 0.18;

      const bIdx = Math.floor(t / bassLen) % bassNotes.length;
      const bFreq = noteFreq(bassNotes[bIdx]);
      const bEnv = Math.max(0.2, 1 - ((t % bassLen) / bassLen) * 0.6);
      const bBass = triangleWave(2 * Math.PI * bFreq * t) * bEnv * 0.22;

      const beat = (t % 0.3) < 0.04 ? whiteNoise() * 0.05 : 0;
      samples[i] = mLead + bBass + beat;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-bgm-gameplay.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 13. BGM Lobby: Relaxed, pleasant 8-bit arcade loop (5.4s seamless loop at 90 BPM)
  {
    const duration = 5.4;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    const melodyNotes = ['E4', 'G4', 'B4', 'D5', 'C5', 'A4', 'F4', 'G4', 'E4', 'A4', 'C5', 'E5', 'D5', 'B4', 'G4', 'C5'];
    const bassNotes = ['C3', 'E3', 'A3', 'F3', 'G3', 'E3', 'F3', 'G3'];

    const noteLen = duration / melodyNotes.length;
    const bassLen = duration / bassNotes.length;

    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const mIdx = Math.floor(t / noteLen) % melodyNotes.length;
      const mFreq = noteFreq(melodyNotes[mIdx]);
      const mEnv = Math.max(0.2, 1 - ((t % noteLen) / noteLen) * 0.7);
      const mLead = triangleWave(2 * Math.PI * mFreq * t) * mEnv * 0.2;

      const bIdx = Math.floor(t / bassLen) % bassNotes.length;
      const bFreq = noteFreq(bassNotes[bIdx]);
      const bEnv = Math.max(0.2, 1 - ((t % bassLen) / bassLen) * 0.6);
      const bBass = triangleWave(2 * Math.PI * bFreq * t) * bEnv * 0.18;

      samples[i] = mLead + bBass;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-bgm-lobby.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  // 14. BGM Auction: Tense 8-bit ticking countdown arpeggio (2.4s seamless loop)
  {
    const duration = 2.4;
    const samples = new Float32Array(Math.floor(SAMPLE_RATE * duration));
    const notes = ['A4', 'C5', 'E5', 'A5', 'G5', 'E5', 'D5', 'E5', 'A4', 'C5', 'E5', 'A5', 'B5', 'G5', 'E5', 'A4'];
    const noteLen = duration / notes.length;

    for (let i = 0; i < samples.length; i++) {
      const t = i / SAMPLE_RATE;
      const idx = Math.floor(t / noteLen) % notes.length;
      const freq = noteFreq(notes[idx]);
      const env = Math.max(0.1, 1 - ((t % noteLen) / noteLen) * 0.85);
      const pulse = squareWave(2 * Math.PI * freq * t, 0.125) * env * 0.22;
      const tick = (t % (noteLen * 2)) < 0.02 ? whiteNoise() * 0.1 : 0;
      samples[i] = pulse + tick;
    }
    fs.writeFileSync(path.join(outputDir, 'pixel-bgm-auction.wav'), createWavBuffer(SAMPLE_RATE, samples));
  }

  console.log(`✓ All 14 Pixel Arcade 8-bit audio files generated successfully at: ${outputDir}`);
}

const targetDir = path.resolve(__dirname, '../client/public/themes/pixel_arcade/audio');
generatePixelArcadeAudioAssets(targetDir);
