/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#f5f5f0',
        muted: '#8a8f98',
        panel: '#0d0d0d',
        'panel-border': '#2a2a2a',
        'accent-red': '#ff3b5c',
        'accent-cyan': '#25f4ee',
        'accent-green': '#7cff6b',
        'receipt-paper': '#f4f1e8',
        'receipt-ink': '#111111'
      },
      fontFamily: {
        sans: ['Geist Sans', 'var(--font-geist-sans)', 'sans-serif'],
        mono: ['Geist Mono', 'var(--font-geist-mono)', 'JetBrains Mono', 'IBM Plex Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
