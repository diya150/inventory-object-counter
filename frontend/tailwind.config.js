/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14181B",        // main background — dark stockroom
        surface: "#1B2126",    // panels
        raised: "#222A30",     // hover/raised panels
        paper: "#F3EEDD",      // inventory tag paper
        safety: "#FFC53D",     // safety-yellow accent
        signal: "#FF5A36",     // alert/count accent
        ink2: "#EDEAE0",       // light text on dark
        dim: "#8B939A",        // secondary text
        line: "#2E363C",       // hairline dividers
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
