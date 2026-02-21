# Changelog

All notable changes to this project are documented in this file.

## [0.1.0] - 2026-02-21

### Added
- Mobile-first Mission Control interface for managing agent operations.
- Multi-provider integrations surfaced across the stack (Anthropic, OpenAI, and Moonshot model metadata in agent workflows).
- PWA packaging assets for installable web app behavior:
  - `frontend/public/manifest.webmanifest`
  - `frontend/public/icons/icon-192.png`
  - `frontend/public/icons/icon-512.png`
  - `frontend/public/icons/apple-touch-icon.png`

### Backend and API
- FastAPI endpoints for mission status checks and agent detail management under `/api`.
- MongoDB-backed persistence for status checks.

### Notes
- This is the first tagged release.
