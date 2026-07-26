/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ef4444',
          led: '#ff2a2a',
        }
      }
    },
  },
  plugins: [],
}
