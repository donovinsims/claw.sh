# claw.sh

Mission Control workspace for orchestrating a multi-agent team with a FastAPI backend and React frontend.

## Environment Variables

### Backend
- `MONGO_URL` (required): MongoDB connection string.
- `DB_NAME` (required): MongoDB database name.
- `CORS_ORIGINS` (optional): Comma-separated CORS origins. Defaults to `*`.

### Frontend
- `REACT_APP_BACKEND_URL` (recommended): Backend base URL used by the UI.
- `ENABLE_HEALTH_CHECK` (optional): Set to `true` to enable the health-check plugin in frontend build config.

## Local Run

1. Backend:
   - `cd backend`
   - `pip install -r requirements.txt`
   - `uvicorn server:app --reload --host 0.0.0.0 --port 8001`
2. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm start`

## Smoke Test

1. Verify backend API root:
   - `curl -sS http://localhost:8001/api/ | jq`
2. Verify agent list endpoint:
   - `curl -sS http://localhost:8001/api/agents | jq 'length'`
3. Verify frontend can load:
   - Open `http://localhost:3000` and confirm Mission Control renders.
4. Verify PWA assets:
   - Open DevTools Application tab and confirm manifest is detected.
   - Confirm installability assets resolve:
     - `http://localhost:3000/manifest.webmanifest`
     - `http://localhost:3000/icons/icon-192.png`
     - `http://localhost:3000/icons/icon-512.png`
