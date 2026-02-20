import { kanbanColumns } from "@/data/mockData";

const MissionQueue = () => {
  return (
    <section
      data-testid="mission-queue-panel"
      className="flex-1 flex flex-col h-full overflow-hidden min-w-0"
    >
      {/* Header */}
      <div
        className="px-5 h-11 flex items-center gap-3 border-b border-[var(--mc-border)] shrink-0"
        data-testid="mission-queue-header"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        <span className="font-mono text-xs font-bold tracking-[0.15em] text-[var(--mc-text-primary)] uppercase">
          Mission Queue
        </span>
      </div>

      {/* Kanban Board */}
      <div
        className="flex-1 flex gap-0 overflow-x-auto overflow-y-hidden"
        data-testid="kanban-board"
      >
        {kanbanColumns.map((col) => (
          <div
            key={col.id}
            data-testid={`kanban-column-${col.id}`}
            className="flex-1 min-w-[180px] flex flex-col border-r border-[var(--mc-border)] last:border-r-0"
          >
            {/* Column Header */}
            <div
              className="px-4 py-3 flex items-center gap-2.5 border-b border-[var(--mc-border)]"
              data-testid={`kanban-column-header-${col.id}`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: col.dotColor }}
              />
              <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--mc-text-muted)] uppercase">
                {col.name}
              </span>
              <span className="font-mono text-[10px] bg-[var(--mc-card)] text-[var(--mc-text-muted)] border border-[var(--mc-border)] rounded px-1.5 py-0.5 tabular-nums ml-auto">
                {col.count}
              </span>
            </div>

            {/* Column Body — empty for Phase 1A */}
            <div
              className="flex-1 p-3 overflow-y-auto"
              data-testid={`kanban-column-body-${col.id}`}
            >
              <div className="h-full flex items-center justify-center">
                <span className="font-mono text-[10px] text-[var(--mc-text-muted)]/40 uppercase tracking-wider">
                  {/* Empty column placeholder */}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionQueue;
