/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      sans: ["system-ui", "sans-serif"],
      serif: ["system-ui", "serif"],
    },
    extend: {
      colors: {
        primary: "#133951",
        "primary-light": "#426174",
        "primary-lighter": "#A8D3F1",
        "primary-lightest": "#F5FAFD",
        "primary-background": "#DFE4E7",
        white: "#fff",
        "gray-dark": "#424953",
        gray: "#8492a6",
        "gray-light": "#CAD1DB",
        "gray-lighter": "#D7DCE4",
        "gray-lightest": "#F1F3F6",
        rose: "#e11d48",
        "rose-lightest": "#FCE6EB",
        orange: "orange",
        green: "green",
        "green-lightest": "#F0FAF0",
        black: "#000",
        disabled: "#f9f9f9",
        transparent: "#00000000",
        current: "currentColor",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "hero-pattern": "url('assets/background.svg')",
        confetti: "url('assets/confetti.gif')",
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
      },
      animation: {
        rotate: "rotate 1.2s linear infinite",
      },
      textColor: {
        "tag-white": "#000",
        "tag-green": "#32640B",
        "tag-orange": "#774317",
        "tag-violet": "#683DA4",
        "tag-red": "#800000",
        "tag-blue": "#093C69",
        "tag-gray": "#fff",
        "tag-turq": "#1e3230",
      },
      backgroundColor: {
        "tag-white": "#f8f8ff",
        "tag-green": "#daffce",
        "tag-orange": "#FFF3AE",
        "tag-violet": "#E3D3FA",
        "tag-red": "#FFBFBF",
        "tag-blue": "#C9E1F6",
        "tag-gray": "#bababa",
        "tag-turq": "#CCFFF2",
      },
    },
  },
  variants: {
    fill: ["hover", "focus"],
  },
  plugins: [require("tailwind-scrollbar")],
};
