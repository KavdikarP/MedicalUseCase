/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oxygen', 'sans-serif'],
      },
      colors: {
        "prudential-red": "#ED1B2E",
        "ntuc-orange": "#dc6f39",
        "cymbal-blue-100": "#FFA0A0",
        "cymbal-blue-300": "#FF0000",
        "cymbal-blue-500": "#D82A1B",
        "cymbal-blue-700": "#D82A1B"
      },
    },
  },
  plugins: [],
};
