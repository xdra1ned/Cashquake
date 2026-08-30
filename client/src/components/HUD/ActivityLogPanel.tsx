import { ArrowDown, ScrollText } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';

export const ActivityLogPanel: React.FC = () => {
  const { gameState } = useSocket();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevLogsLengthRef = useRef(0);

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
    <div className="w-full rounded-2xl bg-slate-900/90 border-2 border-slate-800 shadow-xl flex flex-col h-full overflow-hidden relative min-h-0">
      {/* Activity Panel Header */}
      <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ScrollText className="w-3.5 h-3.5 text-pink-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-display">
            Activity Log
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
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
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 italic">
            <ScrollText className="w-7 h-7 opacity-30 mb-1.5" />
            <span className="text-[10px]">Match started. Awaiting first turn actions...</span>
          </div>
        ) : (
          chronologicalLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded-xl border leading-snug break-words transition-colors animate-fade-in ${
                log.type === 'buy' || log.type === 'rent'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : log.type === 'prison' || log.type === 'bankrupt'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : log.type === 'chaos'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                  : log.type === 'card'
                  ? 'bg-pink-500/10 border-pink-500/30 text-pink-300'
                  : log.type === 'trade'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  : log.type === 'alliance'
                  ? 'bg-purple-500/15 border-purple-500/35 text-purple-200'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300'
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
