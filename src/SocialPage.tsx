import { Box, Text, useInput } from "ink";
import { useState } from "react";
import { AppLayout } from "./AppLayout";
import { SelectableList } from "./SelectableList";
import open from "open";

const socialItems = [
  { title: "GitHub", value: "https://github.com/Kart8ik", url: "https://github.com/Kart8ik" },
  { title: "Email", value: "shrkrthk200518@gmail.com", url: "mailto:shrkrthk200518@gmail.com" },
  { title: "Instagram", value: "https://www.instagram.com/krthk200518/", url: "https://www.instagram.com/krthk200518/" },
  { title: "LinkedIn", value: "https://www.linkedin.com/in/a--shri--karthik/", url: "https://www.linkedin.com/in/a--shri--karthik/" },
  { title: "Portfolio", value: "https://shrikarthik.vercel.app/", url: "https://shrikarthik.vercel.app/" },
].map((item) => ({
  title: item.title,
  description: item.value,
  data: item,
}));

type SocialPageProps = {
  onBack: () => void;
};

export function SocialPage({ onBack }: SocialPageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((_, key) => {
    if (key.escape) {
      onBack();
      return;
    }
    if (key.upArrow) setSelectedIndex((i) => Math.max(0, i - 1));
    if (key.downArrow)
      setSelectedIndex((i) => Math.min(socialItems.length - 1, i + 1));
    if (key.return) {
      const item = socialItems[selectedIndex]?.data;
      if (item?.url) {
        open(item.url).catch(() => {});
      }
    }
  });

  return (
    <AppLayout
      title="Socials"
      leftContent={
        <Box flexDirection="column">
          <Box>
            <SelectableList
              items={socialItems}
              selectedIndex={selectedIndex}
            />
          </Box>
        </Box>
      }
      footer={<Text>[ ↑ ↓ select • enter open link • esc back ]</Text>}
    />
  );
}
