/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f3",
          100: "#ffe4e8",
          500: "#f472b6",
          600: "#db2777",
          700: "#be185d"
        }
      }
    },
  },
  plugins: [],
}
