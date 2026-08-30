/**
 * Cashquake Centralized Pacing & UI Animation Configuration
 * Tune turn sequencing, animations, and hold durations in one clean place.
 */

export const PACING_CONFIG = {
  // Dice Rolling Phase
  DICE_TUMBLE_MS: 1200,          // Duration the dice visibly tumble with rapid face shuffles
  DICE_SHUFFLE_INTERVAL_MS: 80,  // Face flip interval during roll
  DICE_HOLD_RESULT_MS: 1200,     // Duration final dice values remain locked & readable before movement begins

  // Pawn Movement Phase
  PAWN_STEP_INTERVAL_MS: 200,    // Hop duration per single board tile (180-220ms baseline)
  PAWN_HOP_HEIGHT_PX: 10,        // Vertical bounce peak during stepping
  ARRIVAL_PAUSE_MS: 700,         // Deliberate pause upon reaching destination tile before actions reveal

  // Modal & Event Presentation Phase
  ACTION_MODAL_REVEAL_DELAY_MS: 350, // Breathing room before property purchase/deed modal opens
  CARD_DRAW_HOLD_MS: 7000,           // Duration card modal remains visible before auto-dismiss
  RENT_NOTIFICATION_HOLD_MS: 3200,   // Duration floating rent/tax notification badges stay visible

  // Turn Timer Defaults
  DEFAULT_TURN_TIMER_SECONDS: 60,
  TIMER_LOW_THRESHOLD_SECONDS: 10,
  TIMER_PRESET_OPTIONS: [
    { label: '30s', value: 30 },
    { label: '45s', value: 45 },
    { label: '60s (Default)', value: 60 },
    { label: '90s', value: 90 },
    { label: '120s', value: 120 },
    { label: 'Unlimited', value: 0 },
  ],

  // In-Game Chat Limits
  CHAT_MAX_LENGTH: 180,
  CHAT_SPAM_COOLDOWN_MS: 600,
} as const;
