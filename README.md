# AI Insights Console

Full-stack demo: a FastAPI middleware API in front of dummy "AI" data, and a
React (Vite + TypeScript) client that submits prompts, handles clarification
and error states, and displays paginated, searchable, sortable insights.

## Backend (`backend/`)

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

- `POST /api/insights` — body `{ prompt, targetLanguage, contextId? }`
  - Missing/invalid `prompt` or unsupported `targetLanguage` → `400` with
    `{ error, message }`
  - Prompt shorter than 5 chars → `200` with `{ status: "NEEDS_CLARIFICATION", message }`
  - Otherwise → `200` with `{ status: "SUCCESS", contextId, insights, pagination }`
    (deterministic dummy insights generated per prompt+language, stored
    in-memory, page 1 returned)
- `GET /api/insights/{contextId}?page=&pageSize=` — paginates the
  previously generated insights for that context (backend-driven pagination)

## Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```

Reads the API base URL from `VITE_API_BASE_URL` (see `frontend/.env`,
defaults to `http://localhost:8000`).

- `src/features/request` — Zod-validated prompt form (react-hook-form),
  Redux slice holding the current request/response session state
- `src/api/apiSlice.ts` — RTK Query endpoints (`submitInsights` mutation,
  `getInsights` query) with caching; the initial submit's page-1 result is
  seeded directly into the query cache to avoid a redundant fetch
- `src/features/insights` — results table, debounced client-side search,
  sort, and pagination controls, memoized to avoid unnecessary re-renders
