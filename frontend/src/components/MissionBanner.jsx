import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";

const DEFAULT_MISSION = "Build an autonomous organization of AI agents that produces value 24/7";

const MissionBanner = () => {
  const [mission, setMission] = useState(DEFAULT_MISSION);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(mission);

  const openEdit = () => {
    setDraft(mission);
    setEditing(true);
  };

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed) setMission(trimmed);
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  return (
    <>
      <div
        data-testid="mission-banner"
        className="mission-banner shrink-0"
      >
        <div className="flex items-center justify-center gap-3 px-5 h-full">
          <p
            className="text-[12px] italic text-[var(--mc-text-primary)] opacity-80 truncate max-w-[700px] text-center leading-relaxed"
            data-testid="mission-banner-text"
          >
            {mission}
          </p>
          <button
            data-testid="mission-banner-edit-btn"
            onClick={openEdit}
            className="w-5 h-5 rounded flex items-center justify-center text-[var(--mc-text-muted)]/60 hover:text-[var(--mc-text-primary)] hover:bg-white/[0.05] transition-colors shrink-0"
            aria-label="Edit mission"
          >
            <Pencil className="w-3 h-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          data-testid="mission-edit-modal-overlay"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) cancel(); }}
        >
          <div
            data-testid="mission-edit-modal"
            className="w-full max-w-md bg-[var(--mc-surface)] border border-[var(--mc-border)] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold tracking-[0.15em] text-[var(--mc-text-primary)] uppercase">
                Edit Mission
              </span>
              <button
                data-testid="mission-edit-close-btn"
                onClick={cancel}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <textarea
              data-testid="mission-edit-textarea"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full h-24 bg-[var(--mc-bg)] border border-[var(--mc-border)] rounded-xl px-4 py-3 text-sm text-[var(--mc-text-primary)] placeholder-[var(--mc-text-muted)] resize-none focus:outline-none focus:border-[#1EBEF1]/40 transition-colors"
              placeholder="Enter your mission statement..."
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                data-testid="mission-edit-cancel-btn"
                onClick={cancel}
                className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-lg text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="mission-edit-save-btn"
                onClick={save}
                className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-lg bg-[#1EBEF1]/15 text-[#1EBEF1] border border-[#1EBEF1]/20 hover:bg-[#1EBEF1]/25 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3 h-3" strokeWidth={2} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionBanner;
