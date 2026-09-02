import { ArrowDown, ScrollText } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { getTheme } from '../../theme/themeRegistry';

export const ActivityLogPanel: React.FC = () => {
  const { gameState } = useSocket();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevLogsLengthRef = useRef(0);

  const theme = getTheme(gameState?.themeId || 'world_tour');
  const logs = gameState?.logs || [];
  // Chronological logs (oldest at top, newest at bottom)
  const chronologicalLogs = [...logs].reverse();

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNear = distanceFromBottom <= 100;
    isNearBottomRef.current = isNear;
    setShowScrollButton(!isNear);
  };

  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      if (smooth) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      isNearBottomRef.current = true;
      setShowScrollButton(false);
    }
  };

  // Initial scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Smart bottom-anchored auto-scroll on new log arrival
  useEffect(() => {
    if (logs.length !== prevLogsLengthRef.current) {
      prevLogsLengthRef.current = logs.length;
      if (isNearBottomRef.current) {
        scrollToBottom(true);
      } else {
        setShowScrollButton(true);
      }
    }
  }, [logs.length]);

  return (
    <div
      className="w-full rounded-2xl border-2 shadow-xl flex flex-col h-full overflow-hidden relative min-h-0 backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: theme.colors.surfacePrimary,
        borderColor: theme.colors.panelBorder,
      }}
    >
      {/* Activity Panel Header */}
      <div
        className="px-3 py-2 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.panelBorder,
        }}
      >
        <div className="flex items-center gap-2">
          <ScrollText className="w-3.5 h-3.5" style={{ color: theme.colors.textAccent }} />
          <h4
            className="text-xs font-black uppercase tracking-wider font-display"
            style={{ color: theme.colors.textPrimary }}
          >
            Activity Log
          </h4>
        </div>
        <span
          className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
          style={{
            backgroundColor: theme.colors.badgeBg,
            borderColor: theme.colors.badgeBorder,
            color: theme.colors.badgeText,
          }}
        >
          {logs.length}
        </span>
      </div>

      {/* Activity Log Feed */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2.5 space-y-1.5 font-mono text-[11px] scrollbar-thin min-h-0 relative"
      >
        {chronologicalLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 italic">
            <ScrollText className="w-7 h-7 opacity-30 mb-1.5" />
            <span className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
              Match started. Awaiting first turn actions...
            </span>
          </div>
        ) : (
          chronologicalLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded-xl border leading-snug break-words transition-colors animate-fade-in ${
                log.type === 'buy' || log.type === 'rent'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-medium'
                  : log.type === 'prison' || log.type === 'bankrupt'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 font-medium'
                  : log.type === 'chaos'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 font-bold'
                  : log.type === 'card'
                  ? 'bg-pink-500/15 border-pink-500/40 text-pink-400 font-medium'
                  : log.type === 'trade'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-medium'
                  : log.type === 'alliance'
                  ? 'bg-purple-500/20 border-purple-500/45 text-purple-300 font-medium'
                  : theme.id === 'frutiger_aero'
                  ? 'bg-white/80 border-sky-300/60 text-sky-950 font-medium'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-200 font-medium'
              }`}
            >
              {log.message}
            </div>
          ))
        )}
      </div>

      {/* Floating Jump to Latest Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-pink-500 hover:bg-pink-400 text-white text-[10px] font-black font-sans shadow-lg flex items-center gap-1.5 transition-all animate-fade-in z-20 btn-tactile"
        >
          <ArrowDown className="w-3 h-3" />
          <span>Latest</span>
        </button>
      )}
    </div>
  );
};
