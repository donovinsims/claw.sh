import { useState, useEffect } from "react";
import { Diamond, Sun, Moon, ClipboardList, Search, PanelRightClose, PanelRightOpen } from "lucide-react";

const TopBar = ({ onStandupOpen, onSearchOpen, feedVisible, onFeedToggle }) => {
  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSearchOpen]);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (d) =>
    d
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();

  return (
    <header
      data-testid="top-bar"
      className="fixed top-[32px] left-0 right-0 z-50 h-16 border-b border-[var(--mc-border)] bg-[var(--mc-surface)] flex items-center px-5 gap-4"
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-3 shrink-0" data-testid="top-bar-logo">
        <Diamond className="w-5 h-5 text-[var(--mc-text-primary)]" strokeWidth={1.5} />
        <span className="font-mono text-sm font-bold tracking-[0.2em] text-[var(--mc-text-primary)] uppercase">
          Mission Control
        </span>
      </div>

      {/* Center: Stats */}
      <div className="flex-1 flex items-center justify-center gap-12" data-testid="top-bar-stats">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-2xl font-bold text-[var(--mc-text-primary)] tabular-nums" data-testid="agents-active-count">
            11
          </span>
          <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--mc-text-muted)] uppercase">
            Agents Active
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-2xl font-bold text-[var(--mc-text-primary)] tabular-nums" data-testid="tasks-queue-count">
            35
          </span>
          <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--mc-text-muted)] uppercase">
            Tasks in Queue
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 shrink-0" data-testid="top-bar-right">
        {/* Search */}
        <button
          data-testid="search-open-btn"
          onClick={onSearchOpen}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-2.5 py-1.5 rounded-lg border border-[var(--mc-border)] text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] hover:border-[var(--mc-text-muted)]/30 transition-colors"
        >
          <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
          <kbd className="font-mono text-[8px] opacity-50">⌘K</kbd>
        </button>

        {/* Standup */}
        <button
          data-testid="standup-open-btn"
          onClick={onStandupOpen}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-lg border border-[var(--mc-border)] text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] hover:border-[var(--mc-text-muted)]/30 transition-colors"
        >
          <ClipboardList className="w-3.5 h-3.5" strokeWidth={1.5} />
          Standup
        </button>

        {/* Feed Toggle */}
        <button
          data-testid="feed-toggle-btn"
          onClick={onFeedToggle}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            feedVisible
              ? "text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)]"
              : "text-blue-400 bg-blue-500/10 hover:bg-blue-500/15"
          }`}
          aria-label={feedVisible ? "Hide Live Feed" : "Show Live Feed"}
          title={feedVisible ? "Hide Live Feed" : "Show Live Feed"}
        >
          {feedVisible ? (
            <PanelRightClose className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <PanelRightOpen className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>

        {/* Theme */}
        <button
          data-testid="theme-toggle-btn"
          onClick={() => setIsDark(!isDark)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--mc-text-muted)] hover:text-[var(--mc-text-primary)] hover:bg-[var(--mc-card)] transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Clock */}
        <div className="text-right" data-testid="top-bar-clock">
          <div className="font-mono text-lg font-bold tabular-nums text-[var(--mc-text-primary)] leading-tight">
            {formatTime(time)}
          </div>
          <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--mc-text-muted)] leading-tight">
            {formatDate(time)}
          </div>
        </div>

        {/* Online */}
        <div
          className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 rounded-full px-3 py-1"
          data-testid="online-status-pill"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
            Online
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
