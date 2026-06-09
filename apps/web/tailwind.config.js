/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080808',
        foreground: '#fafaf8',
        muted: '#8b8b96',
        panel: '#111114',
        'panel-border': '#222228',
        'accent-red': '#ff3b5c',
        'accent-cyan': '#25f4ee',
        'accent-green': '#1db954',
        'accent-yellow': '#facc15',
        'accent-purple': '#a855f7',
        'accent-orange': '#fb923c',
        'tiktok-pink': '#ff3b5c',
        'tiktok-cyan': '#25f4ee',
        'spotify-green': '#1db954',
        'receipt-paper': '#f4f1e8',
        'receipt-ink': '#111111',
        'surface': '#141418',
        'surface-hover': '#1c1c22',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'var(--font-geist-sans)', 'sans-serif'],
        sans: ['var(--font-geist-sans)', '"Space Grotesk"', 'sans-serif'],
        mono: ['var(--font-geist-mono)', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 24px rgba(37, 244, 238, 0.2), 0 0 64px rgba(37, 244, 238, 0.08)',
        'neon-red': '0 0 24px rgba(255, 59, 92, 0.2), 0 0 64px rgba(255, 59, 92, 0.08)',
        'neon-green': '0 0 24px rgba(29, 185, 84, 0.2), 0 0 64px rgba(29, 185, 84, 0.08)',
        'wrapped': '0 24px 80px -16px rgba(0, 0, 0, 0.75)',
        'glow-lg': '0 0 48px rgba(37, 244, 238, 0.1), 0 0 96px rgba(255, 59, 92, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scanner': 'scanner 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanner: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
