import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const fallbackPortrait = [
  "      .-''''-.",
  "    .'  _  _  '.",
  "   /   (o)(o)   \\",
  "  |     .--.     |",
  "  |    (____)    |",
  "   \\  .`----'.  /",
  "    '.  '--'  .'/",
  "      '-.__.-'",
].join("\n");

export const loadPortrait = (): string => {
  try {
    const portraitPath = join(__dirname, "portrait.txt");
    const raw = readFileSync(portraitPath, "utf8");

    // Normalize line endings only
    const normalized = raw
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, "    ");

    return normalized;
  } catch {
    return fallbackPortrait;
  }
};