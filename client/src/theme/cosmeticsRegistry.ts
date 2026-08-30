export interface DiceSkinStyle {
  id: string;
  name: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  pipColor: string;
  accentPipColor: string;
  shadow: string;
  glowColor: string;
}

export interface TrailEffectStyle {
  id: string;
  name: string;
  particleType: 'sparkle' | 'fire' | 'money' | 'lightning' | 'none';
  particleColor: string;
  particleSvg: string;
}

export const DICE_SKIN_STYLES: Record<string, DiceSkinStyle> = {
  dice_classic: {
    id: 'dice_classic',
    name: 'Ivory Classic',
    bgClass: 'bg-gradient-to-b from-slate-100 to-slate-200',
    borderClass: 'border-slate-900',
    textClass: 'text-slate-950',
    pipColor: '#090d16',
    accentPipColor: '#e11d48',
    shadow: '0 4px 0 #0f172a, 0 8px 16px rgba(0,0,0,0.4)',
    glowColor: 'rgba(255, 255, 255, 0.2)',
  },
  dice_blossom: {
    id: 'dice_blossom',
    name: 'Pink Blossom',
    bgClass: 'bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300',
    borderClass: 'border-rose-400',
    textClass: 'text-rose-950',
    pipColor: '#be123c',
    accentPipColor: '#fbbf24',
    shadow: '0 4px 0 #9f1239, 0 8px 20px rgba(244, 63, 94, 0.4)',
    glowColor: 'rgba(244, 114, 182, 0.6)',
  },
  dice_emerald: {
    id: 'dice_emerald',
    name: 'Emerald Glow',
    bgClass: 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-950',
    pipColor: '#022c22',
    accentPipColor: '#a7f3d0',
    shadow: '0 4px 0 #064e3b, 0 8px 20px rgba(16, 185, 129, 0.45)',
    glowColor: 'rgba(52, 211, 153, 0.6)',
  },
  dice_violet: {
    id: 'dice_violet',
    name: 'Violet Dream',
    bgClass: 'bg-gradient-to-br from-purple-500 via-indigo-700 to-violet-950',
    borderClass: 'border-violet-300',
    textClass: 'text-violet-100',
    pipColor: '#e9d5ff',
    accentPipColor: '#f472b6',
    shadow: '0 4px 0 #3b0764, 0 8px 20px rgba(139, 92, 246, 0.45)',
    glowColor: 'rgba(167, 139, 250, 0.6)',
  },
  dice_ocean: {
    id: 'dice_ocean',
    name: 'Ocean Blue',
    bgClass: 'bg-gradient-to-br from-sky-400 via-blue-600 to-cyan-900',
    borderClass: 'border-cyan-300',
    textClass: 'text-cyan-950',
    pipColor: '#082f49',
    accentPipColor: '#67e8f9',
    shadow: '0 4px 0 #0c4a6e, 0 8px 20px rgba(14, 165, 233, 0.45)',
    glowColor: 'rgba(56, 189, 248, 0.6)',
  },
  dice_bubblegum: {
    id: 'dice_bubblegum',
    name: 'Bubblegum',
    bgClass: 'bg-gradient-to-br from-pink-400 via-fuchsia-500 to-pink-600',
    borderClass: 'border-pink-200',
    textClass: 'text-white',
    pipColor: '#ffffff',
    accentPipColor: '#fde047',
    shadow: '0 4px 0 #831843, 0 8px 20px rgba(236, 72, 153, 0.5)',
    glowColor: 'rgba(244, 114, 182, 0.7)',
  },
  dice_midnight: {
    id: 'dice_midnight',
    name: 'Midnight',
    bgClass: 'bg-gradient-to-br from-slate-900 via-neutral-950 to-black',
    borderClass: 'border-slate-500',
    textClass: 'text-slate-100',
    pipColor: '#f8fafc',
    accentPipColor: '#38bdf8',
    shadow: '0 4px 0 #000000, 0 8px 20px rgba(0, 0, 0, 0.8)',
    glowColor: 'rgba(148, 163, 184, 0.4)',
  },
  dice_gold: {
    id: 'dice_gold',
    name: 'Gold Ingot',
    bgClass: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600',
    borderClass: 'border-amber-950',
    textClass: 'text-amber-950',
    pipColor: '#78350f',
    accentPipColor: '#451a03',
    shadow: '0 4px 0 #78350f, 0 8px 20px rgba(245, 158, 11, 0.5)',
    glowColor: 'rgba(245, 158, 11, 0.6)',
  },
  dice_neon: {
    id: 'dice_neon',
    name: 'Cyber Matrix',
    bgClass: 'bg-gradient-to-br from-slate-950 via-cyan-950 to-purple-950',
    borderClass: 'border-cyan-400',
    textClass: 'text-cyan-300',
    pipColor: '#22d3ee',
    accentPipColor: '#f43f5e',
    shadow: '0 4px 0 #083344, 0 8px 20px rgba(6, 182, 212, 0.4)',
    glowColor: 'rgba(6, 182, 212, 0.6)',
  },
  dice_magma: {
    id: 'dice_magma',
    name: 'Magma Flame',
    bgClass: 'bg-gradient-to-br from-red-600 via-orange-600 to-amber-500',
    borderClass: 'border-amber-950',
    textClass: 'text-white',
    pipColor: '#450a0a',
    accentPipColor: '#fef08a',
    shadow: '0 4px 0 #450a0a, 0 8px 20px rgba(239, 68, 68, 0.5)',
    glowColor: 'rgba(249, 115, 22, 0.6)',
  },
  dice_cosmic: {
    id: 'dice_cosmic',
    name: 'Cosmic Void',
    bgClass: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
    borderClass: 'border-purple-400',
    textClass: 'text-purple-200',
    pipColor: '#c084fc',
    accentPipColor: '#38bdf8',
    shadow: '0 4px 0 #2e1065, 0 8px 20px rgba(168, 85, 247, 0.4)',
    glowColor: 'rgba(168, 85, 247, 0.6)',
  },
};

export const TRAIL_EFFECT_STYLES: Record<string, TrailEffectStyle> = {
  trail_none: {
    id: 'trail_none',
    name: 'Standard Step',
    particleType: 'none',
    particleColor: 'transparent',
    particleSvg: '',
  },
  trail_sparkles: {
    id: 'trail_sparkles',
    name: 'Glitter Sparkles',
    particleType: 'sparkle',
    particleColor: '#FDE047',
    particleSvg: '✨',
  },
  trail_fire: {
    id: 'trail_fire',
    name: 'Flame Trail',
    particleType: 'fire',
    particleColor: '#F97316',
    particleSvg: '🔥',
  },
  trail_money: {
    id: 'trail_money',
    name: 'Flying Bills',
    particleType: 'money',
    particleColor: '#22C55E',
    particleSvg: '💸',
  },
  trail_lightning: {
    id: 'trail_lightning',
    name: 'Thunder Arc',
    particleType: 'lightning',
    particleColor: '#38BDF8',
    particleSvg: '⚡',
  },
};

export const getDiceSkin = (skinId?: string): DiceSkinStyle => {
  return DICE_SKIN_STYLES[skinId || 'dice_classic'] || DICE_SKIN_STYLES.dice_classic;
};

export const getTrailEffect = (trailId?: string): TrailEffectStyle => {
  return TRAIL_EFFECT_STYLES[trailId || 'trail_none'] || TRAIL_EFFECT_STYLES.trail_none;
};
