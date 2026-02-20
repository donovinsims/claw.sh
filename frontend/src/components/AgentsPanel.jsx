import {
  Shield,
  BarChart3,
  Search,
  Eye,
  PenTool,
  MessageSquare,
  Palette,
  Mail,
  Code,
  BookOpen,
} from "lucide-react";
import { agents } from "@/data/mockData";

const iconMap = {
  shield: Shield,
  "bar-chart": BarChart3,
  search: Search,
  eye: Eye,
  "pen-tool": PenTool,
  "message-square": MessageSquare,
  palette: Palette,
  mail: Mail,
  code: Code,
  "book-open": BookOpen,
};

const badgeStyles = {
  orange:
    "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  blue: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  grey: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20",
};

const AgentsPanel = ({ onAgentClick }) => {
  const activeCount = agents.filter((a) => a.status === "WORKING").length;

  return (
    <aside
      data-testid="agents-panel"
      className="w-[240px] shrink-0 border-r border-[var(--mc-border)] flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div
        className="px-4 h-11 flex items-center gap-3 border-b border-[var(--mc-border)] shrink-0"
        data-testid="agents-panel-header"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        <span className="font-mono text-xs font-bold tracking-[0.15em] text-[var(--mc-text-primary)] uppercase">
          Agents
        </span>
        <span className="font-mono text-[10px] bg-[var(--mc-card)] text-[var(--mc-text-muted)] border border-[var(--mc-border)] rounded px-1.5 py-0.5 tabular-nums">
          {agents.length}
        </span>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin" data-testid="agents-list">
        {agents.map((agent) => {
          const Icon = iconMap[agent.icon];
          return (
            <button
              key={agent.id}
              data-testid={`agent-item-${agent.id}`}
              onClick={() => onAgentClick?.(agent.id)}
              className="w-full text-left px-4 py-3 border-b border-[var(--mc-border)] hover:bg-[var(--mc-card)] transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[var(--mc-card)] border border-[var(--mc-border)] flex items-center justify-center shrink-0 group-hover:border-[var(--mc-text-muted)]/30 transition-colors">
                  <Icon className="w-4 h-4 text-[var(--mc-text-muted)]" strokeWidth={1.5} />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-[var(--mc-text-primary)] truncate">
                      {agent.name}
                    </span>
                    <span
                      className={`font-mono text-[9px] font-bold tracking-wider rounded px-1.5 py-px ${badgeStyles[agent.badgeColor]}`}
                      data-testid={`agent-badge-${agent.id}`}
                    >
                      {agent.badge}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--mc-text-muted)] truncate">
                    {agent.role}
                  </div>
                  {/* Status */}
                  <div className="flex items-center gap-1.5 mt-1.5" data-testid={`agent-status-${agent.id}`}>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent.status === "WORKING"
                          ? "bg-emerald-400 status-pulse"
                          : "bg-zinc-500"
                      }`}
                    />
                    <span
                      className={`font-mono text-[9px] font-semibold tracking-wider uppercase ${
                        agent.status === "WORKING"
                          ? "text-emerald-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default AgentsPanel;
