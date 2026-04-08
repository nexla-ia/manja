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
          mint:  "#6EE7B7",
          blue:  "#3B82F6",
          amber: "#F59E0B",
          50:    "#f0fdf4",
          100:   "#dcfce7",
          200:   "#bbf7d0",
          300:   "#86efac",
          400:   "#4ade80",
          500:   "#22c55e",
          600:   "#16a34a",
          700:   "#15803d",
          800:   "#166534",
          900:   "#14532d",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        syne: ["Syne", "system-ui", "sans-serif"],
      },
      animation: {
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "glow": "glow 3s ease-in-out infinite",
        "shimmer": "shimmer 1.5s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(110,231,183,0.15)" },
          "50%":      { boxShadow: "0 0 40px rgba(110,231,183,0.35)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
