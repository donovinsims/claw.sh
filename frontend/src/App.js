import { useEffect } from "react";
import "@/App.css";
import TopBar from "@/components/TopBar";
import AgentsPanel from "@/components/AgentsPanel";
import MissionQueue from "@/components/MissionQueue";
import LiveFeed from "@/components/LiveFeed";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div id="mc-root" data-testid="mission-control-root">
      <TopBar />
      <div id="mc-body">
        <AgentsPanel />
        <MissionQueue />
        <LiveFeed />
      </div>
    </div>
  );
}

export default App;
