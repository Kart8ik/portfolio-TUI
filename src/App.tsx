import { useMemo, useState } from "react";

import { loadPortrait } from "@/ascii/loadPortrait";
import { IntroPage } from "@/pages/IntroPage";
import { ExperiencePage } from "@/pages/ExperiencePage";
import { ExperienceDetailPage } from "@/pages/ExperienceDetailPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { SkillsDetailPage } from "@/pages/SkillsDetailPage";
import { SkillsPage } from "@/pages/SkillsPage";
import { SocialPage } from "@/pages/SocialPage";

const endpoints = ["Skills", "Projects", "Experience", "Socials"];

export function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const portrait = useMemo(() => loadPortrait(), []);

  if (activeEndpoint) {
    if (activeEndpoint === "Projects") return <ProjectsPage onBack={() => setActiveEndpoint(null)} />;
    if (activeEndpoint === "Experience") return <ExperiencePage onBack={() => setActiveEndpoint(null)} />;
    if (activeEndpoint === "Skills") return <SkillsPage onBack={() => setActiveEndpoint(null)} />;
    if (activeEndpoint === "Socials") return <SocialPage onBack={() => setActiveEndpoint(null)} />;
  }

  return (
    <IntroPage
      portrait={portrait}
      endpoints={endpoints}
      selectedIndex={selectedIndex}
      onMoveLeft={() => setSelectedIndex(current => (current - 1 + endpoints.length) % endpoints.length)}
      onMoveRight={() => setSelectedIndex(current => (current + 1) % endpoints.length)}
      onEnter={() => setActiveEndpoint(endpoints[selectedIndex] ?? endpoints[0])}
    />
  );
}

export default App;
