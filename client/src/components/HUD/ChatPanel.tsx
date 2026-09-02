import { ArrowDown, MessageSquare, Send, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { PACING_CONFIG } from '../../config/pacing';
import { useAudio } from '../../context/AudioContext';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';
import { getTheme } from '../../theme/themeRegistry';

const QUICK_CHAT_EMOJIS = ['😂', '❤️', '🔥', '😭', '👀', '🎉', '👋', '👑', '💸', '🎲'];

export const ChatPanel: React.FC = () => {
  const { gameState, myPlayerId, sendChatMessage } = useSocket();
  const audio = useAudio();

  const theme = getTheme(gameState?.themeId || 'world_tour');

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
    <div
      className="w-full rounded-2xl border-2 shadow-xl flex flex-col h-full overflow-hidden relative min-h-0 backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: theme.colors.surfacePrimary,
        borderColor: theme.colors.panelBorder,
      }}
    >
      {/* Chat Header */}
      <div
        className="px-3 py-2 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.panelBorder,
        }}
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5" style={{ color: theme.colors.textAccent }} />
          <h4
            className="text-xs font-black uppercase tracking-wider font-display"
            style={{ color: theme.colors.textPrimary }}
          >
            Match Chat
          </h4>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: theme.colors.textSecondary }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{activePlayersCount} online</span>
          </div>

          {/* Independent Chat Notification Audio Speaker Toggle */}
          <button
            type="button"
            onClick={audio.toggleChatMute}
            className={`p-1 rounded-lg border transition btn-tactile ${
              audio.isChatMuted
                ? 'bg-rose-500/20 border-rose-400 text-rose-400'
                : 'bg-sky-500/20 border-sky-400 text-sky-500'
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
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 italic">
            <MessageSquare className="w-7 h-7 opacity-30 mb-1.5" />
            <span className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
              Send a quick greeting or reaction!
            </span>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.playerId === myPlayerId;
            const player = gameState?.players[msg.playerId];
            const isEliminated = player ? Boolean(player.isBankrupt || player.isSpectator) : false;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${
                  isEliminated ? 'opacity-85' : 'opacity-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center border shadow-inner mt-0.5 transition-all ${
                    isEliminated ? 'grayscale-[50%] opacity-70 border-slate-700' : ''
                  }`}
                  style={{
                    backgroundColor: isEliminated ? `${msg.playerColor}15` : `${msg.playerColor}25`,
                    borderColor: isEliminated ? `${msg.playerColor}60` : msg.playerColor,
                  }}
                >
                  <AvatarSilhouette
                    avatarId={msg.avatarId || 'av_star'}
                    color={isEliminated ? `${msg.playerColor}99` : msg.playerColor}
                    size={13}
                  />
                </div>

                <div
                  className={`max-w-[82%] px-3 py-1.5 rounded-2xl border shadow-sm transition-all ${
                    theme.id === 'frutiger_aero'
                      ? isEliminated
                        ? 'bg-slate-100/90 border-sky-300 text-sky-950'
                        : isMe
                        ? 'bg-sky-500/20 border-sky-400/60 text-sky-950'
                        : 'bg-white/90 border-sky-300/80 text-sky-950'
                      : isEliminated
                      ? 'bg-slate-900/90 border-slate-700/80 text-slate-400 opacity-60'
                      : isMe
                      ? 'bg-sky-900/40 border-sky-500/50 text-slate-100'
                      : 'bg-slate-900/80 border-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5 text-[9.5px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`font-bold truncate transition-colors ${
                          isEliminated ? 'opacity-70' : 'opacity-100'
                        }`}
                        style={{ color: isEliminated ? `${msg.playerColor}cc` : msg.playerColor }}
                      >
                        {isMe ? 'You' : msg.playerName}
                      </span>
                      {isEliminated && (
                        <span className="text-[8.5px] px-1 py-0.2 rounded font-mono font-bold bg-slate-800/90 border border-slate-700/70 text-slate-400 shrink-0">
                          SPECTATOR
                        </span>
                      )}
                    </div>
                    <span
                      className="font-mono text-[8.5px] tabular-nums shrink-0"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p
                    className="text-[11px] leading-relaxed break-words font-medium"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {msg.message}
                  </p>
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
      <div
        className="px-2 py-1 border-t flex items-center justify-between gap-1 overflow-x-auto shrink-0 scrollbar-none"
        style={{
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.panelBorder,
        }}
      >
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
        className="p-2 border-t flex items-center gap-1.5 shrink-0"
        style={{
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.panelBorder,
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message..."
          maxLength={PACING_CONFIG.CHAT_MAX_LENGTH}
          style={{
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.panelBorder,
            color: theme.colors.textPrimary,
          }}
          className="flex-1 border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none transition font-medium placeholder-sky-700/60"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          style={{
            background: theme.colors.btnPrimaryBg,
            borderColor: theme.colors.btnPrimaryBorder,
            color: theme.colors.btnPrimaryText,
          }}
          className="p-1.5 rounded-xl border disabled:opacity-30 transition btn-tactile shadow-sm shrink-0 font-bold"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
