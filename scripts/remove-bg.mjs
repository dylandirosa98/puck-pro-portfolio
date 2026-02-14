import { removeBackground } from "@imgly/background-removal-node";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const inputPath = resolve("public/images/hero-original.png");
const outputPath = resolve("public/images/hero-cutout.png");

console.log("Removing background...");
const blob = await removeBackground(inputPath);
const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync(outputPath, buffer);
console.log("Done! Saved to", outputPath);
