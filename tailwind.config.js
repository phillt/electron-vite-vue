/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "hsl(226, 72%, 40%)", // Navy blue (Trust, Stability)
          dark50: "hsla(226, 72%, 40%, 0.5)", // Semi-transparent navy
          dark20: "hsla(226, 72%, 40%, 0.2)", // Light navy

          accent: "hsl(156, 72%, 45%)", // Emerald green (Growth, Prosperity)
          accent20: "hsla(156, 72%, 45%, 0.2)",

          background: "hsl(210, 20%, 98%)", // Very light gray (Clean, Open)
          background80: "hsla(210, 20%, 98%, 0.8)",

          surface: "hsl(220, 13%, 95%)", // Card surfaces

          text: "hsl(222, 47%, 11%)", // Primary text
          text60: "hsla(222, 47%, 11%, 0.6)",

          muted: "hsl(222, 17%, 45%)", // Secondary text
          muted40: "hsla(222, 17%, 45%, 0.4)",

          success: "hsl(142, 71%, 35%)", // Deep green for positive values
          success30: "hsla(142, 71%, 35%, 0.3)",

          warning: "hsl(42, 94%, 58%)", // Amber warning
          warning20: "hsla(42, 94%, 58%, 0.2)",

          goldAccent: "hsl(48, 96%, 75%)", // Premium gold-like accent
          goldAccent50: "hsla(48, 96%, 75%, 0.5)",
        },
      },
    },
  },
  plugins: [],
};
