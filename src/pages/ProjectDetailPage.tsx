import { Box, Text, useInput } from "ink";

import { AppLayout } from "@/layout/AppLayout";
import { DIVIDER } from "@/constants";

type Project = {
  name: string;
  description: string;
  explanation: string;
  stack: string[];
  github: string;
  link?: string;
};

type ProjectDetailPageProps = {
  project: Project;
  onBack: () => void;
};

export function ProjectDetailPage({ project, onBack }: ProjectDetailPageProps) {
  useInput((_, key) => {
    if (key.escape) onBack();
  });

  return (
    <AppLayout
      title="Projects"
      leftContent={
        <>
        <Text dimColor>{DIVIDER}</Text>
        <Box flexDirection="column">
          <Text color="white" bold>{project.name}</Text>
          <Box marginTop={1} flexDirection="column">
            <Text color="white" bold>Description</Text>
            <Text dimColor>{project.explanation}</Text>
          </Box>
          <Box marginTop={1} flexDirection="column">
            <Text color="white" bold>Stack</Text>
            <Box flexDirection="column">
              {project.stack.map((s) => (
                <Text key={s} dimColor>{s}</Text>
              ))}
            </Box>
          </Box>
          <Box marginTop={1} flexDirection="column">
            <Text color="white" bold>Links</Text>
            <Text dimColor>
              {project.github}
              {project.link ? ` • ${project.link}` : ""}
            </Text>
            </Box>
          </Box>
        </>
      }
      footer={<Text>[ esc back ]</Text>}
    />
  );
}
