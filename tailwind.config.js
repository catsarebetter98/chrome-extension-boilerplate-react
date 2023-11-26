/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.jsx'], // on prod build
  content: ['./src/**/*.jsx'], // on dev build
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: [],
}
