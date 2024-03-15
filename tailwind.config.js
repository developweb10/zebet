/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/sportsbook/src/**/*.{html,ts}",
    'node_modules/preline/dist/*.js',
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [ require('preline/plugin'),require("tw-elements/dist/plugin.cjs")],
}

