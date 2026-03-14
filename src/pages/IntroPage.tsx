import { Box, Text, useInput } from "ink";
import { useEffect, useMemo, useState } from "react";

const SHEEN_INTERVAL_MS = 135;

/** Parse a portrait line into cells: {fg, bg, char} with original ANSI colors.
 *  Preserves every character (including those without preceding ANSI). */
function parsePortraitCells(line: string): Array<{ fg: { r: number; g: number; b: number }; bg: { r: number; g: number; b: number }; char: string }> {
  const cells: Array<{ fg: { r: number; g: number; b: number }; bg: { r: number; g: number; b: number }; char: string }> = [];
  const ansiRegex = /\x1b\[([0-9;]*)m/g;
  let fg = { r: 128, g: 128, b: 128 };
  let bg = { r: 0, g: 0, b: 0 };
  let i = 0;
  while (i < line.length) {
    if (line[i] === "\x1b") {
      ansiRegex.lastIndex = i;
      const match = ansiRegex.exec(line);
      if (match) {
        const codes = match[1].split(";").map(Number);
        for (let j = 0; j < codes.length - 4; j++) {
          if (codes[j] === 38 && codes[j + 1] === 2) {
            fg = { r: codes[j + 2], g: codes[j + 3], b: codes[j + 4] };
          }
          if (codes[j] === 48 && codes[j + 1] === 2) {
            bg = { r: codes[j + 2], g: codes[j + 3], b: codes[j + 4] };
          }
        }
        i = ansiRegex.lastIndex;
        continue;
      }
    }
    cells.push({ fg: { ...fg }, bg: { ...bg }, char: line[i] });
    i++;
  }
  return cells;
}

/** Blend color toward white; t=0 keep original, t=1 full white */
function blendTowardWhite(r: number, g: number, b: number, t: number): { r: number; g: number; b: number } {
  return {
    r: Math.round(r + (255 - r) * t),
    g: Math.round(g + (255 - g) * t),
    b: Math.round(b + (255 - b) * t),
  };
}

type IntroPageProps = {
  portrait: string;
  endpoints: string[];
  selectedIndex: number;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onEnter: () => void;
};

const getUptime = () => {
  const birthDate = new Date(2005, 3, 8);
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years}y ${months}m`;
};

const banner = [
  "██╗  ██╗ █████╗ ██████╗ ████████╗ █████╗ ██║██╗  ██╗",
  "██║ ██╔╝██╔══██╗██╔══██║╚══██╔══╝██╔══██╗██║██║ ██╔╝",
  "█████╔╝ ███████║██████╔╝   ██║   ╚█████╔╝██║█████╔╝ ",
  "██╔═██╗ ██╔══██║██╔══██╗   ██║   ██╔══██╗██║██╔═██╗ ",
  "██║  ██╗██║  ██║██║  ██║   ██║   ╚█████╔╝██║██║  ██╗",
  "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚════╝ ╚═╝╚═╝  ╚═╝"
];

const bioLines = [
  "User      : shrikarthik",
  "Runtime   : Human",
  "Version   : Rooster 8.4.5",
  "Role      : Software Developer",
  `Uptime    : ${getUptime()}`,
  "Location  : Bengaluru-India",
  "Status    : compiling ideas 24x7"
];

export function IntroPage({
  portrait,
  endpoints,
  selectedIndex,
  onMoveLeft,
  onMoveRight,
  onEnter,
}: IntroPageProps) {
  const [frame, setFrame] = useState(0);
  useInput((_, key) => {
    if (key.leftArrow) onMoveLeft();
    if (key.rightArrow) onMoveRight();
    if (key.return) onEnter();
  });

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), SHEEN_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const parsedLines = useMemo(
    () => portrait.split("\n").map(parsePortraitCells),
    [portrait]
  );
  const width = Math.max(0, ...parsedLines.map((cells) => cells.length));
  const framePosition = frame % (width + 30);

  const buildSheenLine = (cells: ReturnType<typeof parsePortraitCells>, y: number): string => {
    let out = "";
    for (let x = 0; x < cells.length; x++) {
      const { fg, bg, char } = cells[x];
      if (char === " ") {
        out += `\x1b[38;2;${fg.r};${fg.g};${fg.b}m\x1b[48;2;${bg.r};${bg.g};${bg.b}m${char}`;
        continue;
      }
      const waveOffset = Math.sin(y / 5) * 2;
      const bandCenter = framePosition - y + waveOffset;
      const distance = Math.abs(x - bandCenter);
      const sheenStrength = distance < 1 ? 1 : distance < 2 ? 0.5 : 0;
      const { r, g, b } = blendTowardWhite(fg.r, fg.g, fg.b, sheenStrength);
      out += `\x1b[38;2;${r};${g};${b}m\x1b[48;2;${bg.r};${bg.g};${bg.b}m${char}`;
    }
    return out;
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="row">
        <Box flexDirection="column" width={56}>
          <Box flexDirection="column" marginBottom={2}>
            <Text bold color="white">{banner.join("\n")}</Text>
          </Box>
          <Box flexDirection="column" gap={1}>
            <Box flexDirection="column">
              {bioLines.map((line) => {
                const [key, ...rest] = line.split(":");
                return (
                  <Text key={key} bold>
                    <Text color="cyan">{key}</Text>
                    <Text>:{rest.join(":")}</Text>
                  </Text>
                );
              })}
            </Box>
            <Box>
              <Text>
                I'm a CS undergrad building practical software across web apps, systems, and ML. Most of my projects start from a simple question: what would make this achievable efficiently in the real world, and what can I learn by building it properly? and then I get right on it ;)
              </Text>
            </Box>
          </Box>
        </Box>
        <Box marginLeft={4} flexDirection="column">
          {parsedLines.map((cells, y) => (
            <Box key={y}>
              <Text wrap="truncate-end">{buildSheenLine(cells, y)}</Text>
            </Box>
          ))}
        </Box>
      </Box>
      <Box flexDirection="row" marginTop={1} gap={2}>
        {endpoints.map((endpoint, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Text
              key={endpoint}
              bold={isSelected}
              color={isSelected ? "cyan" : "gray"}
            >
              {isSelected ? `[${endpoint}]` : ` ${endpoint} `}
            </Text>
          );
        })}
      </Box>
      <Box marginTop={1}>
        <Text>[ ← → to navigate • Ctrl+C to exit ]</Text>
      </Box>
    </Box>
  );
}
