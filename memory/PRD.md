# Mission Control Dashboard — PRD

## Original Problem Statement
Build a Mission Control dashboard web app for managing a team of AI agents (OpenClaw system). 3-panel desktop layout, dark mode default, with hardcoded mock data. Reference screenshots provided for visual style.

## Architecture
- **Stack**: React + Tailwind CSS (CRA-based), no backend for Phase 1
- **Theming**: CSS custom properties (`--mc-*` variables) with `dark` class toggle
- **Fonts**: JetBrains Mono (monospace headers/stats), DM Sans (body)
- **Components**: TopBar, AgentsPanel, MissionQueue, LiveFeed

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
- **Phase 1A** (Jan 2026): 3-panel structure complete
  - TopBar with diamond icon, "MISSION CONTROL", 11/35 stat counters, HH:MM:SS clock, ONLINE pill, dark/light toggle
  - AgentsPanel: 10 agents (Jarvis, Shuri, Fury, Vision, Loki, Quill, Wanda, Pepper, Friday, Wong) with LEAD/INT/SPC badges and WORKING/IDLE status
  - MissionQueue: 5 empty kanban columns with headers and count badges (0)
  - LiveFeed: header with green dot, 6 filter tabs, empty scrollable area
  - Testing: 100% pass (15/15 tests)

## Prioritized Backlog
### P0 — Phase 2 (Task Cards)
- Populate kanban columns with sample task cards (title, description, assignee, tags, timestamps)
- Non-zero column counts

### P1 — Phase 3 (Live Feed)
- Sample feed entries: comments, decisions, status changes, task assignments
- Agent avatar grid with activity counts

### P2 — Design Polish
- Light mode refinement
- Hover/interaction animations
- Responsive/mobile layout

### P3 — Backend Integration
- Convex real-time database connection
- Live agent status, task CRUD, feed streaming

## Next Tasks
1. Add sample task cards to kanban columns (Phase 2)
2. Add live feed entries (Phase 3)
3. Polish light mode theme
