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
    },
  },
  plugins: [],
};
