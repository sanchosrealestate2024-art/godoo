import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#050505",
          pure: "#000000",
          raised: "#0d0d0d",
          panel: "#121212",
        },
        neutral: {
          150: "#e5e5e5",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.35em",
        technical: "0.4em",
      },
      borderRadius: {
        DEFAULT: "0px",
        none: "0px",
        sm: "1px",
        md: "1px",
        lg: "2px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
