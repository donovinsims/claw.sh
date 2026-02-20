import { useState, useCallback, useRef } from "react";
import { kanbanColumns, initialTasks } from "@/data/mockData";
import TaskCard from "@/components/TaskCard";

const MissionQueue = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [dragOverCol, setDragOverCol] = useState(null);
  const dragCounterRef = useRef({});

  const tasksByColumn = kanbanColumns.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.column === col.id);
    return acc;
  }, {});

  const totalActive = tasks.filter((t) => t.column !== "done").length;

  const handleDrop = useCallback(
    (columnId) => (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("text/plain");
      if (!taskId) return;
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, column: columnId } : t))
      );
      setDragOverCol(null);
      dragCounterRef.current = {};
    },
    []
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback((columnId) => (e) => {
    e.preventDefault();
    if (!dragCounterRef.current[columnId]) {
      dragCounterRef.current[columnId] = 0;
    }
    dragCounterRef.current[columnId]++;
    setDragOverCol(columnId);
  }, []);

  const handleDragLeave = useCallback((columnId) => (e) => {
    e.preventDefault();
    if (dragCounterRef.current[columnId]) {
      dragCounterRef.current[columnId]--;
    }
    if (dragCounterRef.current[columnId] <= 0) {
      dragCounterRef.current[columnId] = 0;
      setDragOverCol((prev) => (prev === columnId ? null : prev));
    }
  }, []);

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
        <span className="flex-1" />
        <span className="font-mono text-[10px] text-[var(--mc-text-muted)] tabular-nums" data-testid="mission-queue-active-count">
          {totalActive} active
        </span>
      </div>

      {/* Kanban Board */}
      <div
        className="flex-1 flex gap-0 overflow-x-auto overflow-y-hidden"
        data-testid="kanban-board"
      >
        {kanbanColumns.map((col) => {
          const colTasks = tasksByColumn[col.id] || [];
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              data-testid={`kanban-column-${col.id}`}
              className={`flex-1 min-w-[200px] flex flex-col border-r border-[var(--mc-border)] last:border-r-0 transition-colors duration-150 ${
                isOver ? "bg-white/[0.02]" : ""
              }`}
              onDrop={handleDrop(col.id)}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter(col.id)}
              onDragLeave={handleDragLeave(col.id)}
            >
              {/* Column Header */}
              <div
                className="px-4 py-3 flex items-center gap-2.5 border-b border-[var(--mc-border)]"
                data-testid={`kanban-column-header-${col.id}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: col.dotColor }}
                />
                <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--mc-text-muted)] uppercase">
                  {col.name}
                </span>
                <span
                  className="font-mono text-[10px] bg-[var(--mc-card)] text-[var(--mc-text-muted)] border border-[var(--mc-border)] rounded px-1.5 py-0.5 tabular-nums ml-auto"
                  data-testid={`kanban-column-count-${col.id}`}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Column Body */}
              <div
                className={`flex-1 p-2 overflow-y-auto scrollbar-thin space-y-2 ${
                  isOver ? "kanban-drop-zone" : ""
                }`}
                data-testid={`kanban-column-body-${col.id}`}
              >
                {colTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center min-h-[80px]">
                    <div className={`text-center py-6 px-3 rounded-lg border border-dashed transition-colors ${
                      isOver
                        ? "border-blue-500/30 bg-blue-500/5"
                        : "border-[var(--mc-border)]/50"
                    }`}>
                      <span className="font-mono text-[9px] text-[var(--mc-text-muted)]/40 tracking-wider uppercase">
                        {isOver ? "Drop here" : "No tasks"}
                      </span>
                    </div>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MissionQueue;
