/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JSX files in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}