import React, { useEffect, useState } from 'react';
import { Swords, X } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

export const AllianceDissolutionBanner: React.FC = () => {
  const { gameState } = useSocket();
  const [isVisible, setIsVisible] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string>('');

  useEffect(() => {
    if (!gameState?.allianceDissolutionNotice) {
      setIsVisible(false);
      return;
    }

    const notice = gameState.allianceDissolutionNotice;
    const ageMs = Date.now() - notice.timestamp;

    // Show if notice was generated within the last 8 seconds
    if (ageMs < 8000) {
      setNoticeMessage(notice.message);
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000 - ageMs);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [gameState?.allianceDissolutionNotice]);

  if (!isVisible || !noticeMessage) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-auto animate-bounce-short">
      <div className="relative p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-2 border-rose-500/80 shadow-2xl shadow-rose-950/60 backdrop-blur-md flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
            <Swords className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black tracking-wide uppercase text-rose-300 font-display">
              Alliances Dissolved
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-200 font-sans mt-0.5 leading-snug">
              {noticeMessage.replace('⚔️ ALLIANCES DISSOLVED: ', '').replace('⚔️ Alliance Dissolved: ', '')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0"
          title="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
