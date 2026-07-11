// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      fallbacks: ["serif"],
      styles: ["normal", "italic"],
      weights: ["200 800"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
