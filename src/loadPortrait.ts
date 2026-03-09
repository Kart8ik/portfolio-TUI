import { readFileSync } from "node:fs";

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
    const portraitUrl = new URL("./portrait.txt", import.meta.url);
    const raw = readFileSync(portraitUrl, "utf8");

    // Keep source geometry intact while normalizing platform newlines and tabs.
    const normalized = raw.replace(/\r\n/g, "\n").replace(/\t/g, "    ");

    // Keep exact row width for generated ASCII while removing outer blank lines.
    return normalized.replace(/^\n+/, "").replace(/\n+$/, "");
  } catch {
    return fallbackPortrait;
  }
};
