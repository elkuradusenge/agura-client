/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // Syne is the only typeface in the product. No fallback stacks that would
        // render a different shape: the sans stack is the browser default only.
        sans: ["Syne", "system-ui", "sans-serif"],
      },
      colors: {
        leaf: {
          50: "#f0f7f1",
          100: "#dcecdf",
          200: "#bcdac2",
          300: "#8fc09a",
          400: "#5d9f6d",
          500: "#3d8350",
          600: "#2d693e",
          700: "#255333",
          800: "#1f422b",
          900: "#1a3724",
        },
        earth: {
          50: "#faf7f2",
          100: "#f2ebdf",
          200: "#e4d5bf",
          300: "#d2b795",
          400: "#bf976c",
          500: "#b07f50",
          600: "#9a6943",
          700: "#7d5139",
          800: "#674434",
          900: "#56392d",
        },
        amber: {
          400: "#f5b942",
          500: "#eda324",
          600: "#d1821a",
        },
        danger: {
          500: "#c0392b",
          600: "#a93226",
        },
      },
      minHeight: {
        tap: "44px",
      },
      minWidth: {
        tap: "44px",
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [],
};
