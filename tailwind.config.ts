import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: warm off-white editorial base
        primary: {
          DEFAULT: '#FFFEFB',
          light: '#F9F6F1',
          dark: '#F3EEE6',
        },
        // Brand: Black
        black: {
          DEFAULT: '#000000',
          light: '#1A1A1A',
          dark: '#0C0A08',
        },
        // Brand: muted antique gold (quiet luxury)
        gold: {
          light: '#E8D5A3',
          DEFAULT: '#C4A35A',
          dark: '#9A7B32',
          metallic: '#B8954A',
        },
        // Gray scale
        gray: {
          50: '#FAFAF8',
          100: '#F5F3EF',
          200: '#E8E4DC',
          300: '#D4CFC4',
          400: '#A39E93',
          500: '#73706A',
          600: '#52504B',
          700: '#3F3D39',
          800: '#262522',
          900: '#171614',
        },
        // Supporting colors (kept for backward compatibility)
        ivory: "#FDF8F3",
        champagne: "#F0E6D6",
        sand: "#D4C4B0",
        brown: {
          DEFAULT: "#5D4E37",
          dark: "#3D3125",
        },
        accent: {
          orange: "#C4A35A",
          emerald: "#2E8B57",
          burgundy: "#800020",
          gold: "#C4A35A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
      letterSpacing: {
        tighter: "-0.05em",
        wide: "0.1em",
        wider: "0.2em",
        widest: "0.3em",
      },
      boxShadow: {
        editorial: "0 1px 0 rgba(12, 10, 8, 0.04), 0 18px 48px rgba(12, 10, 8, 0.06)",
        "editorial-lg": "0 2px 0 rgba(12, 10, 8, 0.03), 0 28px 64px rgba(12, 10, 8, 0.08)",
        "gold-soft": "0 12px 40px rgba(196, 163, 90, 0.12)",
      },
    },
  },
  plugins: [],
}
export default config
