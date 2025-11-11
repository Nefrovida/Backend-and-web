/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#010C5E",
        "light-blue": "#9AE5FB",
        "success": "#DEEECD",
        "hover-success": "#CAF39E"
      },
    },
  },
  plugins: [],
};
