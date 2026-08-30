import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  isChatMuted: boolean;
  toggleChatMute: () => void;
  playDiceRoll: () => void;
  playCashChaching: () => void;
  playSellProperty: () => void;
  playRentTransfer: () => void;
  playVacationChime: () => void;
  playJailClank: () => void;
  playStartPassed: () => void;
  playSnakeEyes: () => void;
  playCardWhoosh: () => void;
  playAuctionStart: () => void;
  playAuctionBid: () => void;
  playAuctionWin: () => void;
  playAuctionHammer: () => void;
  playChaosBoom: () => void;
  playVictoryFanfare: () => void;
  playSparkleChime: () => void;
  playButtonTap: () => void;
  playTokenHop: () => void;
  playErrorBuzz: () => void;
  playRouletteSpin: () => void;
  playRouletteBallDrop: () => void;
  playSlotLever: () => void;
  playSlotReelSpin: () => void;
  playSlotReelStop: (reelIndex?: number) => void;
  playCasinoJackpot: () => void;
  playChipClink: () => void;
  playSmallWin: () => void;
  playChatNotification: () => void;
  playCardDeal: () => void;
  playThemeTransit: (themeId?: string) => void;
  playThemeSpecialEvent: (themeId?: string) => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('cashquake_muted');
    return saved === 'true';
  });

  const [isChatMuted, setIsChatMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('cashquake_chat_muted');
    return saved === 'true';
  });

  const lastChatSoundTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chatAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    try {
      const sound = new Audio('/sounds/chat-notification.mp3');
      sound.preload = 'auto';
      chatAudioRef.current = sound;
    } catch (e) {
      console.warn('💬 [Cashquake Audio] Chat notification audio preloading error:', e);
    }

    const initAudio = () => {
      let ctx = audioContextRef.current;
      if (!ctx || ctx.state === 'closed') {
        try {
          ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = ctx;
          setAudioContext(ctx);
        } catch (e) {}
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Prime HTML5 Audio element for MP3 asset playback
      if (chatAudioRef.current) {
        chatAudioRef.current.load();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    window.addEventListener('pointerdown', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('pointerdown', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('cashquake_muted', String(next));
      return next;
    });
  };

  const toggleChatMute = () => {
    setIsChatMuted((prev) => {
      const next = !prev;
      localStorage.setItem('cashquake_chat_muted', String(next));
      return next;
    });
  };

  const getCtx = (): AudioContext | null => {
    if (isMuted) return null;
    let ctx = audioContextRef.current;
    if (!ctx || ctx.state === 'closed') {
      try {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;
        setAudioContext(ctx);
      } catch (err) {
        return null;
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  };

  const playButtonTap = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  };

  const playDiceRoll = () => {
    const ctx = getCtx();
    if (!ctx) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 180, ctx.currentTime);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.035);
      }, i * 55);
    }
  };

  // Property Purchase: Satisfying 2-tone cash register chime
  const playCashChaching = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.07); // E6
    gain2.gain.setValueAtTime(0.14, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.38);
  };

  // Property Sale / Mortgage: Descending crisp liquidation coin drop
  const playSellProperty = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  };

  // Rent Payment / Collection: Pleasant 3-note cash exchange chime
  const playRentTransfer = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.09, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.2);
    });
  };

  // Vacation Cash Pot: Warm relaxing major chord
  const playVacationChime = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  };

  // Jail / Detention: Deep metallic gate latch
  const playJailClank = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  };

  // Passing START: Level-up chime
  const playStartPassed = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.1, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.25);
    });
  };

  // Snake Eyes bonus: Festive double bell
  const playSnakeEyes = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [1046.5, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.15, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.3);
    });
  };

  // Card Draw: Airy whoosh
  const playCardWhoosh = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  };

  // Auction: Soft, subtle bid chime (NO continuous annoying buzzing)
  const playAuctionBid = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, now); // G5
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  };

  const playAuctionStart = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [659.25, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.09, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.2);
    });
  };

  const playAuctionWin = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.35);
    });
  };

  const playAuctionHammer = () => {
    playAuctionWin();
  };

  const playChaosBoom = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  };

  const playVictoryFanfare = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.15, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.45);
    });
  };

  const playSparkleChime = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000 + i * 400, now + i * 0.05);
      gain.gain.setValueAtTime(0.08, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.2);
    }
  };

  const playTokenHop = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  };

  const playErrorBuzz = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  };

  // --- Procedural Casino Audio FX ---

  const playRouletteSpin = () => {
    const ctx = getCtx();
    if (!ctx) return;
    // Rhythmic decelerating wheel ticks over ~2.2 seconds
    const clickCount = 28;
    let delay = 0;
    for (let i = 0; i < clickCount; i++) {
      // Exponentially increasing gap between clicks (simulate friction deceleration)
      const gap = 0.03 + Math.pow(i / clickCount, 2) * 0.22;
      delay += gap;
      const t = ctx.currentTime + delay;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.015);

      gain.gain.setValueAtTime(0.06 * (1 - i / (clickCount * 1.5)), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.018);
    }
  };

  const playRouletteBallDrop = () => {
    const ctx = getCtx();
    if (!ctx) return;
    // 3 rapid clatters as the ivory ball drops into a brass pocket
    const times = [0, 0.055, 0.11];
    times.forEach((offset, idx) => {
      const t = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100 - idx * 180, t);
      osc.frequency.exponentialRampToValueAtTime(350, t + 0.035);

      gain.gain.setValueAtTime(0.09 - idx * 0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    });
  };

  const playSlotLever = () => {
    const ctx = getCtx();
    if (!ctx) return;
    // Mechanical lever yank: heavy click + spring ratchet sound
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);

    // Spring clink
    const clink = ctx.createOscillator();
    const clinkGain = ctx.createGain();
    clink.type = 'sine';
    clink.frequency.setValueAtTime(1400, t + 0.06);
    clink.frequency.exponentialRampToValueAtTime(600, t + 0.14);
    clinkGain.gain.setValueAtTime(0.08, t + 0.06);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    clink.connect(clinkGain);
    clinkGain.connect(ctx.destination);
    clink.start(t + 0.06);
    clink.stop(t + 0.15);
  };

  const playSlotReelSpin = () => {
    const ctx = getCtx();
    if (!ctx) return;
    // Rapid mechanical reel tick
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.025);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  };

  const playSlotReelStop = (reelIndex: number = 0) => {
    const ctx = getCtx();
    if (!ctx) return;
    // Heavy mechanical reel lock (higher pitch for reel 1, 2, 3 for dramatic buildup)
    const baseFreq = 300 + reelIndex * 140;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.07);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  };

  const playCasinoJackpot = () => {
    const ctx = getCtx();
    if (!ctx) return;
    // Triumphant 777 fanfare chords + cascade of gold bells
    const chords = [
      [523.25, 659.25, 783.99], // C Major
      [587.33, 739.99, 880.0],  // D Major
      [659.25, 830.61, 987.77], // E Major
      [783.99, 987.77, 1174.66, 1567.98], // High G Major triumphant
    ];

    chords.forEach((chord, step) => {
      const t = ctx.currentTime + step * 0.14;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    });

    // Rapid coin cascade
    for (let c = 0; c < 16; c++) {
      const ct = ctx.currentTime + 0.5 + c * 0.045;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 800, ct);
      osc.frequency.exponentialRampToValueAtTime(600, ct + 0.035);
      gain.gain.setValueAtTime(0.04, ct);
      gain.gain.exponentialRampToValueAtTime(0.0001, ct + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ct);
      osc.stop(ct + 0.04);
    }
  };

  const playChipClink = () => {
    const ctx = getCtx();
    if (!ctx) return;
    // Crisp ceramic casino chip clinking
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200 + Math.random() * 300, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.025);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  };

  const playSmallWin = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const notes = [587.33, 880.0]; // D5 -> A5
    notes.forEach((freq, idx) => {
      const t = ctx.currentTime + idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  };

  // Chat incoming notification: MP3 asset playback with centralized cooldown protection & clear diagnostics
  const playChatNotification = () => {
    if (isChatMuted || isMuted) {
      return;
    }

    // Cooldown check (800ms minimum between sounds to prevent spam during message bursts)
    const now = Date.now();
    if (now - lastChatSoundTimeRef.current < 800) {
      return;
    }
    lastChatSoundTimeRef.current = now;

    try {
      const sound = new Audio('/sounds/chat-notification.mp3');
      sound.volume = 0.8;
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('💬 [Cashquake Audio] Chat notification playback blocked/failed:', err);
        });
      }
    } catch (err) {
      console.error('💬 [Cashquake Audio] Failed to play chat-notification.mp3:', err);
    }
  };

  // Crisp multi-card deck deal flutter
  const playCardDeal = () => {
    const ctx = getCtx();
    if (!ctx) return;
    for (let i = 0; i < 3; i++) {
      const t = ctx.currentTime + i * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700 + i * 180, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.035);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    }
  };

  // Theme Transit Signature Sound
  const playThemeTransit = (themeId?: string) => {
    const ctx = getCtx();
    if (!ctx) return;

    if (themeId === 'world_tour') {
      // European Airport 2-tone Chime (D5 -> A4)
      const tones = [587.33, 440.0];
      tones.forEach((f, idx) => {
        const t = ctx.currentTime + idx * 0.22;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.38);
      });
    } else if (themeId === 'cosmic_space') {
      // Sci-Fi Interstellar Warp Sweep
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.45);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.48);
    } else if (themeId === 'mystic_fantasy') {
      // Arcane Crystal Harp Sparkle
      const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
      notes.forEach((f, idx) => {
        const t = ctx.currentTime + idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      });
    } else if (themeId === 'cyber_neon') {
      // Cyber Data Packet Ping
      const notes = [1046.5, 1396.91, 2093.0];
      notes.forEach((f, idx) => {
        const t = ctx.currentTime + idx * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      });
    } else if (themeId === 'anime_akiba') {
      // Retro 8-bit Arcade Transit Fanfare
      const notes = [440.0, 554.37, 659.25, 880.0];
      notes.forEach((f, idx) => {
        const t = ctx.currentTime + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.035, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      });
    } else {
      playTokenHop();
    }
  };

  // Theme Special Card / Anomaly Announcement Cue
  const playThemeSpecialEvent = (themeId?: string) => {
    const ctx = getCtx();
    if (!ctx) return;

    if (themeId === 'cosmic_space') {
      // Deep Space Transmission Tone
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(880, t + 0.12);
      osc.frequency.setValueAtTime(1320, t + 0.24);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.42);
    } else if (themeId === 'mystic_fantasy') {
      playSparkleChime();
    } else if (themeId === 'cyber_neon') {
      // Cyber Terminal Boot
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } else if (themeId === 'anime_akiba') {
      // Gacha Capsule Pop
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(1600, t + 0.08);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    } else {
      playCardWhoosh();
    }
  };

  return (
    <AudioCtx.Provider
      value={{
        isMuted,
        toggleMute,
        isChatMuted,
        toggleChatMute,
        playDiceRoll,
        playCashChaching,
        playSellProperty,
        playRentTransfer,
        playVacationChime,
        playJailClank,
        playStartPassed,
        playSnakeEyes,
        playCardWhoosh,
        playAuctionStart,
        playAuctionBid,
        playAuctionWin,
        playAuctionHammer,
        playChaosBoom,
        playVictoryFanfare,
        playSparkleChime,
        playButtonTap,
        playTokenHop,
        playErrorBuzz,
        playRouletteSpin,
        playRouletteBallDrop,
        playSlotLever,
        playSlotReelSpin,
        playSlotReelStop,
        playCasinoJackpot,
        playChipClink,
        playSmallWin,
        playChatNotification,
        playCardDeal,
        playThemeTransit,
        playThemeSpecialEvent,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioCtx);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
