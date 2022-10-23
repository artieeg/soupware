/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gray-1200": '#0D0D0D',
        "gray-1100": '#1E1E1E',
        "gray-1000": '#303030',
        "brand-0": '#C3FF44',
        "brand-1": '#FFD644'
      }
    },
  },
  plugins: [],
};
