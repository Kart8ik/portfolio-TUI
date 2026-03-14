import { Box, Text } from "ink";

import { DIVIDER } from "@/constants";

export type SelectableListItem = {
  title: string;
  description: string;
  data?: unknown;
};

type SelectableListProps = {
  items: SelectableListItem[];
  selectedIndex: number;
};

/**
 * Presentational list. Parent handles keyboard (↑↓ enter) and passes selectedIndex.
 */
export function SelectableList({ items, selectedIndex }: SelectableListProps) {
  return (
    <Box flexDirection="column">
      <Text dimColor>{DIVIDER}</Text>
      <Box marginTop={1} flexDirection="column">
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <Box key={idx} flexDirection="column" marginBottom={1}>
              <Text color={isSelected ? "cyan" : "white"} bold={isSelected}>
                {isSelected ? `[${item.title}]` : ` ${item.title} `}
              </Text>
              <Text dimColor>{item.description}</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
