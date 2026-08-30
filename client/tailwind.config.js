/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../shared/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        quake: {
          dark: '#0b0f19',
          card: '#131b2e',
          border: '#1f293d',
          gold: '#fbbf24',
          accent: '#ec4899',
          neon: '#06b6d4',
          purple: '#8b5cf6',
          danger: '#ef4444',
          success: '#10b981',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
        sans: ['var(--font-sans)'],
      },
      animation: {
        'fade-in': 'fadeInSubtle 0.16s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUpSubtle 0.16s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};

