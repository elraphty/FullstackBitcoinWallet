const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      gray: colors.gray,
      red: colors.red,
      yellow: colors.amber,
      indigo: colors.indigo,
      white: colors.white,
      orange: colors.orange,
      blue: colors.blue,
      black: colors.black,
      green: colors.green,
      purple: colors.purple,
      pink: colors.pink,
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0747A6',
          dark: '#043A8B',
          text: '#04275D',
        },
      },
      fontFamily: {
        heading: ['circular', 'sans-serif', 'Helvetica', 'Arial'],
        text: ['circular', '-apple-system', 'sans-serif'],
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(18, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
