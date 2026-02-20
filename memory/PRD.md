# Mission Control Dashboard — PRD

## Original Problem Statement
Build a Mission Control dashboard web app for managing a team of AI agents (OpenClaw system). 3-panel desktop layout, dark mode default, with hardcoded mock data.

## Architecture
- **Stack**: React + Tailwind CSS (CRA-based), no backend
- **Theming**: CSS custom properties (`--mc-*`) with `dark` class toggle
- **Fonts**: JetBrains Mono (monospace), DM Sans (body)
- **Components**: MissionBanner, TopBar, AgentsPanel, MissionQueue (TaskCard), LiveFeed (FeedEntry, AgentActivityGrid), StandupPanel

## What's Been Implemented
- **Phase 1A**: 3-panel structure (Agents 240px, Kanban center, Live Feed 320px) — 15/15 passed
- **Phase 2**: 16 kanban task cards with DnD, inline expansion, dynamic counts — 13/13 passed
- **Phase 3**: 30 feed events, tab filtering, agent activity grid — 14/14 passed
- **UI Pack A** (Jan 2026):
  - **Demo Pulse**: Toggle in Live Feed header, generates random feed events every 30-60s, caps at 60, feed-only (no kanban mutation), proper cleanup on unmount/toggle off
  - **Mission Banner**: Gradient banner above top bar (#1EBEF1/8%), editable via modal, local state
  - **Daily Standup**: Slide-over panel (28px radius), 5 sections (Completed/In Progress/Blocked/Needs Review/Key Decisions), ESC key close, backdrop blur
  - Fixed z-index overlay issue with Emergent badge (z-10000+)
  - All tests passing: banner, modal, standup open/close/dismiss/ESC, pulse toggle, no regressions

## Prioritized Backlog
### P0 — Design Polish
- Light mode refinement
- Responsive/mobile layout

### P1 — Backend Integration
- Convex real-time database connection
- Live agent status, task CRUD, feed streaming

### P2 — Advanced Features
- Cmd+K command palette
- Task filtering by assignee/priority/tag
- Real-time notifications

## Next Tasks
1. Polish light mode theme
2. Add responsive breakpoints
3. Connect Convex for real-time data
