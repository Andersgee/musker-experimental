/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        strokedraw: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        strokedraw: "strokedraw 2.5s cubic-bezier(0.33, 0.4, 0.96, 0.6) forwards",
        slowstrokedraw: "strokedraw 10s cubic-bezier(0.33, 0.4, 0.96, 0.6) forwards",
        muskstrokedraw: "strokedraw 1s cubic-bezier(.17,.67,.72,.78) forwards",
      },
      boxShadow: {
        imageborder: "inset 0 2px 4px 0 hsla(0, 0%, 0%, .2)",
      },

      gridTemplateColumns: {
        // Complex site-specific column configuration
        footer: "200px minmax(900px, 1fr) 100px",
      },
      gridTemplateRows: {
        phone: "48px 1fr 48px",
      },
    },
  },
  plugins: [],
};
