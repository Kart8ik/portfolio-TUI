import { Box, Text, useInput } from "ink";
import { AppLayout } from "./AppLayout";

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type SkillsDetailPageProps = {
  category: string;
  skills: string[];
  onBack: () => void;
};

export function SkillsDetailPage({
  category,
  skills,
  onBack,
}: SkillsDetailPageProps) {
  useInput((_, key) => {
    if (key.escape) onBack();
  });

  const DIVIDER = "─────────────────────────────────────────";

  return (
    <AppLayout
      title="Skills"
      leftContent={
        <>
        <Text dimColor>{DIVIDER}</Text>
        <Box flexDirection="column">
          <Text color="white" bold>
            {category}
          </Text>
          <Box marginTop={1} flexDirection="column">
            {skills.map((s) => (
              <Text key={s} dimColor>
                • {titleCase(s)}
              </Text>
            ))}
          </Box>
        </Box>
        </>
      }
      footer={<Text>[ esc back ]</Text>}
    />
  );
}
