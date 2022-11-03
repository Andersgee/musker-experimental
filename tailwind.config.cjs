/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "sm": "640px",
      "md": "988px",
      "lg": "1266px",
      "xl": "1380px",
      "2xl": "1536px",
    },
    container: {
      screens: {
        "sm": "640px",
        "md": "988px",
        "lg": "1266px",
        "xl": "1380px",
        "2xl": "1536px",
      },
      center: true,
    },

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
        phone: "1fr",
        sm: "4.5rem 1fr",
        md: "4.5rem 1fr 20rem",
        lg: "18rem 1fr 25rem",
      },
      gridTemplateRows: {
        phone: "3rem 1fr 3rem",
        sm: "3rem 1fr",
        md: "3rem 1fr",
        lg: "3rem 1fr",
      },
    },
  },
  plugins: [],
};
