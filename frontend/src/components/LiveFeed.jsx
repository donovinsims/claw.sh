import { useState, useEffect, useRef, useMemo } from "react";
import {
  Plus,
  ArrowRight,
  MessageCircle,
  Zap,
  FileText,
  Activity,
  Clock,
} from "lucide-react";
import {
  liveFeedTabs,
  feedEvents,
  tabFilterMap,
  agents,
  agentMap,
  initialTasks,
} from "@/data/mockData";

const typeIcon = {
  task_created: Plus,
  task_moved: ArrowRight,
  comment: MessageCircle,
  decision: Zap,
  doc: FileText,
  status_update: Activity,
};

const typeAccent = {
  task_created: "text-emerald-400",
  task_moved: "text-blue-400",
  comment: "text-amber-400",
  decision: "text-violet-400",
  doc: "text-cyan-400",
  status_update: "text-zinc-400",
};

const typeLabel = {
  task_created: "Task",
  task_moved: "Task",
  comment: "Comment",
  decision: "Decision",
  doc: "Doc",
  status_update: "Status",
};

const FeedEntry = ({ event }) => {
  const agent = agentMap[event.agentId];
  const Icon = typeIcon[event.type] || Activity;
  const accent = typeAccent[event.type] || "text-zinc-400";

  return (
    <div
      data-testid={`feed-entry-${event.id}`}
      className="feed-entry group"
    >
      <div className="flex gap-2.5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-7 h-7 rounded-full bg-[var(--mc-card)] border border-white/[0.06] flex items-center justify-center">
            <span className="text-[9px] font-bold text-[var(--mc-text-muted)] uppercase">
              {agent?.name?.charAt(0)}
            </span>
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--mc-surface)] flex items-center justify-center`}>
            <Icon className={`w-2 h-2 ${accent}`} strokeWidth={2} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[11px] leading-relaxed text-[var(--mc-text-muted)]">
            <span className="font-semibold text-[var(--mc-text-primary)]">
              {agent?.name}
            </span>{" "}
            <span className="opacity-70">{event.action}</span>{" "}
            {event.target && (
              <span className="text-[var(--mc-text-primary)] font-medium">
                &ldquo;{event.target}&rdquo;
              </span>
            )}
          </p>

          {event.detail && (
            <p className="text-[10px] leading-relaxed text-[var(--mc-text-muted)]/70 mt-1 line-clamp-2">
              {event.detail}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`font-mono text-[8px] tracking-wider uppercase ${accent} opacity-70`}>
              {typeLabel[event.type]}
            </span>
            <span className="text-[var(--mc-border)]">&middot;</span>
            <span className="font-mono text-[9px] text-[var(--mc-text-muted)]/50 tabular-nums flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 opacity-50" strokeWidth={1.5} />
              {event.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentActivityGrid = () => {
  const agentStats = useMemo(() => {
    return agents.map((agent) => {
      const taskCount = initialTasks.filter(
        (t) => t.assigneeId === agent.id && t.column !== "done"
      ).length;
      const lastEvent = feedEvents.find((e) => e.agentId === agent.id);
      return {
        ...agent,
        activeTasks: taskCount,
        lastAction: lastEvent?.timestamp || "—",
      };
    });
  }, []);

  return (
    <div data-testid="agent-activity-grid" className="px-3 pb-3">
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-[var(--mc-text-muted)] uppercase">
          Agent Activity
        </span>
        <span className="flex-1 h-px bg-[var(--mc-border)]/50" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {agentStats.map((a) => (
          <div
            key={a.id}
            data-testid={`agent-grid-item-${a.id}`}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--mc-card)] transition-colors"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                a.status === "WORKING" ? "bg-emerald-400" : "bg-zinc-600"
              }`}
            />
            <span className="text-[10px] font-medium text-[var(--mc-text-primary)] truncate flex-1">
              {a.name}
            </span>
            <span className="font-mono text-[9px] text-[var(--mc-text-muted)] tabular-nums shrink-0">
              {a.activeTasks}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LiveFeed = () => {
  const [activeTab, setActiveTab] = useState("All");
  const scrollRef = useRef(null);

  const filtered = useMemo(() => {
    const filterTypes = tabFilterMap[activeTab];
    if (!filterTypes) return feedEvents;
    return feedEvents.filter((e) => filterTypes.includes(e.type));
  }, [activeTab]);

  const tabCounts = useMemo(() => {
    const counts = {};
    for (const tab of liveFeedTabs) {
      const ft = tabFilterMap[tab];
      counts[tab] = ft
        ? feedEvents.filter((e) => ft.includes(e.type)).length
        : feedEvents.length;
    }
    return counts;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

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
        <span className="flex-1" />
        <span
          className="font-mono text-[10px] text-[var(--mc-text-muted)] tabular-nums"
          data-testid="live-feed-total-count"
        >
          {feedEvents.length}
        </span>
      </div>

      {/* Filter Tabs */}
      <div
        className="px-3 py-2 flex flex-wrap gap-1 border-b border-[var(--mc-border)] shrink-0"
        data-testid="live-feed-tabs"
      >
        {liveFeedTabs.map((tab) => (
          <button
            key={tab}
            data-testid={`live-feed-tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-[10px] tracking-wider px-2 py-1 rounded-md transition-all duration-150 flex items-center gap-1.5 ${
              activeTab === tab
                ? "bg-[var(--mc-text-primary)] text-[var(--mc-bg)] font-bold"
                : "text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)]"
            }`}
          >
            {tab}
            <span
              className={`text-[8px] tabular-nums ${
                activeTab === tab
                  ? "opacity-70"
                  : "opacity-50"
              }`}
            >
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Feed Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
        data-testid="live-feed-content"
      >
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 opacity-30">
            <div className="w-8 h-8 rounded-full border border-[var(--mc-border)] border-dashed" />
            <span className="font-mono text-[10px] text-[var(--mc-text-muted)] tracking-wider uppercase">
              No activity
            </span>
          </div>
        ) : (
          <div className="py-1" data-testid="feed-entries-list">
            {filtered.map((event, i) => (
              <FeedEntry key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Agent Activity Grid */}
      <div className="border-t border-[var(--mc-border)] shrink-0 pt-2.5 max-h-[200px] overflow-y-auto scrollbar-thin">
        <AgentActivityGrid />
      </div>
    </aside>
  );
};

export default LiveFeed;
