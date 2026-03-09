import { Box, Static } from "ink";
import { useState } from "react";
import { CommandHistory } from "./CommandHistory";
import { CommandInput } from "./CommandInput";
import { CommandOutput } from "./CommandOutput";
import { type CommandResult, routeCommand } from "./CommandRouter";

type Entry = {
  id: number;
  command: string;
  output: CommandResult;
};

export function TerminalShell() {
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  const submitCommand = (submittedValue: string) => {
    const command = submittedValue.trim();

    if (!command) {
      setInput("");
      setHistoryIndex(null);
      return;
    }

    setCommandHistory(previous => [...previous, command]);
    setHistoryIndex(null);

    const response = routeCommand(command);

    if (response.kind === "clear") {
      setEntries([]);
      setInput("");
      return;
    }

    setEntries(previous => [
      ...previous,
      {
        id: previous.length + 1,
        command,
        output: response.result,
      },
    ]);

    setInput("");
  };

  const navigateHistory = (direction: "up" | "down") => {
    if (commandHistory.length === 0) {
      return;
    }

    if (direction === "up") {
      const nextIndex = historyIndex === null ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex] ?? "");
      return;
    }

    if (historyIndex === null) {
      return;
    }

    const nextIndex = Math.min(historyIndex + 1, commandHistory.length);

    if (nextIndex === commandHistory.length) {
      setHistoryIndex(null);
      setInput("");
      return;
    }

    setHistoryIndex(nextIndex);
    setInput(commandHistory[nextIndex] ?? "");
  };

  return (
    <Box flexDirection="column" paddingX={1}>
      <Static items={entries}>
        {entry => (
          <Box flexDirection="column" key={entry.id} marginBottom={1}>
            <CommandHistory command={entry.command} />
            <CommandOutput output={entry.output} />
          </Box>
        )}
      </Static>
      <CommandInput value={input} onChange={setInput} onSubmit={submitCommand} onHistoryNavigate={navigateHistory} />
    </Box>
  );
}
