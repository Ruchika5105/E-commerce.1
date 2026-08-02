/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          /* Primary — deep maroon/burgundy from logo ring text + ribbon */
          green: '#5E1010',
          'green-dark': '#3D0A0A',
          'green-light': '#7A1515',
          /* Cream — warm ivory background matching logo badge interior */
          cream: '#F8EDD3',
          'cream-dark': '#EDD9A8',
          /* Gold — outer ring and border of logo badge */
          gold: '#C8952A',
          'gold-light': '#DBA83C',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
