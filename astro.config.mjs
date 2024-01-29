import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare({
    mode: "directory",
    runtime: {
      mode: "local",
      type: "pages",
      bindings: {
        EMAIL_RECEIVERS: {
          type: "var",
          value: "nnad3n@outlook.com",
        },
      },
    },
  }),
  integrations: [tailwind(), solidJs()],
});
