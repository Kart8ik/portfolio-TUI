import { Box, Text } from "ink";
import type { CommandResult } from "./CommandRouter";

type CommandOutputProps = {
  output: CommandResult;
};

export function CommandOutput({ output }: CommandOutputProps) {
  return (
    <Box flexDirection="column">
      {output.title ? <Text color="cyan">{output.title}</Text> : null}
      {output.lines.map((line, index) => (
        <Text key={`${index}-${line}`}>{line}</Text>
      ))}
    </Box>
  );
}
