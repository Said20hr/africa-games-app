/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/_layout.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E1E2C",
        secondary: "#2C2C3A",
        accent: "#6687c4",
        brand: "#0076FC",
        black: "#000000",
        white: "#FFFFFF",
        red: "#E13434",
        grey: "#909198",
        textPrimary: "#E5E5E5",
        textSecondary: "#A9A9B3",
        textField: "#2C2C3A",
        tint: "#3E3E55",
      },
    },
  },
  plugins: [],
};
