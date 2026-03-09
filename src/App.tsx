import { useMemo, useState } from "react";
import { EndpointPage } from "./EndpointPage";
import { IntroScreen } from "./IntroScreen";
import { loadPortrait } from "./loadPortrait";
import { ProjectsScreen } from "./ProjectsScreen";

const endpoints = ["Skills", "Projects", "Experience", "Social"];

export function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const portrait = useMemo(() => loadPortrait(), []);

  if (activeEndpoint) {
    if (activeEndpoint === "Projects") {
      return <ProjectsScreen onBack={() => setActiveEndpoint(null)} />;
    }
    return <EndpointPage endpoint={activeEndpoint} onBack={() => setActiveEndpoint(null)} />;
  }

  return (
    <IntroScreen
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
