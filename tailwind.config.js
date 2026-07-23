/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        hand: ['"Caveat"', 'cursive'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        lavender: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
        },
        peach: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316',
        },
        cream: {
          50: '#fffdf7', 100: '#fdf6e3', 200: '#f7ecd4',
        },
        sky: {
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
          400: '#38bdf8', 500: '#0ea5e9',
        },
        rose: {
          200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e',
        },
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      backdropBlur: { '2xl': '40px', '3xl': '60px' },
      animation: {
        'float-slow': 'floatYSlow 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
