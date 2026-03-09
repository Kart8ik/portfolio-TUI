import { Box, Text, useInput } from "ink";
import { useState } from "react";
// @ts-ignore
import { projects } from "../data/ProjectsData.jsx";

type ProjectsScreenProps = {
  onBack: () => void;
};

const PROJECT_BANNER = [
  "██████╗ ██████╗  ██████╗     ██╗███████╗ ██████╗████████╗███████╗",
  "██╔══██╗██╔══██╗██╔═══██╗    ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝",
  "██████╔╝██████╔╝██║   ██║    ██║█████╗  ██║        ██║   ███████╗",
  "██╔═══╝ ██╔══██╗██║   ██║██║ ██║██╔══╝  ██║        ██║   ╚════██║",
  "██║     ██║  ██║╚██████╔╝██████║███████╗╚██████╗   ██║   ███████║",
  "╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝ ╚═════╝   ╚═╝   ╚══════╝"
];

const generalProjectArt = [
  "       .---.       ",
  "      /     \\      ",
  "     | () () |     ",
  "      \\  ^  /      ",
  "       |||||       ",
  "       |||||       ",
  "   ___|||||||___   ",
  "  |             |  "
];

const projectArts: Record<string, string[]> = {
  "CalPal": [
    "      ,,   ",
    "    ,<    ",
    "     >     ",
    "         ",
    "      |    ",
    "     / \\   ",
    "    /   \\  ",
    "    ---'   "
  ],
  "LeetTrack": [
    "   _          ",
    "  | |         ",
    "  | |__       ",
    "  | '_ \\      ",
    "  | |_) |     ",
    "  |_.__/      "
  ],
  "P2P-Echovoid": [
    "     /\\     ",
    "    /  \\    ",
    "   /____\\   ",
    "   (    )   ",
    "   (    )   "
  ],
  "Loopy": [
    "     .-.    ",
    "    (   )   ",
    "     | |    ",
    "     | |    ",
    "    /   \\   ",
    "   -----'  "
  ]
};

const ProjectList = ({ selectedIndex }: { selectedIndex: number }) => {
  return (
    <Box flexDirection="column" gap={1}>
      {projects.map((proj: any, idx: number) => {
        const isSelected = idx === selectedIndex;
        return (
          <Box key={proj.name} flexDirection="row">
            <Box width={2}>
               <Text color="cyan">{isSelected ? "▶" : " "}</Text>
            </Box>
            <Box width={14}>
               <Text color={isSelected ? "white" : "gray"} bold={isSelected}>{proj.name}</Text>
            </Box>
            <Box>
               <Text color="gray">{proj.description}</Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const ProjectDetail = ({ project }: { project: any }) => {
  return (
    <Box flexDirection="column" gap={1}>
      <Text color="cyan" bold>Project: <Text color="white">{project.name}</Text></Text>
      <Box flexDirection="column">
        <Text color="cyan" bold>Description:</Text>
        <Text>{project.explanation}</Text>
      </Box>
      <Box flexDirection="column">
        <Text color="cyan" bold>Stack:</Text>
        <Box flexDirection="column">
          {project.stack.map((s: string) => <Text key={s}>- {s}</Text>)}
        </Box>
      </Box>
      <Box flexDirection="column">
        <Text color="cyan" bold>Links:</Text>
        <Text>GitHub: {project.github}</Text>
        {project.link && <Text>Demo: {project.link}</Text>}
      </Box>
    </Box>
  );
};

export function ProjectsScreen({ onBack }: ProjectsScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inDetail, setInDetail] = useState(false);

  useInput((_, key) => {
    if (key.escape) {
      if (inDetail) {
        setInDetail(false);
      } else {
        onBack();
      }
      return;
    }

    if (!inDetail) {
      if (key.upArrow) {
        setSelectedIndex(curr => Math.max(0, curr - 1));
      }
      if (key.downArrow) {
        setSelectedIndex(curr => Math.min(projects.length - 1, curr + 1));
      }
      if (key.return) {
        setInDetail(true);
      }
    }
  });

  const activeProject = projects[selectedIndex];
  const rightArt = inDetail && activeProject 
    ? (projectArts[activeProject.name] || generalProjectArt)
    : generalProjectArt;

  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="row">
        <Box flexDirection="column" width={70}>
          <Box flexDirection="column" marginBottom={2}>
            <Text bold color="white">{PROJECT_BANNER.join("\n")}</Text>
          </Box>
          <Box flexDirection="column">
            {inDetail ? (
              <ProjectDetail project={activeProject} />
            ) : (
              <ProjectList selectedIndex={selectedIndex} />
            )}
          </Box>
        </Box>
        <Box marginLeft={4} flexDirection="column">
          {rightArt.map((line, idx) => (
            <Text key={`art-${idx}`}>{line}</Text>
          ))}
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text color="green">[ESC] go back</Text>
      </Box>
    </Box>
  );
}
