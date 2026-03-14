import { Box, Text, useInput, useStdout } from "ink";
import { useEffect, useMemo, useState } from "react";

const SHEEN_INTERVAL_MS = 135;
const BREATH_CYCLE = 4;
const PARTICLE_COUNT = 25;
const PARTICLE_MAX_LIFE = 65;
const PARTICLE_SPEED = 0.15;
const PARTICLE_CHARS = [".", "·", "•"] as const;

/** Deterministic seeded number in [0,1) */
function seeded(i: number, j: number): number {
  const n = (i * 1103515245 + j * 12345) & 0x7fffffff;
  return n / 0x7fffffff;
}

/** Compute particle state from frame (deterministic, no extra timers).
 *  Spawn positions vary each respawn cycle so particles cover the portrait over time. */
function getParticlesForFrame(
  frame: number,
  _centerX: number,
  _centerY: number,
  width: number,
  height: number
): Array<{ x: number; y: number; life: number; maxLife: number; char: string }> {
  const out: Array<{ x: number; y: number; life: number; maxLife: number; char: string }> = [];
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const phase = (i * 17) % PARTICLE_MAX_LIFE;
    const localFrame = frame + phase;
    const life = PARTICLE_MAX_LIFE - (localFrame % PARTICLE_MAX_LIFE);
    const age = localFrame % PARTICLE_MAX_LIFE;
    const angle = seeded(i, 0) * Math.PI * 2;
    const vx = Math.cos(angle) * PARTICLE_SPEED;
    const vy = Math.sin(angle) * PARTICLE_SPEED;
    // New spawn each respawn cycle - spread across full bounds
    const cycle = Math.floor(localFrame / PARTICLE_MAX_LIFE);
    const sx = (seeded(i, 1) + seeded(cycle, i + 100)) % 1;
    const sy = (seeded(i, 2) + seeded(cycle, i + 200)) % 1;
    const px = sx * (w - 1);
    const py = sy * (h - 1);
    const x = px + vx * age;
    const y = py + vy * age;
    const char = PARTICLE_CHARS[Math.floor(seeded(i, cycle) * PARTICLE_CHARS.length)] ?? "·";
    out.push({ x, y, life, maxLife: PARTICLE_MAX_LIFE, char });
  }
  return out;
}

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
      if (match?.[1] != null) {
        const codes = (match[1] ?? "").split(";").map(Number);
        for (let j = 0; j < codes.length - 4; j++) {
          const c0 = codes[j];
          const c1 = codes[j + 1];
          const r = codes[j + 2] ?? 0;
          const g = codes[j + 3] ?? 0;
          const b = codes[j + 4] ?? 0;
          if (c0 === 38 && c1 === 2) {
            fg = { r, g, b };
          }
          if (c0 === 48 && c1 === 2) {
            bg = { r, g, b };
          }
        }
        i = ansiRegex.lastIndex;
        continue;
      }
    }
    cells.push({ fg: { ...fg }, bg: { ...bg }, char: line[i] ?? " " });
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
  const { stdout } = useStdout();
  const screenWidth = stdout?.columns ?? 120;
  const screenHeight = stdout?.rows ?? 40;

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
  const portraitColumnOffset = 56 + 4;
  const contentWidth = portraitColumnOffset + width;
  const framePosition = frame % (width + 30);

  const particles = getParticlesForFrame(frame, contentWidth / 2, screenHeight / 2, contentWidth, screenHeight);

  const particleMap = useMemo(() => {
    const map = new Map<string, (typeof particles)[0]>();
    particles.forEach((p) => {
      map.set(`${Math.floor(p.x)},${Math.floor(p.y)}`, p);
    });
    return map;
  }, [particles]);

  /** Particle background - only within content area, not empty right side */
  const particleRows = useMemo(() => {
    return Array.from({ length: screenHeight }, (_, y) => {
      let row = "";
      for (let x = 0; x < screenWidth; x++) {
        const p = x < contentWidth ? particleMap.get(`${x},${y}`) : undefined;
        if (p) {
          const t = p.life / p.maxLife;
          const brightness = 0.5 + 0.4 * Math.sin(Math.PI * t);
          const v = Math.round(170 + brightness * 70);
          row += `\x1b[38;2;${v};${v};${v + 10}m${p.char}`;
        } else {
          row += " ";
        }
      }
      return row;
    });
  }, [particleMap, screenWidth, screenHeight, contentWidth]);

  const buildSheenLine = (cells: ReturnType<typeof parsePortraitCells>, y: number): string => {
    let out = "";
    for (let x = 0; x < cells.length; x++) {
      const cell = cells[x];
      if (!cell) continue;
      const { fg, bg, char } = cell;
      const isEmpty = char === " " || char.trim() === "";
      if (isEmpty) {
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

  const breathPhase = Math.floor(frame / BREATH_CYCLE) % 2;

  return (
    <>
      <Box position="absolute" flexDirection="column">
        {particleRows.map((r, i) => (
          <Text key={i}>{r}</Text>
        ))}
      </Box>
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
          const leftBracket = isSelected && breathPhase === 1 ? "⟦" : "[";
          const rightBracket = isSelected && breathPhase === 1 ? "⟧" : "]";
          return (
            <Text
              key={endpoint}
              bold={isSelected}
              color={isSelected ? "cyan" : "gray"}
            >
              {isSelected ? `${leftBracket}${endpoint}${rightBracket}` : ` ${endpoint} `}
            </Text>
          );
        })}
      </Box>
      <Box marginTop={1}>
        <Text>[ ← → to navigate • Ctrl+C to exit ]</Text>
      </Box>
    </Box>
    </>
  );
}
