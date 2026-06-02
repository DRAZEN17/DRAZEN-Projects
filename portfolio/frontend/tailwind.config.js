/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05060a',
        panel: '#0b0d14',
        ink: '#e7e9f0',
        muted: '#8a93a6',
        neon: { cyan: '#22d3ee', magenta: '#ff2bd6', violet: '#7c3aed', lime: '#a3e635' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(34, 211, 238, 0.25)',
        glowMagenta: '0 0 40px rgba(255, 43, 214, 0.25)',
      },
      backgroundImage: {
        'grid-cyber':
          'linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
