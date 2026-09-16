/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: "#0f172a",
        "surface-card": "rgba(15, 23, 42, 0.75)",
        "surface-border": "rgba(255, 255, 255, 0.08)",
        hero: {
          emerald: "#10b981",
          cyan: "#06b6d4",
          gold: "#f59e0b",
          purple: "#8b5cf6",
          rose: "#f43f5e",
        },
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)",
        "gradient-gold": "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(16, 185, 129, 0.3)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.3)",
        "glow-gold": "0 0 25px -5px rgba(245, 158, 11, 0.3)",
      },
    },
  },
  plugins: [],
};
