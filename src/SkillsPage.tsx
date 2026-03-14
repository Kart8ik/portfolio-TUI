import { Box, Text, useInput } from "ink";
import { useState } from "react";
import { AppLayout } from "./AppLayout";
import { SelectableList } from "./SelectableList";
import { SkillsDetailPage } from "./SkillsDetailPage";
// @ts-ignore
import { skills } from "../data/SkillsData.jsx";

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const listItems = Object.entries(skills as Record<string, string[]>).map(
  ([category, values]) => ({
    title: category,
    description: values.map(titleCase).join(", "),
    data: { category, skills: values },
  })
);

type SkillsPageProps = {
  onBack: () => void;
};

export function SkillsPage({ onBack }: SkillsPageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openItem, setOpenItem] = useState<{
    category: string;
    skills: string[];
  } | null>(null);

  useInput((_, key) => {
    if (key.escape) {
      if (openItem) setOpenItem(null);
      else onBack();
      return;
    }
    if (openItem) return;
    if (key.upArrow) setSelectedIndex((i) => Math.max(0, i - 1));
    if (key.downArrow)
      setSelectedIndex((i) => Math.min(listItems.length - 1, i + 1));
    if (key.return)
      setOpenItem(listItems[selectedIndex]?.data ?? null);
  });

  if (openItem) {
    return (
      <SkillsDetailPage
        category={openItem.category}
        skills={openItem.skills}
        onBack={() => setOpenItem(null)}
      />
    );
  }

  return (
    <AppLayout
      title="Skills"
      leftContent={
        <Box flexDirection="column">
          <Box>
            <SelectableList
              items={listItems}
              selectedIndex={selectedIndex}
            />
          </Box>
        </Box>
      }
      footer={<Text>[ ↑ ↓ select • enter open • esc back ]</Text>}
    />
  );
}
