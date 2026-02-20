import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import MissionBanner from "@/components/MissionBanner";
import TopBar from "@/components/TopBar";
import AgentsPanel from "@/components/AgentsPanel";
import MissionQueue from "@/components/MissionQueue";
import LiveFeed from "@/components/LiveFeed";
import StandupPanel from "@/components/StandupPanel";
import AgentDetailModal from "@/components/AgentDetailModal";
import SearchModal from "@/components/SearchModal";

function App() {
  const [standupOpen, setStandupOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedVisible, setFeedVisible] = useState(() => {
    const stored = localStorage.getItem("mc-feed-visible");
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("mc-feed-visible", JSON.stringify(feedVisible));
  }, [feedVisible]);

  const handleFeedToggle = useCallback(() => {
    setFeedVisible((prev) => !prev);
  }, []);

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
  }, []);

  return (
    <div id="mc-root" data-testid="mission-control-root">
      <MissionBanner />
      <TopBar
        onStandupOpen={() => setStandupOpen(true)}
        onSearchOpen={handleSearchOpen}
        feedVisible={feedVisible}
        onFeedToggle={handleFeedToggle}
      />
      <div id="mc-body">
        <AgentsPanel onAgentClick={(id) => setSelectedAgent(id)} />
        <MissionQueue />
        {feedVisible && <LiveFeed />}
      </div>
      <StandupPanel open={standupOpen} onClose={() => setStandupOpen(false)} />
      <AgentDetailModal agentId={selectedAgent} onClose={() => setSelectedAgent(null)} />
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectAgent={(id) => setSelectedAgent(id)}
      />
    </div>
  );
}

export default App;
