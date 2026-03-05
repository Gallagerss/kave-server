/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kave: {
          50: '#faf6f1',
          100: '#f0e6d8',
          200: '#e0ccb0',
          300: '#c9a97a',
          400: '#b8905a',
          500: '#a67c4e',
          600: '#8f6542',
          700: '#6b4a32',
          800: '#4a3425',
          900: '#2d1f15',
        },
        cream: '#fdfbf7',
        espresso: '#1a120b',
        forest: '#2d4a3e',
        gold: '#c9a962',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}