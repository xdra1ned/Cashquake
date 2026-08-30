import { ArrowDown, MessageSquare, Send, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { PACING_CONFIG } from '../../config/pacing';
import { useAudio } from '../../context/AudioContext';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';

const QUICK_CHAT_EMOJIS = ['😂', '❤️', '🔥', '😭', '👀', '🎉', '👋', '👑', '💸', '🎲'];

export const ChatPanel: React.FC = () => {
  const { gameState, myPlayerId, sendChatMessage } = useSocket();
  const audio = useAudio();

  const [inputText, setInputText] = useState('');
  const [lastSentTime, setLastSentTime] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevChatCountRef = useRef(0);
  const processedMessageIdsRef = useRef<Set<string>>(new Set());

  const chatMessages = gameState?.chatMessages || [];

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

  // Initial mount: record existing messages so historical logs don't fire notification chime
  useEffect(() => {
    chatMessages.forEach((msg) => processedMessageIdsRef.current.add(msg.id));
    prevChatCountRef.current = chatMessages.length;
    const timer = setTimeout(() => {
      scrollToBottom(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Smart auto-scroll on new chat message
  useEffect(() => {
    if (chatMessages.length > prevChatCountRef.current) {
      prevChatCountRef.current = chatMessages.length;

      if (isNearBottomRef.current) {
        scrollToBottom(true);
      } else {
        setShowScrollButton(true);
      }
    }
  }, [chatMessages.length]);

  const handleSendMessage = (textToSend?: string) => {
    const raw = typeof textToSend === 'string' ? textToSend : inputText;
    const clean = raw.trim().substring(0, PACING_CONFIG.CHAT_MAX_LENGTH);
    if (!clean) return;

    // Spam throttle
    const now = Date.now();
    if (now - lastSentTime < PACING_CONFIG.CHAT_SPAM_COOLDOWN_MS) return;

    sendChatMessage(clean);
    if (!textToSend) {
      setInputText('');
    }
    setLastSentTime(now);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activePlayersCount = Object.values(gameState?.players || {}).filter(
    (p) => !p.isBankrupt
  ).length;

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border-2 border-slate-800 shadow-xl flex flex-col h-full overflow-hidden relative min-h-0">
      {/* Chat Header */}
      <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-display">
            Match Chat
          </h4>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{activePlayersCount} online</span>
          </div>

          {/* Independent Chat Notification Audio Speaker Toggle */}
          <button
            type="button"
            onClick={audio.toggleChatMute}
            className={`p-1 rounded-lg border transition btn-tactile ${
              audio.isChatMuted
                ? 'bg-slate-800/80 border-slate-700 text-rose-400 hover:text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-cyan-400 hover:text-cyan-300'
            }`}
            title={audio.isChatMuted ? 'Chat Sounds: MUTED (Click to unmute)' : 'Chat Sounds: ON (Click to mute)'}
          >
            {audio.isChatMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>


      {/* Messages Feed */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2.5 space-y-2 font-sans text-xs scrollbar-thin min-h-0 relative"
      >
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 italic">
            <MessageSquare className="w-7 h-7 opacity-30 mb-1.5" />
            <span className="text-[10px]">Send a quick greeting or reaction!</span>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.playerId === myPlayerId;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center border shadow-inner mt-0.5"
                  style={{
                    backgroundColor: `${msg.playerColor}25`,
                    borderColor: msg.playerColor,
                  }}
                >
                  <AvatarSilhouette
                    avatarId={msg.avatarId || 'av_star'}
                    color={msg.playerColor}
                    size={13}
                  />
                </div>

                <div
                  className={`max-w-[85%] rounded-xl px-2.5 py-1.5 shadow-sm border ${
                    isMe
                      ? 'bg-gradient-to-br from-purple-900/60 to-slate-900 border-purple-500/40 text-purple-100'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5 text-[9.5px]">
                    <span className="font-bold truncate" style={{ color: msg.playerColor }}>
                      {isMe ? 'You' : msg.playerName}
                    </span>
                    <span className="font-mono text-slate-400 text-[8.5px] tabular-nums shrink-0">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed break-words font-medium">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Jump to Latest Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-20 right-2.5 px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black font-sans shadow-lg flex items-center gap-1.5 transition-all animate-fade-in z-20 btn-tactile"
        >
          <ArrowDown className="w-3 h-3" />
          <span>New Messages</span>
        </button>
      )}

      {/* Quick Reaction Emojis (Direct Chat Pathway) */}
      <div className="px-2 py-1 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto shrink-0 scrollbar-none">
        {QUICK_CHAT_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleSendMessage(emoji)}
            className="text-sm hover:scale-125 active:scale-95 transition-transform p-1 select-none"
            title={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Text Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message..."
          maxLength={PACING_CONFIG.CHAT_MAX_LENGTH}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 text-white transition btn-tactile shadow-sm shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
