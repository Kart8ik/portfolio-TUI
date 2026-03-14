import { Box, Text, useInput } from "ink";
import { AppLayout } from "./AppLayout";

type Experience = {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  link: string | null;
};

type ExperienceDetailPageProps = {
  experience: Experience;
  onBack: () => void;
};

export function ExperienceDetailPage({ experience, onBack }: ExperienceDetailPageProps) {
  useInput((_, key) => {
    if (key.escape) onBack();
  });

  const DIVIDER = "─────────────────────────────────────────";

  return (
    <AppLayout
      title="Experience"
      leftContent={
        <>
        <Text dimColor>{DIVIDER}</Text>
        <Box flexDirection="column">
          <Text color="white">{experience.position} @ {experience.company}</Text>
          <Box marginTop={1} flexDirection="column">
            <Text color="white" bold>Duration</Text>
            <Text dimColor>{experience.duration} | {experience.location}</Text>
          </Box>
          <Box marginTop={1} flexDirection="column">
            <Text color="white" bold>Description</Text>
            <Text dimColor>{experience.description}</Text>
          </Box>
          <Box marginTop={1} flexDirection="column">
            <Text color="white" bold>Skills</Text>
            <Text dimColor>{experience.skills.join(", ")}</Text>
          </Box>
          {experience.link && (
            <Box marginTop={1} flexDirection="column">
              <Text color="white" bold>Link</Text>
              <Text dimColor>{experience.link}</Text>
            </Box>
          )}
        </Box>
        </>
      }
      footer={<Text>[ esc back ]</Text>}
    />
  );
}
