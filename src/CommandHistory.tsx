import { Text } from "ink";

type CommandHistoryProps = {
  command: string;
};

export function CommandHistory({ command }: CommandHistoryProps) {
  return (
    <Text>
      <Text color="green">&gt; </Text>
      {command}
    </Text>
  );
}
