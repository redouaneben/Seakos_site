/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#749a53',
        'earth-brown': '#4e3e1f',
        'dark-anthracite': '#1d1e1c',
        'vercel-border': '#333333',
        'vercel-muted': '#888888',
        'vercel-surface': '#111111',
      },
      fontFamily: {
        sans: ['Inter', 'Raleway', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}
