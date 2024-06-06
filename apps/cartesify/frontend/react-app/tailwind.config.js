/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'gradient-custom': 'linear-gradient(to right, #AE62EE, #FE8A7C)',

      },
      colors: {
        'dark-blue': '#040419',
        'dark-text': '#09324C',
        'custom-purple': '#AE62EE',
        'light-purple': '#9395D3',
        'custom-orange': '#FE8A7C',
        'bcolor': '#05051F'
      },
  },
  plugins: [],

}}

