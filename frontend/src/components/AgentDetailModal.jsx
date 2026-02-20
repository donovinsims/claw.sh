import { useState, useEffect, useCallback } from "react";
import {
  X,
  Save,
  AlertTriangle,
  Plus,
  Trash2,
  Cpu,
  FileText,
  Terminal,
  Check,
} from "lucide-react";

const badgeStyles = {
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  grey: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

const AgentDetailModal = ({ agentId, onClose }) => {
  const [agent, setAgent] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const API = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!agentId) return;
    setLoading(true);
    fetch(`${API}/api/agents/${agentId}`)
      .then((r) => r.json())
      .then((data) => {
        setAgent(data);
        setDraft(JSON.parse(JSON.stringify(data)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [agentId, API]);

  const hasChanges = agent && draft && JSON.stringify(agent) !== JSON.stringify(draft);

  const handleClose = useCallback(() => {
    if (hasChanges) {
      setShowDiscard(true);
    } else {
      onClose();
    }
  }, [hasChanges, onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/agents/${agentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          role: draft.role,
          llmProvider: draft.llmProvider,
          llmModel: draft.llmModel,
          systemInstructions: draft.systemInstructions,
          promptTemplates: draft.promptTemplates,
          status: draft.status,
        }),
      });
      const updated = await res.json();
      setAgent(updated);
      setDraft(JSON.parse(JSON.stringify(updated)));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  };

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updatePrompt = (index, key, value) => {
    setDraft((prev) => {
      const prompts = [...prev.promptTemplates];
      prompts[index] = { ...prompts[index], [key]: value };
      return { ...prev, promptTemplates: prompts };
    });
  };

  const addPrompt = () => {
    setDraft((prev) => ({
      ...prev,
      promptTemplates: [
        ...prev.promptTemplates,
        { name: "New Prompt", template: "", variables: [] },
      ],
    }));
  };

  const removePrompt = (index) => {
    setDraft((prev) => ({
      ...prev,
      promptTemplates: prev.promptTemplates.filter((_, i) => i !== index),
    }));
  };

  if (!agentId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="agent-modal-backdrop"
        className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        data-testid="agent-detail-modal"
        className="fixed top-0 right-0 z-[10001] h-full w-full max-w-[580px] standup-slide-in"
      >
        <div className="h-full bg-[var(--mc-surface)] border-l border-[var(--mc-border)] rounded-l-[28px] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-6 pb-4 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold tracking-[0.18em] text-[var(--mc-text-primary)] uppercase">
                  Agent Details
                </span>
                {saved && (
                  <span
                    data-testid="agent-save-success"
                    className="flex items-center gap-1 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 animate-in"
                  >
                    <Check className="w-2.5 h-2.5" strokeWidth={2} />
                    Saved
                  </span>
                )}
              </div>
              <button
                data-testid="agent-modal-close-btn"
                onClick={handleClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="h-px bg-[var(--mc-border)] mx-5" />

          {/* Content */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="font-mono text-[10px] text-[var(--mc-text-muted)] tracking-wider animate-pulse">
                Loading...
              </span>
            </div>
          ) : draft ? (
            <div className="flex-1 overflow-y-auto scrollbar-thin px-7 py-5 space-y-5" data-testid="agent-detail-content">
              {/* Identity Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[var(--mc-card)] border border-[var(--mc-border)] flex items-center justify-center">
                    <span className="text-sm font-bold text-[var(--mc-text-muted)] uppercase">
                      {draft.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        data-testid="agent-edit-name"
                        value={draft.name}
                        onChange={(e) => updateDraft("name", e.target.value)}
                        className="bg-transparent text-lg font-bold text-[var(--mc-text-primary)] border-none outline-none w-full focus:bg-[var(--mc-card)] rounded px-1 -mx-1 transition-colors"
                      />
                      <span className={`font-mono text-[9px] font-bold tracking-wider rounded px-2 py-0.5 border shrink-0 ${badgeStyles[draft.badgeColor]}`}>
                        {draft.badge}
                      </span>
                    </div>
                    <input
                      data-testid="agent-edit-role"
                      value={draft.role}
                      onChange={(e) => updateDraft("role", e.target.value)}
                      className="bg-transparent text-[12px] text-[var(--mc-text-muted)] border-none outline-none w-full focus:bg-[var(--mc-card)] rounded px-1 -mx-1 mt-0.5 transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${draft.status === "WORKING" ? "bg-emerald-400 status-pulse" : "bg-zinc-500"}`} />
                    <select
                      data-testid="agent-edit-status"
                      value={draft.status}
                      onChange={(e) => updateDraft("status", e.target.value)}
                      className="bg-transparent font-mono text-[9px] font-semibold tracking-wider uppercase text-[var(--mc-text-muted)] border-none outline-none cursor-pointer"
                    >
                      <option value="WORKING">WORKING</option>
                      <option value="IDLE">IDLE</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* LLM Model Section */}
              <div className="space-y-2" data-testid="agent-llm-section">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[var(--mc-text-muted)]" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--mc-text-muted)] uppercase">
                    LLM Model
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-mono text-[8px] text-[var(--mc-text-muted)]/60 tracking-wider uppercase block mb-1">
                      Provider
                    </label>
                    <input
                      data-testid="agent-edit-provider"
                      value={draft.llmProvider}
                      onChange={(e) => updateDraft("llmProvider", e.target.value)}
                      className="w-full bg-[var(--mc-bg)] border border-[var(--mc-border)] rounded-lg px-3 py-2 text-[12px] text-[var(--mc-text-primary)] focus:outline-none focus:border-blue-500/30 transition-colors"
                      placeholder="e.g., Anthropic"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[8px] text-[var(--mc-text-muted)]/60 tracking-wider uppercase block mb-1">
                      Model
                    </label>
                    <input
                      data-testid="agent-edit-model"
                      value={draft.llmModel}
                      onChange={(e) => updateDraft("llmModel", e.target.value)}
                      className="w-full bg-[var(--mc-bg)] border border-[var(--mc-border)] rounded-lg px-3 py-2 text-[12px] text-[var(--mc-text-primary)] focus:outline-none focus:border-blue-500/30 transition-colors"
                      placeholder="e.g., Claude Sonnet 4.5"
                    />
                  </div>
                </div>
              </div>

              {/* System Instructions */}
              <div className="space-y-2" data-testid="agent-instructions-section">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[var(--mc-text-muted)]" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--mc-text-muted)] uppercase">
                    System Instructions
                  </span>
                </div>
                <textarea
                  data-testid="agent-edit-instructions"
                  value={draft.systemInstructions}
                  onChange={(e) => updateDraft("systemInstructions", e.target.value)}
                  className="w-full bg-[var(--mc-bg)] border border-[var(--mc-border)] rounded-lg px-3 py-2.5 text-[11px] leading-relaxed text-[var(--mc-text-primary)] focus:outline-none focus:border-blue-500/30 transition-colors resize-none font-mono min-h-[120px]"
                  rows={6}
                />
              </div>

              {/* Prompt Templates */}
              <div className="space-y-2" data-testid="agent-prompts-section">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[var(--mc-text-muted)]" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--mc-text-muted)] uppercase">
                    Prompt Templates
                  </span>
                  <span className="font-mono text-[9px] bg-[var(--mc-card)] text-[var(--mc-text-muted)] border border-[var(--mc-border)] rounded px-1.5 py-0.5 tabular-nums">
                    {draft.promptTemplates.length}
                  </span>
                  <span className="flex-1" />
                  <button
                    data-testid="agent-add-prompt-btn"
                    onClick={addPrompt}
                    className="flex items-center gap-1 font-mono text-[9px] text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] transition-colors"
                  >
                    <Plus className="w-3 h-3" strokeWidth={2} />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {draft.promptTemplates.map((prompt, i) => (
                    <div
                      key={i}
                      data-testid={`agent-prompt-${i}`}
                      className="bg-[var(--mc-card)] border border-white/[0.04] rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          data-testid={`agent-prompt-name-${i}`}
                          value={prompt.name}
                          onChange={(e) => updatePrompt(i, "name", e.target.value)}
                          className="bg-transparent text-[12px] font-semibold text-[var(--mc-text-primary)] border-none outline-none flex-1 focus:bg-[var(--mc-bg)] rounded px-1 -mx-1 transition-colors"
                          placeholder="Prompt name"
                        />
                        <button
                          data-testid={`agent-prompt-delete-${i}`}
                          onClick={() => removePrompt(i)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[var(--mc-text-muted)]/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <textarea
                        data-testid={`agent-prompt-template-${i}`}
                        value={prompt.template}
                        onChange={(e) => updatePrompt(i, "template", e.target.value)}
                        className="w-full bg-[var(--mc-bg)] border border-[var(--mc-border)] rounded-md px-2.5 py-2 text-[10px] leading-relaxed text-[var(--mc-text-primary)] focus:outline-none focus:border-blue-500/30 transition-colors resize-none font-mono min-h-[70px]"
                        rows={3}
                      />
                      {prompt.variables && prompt.variables.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {prompt.variables.map((v) => (
                            <span key={v} className="font-mono text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/15">
                              {`{{${v}}}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer */}
          {draft && (
            <div className="px-7 py-4 border-t border-[var(--mc-border)] shrink-0">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[var(--mc-text-muted)] tracking-wider">
                  {draft.llmProvider} / {draft.llmModel}
                </span>
                {hasChanges ? (
                  <div className="flex items-center gap-2">
                    <button
                      data-testid="agent-cancel-btn"
                      onClick={() => setDraft(JSON.parse(JSON.stringify(agent)))}
                      className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-lg text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      data-testid="agent-save-btn"
                      onClick={handleSave}
                      disabled={saving}
                      className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Save className="w-3 h-3" strokeWidth={2} />
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                ) : (
                  <button
                    data-testid="agent-close-footer-btn"
                    onClick={onClose}
                    className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-lg bg-[var(--mc-card)] text-[var(--mc-text-primary)] border border-[var(--mc-border)] hover:bg-[var(--mc-text-muted)]/10 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discard Confirmation */}
      {showDiscard && (
        <div
          data-testid="discard-modal-overlay"
          className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            data-testid="discard-modal"
            className="w-full max-w-sm bg-[var(--mc-surface)] border border-[var(--mc-border)] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
              </div>
              <span className="font-mono text-xs font-bold tracking-[0.1em] text-[var(--mc-text-primary)] uppercase">
                Unsaved Changes
              </span>
            </div>
            <p className="text-[12px] text-[var(--mc-text-muted)] leading-relaxed mb-5">
              You have unsaved changes. Discard or keep editing?
            </p>
            <div className="flex justify-end gap-2">
              <button
                data-testid="discard-keep-editing-btn"
                onClick={() => setShowDiscard(false)}
                className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-lg text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] transition-colors"
              >
                Keep editing
              </button>
              <button
                data-testid="discard-confirm-btn"
                onClick={() => { setShowDiscard(false); onClose(); }}
                className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/20 hover:bg-rose-500/25 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentDetailModal;
