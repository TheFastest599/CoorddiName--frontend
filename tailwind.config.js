/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      height: {
        88: '22rem',
        112: '28rem',
        128: '32rem',
        'nav-height': 'calc(100vh - 0.5rem)',
      },
      maxHeight: {
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      maxWidth: {
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      screens: {
        msm: '414px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive'],
      },
      zIndex: {
        5: '5',
      },
      translate: {
        '4/5': '80%', // Custom class for translateY(80%)
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-custom': {
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            'border-radius': '9999px',
            'background-color': 'rgba(243, 244, 246, 0.1)', // gray-100 with low opacity
          },
          '&::-webkit-scrollbar-thumb': {
            'border-radius': '9999px',
            'background-color': '#d1d5db', // gray-300
          },
          '.dark &::-webkit-scrollbar-track': {
            'background-color': 'rgba(55, 65, 81, 0.1)', // neutral-700 with low opacity
          },
          '.dark &::-webkit-scrollbar-thumb': {
            'background-color': '#6b7280', // neutral-500
          },
        },
      });
    },
  ],
};
