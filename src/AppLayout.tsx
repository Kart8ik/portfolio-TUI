import { Box, Text } from "ink";

export type AppLayoutProps = {
  /** Page title - plain bold text */
  title?: string;
  leftContent: React.ReactNode;
  footer: React.ReactNode;
  leftWidth?: number;
};

/**
 * Reusable layout for non-intro pages. Matches intro page spacing and structure.
 */
export function AppLayout({
  title,
  leftContent,
  footer,
  leftWidth = 56,
}: AppLayoutProps) {
  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="column" width={leftWidth}>
        {title && (
          <Box flexDirection="column">
            <Text bold color="cyan">{title}</Text>
          </Box>
        )}
        <Box flexDirection="column" gap={1}>
          {leftContent}
        </Box>
        <Box marginTop={1}>{footer}</Box>
      </Box>
    </Box>
  );
}
