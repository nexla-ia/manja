import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          mint:  "#00E5A0",
          blue:  "#3B82F6",
          amber: "#F59E0B",
          rose:  "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        syne: ["Syne", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":   "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":   "fadeIn 0.35s ease both",
        "float":     "float 6s ease-in-out infinite",
        "spin-slow": "spinSlow 20s linear infinite",
        "bounce-dot":"bounceDot 1.3s ease-in-out infinite",
        "shimmer":   "shimmer 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "translateY(0)",    opacity: "0.4" },
          "40%":           { transform: "translateY(-7px)", opacity: "1"   },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-300% center" },
          "100%": { backgroundPosition:  "300% center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
