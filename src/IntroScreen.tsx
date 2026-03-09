import { Box, Text, useInput } from "ink";

type IntroScreenProps = {
  portrait: string;
  endpoints: string[];
  selectedIndex: number;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onEnter: () => void;
};

const getUptime = () => {
  const birthDate = new Date(2005, 3, 8); // April is index 3
  const now = new Date();
  
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return `${years}y ${months}m`;
};

const LeftColumn = () => {
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
  return (
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
  );
};

const Portrait = ({ portrait }: { portrait: string }) => {
  const lines = portrait.split("\n").map(l => l.replace(/\s+$/, ""));
  return (
    <Box marginLeft={4} flexDirection="column">
      {lines.map((line, idx) => (
        <Text key={`portrait-${idx}`}>{line}</Text>
      ))}
    </Box>
  );
};

const MainSection = ({ portrait }: { portrait: string }) => {
  return (
    <Box flexDirection="row">
      <LeftColumn />
      <Portrait portrait={portrait} />
    </Box>
  );
};

const NavigationTabs = ({ endpoints, selectedIndex }: { endpoints: string[], selectedIndex: number }) => {
  return (
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
  );
};

const Footer = () => {
  return (
    <Box marginTop={1}>
      <Text>← → to navigate, Ctrl+C to exit</Text>
    </Box>
  );
};

export function IntroScreen({
  portrait,
  endpoints,
  selectedIndex,
  onMoveLeft,
  onMoveRight,
  onEnter,
}: IntroScreenProps) {
  useInput((_, key) => {
    if (key.leftArrow) onMoveLeft();
    if (key.rightArrow) onMoveRight();
    if (key.return) onEnter();
  });

  return (
    <Box flexDirection="column" padding={1}>
      <MainSection portrait={portrait} />
      <NavigationTabs endpoints={endpoints} selectedIndex={selectedIndex} />
      <Footer />
    </Box>
  );
}
