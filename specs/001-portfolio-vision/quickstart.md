# Quickstart Guide — Portfolio v2 Local Development

**Prerequisites**: WSL Ubuntu, Node.js 22 (nvm), Python 3.12, Docker (optional)

---

## Step 1 — Clone & Navigate

```bash
cd ~/projects/portfolio-v2
```

---

## Step 2 — Backend Setup

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Copy env template and fill values
cp .env.example .env
# Edit .env: add DATABASE_URL, QDRANT_URL, QDRANT_API_KEY, GROQ_API_KEY
```

Run migrations:
```bash
alembic upgrade head
```

Seed RAG knowledge base (first time):
```bash
cd ..
python scripts/seed-rag.py
```

Start backend:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Verify: `curl http://localhost:8000/health` → `{"status":"ok"}`

---

## Step 3 — Frontend Setup

```bash
cd frontend
npm install

# Copy env template
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL is not needed — frontend calls /api/* route handlers
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start frontend:
```bash
npm run dev
```

Verify: Open `http://localhost:3000`

---

## Step 4 — Run Both Concurrently (from project root)

```bash
# From portfolio-v2 root
npm run dev
# Starts both frontend (port 3000) and backend (port 8000) concurrently
```

---

## Step 5 — MCP Server (optional — for portfolio management)

```bash
cd mcp-server
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Configure in Claude Code:
```json
// .claude/mcp-config.json
{
  "mcpServers": {
    "portfolio": {
      "command": "python",
      "args": ["mcp-server/server.py"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Example | Notes |
|---|---|---|---|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host/db` | Neon pooled URL |
| `DATABASE_DIRECT_URL` | ✅ | `postgresql://user:pass@host/db?sslmode=require` | Neon direct URL (Alembic) |
| `QDRANT_URL` | ✅ | `https://xxx.qdrant.io` | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | ✅ | `xxx` | Qdrant API key |
| `LLM_PROVIDER` | ✅ | `groq` | `groq` or `openai` |
| `GROQ_API_KEY` | if groq | `gsk_...` | Groq API key |
| `GROQ_MODEL` | if groq | `llama-3.3-70b-versatile` | |
| `OPENAI_API_KEY` | if openai | `sk-...` | OpenAI API key |
| `OPENAI_MODEL` | if openai | `gpt-4o-mini` | |
| `EMBEDDING_PROVIDER` | ✅ | `fastembed` | `fastembed` or `openai` |
| `EMBEDDING_MODEL` | ✅ | `BAAI/bge-small-en-v1.5` | For fastembed |
| `ALLOWED_ORIGINS` | ✅ | `http://localhost:3000` | Comma-separated CORS origins |

### Frontend (`frontend/.env.local`)

| Variable | Required | Example | Notes |
|---|---|---|---|
| `BACKEND_URL` | ✅ | `http://localhost:8000` | Server-side only — NOT NEXT_PUBLIC |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `http://localhost:3000` | For OG tags |

---

## Validation Checklist

After setup, verify:
- [ ] `GET http://localhost:8000/health` returns `{"status":"ok"}`
- [ ] `GET http://localhost:8000/projects` returns project list from manifest
- [ ] `GET http://localhost:8000/skills` returns skill categories
- [ ] `POST http://localhost:8000/chat` with valid session_id + message returns response
- [ ] `http://localhost:3000` loads with hero section visible
- [ ] Chat widget opens and responds to "What projects have you built?"
- [ ] Contact form submits and returns reference number
