import { Box, Text, useInput } from "ink";

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
  useInput((_, key) => {
    if (key.leftArrow) onMoveLeft();
    if (key.rightArrow) onMoveRight();
    if (key.return) onEnter();
  });

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
          {portrait.split("\n").map((l, idx) => (
            <Text key={idx}>{l.replace(/\s+$/, "")}</Text>
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
