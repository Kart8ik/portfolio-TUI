import { Box, Text, useInput } from "ink";
import { useState } from "react";

import { Box, Text } from "ink";
import { useState } from "react";

import { AppLayout } from "@/layout/AppLayout";
import { SelectableList } from "@/components/SelectableList";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
// @ts-ignore
import { projects } from "@data/ProjectsData.jsx";

const listItems = projects.map((p: { name: string; description: string }) => ({
  title: p.name,
  description: p.description,
  data: p,
}));

type ProjectsPageProps = {
  onBack: () => void;
};

export function ProjectsPage({ onBack }: ProjectsPageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openItem, setOpenItem] = useState<typeof projects[0] | null>(null);

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
    return <ProjectDetailPage project={openItem} onBack={() => setOpenItem(null)} />;
  }

  return (
    <AppLayout
      title="Projects"
      leftContent={
        <Box>
          <SelectableList items={listItems} selectedIndex={selectedIndex} />
        </Box>
      }
      footer={<Text>[ ↑ ↓ select • enter open • esc back ]</Text>}
    />
  );
}
