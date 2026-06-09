/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#030303',
        foreground: '#f5f5f0',
        muted: '#6b7280',
        panel: '#0b0b0c',
        'panel-border': '#1a1a1e',
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
        'surface': '#111113',
        'surface-hover': '#18181b',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'var(--font-geist-sans)', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Geist Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(37, 244, 238, 0.15), 0 0 60px rgba(37, 244, 238, 0.05)',
        'neon-red': '0 0 20px rgba(255, 59, 92, 0.15), 0 0 60px rgba(255, 59, 92, 0.05)',
        'neon-green': '0 0 20px rgba(29, 185, 84, 0.15), 0 0 60px rgba(29, 185, 84, 0.05)',
        'glow-lg': '0 0 40px rgba(37, 244, 238, 0.08), 0 0 80px rgba(255, 59, 92, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scanner': 'scanner 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
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
      },
    },
  },
  plugins: [],
}
