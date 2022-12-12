/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        gridmap: "repeat(40, 0fr)",
      },
    },
  },
  plugins: [],
};
