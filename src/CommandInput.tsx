import { useEffect, useState } from "react";
import { Text, useApp, useInput } from "ink";

type Direction = "up" | "down";

type CommandInputProps = {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmit: (value: string) => void;
  onHistoryNavigate: (direction: Direction) => void;
};

export function CommandInput({ value, onChange, onSubmit, onHistoryNavigate }: CommandInputProps) {
  const [showCursor, setShowCursor] = useState(true);
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input.toLowerCase() === "c") {
      exit();
      return;
    }

    if (key.return) {
      onSubmit(value);
      return;
    }

    if (key.backspace || key.delete) {
      onChange(value.slice(0, -1));
      return;
    }

    if (key.upArrow) {
      onHistoryNavigate("up");
      return;
    }

    if (key.downArrow) {
      onHistoryNavigate("down");
      return;
    }

    if (!key.ctrl && !key.meta && input) {
      onChange(value + input);
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setShowCursor(current => !current);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <Text>
      <Text color="green">&gt; </Text>
      {value}
      {showCursor ? "█" : " "}
    </Text>
  );
}
