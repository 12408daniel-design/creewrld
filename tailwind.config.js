/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'yacht-navy': '#0A1118',
        'yacht-midnight': '#132238',
        'yacht-ivory': '#F4EFEA',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
