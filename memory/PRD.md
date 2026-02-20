# Mission Control Dashboard — PRD

## Original Problem Statement
Build a Mission Control dashboard web app for managing a team of AI agents (OpenClaw system). 3-panel desktop layout, dark mode default, with hardcoded mock data. Reference screenshots provided for visual style.

## Architecture
- **Stack**: React + Tailwind CSS (CRA-based), no backend for Phase 1-2
- **Theming**: CSS custom properties (`--mc-*` variables) with `dark` class toggle
- **Fonts**: JetBrains Mono (monospace headers/stats), DM Sans (body)
- **Components**: TopBar, AgentsPanel, MissionQueue (TaskCard), LiveFeed
- **DnD**: HTML5 native Drag and Drop API (zero dependencies)

## User Personas
- Solo founder/operator monitoring an AI agent system (OpenClaw) daily
- Needs at-a-glance status of agents, task pipeline, and activity feed

## Core Requirements (Static)
1. Top bar: logo, stat counters, live clock, online pill, theme toggle
2. Left panel (240px): scrollable agent list with icons, role badges, status dots
3. Center panel: Kanban board — 5 columns (Inbox, Assigned, In Progress, Review, Done)
4. Right panel (320px): Live Feed with filter tabs
5. Dark mode default, light mode via toggle

## What's Been Implemented
- **Phase 1A** (Jan 2026): 3-panel structure complete — 15/15 tests passed
- **Phase 2** (Jan 2026): Kanban task cards — 13/13 tests passed
  - 16 realistic AI ops tasks distributed: Inbox(4), Assigned(4), In Progress(3), Review(3), Done(2)
  - TaskCard component: title, description, assignee avatar, priority dot, tags, timestamp
  - Click-to-expand inline detail view with role badge, priority badge, full metadata
  - HTML5 drag-and-drop between columns with dynamic count updates
  - Subtle card elevation, hover translateY, 150ms transitions
  - Drop zone visual feedback

## Prioritized Backlog
### P0 — Phase 3 (Live Feed)
- Sample feed entries: comments, decisions, status changes, task assignments
- Agent avatar grid with activity counts

### P1 — Design Polish
- Light mode refinement
- Responsive/mobile layout
- Enhanced animations

### P2 — Backend Integration
- Convex real-time database connection
- Live agent status, task CRUD, feed streaming

## Next Tasks
1. Populate Live Feed with sample entries (Phase 3)
2. Add agent activity grid to Live Feed
3. Polish light mode theme
