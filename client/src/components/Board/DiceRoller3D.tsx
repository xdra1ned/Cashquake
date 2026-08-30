import { Dices, Flame, Sparkles } from 'lucide-react';
import React from 'react';
import { getDiceSkin } from '../../theme/cosmeticsRegistry';
import { useSocket } from '../../context/SocketContext';

export const DiceRoller3D: React.FC = () => {
  const { gameState, myPlayerId, session, rollDice, turnPresentationPhase, animDice, isPawnStepping } =
    useSocket();

  if (!gameState) return null;

  const currentP = gameState.players[gameState.turn.currentPlayerId];
  const isMyTurn = currentP?.id === myPlayerId;
  const isRollingAnimation = turnPresentationPhase === 'ROLLING';
  const isHoldingResult = turnPresentationPhase === 'ROLL_RESULT';
  const canRoll =
    isMyTurn &&
    !gameState.turn.hasRolled &&
    (turnPresentationPhase === 'IDLE' || gameState.phase === 'rolling') &&
    !isPawnStepping;

  const activeSkinId = isMyTurn
    ? (session?.customization?.diceSkin || currentP?.customization?.diceSkin)
    : currentP?.customization?.diceSkin;
  const diceSkin = getDiceSkin(activeSkinId);

  const [d1, d2] = isRollingAnimation ? animDice : gameState.turn.dice;
  const isDouble = gameState.turn.isDouble && gameState.turn.hasRolled;
  const isSnakeEyes = gameState.turn.dice[0] === 1 && gameState.turn.dice[1] === 1 && gameState.turn.hasRolled;

  const showResultBadges =
    gameState.turn.hasRolled && !isRollingAnimation;

  const handleRollClick = async () => {
    if (!canRoll || isRollingAnimation || isHoldingResult) return;
    try {
      await rollDice();
    } catch (e) {
      console.error(e);
    }
  };

  // Render die face respecting player's equipped skin and supporting 2d12 mode
  const renderDieFace = (value: number, isRolling: boolean) => {
    const is12Sided = gameState.rules.diceMode === '2d12';

    return (
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 shadow-xl flex flex-col justify-center items-center p-2 relative select-none transition-all ${
          diceSkin.bgClass
        } ${diceSkin.borderClass} ${
          isRolling ? 'rotate-12 scale-110' : 'hover:scale-[1.02]'
        }`}
        style={{
          boxShadow: diceSkin.shadow,
        }}
      >
        {is12Sided || value > 6 ? (
          <div
            className="font-mono text-xl sm:text-2xl font-black tabular-nums drop-shadow-sm"
            style={{ color: diceSkin.pipColor }}
          >
            {value}
          </div>
        ) : (
          /* Standard 6-sided Pip Grid Layout */
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5 pointer-events-none">
            {/* Top Left */}
            <div className="flex items-center justify-center">
              {(value === 2 || value === 3 || value === 4 || value === 5 || value === 6) && (
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-inner"
                  style={{ backgroundColor: diceSkin.pipColor }}
                />
              )}
            </div>
            {/* Top Center */}
            <div className="flex items-center justify-center" />
            {/* Top Right */}
            <div className="flex items-center justify-center">
              {(value === 4 || value === 5 || value === 6) && (
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-inner"
                  style={{ backgroundColor: diceSkin.pipColor }}
                />
              )}
            </div>

            {/* Middle Left */}
            <div className="flex items-center justify-center">
              {value === 6 && (
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-inner"
                  style={{ backgroundColor: diceSkin.pipColor }}
                />
              )}
            </div>
            {/* Center */}
            <div className="flex items-center justify-center">
              {(value === 1 || value === 3 || value === 5) && (
                <div
                  className="w-3 h-3 rounded-full shadow-inner"
                  style={{
                    backgroundColor: value === 1 ? diceSkin.accentPipColor : diceSkin.pipColor,
                  }}
                />
              )}
            </div>
            {/* Middle Right */}
            <div className="flex items-center justify-center">
              {value === 6 && (
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-inner"
                  style={{ backgroundColor: diceSkin.pipColor }}
                />
              )}
            </div>

            {/* Bottom Left */}
            <div className="flex items-center justify-center">
              {(value === 4 || value === 5 || value === 6) && (
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-inner"
                  style={{ backgroundColor: diceSkin.pipColor }}
                />
              )}
            </div>
            {/* Bottom Center */}
            <div className="flex items-center justify-center" />
            {/* Bottom Right */}
            <div className="flex items-center justify-center">
              {(value === 2 || value === 3 || value === 4 || value === 5 || value === 6) && (
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-inner"
                  style={{ backgroundColor: diceSkin.pipColor }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Active Ruleset Indicator Badge */}
      {gameState.rules.diceMode === '2d12' && (
        <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold font-mono shadow-sm flex items-center gap-1">
          <span>🎲</span>
          <span>2×d12 Mode (2–24 Range)</span>
        </div>
      )}

      {/* Dice Pair Display */}
      <div
        className={`flex items-center gap-3 transition-transform duration-200 ${
          isRollingAnimation ? 'animate-bounce-short' : ''
        }`}
      >
        {renderDieFace(d1, isRollingAnimation)}
        {renderDieFace(d2, isRollingAnimation)}
      </div>

      {/* Consecutive Doubles Indicator if rolling again */}
      {gameState.turn.doublesCount > 0 && !gameState.turn.hasRolled && !isRollingAnimation && (
        <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black flex items-center gap-1.5 font-sans animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>✨ Doubles — Roll Again!</span>
        </div>
      )}

      {/* Sum & Roll Badges (Visible during hold phase & after roll) */}
      {showResultBadges && (
        <div className="flex flex-col items-center gap-1 animate-fade-in">
          <div className="font-mono text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
            <span>Result:</span>
            <span className="text-white text-base font-black tabular-nums bg-slate-800 px-2.5 py-0.5 rounded-xl border border-slate-700 shadow-md">
              {gameState.turn.dice[0]} + {gameState.turn.dice[1]} ={' '}
              {gameState.turn.dice[0] + gameState.turn.dice[1]}
            </span>
          </div>

          {isSnakeEyes && (
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Snake Eyes Bonus (+$100)!</span>
            </div>
          )}

          {isDouble && !isSnakeEyes && (
            <div className="px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400/60 text-amber-200 text-xs font-extrabold flex items-center gap-1.5 font-sans shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>✨ DOUBLE! +1 ROLL</span>
            </div>
          )}
        </div>
      )}

      {/* Primary Action Button Hierarchy */}
      {canRoll ? (
        <button
          onClick={handleRollClick}
          disabled={isRollingAnimation || isHoldingResult}
          className="mt-1 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-pink-500 text-white font-display font-black text-sm sm:text-base tracking-wider uppercase shadow-2xl shadow-pink-500/30 transition transform hover:scale-105 active:scale-95 btn-tactile flex items-center gap-2.5 border-2 border-slate-900 animate-pulse"
        >
          <Dices className="w-5 h-5" />
          <span>ROLL DICE</span>
        </button>
      ) : isPawnStepping || turnPresentationPhase === 'MOVING' ? (
        <div className="text-[11px] text-cyan-300 font-bold px-3.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/30 animate-pulse font-mono">
          Moving pawn...
        </div>
      ) : (
        <div className="text-[11px] text-slate-400 font-medium px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 font-sans">
          {isMyTurn ? 'Take your action...' : `Waiting for ${currentP?.name || 'player'}...`}
        </div>
      )}
    </div>
  );
};
