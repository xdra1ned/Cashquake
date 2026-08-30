import confetti from 'canvas-confetti';
import { Heart, Sparkles, Star, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useAudio } from '../../context/AudioContext';

export const JasmineEasterEgg: React.FC = () => {
  const audio = useAudio();
  const [showTooltip, setShowTooltip] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [portalCoords, setPortalCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = 288; // 18rem / w-72
    const height = 160;

    let top = rect.bottom + 8;
    let left = rect.left + rect.width / 2 - width / 2;

    // Auto-flip upward if too close to viewport bottom
    if (top + height > window.innerHeight - 12) {
      top = Math.max(12, rect.top - height - 8);
    }

    // Viewport horizontal clamping
    if (left < 12) left = 12;
    if (left + width > window.innerWidth - 12) {
      left = window.innerWidth - width - 12;
    }

    setPortalCoords({ top, left });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playSparkleChime();
    setClickCount((prev) => prev + 1);

    if (buttonRef.current) {
      calculatePosition();
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 35,
        spread: 55,
        origin: { x, y },
        colors: ['#EC4899', '#F472B6', '#FBBF24', '#38BDF8', '#A855F7'],
      });
    }

    setShowTooltip((prev) => !prev);
  };

  // Recalculate on resize or scroll
  useEffect(() => {
    if (!showTooltip) return;
    const handleRecalc = () => calculatePosition();
    window.addEventListener('resize', handleRecalc);
    window.addEventListener('scroll', handleRecalc);
    return () => {
      window.removeEventListener('resize', handleRecalc);
      window.removeEventListener('scroll', handleRecalc);
    };
  }, [showTooltip]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [showTooltip]);

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-400 text-xs text-pink-300 transition-all duration-200 shadow-sm hover:shadow-pink-500/20 active:scale-95 btn-tactile select-none font-sans"
        title="Click for Jasmine’s royal game blessing!"
      >
        <Sparkles className="w-3.5 h-3.5 text-pink-400 fill-pink-400 group-hover:rotate-12 transition-transform shrink-0" />
        <span className="font-extrabold text-pink-200 group-hover:text-white text-xs">Jasmine</span>
        <Star className="w-3 h-3 text-amber-300 fill-amber-300 inline shrink-0" />
      </button>

      {/* React Portal Popover rendered directly into document.body to guarantee top stacking */}
      {showTooltip &&
        ReactDOM.createPortal(
          <div
            ref={popoverRef}
            style={{
              position: 'fixed',
              top: `${portalCoords.top}px`,
              left: `${portalCoords.left}px`,
              zIndex: 99999,
            }}
            className="w-72 p-4 rounded-xl bg-slate-900/95 border-2 border-pink-500/80 text-slate-100 text-xs shadow-2xl backdrop-blur-md animate-fade-in text-center select-none"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="font-bold text-pink-300 text-sm font-display flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Jasmine’s Game Blessing</span>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed font-medium text-[11px] text-left bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              "May your dice roll double sixes, and your rivals land straight onto your hotel empires!"
            </p>

            <div className="mt-2 text-[10px] text-pink-400 font-mono font-bold">
              {clickCount > 3
                ? '🎉 Secret Quake Master Level Unlocked!'
                : '✨ Cashquake Special Edition'}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
