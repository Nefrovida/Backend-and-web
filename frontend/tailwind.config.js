/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
}

