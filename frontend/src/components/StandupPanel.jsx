import { useEffect } from "react";
import { X, CheckCircle2, Loader2, AlertTriangle, Eye, Zap } from "lucide-react";
import { standupData } from "@/data/mockData";

const sections = [
  { key: "completed", label: "Completed", icon: CheckCircle2, accent: "text-emerald-400", dot: "bg-emerald-400", data: standupData.completed },
  { key: "inProgress", label: "In Progress", icon: Loader2, accent: "text-blue-400", dot: "bg-blue-400", data: standupData.inProgress },
  { key: "blocked", label: "Blocked", icon: AlertTriangle, accent: "text-rose-400", dot: "bg-rose-400", data: standupData.blocked },
  { key: "needsReview", label: "Needs Review", icon: Eye, accent: "text-amber-400", dot: "bg-amber-400", data: standupData.needsReview },
  { key: "keyDecisions", label: "Key Decisions", icon: Zap, accent: "text-violet-400", dot: "bg-violet-400", data: standupData.keyDecisions },
];

const formatDate = () =>
  new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

const StandupPanel = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="standup-backdrop"
        className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div
        data-testid="standup-panel"
        className="fixed top-0 right-0 z-[10001] h-full w-full max-w-[520px] standup-slide-in"
      >
        <div className="h-full bg-[var(--mc-surface)] border-l border-[var(--mc-border)] rounded-l-[28px] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-7 pb-4 shrink-0" data-testid="standup-header">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-sm font-bold tracking-[0.18em] text-[var(--mc-text-primary)] uppercase">
                Daily Standup
              </span>
              <button
                data-testid="standup-close-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <span className="font-mono text-[10px] text-[var(--mc-text-muted)] tracking-wider">
              {formatDate()}
            </span>
          </div>

          <div className="h-px bg-[var(--mc-border)] mx-5" />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-7 py-5 space-y-6" data-testid="standup-content">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.key} data-testid={`standup-section-${section.key}`}>
                  {/* Section Header */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <Icon className={`w-4 h-4 ${section.accent}`} strokeWidth={1.8} />
                    <span className={`font-mono text-[11px] font-bold tracking-[0.12em] uppercase ${section.accent}`}>
                      {section.label}
                    </span>
                    <span className="font-mono text-[9px] bg-[var(--mc-card)] text-[var(--mc-text-muted)] border border-[var(--mc-border)] rounded px-1.5 py-0.5 tabular-nums">
                      {section.data.length}
                    </span>
                    <span className="flex-1 h-px bg-[var(--mc-border)]/50" />
                  </div>

                  {/* Items */}
                  <div className="space-y-2 pl-1">
                    {section.data.map((item) => (
                      <div
                        key={item.id}
                        data-testid={`standup-item-${item.id}`}
                        className="standup-item group"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full mt-[7px] shrink-0 ${section.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[var(--mc-text-primary)] leading-snug">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-[var(--mc-text-muted)] mt-0.5 leading-relaxed">
                              {item.detail}
                            </p>
                            <span className="font-mono text-[9px] text-[var(--mc-text-muted)]/50 mt-1 inline-block">
                              {item.agent}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-[var(--mc-border)] shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-[var(--mc-text-muted)] tracking-wider">
                {standupData.completed.length + standupData.inProgress.length + standupData.blocked.length + standupData.needsReview.length + standupData.keyDecisions.length} items total
              </span>
              <button
                data-testid="standup-dismiss-btn"
                onClick={onClose}
                className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-lg bg-[var(--mc-card)] text-[var(--mc-text-primary)] border border-[var(--mc-border)] hover:bg-[var(--mc-text-muted)]/10 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StandupPanel;
