/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          lg: "1rem",
          xl: "1rem",
          "2xl": "1rem",
        },
      },
      colors: {
        primary: "#0B1628",
        secondary: "#1C121E",
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
        serif: ["Alegreya", "serif"],
      },
    },
  },
  plugins: [],
};
