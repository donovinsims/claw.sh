import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, ArrowRight, FileText, Users, Zap } from "lucide-react";
import { initialTasks, feedEvents, agents } from "@/data/mockData";

const SearchModal = ({ open, onClose, onSelectAgent }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { tasks: [], events: [], agentResults: [] };

    const tasks = initialTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    ).slice(0, 6);

    const events = feedEvents.filter(
      (e) =>
        e.target?.toLowerCase().includes(q) ||
        e.action?.toLowerCase().includes(q) ||
        e.detail?.toLowerCase().includes(q)
    ).slice(0, 5);

    const agentResults = agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
    ).slice(0, 5);

    return { tasks, events, agentResults };
  }, [query]);

  const totalResults = results.tasks.length + results.events.length + results.agentResults.length;

  if (!open) return null;

  return (
    <>
      <div
        data-testid="search-modal-backdrop"
        className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        data-testid="search-modal"
        className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[10001] w-full max-w-[560px] bg-[var(--mc-surface)] border border-[var(--mc-border)] rounded-2xl shadow-2xl overflow-hidden animate-in"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 h-14 border-b border-[var(--mc-border)]">
          <Search className="w-4 h-4 text-[var(--mc-text-muted)] shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            data-testid="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[var(--mc-text-primary)] placeholder-[var(--mc-text-muted)] outline-none"
            placeholder="Search tasks, events, agents..."
          />
          <kbd className="font-mono text-[9px] text-[var(--mc-text-muted)]/50 border border-[var(--mc-border)] rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin" data-testid="search-results">
          {query.trim() === "" ? (
            <div className="px-5 py-8 text-center">
              <span className="font-mono text-[10px] text-[var(--mc-text-muted)]/50 tracking-wider">
                Type to search across tasks, events, and agents
              </span>
            </div>
          ) : totalResults === 0 ? (
            <div className="px-5 py-8 text-center">
              <span className="font-mono text-[10px] text-[var(--mc-text-muted)] tracking-wider">
                No results for &ldquo;{query}&rdquo;
              </span>
            </div>
          ) : (
            <div className="py-2">
              {/* Agents */}
              {results.agentResults.length > 0 && (
                <div className="mb-1">
                  <div className="px-5 py-1.5 flex items-center gap-2">
                    <Users className="w-3 h-3 text-[var(--mc-text-muted)]" strokeWidth={1.5} />
                    <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-[var(--mc-text-muted)] uppercase">
                      Agents
                    </span>
                  </div>
                  {results.agentResults.map((a) => (
                    <button
                      key={a.id}
                      data-testid={`search-result-agent-${a.id}`}
                      onClick={() => { onClose(); onSelectAgent?.(a.id); }}
                      className="w-full text-left px-5 py-2 hover:bg-[var(--mc-card)] transition-colors flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[var(--mc-card)] border border-[var(--mc-border)] flex items-center justify-center shrink-0">
                        <span className="text-[8px] font-bold text-[var(--mc-text-muted)] uppercase">{a.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-[var(--mc-text-primary)]">{a.name}</span>
                        <span className="text-[10px] text-[var(--mc-text-muted)] ml-2">{a.role}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[var(--mc-text-muted)]/30" strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div className="mb-1">
                  <div className="px-5 py-1.5 flex items-center gap-2">
                    <FileText className="w-3 h-3 text-[var(--mc-text-muted)]" strokeWidth={1.5} />
                    <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-[var(--mc-text-muted)] uppercase">
                      Tasks
                    </span>
                  </div>
                  {results.tasks.map((t) => (
                    <div
                      key={t.id}
                      data-testid={`search-result-task-${t.id}`}
                      className="px-5 py-2 hover:bg-[var(--mc-card)] transition-colors cursor-default"
                    >
                      <span className="text-[12px] font-semibold text-[var(--mc-text-primary)] block">{t.title}</span>
                      <span className="text-[10px] text-[var(--mc-text-muted)] line-clamp-1">{t.description}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Events */}
              {results.events.length > 0 && (
                <div className="mb-1">
                  <div className="px-5 py-1.5 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[var(--mc-text-muted)]" strokeWidth={1.5} />
                    <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-[var(--mc-text-muted)] uppercase">
                      Events
                    </span>
                  </div>
                  {results.events.map((e) => (
                    <div
                      key={e.id}
                      data-testid={`search-result-event-${e.id}`}
                      className="px-5 py-2 hover:bg-[var(--mc-card)] transition-colors cursor-default"
                    >
                      <span className="text-[11px] text-[var(--mc-text-muted)]">
                        <span className="text-[var(--mc-text-primary)] font-medium">{e.action}</span>{" "}
                        {e.target && <>&ldquo;{e.target}&rdquo;</>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {query.trim() !== "" && totalResults > 0 && (
          <div className="px-5 py-2.5 border-t border-[var(--mc-border)] flex items-center justify-between">
            <span className="font-mono text-[9px] text-[var(--mc-text-muted)] tabular-nums">
              {totalResults} result{totalResults !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchModal;
