import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import kobaltePlugin from "@kobalte/tailwindcss";
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
        primary: "#222224",
        accent: "#d05a3a",
      },
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "fade-out": "fade-out 150ms ease-in",
        "slide-down": "slide-down 250ms ease-in-out",
        "slide-up": "slide-up 250ms ease-in-out",
        "fade-in-from-bottom": "fade-in-from-bottom 200ms ease-out",
        "fade-out-to-bottom": "fade-out-to-bottom 200ms ease-in",
        "fade-in-from-right": "fade-in-from-right 200ms ease-out",
        "fade-out-to-right": "fade-out-to-right 200ms ease-in",
        "swipe-out": "swipe-out 250ms ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-down": {
          "0%": { height: "0" },
          "100%": { height: "var(--kb-collapsible-content-height)" },
        },
        "slide-up": {
          "0%": { height: "var(--kb-collapsible-content-height)" },
          "100%": { height: "0" },
        },
        "fade-in-from-bottom": {
          "0%": { opacity: "0", transform: "scale(95%) translateY(16px)" },
          "100%": { opacity: "1", transform: "scale(100%) translateY(0px)" },
        },
        "fade-out-to-bottom": {
          "0%": { opacity: "1", transform: "scale(100%) translateY(0px)" },
          "100%": { opacity: "0", transform: "scale(95%) translateY(16px)" },
        },
        "fade-in-from-right": {
          "0%": { opacity: "0", transform: "scale(95%) translateX(16px)" },
          "100%": { opacity: "1", transform: "scale(100%) translateX(0px)" },
        },
        "fade-out-to-right": {
          "0%": { opacity: "1", transform: "scale(100%) translateX(0px)" },
          "100%": { opacity: "0", transform: "scale(95%) translateX(16px)" },
        },
        "swipe-out": {
          "0%": {
            opacity: "1",
            transform: "scale(100%) translateX(var(--kb-toast-swipe-end-x))",
          },
          "100%": {
            opacity: "0",
            transform: "scale(75%) translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [
    kobaltePlugin,
    plugin(({ addVariant }) => {
      addVariant("pointer-coarse", "@media (pointer: coarse) ");
      addVariant("pointer-fine", "@media (pointer: fine) ");
    }),
  ],
} satisfies Config;
