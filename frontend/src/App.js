import { useEffect, useState } from "react";
import "@/App.css";
import MissionBanner from "@/components/MissionBanner";
import TopBar from "@/components/TopBar";
import AgentsPanel from "@/components/AgentsPanel";
import MissionQueue from "@/components/MissionQueue";
import LiveFeed from "@/components/LiveFeed";
import StandupPanel from "@/components/StandupPanel";

function App() {
  const [standupOpen, setStandupOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div id="mc-root" data-testid="mission-control-root">
      <MissionBanner />
      <TopBar onStandupOpen={() => setStandupOpen(true)} />
      <div id="mc-body">
        <AgentsPanel />
        <MissionQueue />
        <LiveFeed />
      </div>
      <StandupPanel open={standupOpen} onClose={() => setStandupOpen(false)} />
    </div>
  );
}

export default App;
