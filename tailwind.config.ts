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
        // Primary: White
        primary: {
          DEFAULT: '#FFFFFF',
          light: '#FAFAFA',
          dark: '#F5F5F5',
        },
        // Brand: Black
        black: {
          DEFAULT: '#000000',
          light: '#1A1A1A',
          dark: '#0A0A0A',
        },
        // Brand: Gold
        gold: {
          light: '#FFD700',
          DEFAULT: '#D4AF37',
          dark: '#B8860B',
          metallic: '#AA8B2E',
        },
        // Supporting colors (kept for backward compatibility)
        ivory: "#FDF8F3",
        champagne: "#F5E6D3",
        sand: "#D4C4B0",
        brown: {
          DEFAULT: "#5D4E37",
          dark: "#3D3125",
        },
        accent: {
          orange: "#D2691E",
          emerald: "#2E8B57",
          burgundy: "#800020",
          gold: "#D4AF37",
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
    },
  },
  plugins: [],
}
export default config
