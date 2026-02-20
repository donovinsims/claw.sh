import { useState } from "react";
import { Clock, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { agentMap } from "@/data/mockData";

const priorityStyles = {
  high: "bg-rose-500/12 text-rose-400 border-rose-500/15",
  medium: "bg-amber-500/12 text-amber-400 border-amber-500/15",
  low: "bg-zinc-500/12 text-zinc-400 border-zinc-500/15",
};

const priorityDot = {
  high: "bg-rose-400",
  medium: "bg-amber-400",
  low: "bg-zinc-500",
};

const badgeStyles = {
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  grey: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

const TaskCard = ({ task, onDragStart }) => {
  const [expanded, setExpanded] = useState(false);
  const agent = agentMap[task.assigneeId];

  return (
    <div
      data-testid={`task-card-${task.id}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.classList.add("dragging");
        onDragStart?.(task.id);
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove("dragging");
      }}
      className="task-card group"
    >
      {/* Priority dot + Title row */}
      <div className="flex items-start gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full mt-[7px] shrink-0 ${priorityDot[task.priority]}`}
          data-testid={`task-priority-dot-${task.id}`}
        />
        <button
          data-testid={`task-card-toggle-${task.id}`}
          onClick={() => setExpanded(!expanded)}
          className="flex-1 text-left min-w-0"
        >
          <span className="text-[13px] font-semibold text-[var(--mc-text-primary)] leading-snug line-clamp-2 group-hover:text-white dark:group-hover:text-white transition-colors">
            {task.title}
          </span>
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] leading-relaxed text-[var(--mc-text-muted)] mt-1.5 line-clamp-2 pl-3.5">
        {task.description}
      </p>

      {/* Assignee + Meta row */}
      <div className="flex items-center gap-2 mt-3 pl-3.5">
        {/* Avatar */}
        <div className="w-5 h-5 rounded-full bg-[var(--mc-border)] flex items-center justify-center shrink-0">
          <span className="text-[8px] font-bold text-[var(--mc-text-muted)] uppercase">
            {agent?.name?.charAt(0)}
          </span>
        </div>
        <span className="text-[10px] text-[var(--mc-text-muted)] truncate">
          {agent?.name}
        </span>
        {/* Spacer */}
        <span className="flex-1" />
        {/* Timestamp */}
        <span className="text-[9px] text-[var(--mc-text-muted)]/60 font-mono tabular-nums flex items-center gap-1 shrink-0">
          <Clock className="w-2.5 h-2.5" strokeWidth={1.5} />
          {task.timestamp}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-2 pl-3.5">
        {task.tags.map((tag) => (
          <span
            key={tag}
            data-testid={`task-tag-${task.id}-${tag}`}
            className="font-mono text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-[var(--mc-bg)] text-[var(--mc-text-muted)]/70 border border-white/[0.04]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="mt-3 pt-3 border-t border-white/[0.05] pl-3.5 space-y-2.5 animate-in"
          data-testid={`task-detail-${task.id}`}
        >
          {/* Full description */}
          <p className="text-[11px] leading-relaxed text-[var(--mc-text-muted)]">
            {task.description}
          </p>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <div>
              <span className="font-mono text-[8px] text-[var(--mc-text-muted)]/50 tracking-wider uppercase block mb-0.5">
                Assignee
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[var(--mc-border)] flex items-center justify-center">
                  <span className="text-[7px] font-bold text-[var(--mc-text-muted)] uppercase">
                    {agent?.name?.charAt(0)}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--mc-text-primary)]">
                  {agent?.name}
                </span>
                {agent && (
                  <span
                    className={`font-mono text-[7px] font-bold tracking-wider rounded px-1 py-px border ${badgeStyles[agent.badgeColor]}`}
                  >
                    {agent.badge}
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="font-mono text-[8px] text-[var(--mc-text-muted)]/50 tracking-wider uppercase block mb-0.5">
                Priority
              </span>
              <span
                className={`inline-flex items-center gap-1 font-mono text-[9px] font-semibold tracking-wider rounded px-1.5 py-0.5 border capitalize ${priorityStyles[task.priority]}`}
                data-testid={`task-priority-badge-${task.id}`}
              >
                <span className={`w-1 h-1 rounded-full ${priorityDot[task.priority]}`} />
                {task.priority}
              </span>
            </div>
            <div>
              <span className="font-mono text-[8px] text-[var(--mc-text-muted)]/50 tracking-wider uppercase block mb-0.5">
                Role
              </span>
              <span className="text-[10px] text-[var(--mc-text-primary)]">
                {agent?.role}
              </span>
            </div>
            <div>
              <span className="font-mono text-[8px] text-[var(--mc-text-muted)]/50 tracking-wider uppercase block mb-0.5">
                Created
              </span>
              <span className="text-[10px] text-[var(--mc-text-primary)] font-mono tabular-nums">
                {task.timestamp}
              </span>
            </div>
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setExpanded(false)}
            className="flex items-center gap-1 text-[9px] font-mono text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] transition-colors"
            data-testid={`task-collapse-btn-${task.id}`}
          >
            <ChevronUp className="w-3 h-3" />
            Collapse
          </button>
        </div>
      )}

      {/* Expand hint on hover (only when collapsed) */}
      {!expanded && (
        <div className="flex items-center justify-end mt-1.5 pr-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[8px] font-mono text-[var(--mc-text-muted)]/40 flex items-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" />
            click to expand
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
