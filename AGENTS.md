# YORK — Base44 Dev Environment

## Project Overview
YORK is an AI assistant for kids: a Node.js/Express + Prisma/PostgreSQL backend with a Vite/React frontend. The backend generates children's stories and quizzes using the Anthropic Claude API.

## Architecture
- **Frontend**: Vite + React + Tailwind, dev server on port 5173 (mapped to host 3000). Uses `VITE_API_URL` env var to reach the backend.
- **Backend**: Express + Prisma, dev server on port 3001 (mapped to host 8000). Uses `CLAUDE_API_KEY` (not `ANTHROPIC_API_KEY` — the code reads `process.env.CLAUDE_API_KEY`).
- **Database**: PostgreSQL 16, compose service `postgres`.

## Setup
```
docker compose -f docker-compose.base44.yml up -d --build
```

## Key Details
- The backend's `.env.example` references `ANTHROPIC_API_KEY`, but the actual code (`src/services/storyService.js`, `src/services/quizService.js`) reads `process.env.CLAUDE_API_KEY`. Use `CLAUDE_API_KEY`.
- The backend boots fine without the Claude API key; only story/quiz generation endpoints fail without it.
- Prisma migrations run automatically on backend startup (`prisma generate && prisma migrate deploy`).
- The Vite config uses `host: true` + `allowedHosts: true` to accept the preview proxy hostname.
- Frontend `.env` has `VITE_API_URL=http://localhost:3000` but the compose `environment:` override (pointing to the backend's public URL) takes precedence.

## Verification
- Frontend: `curl http://localhost:3000` should return the Vite app HTML.
- Backend health: `curl http://localhost:8000/health` should return JSON with `status: OK`.
- Backend DB health: `curl http://localhost:8000/health/db` should return `database: connected`.
