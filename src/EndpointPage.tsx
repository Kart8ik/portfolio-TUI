import { Box, Text, useInput } from "ink";
import { routeCommand } from "./CommandRouter";
import { CommandOutput } from "./CommandOutput";

type EndpointPageProps = {
  endpoint: string;
  onBack: () => void;
};

export function EndpointPage({ endpoint, onBack }: EndpointPageProps) {
  useInput((_, key) => {
    if (key.escape) {
      onBack();
    }
  });

  const response = routeCommand(endpoint);
  const output =
    response.kind === "output"
      ? response.result
      : {
          title: endpoint,
          lines: ["No page data available."],
        };

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box marginBottom={1}>
        <Text color="yellow">Endpoint: {endpoint}</Text>
      </Box>
      <CommandOutput output={output} />
      <Box marginTop={1}>
        <Text color="green">Press Esc to go back</Text>
      </Box>
    </Box>
  );
}
