import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // SFGOP brand palette — pulled from sfgop.org's CSS:
        //   primary red:    #d32f2f (Material red 700)
        //   secondary navy: #0d47a1 (Material blue 900)
        // The token names (`navy`, `gop`) are kept the same as the LAGOP fork
        // so we don't have to refactor every component.
        navy: {
          DEFAULT: "#0d47a1", // SFGOP navy
          deep: "#0a3a8a", // slightly darker (header band, footer)
          soft: "#1565c0", // slightly lighter (hover)
        },
        gop: {
          red: "#d32f2f", // SFGOP red
          redDark: "#b71c1c", // hover / pressed
          redLight: "#ffebee", // very light red for tint backgrounds
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
