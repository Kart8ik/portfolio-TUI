import { Box, Text, useInput } from "ink";
import { useState } from "react";
import { AppLayout } from "./AppLayout";
import { SelectableList } from "./SelectableList";
import { ExperienceDetailPage } from "./ExperienceDetailPage";
// @ts-ignore
import { experience } from "../data/ExperienceData.jsx";

const listItems = experience.map((e: { position: string; company: string; duration: string; location: string }) => ({
  title: `${e.position} @ ${e.company}`,
  description: `${e.duration} | ${e.location}`,
  data: e,
}));

type ExperiencePageProps = {
  onBack: () => void;
};

export function ExperiencePage({ onBack }: ExperiencePageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openItem, setOpenItem] = useState<typeof experience[0] | null>(null);

  useInput((_, key) => {
    if (key.escape) {
      if (openItem) setOpenItem(null);
      else onBack();
      return;
    }
    if (openItem) return;
    if (key.upArrow) setSelectedIndex((i) => Math.max(0, i - 1));
    if (key.downArrow) setSelectedIndex((i) => Math.min(listItems.length - 1, i + 1));
    if (key.return) setOpenItem(listItems[selectedIndex]?.data ?? null);
  });

  if (openItem) {
    return (
      <ExperienceDetailPage
        experience={openItem}
        onBack={() => setOpenItem(null)}
      />
    );
  }

  return (
    <AppLayout
      title="Experience"
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
