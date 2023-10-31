/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  tailwindAttributes: ["dotClass", "headerClass", "class:list"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
