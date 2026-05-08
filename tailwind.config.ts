import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // LAGOP-style palette: dark navy, white, red accents.
        navy: {
          DEFAULT: "#0a2240",
          deep: "#061734",
          soft: "#13315c",
        },
        gop: {
          red: "#b91c1c",
          redDark: "#991b1b",
          redLight: "#dc2626",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
