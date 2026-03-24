# Portfolio Backend — FastAPI

REST API powering Murad Hasil's portfolio. Handles projects, skills, contact form, RAG chatbot, and analytics.

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| GET | `/projects` | All projects |
| GET | `/projects/{slug}` | Single project |
| GET | `/skills` | All skills by category |
| POST | `/contact` | Contact form submission |
| POST | `/chat` | RAG chatbot message |
| POST | `/analytics/pageview` | Track page view |

Full docs available at `/docs` when running.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # fill in your keys
```

## Run

```bash
# Development
uvicorn app.main:app --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Database Migrations

```bash
# Generate migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

## Tests

```bash
pytest tests/ -v
```

## Environment Variables

```
DATABASE_URL          Neon pooled connection string
DATABASE_DIRECT_URL   Neon direct connection string (for Alembic)
QDRANT_URL            Qdrant Cloud cluster URL
QDRANT_API_KEY        Qdrant API key
GROQ_API_KEY          Groq API key
LLM_PROVIDER          groq or openai (default: groq)
EMBEDDING_PROVIDER    fastembed or openai (default: fastembed)
ALLOWED_ORIGINS       Comma-separated CORS origins
```
