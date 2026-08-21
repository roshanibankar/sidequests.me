import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1B15",
          light: "#16261D",
        },
        surface: "#1C2E24",
        surface2: "#233A2C",
        shelf: "#3E2A1F",
        shelfDark: "#2C1D15",
        brass: {
          DEFAULT: "#C99A3E",
          bright: "#E6BC6A",
          dim: "#8A6B2E",
        },
        parchment: "#F3ECDA",
        moss: "#7C9473",
        rose: "#D8667A",
        ash: "#93A196",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        shelf: "0 18px 30px -18px rgba(0,0,0,0.65)",
        spine: "2px 0 0 rgba(0,0,0,0.25) inset, -1px 0 0 rgba(255,255,255,0.06) inset",
      },
      backgroundImage: {
        grain: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: "3px 3px",
      },
    },
  },
  plugins: [],
};
export default config;
