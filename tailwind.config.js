/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#fdf2f2',
          100: '#fce4e4',
          500: '#8b0304',
          600: '#7a0203',
          700: '#690102',
        },
        nsdl: {
          blue:      '#8b0304',
          lightBlue: '#b71c1c',
          gold:      '#f9a825',
          bg:        '#f4f5f7',
          red:       '#8b0304',
          darkRed:   '#690102',
        },
      },
    },
  },
  plugins: [],
}

