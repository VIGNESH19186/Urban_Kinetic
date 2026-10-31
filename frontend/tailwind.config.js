/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#1a2234',
          900: '#0f141e'
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4'
        }
      }
    },
  },
  plugins: [],
}
