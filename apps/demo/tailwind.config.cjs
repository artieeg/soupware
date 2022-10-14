/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gray-1000": '#0D0D0D',
        "brand-0": '#C3FF44',
        "brand-1": '#FFD644'
      }
    },
  },
  plugins: [],
};
