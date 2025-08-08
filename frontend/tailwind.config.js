/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JSX files in src
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#111b21',
        'dark-primary': '#202c33',
        'dark-secondary': '#2a3942',
        'dark-text': '#e9edef',
        'dark-text-secondary': '#8696a0',
        'dark-green': '#005c4b',
        'dark-hover': '#2a3942',
        'dark-selected': '#2a3942',
      },
    },
  },
  plugins: [],
}