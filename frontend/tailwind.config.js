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
      boxShadow: {
        // M3 elevation levels (RGB shadows)
        'md-elevated-1': '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
        'md-elevated-2': '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.12)',
        'md-elevated-3': '0px 10px 24px rgba(0, 0, 0, 0.2), 0px 2px 6px rgba(0, 0, 0, 0.12)', // Your level
        'md-elevated-4': '0px 20px 32px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.06)',
        // Add up to 5+ for full M3
      },
    },
  },
  plugins: [],
}

