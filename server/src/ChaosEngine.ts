import { CHAOS_EVENTS_CATALOG } from '../../shared/constants';
import { ChaosEvent, GameState } from '../../shared/types';

export class ChaosEngine {
  public static triggerRandomEvent(state: GameState): ChaosEvent | null {
    if (!state.rules.chaosEventsEnabled) return null;

    const available = CHAOS_EVENTS_CATALOG;
    const chosenBlueprint = available[Math.floor(Math.random() * available.length)];
    if (!chosenBlueprint) return null;

    const newEvent: ChaosEvent = {
      ...chosenBlueprint,
      appliedAtTurn: state.turn.turnNumber,
      expiresAtTurn: chosenBlueprint.durationTurns
        ? state.turn.turnNumber + chosenBlueprint.durationTurns
        : undefined,
    };

    // Remove existing event of same effectType if any
    state.activeChaosEvents = state.activeChaosEvents.filter(
      (e) => e.effectType !== newEvent.effectType
    );

    state.activeChaosEvents.push(newEvent);

    // Apply immediate effects if applicable
    if (newEvent.effectType === 'bank_glitch') {
      for (const pId of Object.keys(state.players)) {
        const p = state.players[pId];
        if (p && !p.isBankrupt) {
          p.cash += 250;
        }
      }
    } else if (newEvent.effectType === 'robin_hood') {
      const activePlayers = Object.values(state.players).filter((p) => !p.isBankrupt);
      if (activePlayers.length > 1) {
        let richest = activePlayers[0];
        for (const p of activePlayers) {
          if (p.cash > richest.cash) richest = p;
        }
        for (const p of activePlayers) {
          if (p.id !== richest.id) {
            const amount = Math.min(100, richest.cash);
            richest.cash -= amount;
            p.cash += amount;
          }
        }
      }
    }

    return newEvent;
  }

  public static checkExpiredEvents(state: GameState): void {
    const currentTurn = state.turn.turnNumber;
    state.activeChaosEvents = state.activeChaosEvents.filter((event) => {
      if (event.expiresAtTurn && currentTurn >= event.expiresAtTurn) {
        return false;
      }
      return true;
    });
  }
}
