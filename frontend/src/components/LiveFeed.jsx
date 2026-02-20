import { useState } from "react";
import { liveFeedTabs } from "@/data/mockData";

const LiveFeed = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <aside
      data-testid="live-feed-panel"
      className="w-[320px] shrink-0 border-l border-[var(--mc-border)] flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div
        className="px-4 h-11 flex items-center gap-3 border-b border-[var(--mc-border)] shrink-0"
        data-testid="live-feed-header"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-xs font-bold tracking-[0.15em] text-[var(--mc-text-primary)] uppercase">
          Live Feed
        </span>
      </div>

      {/* Filter Tabs */}
      <div
        className="px-4 py-2.5 flex flex-wrap gap-1.5 border-b border-[var(--mc-border)] shrink-0"
        data-testid="live-feed-tabs"
      >
        {liveFeedTabs.map((tab) => (
          <button
            key={tab}
            data-testid={`live-feed-tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-md transition-colors ${
              activeTab === tab
                ? "bg-[var(--mc-text-primary)] text-[var(--mc-bg)] font-bold"
                : "text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed Content — empty for Phase 1A */}
      <div
        className="flex-1 overflow-y-auto p-4"
        data-testid="live-feed-content"
      >
        <div className="h-full flex flex-col items-center justify-center gap-2 opacity-30">
          <div className="w-8 h-8 rounded-full border border-[var(--mc-border)] border-dashed" />
          <span className="font-mono text-[10px] text-[var(--mc-text-muted)] tracking-wider uppercase">
            Awaiting activity
          </span>
        </div>
      </div>
    </aside>
  );
};

export default LiveFeed;
