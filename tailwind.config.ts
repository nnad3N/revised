import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    fontFamily: {
      display: ["Rowdies"],
    },
    extend: {
      outlineWidth: {
        "3": "3px",
      },
      outlineOffset: {
        "3": "3px",
      },
      borderRadius: {
        xs: "0.0625rem",
      },
      colors: {
        primary: "rgb(34, 34, 36)",
        accent: "rgb(223, 102, 74)",
      },
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
        fadeOut: "fadeOut 150ms ease-in",
        slideDown: "slideDown 250ms ease-in-out",
        slideUp: "slideUp 250ms ease-in-out",
        fadeInWithScale: "fadeInWithScale 200ms ease-out",
        fadeOutWithScale: "fadeOutWithScale 150ms ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeInWithScale: {
          "0%": { opacity: "0", transform: "scale(95%)" },
          "100%": { opacity: "1", transform: "scale(100%)" },
        },
        fadeOutWithScale: {
          "0%": { opacity: "1", transform: "scale(100%)" },
          "100%": { opacity: "0", transform: "scale(95%)" },
        },
        slideDown: {
          "0%": { height: "0" },
          "100%": { height: "var(--kb-collapsible-content-height)" },
        },
        slideUp: {
          "0%": { height: "var(--kb-collapsible-content-height)" },
          "100%": { height: "0" },
        },
      },
    },
  },
  plugins: [
    require("@kobalte/tailwindcss"),
    plugin(({ addVariant }) => {
      addVariant("pointer-coarse", "@media (pointer: coarse) ");
      addVariant("pointer-fine", "@media (pointer: fine) ");
    }),
  ],
} satisfies Config;
