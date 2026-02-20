# Mission Control Dashboard — PRD

## Original Problem Statement
Build a Mission Control dashboard web app for managing a team of AI agents (OpenClaw system). 3-panel desktop layout, dark mode default, with hardcoded mock data. Reference screenshots provided for visual style.

## Architecture
- **Stack**: React + Tailwind CSS (CRA-based), no backend
- **Theming**: CSS custom properties (`--mc-*` variables) with `dark` class toggle
- **Fonts**: JetBrains Mono (monospace headers/stats), DM Sans (body)
- **Components**: TopBar, AgentsPanel, MissionQueue (TaskCard), LiveFeed (FeedEntry, AgentActivityGrid)
- **DnD**: HTML5 native Drag and Drop API (zero dependencies)

## User Personas
- Solo founder/operator monitoring an AI agent system (OpenClaw) daily
- Needs at-a-glance status of agents, task pipeline, and activity feed

## Core Requirements (Static)
1. Top bar: logo, stat counters, live clock, online pill, theme toggle
2. Left panel (240px): scrollable agent list with icons, role badges, status dots
3. Center panel: Kanban board — 5 columns with drag-and-drop task cards
4. Right panel (320px): Live Feed with filtered activity stream + agent grid
5. Dark mode default, light mode via toggle

## What's Been Implemented
- **Phase 1A** (Jan 2026): 3-panel structure — 15/15 tests passed
- **Phase 2** (Jan 2026): Kanban task cards — 13/13 tests passed
  - 16 tasks across 5 columns, DnD, inline expansion, dynamic counts
- **Phase 3** (Jan 2026): Live Feed intelligence stream — 14/14 tests passed
  - 30 activity events across 6 types: task_created, task_moved, comment, decision, doc, status_update
  - FeedEntry component: agent avatar, name, action verb, target, detail text, timestamp, color-coded type icon
  - Tab filtering with dynamic counts (All/Tasks/Comments/Decisions/Docs/Status)
  - Staggered fade-in animation, smooth scroll, auto-scroll on tab switch
  - Agent Activity Grid: all 10 agents with status dots and active task counts

## Prioritized Backlog
### P0 — Design Polish
- Light mode refinement
- Responsive/mobile layout
- Enhanced micro-animations

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
