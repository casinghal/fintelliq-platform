/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // D-035 (scoped to /firms/* via .firms-scope; classes available globally but unused outside)
        bg: '#0A0C12',
        surface: '#10131B',
        accent: '#828487',
        'text-primary': '#E8E8E4',
        'text-muted': 'rgba(232, 232, 228, 0.65)',
        'text-muted-solid': '#97978F',
        line: 'rgba(255, 255, 255, 0.08)',
        'line-solid': '#1B1D24',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
        serif:   ['var(--font-serif)'],
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1.05', fontWeight: '800' }],
        'display-l':  ['56px', { lineHeight: '1.08', fontWeight: '800' }],
        'display-m':  ['44px', { lineHeight: '1.1',  fontWeight: '800' }],
        'headline-l': ['32px', { lineHeight: '1.2',  fontWeight: '700' }],
        'headline-m': ['24px', { lineHeight: '1.3',  fontWeight: '700' }],
        'headline-s': ['20px', { lineHeight: '1.35', fontWeight: '600' }],
        'body-l':     ['18px', { lineHeight: '1.6',  fontWeight: '400' }],
        'body-m':     ['16px', { lineHeight: '1.6',  fontWeight: '400' }],
        'body-s':     ['14px', { lineHeight: '1.5',  fontWeight: '400' }],
        caption:      ['12px', { lineHeight: '1.4',  fontWeight: '500' }],
      },
      boxShadow: {
        card: '-12px -12px 24px rgba(255, 255, 255, 0.045), 12px 12px 24px rgba(0, 0, 0, 0.85)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '320ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasis: 'cubic-bezier(0.3, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};
