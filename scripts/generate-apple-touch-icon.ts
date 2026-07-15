import { fileURLToPath } from "node:url";
import sharp from "sharp";

const favicon = fileURLToPath(
  new URL("../public/favicon.svg", import.meta.url),
);
const output = fileURLToPath(
  new URL("../public/apple-touch-icon.png", import.meta.url),
);
const padding = 26;

await sharp(favicon)
  .resize(180 - padding * 2, 180 - padding * 2)
  .flatten({ background: "#fffcf0" })
  .extend({
    top: padding,
    right: padding,
    bottom: padding,
    left: padding,
    background: "#fffcf0",
  })
  .png()
  .toFile(output);
