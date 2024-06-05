/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  theme: {
    colors: {
      ...colors,
      ...{
        "deep-blue": "#191b31",
      },
    },
    extend: {
      keyframes: {
        appear: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        disappear: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        appear: "appear 1.5s ease 2s 1 forwards",
        disappear: "disappear 3s ease 0s 1 forwards",
      },
    },
  },
};
