const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      display: ["Rowdies"],
    },
    extend: {
      colors: {
        primary: "rgb(34, 34, 36)",
        accent: "rgb(223, 102, 74)",
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
        fadeOut: "fadeOut 150ms ease-in",
        slideDown: "slideDown 250ms ease-in",
        slideUp: "slideUp 250ms ease-out",
        fadeOut: "fadeOut 150ms ease-in",
        fadeInWithScale: "fadeInWithScale 200ms ease-out",
        fadeOutWithScale: "fadeOutWithScale 150ms ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        fadeInWithScale: {
          "0%": { opacity: 0, transform: "scale(95%)" },
          "100%": { opacity: 1, transform: "scale(100%)" },
        },
        fadeOutWithScale: {
          "0%": { opacity: 1, transform: "scale(100%)" },
          "100%": { opacity: 0, transform: "scale(95%)" },
        },
        slideDown: {
          "0%": { height: 0 },
          "100%": { height: "var(--kb-collapsible-content-height)" },
        },
        slideUp: {
          "0%": { height: "var(--kb-collapsible-content-height)" },
          "100%": { height: 0 },
        },
      },
    },
  },
  plugins: [require("@kobalte/tailwindcss")],
};
