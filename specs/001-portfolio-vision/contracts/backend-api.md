# Backend API Contracts

**Service**: FastAPI backend — `/backend/`
**Base URL (dev)**: `http://localhost:8000`
**Base URL (prod)**: Railway-assigned URL (internal — not exposed to browser)
**Version**: v1 (no versioning prefix — single-version personal portfolio)

All endpoints return `application/json`. All error responses use the shape:
```json
{ "detail": "Human-readable error message" }
```

---

## GET /health

Health check for Railway deployment probe.

**Response 200**:
```json
{ "status": "ok", "version": "1.0.0" }
```

---

## GET /projects

Returns all projects from `context/projects-manifest.json`.

**Response 200**:
```json
{
  "projects": [
    {
      "id": "crm-digital-fte",
      "title": "CRM Digital FTE — Omnichannel AI Customer Success Agent",
      "slug": "crm-digital-fte",
      "status": "completed",
      "featured": true,
      "category": "AI Agents",
      "description": "...",
      "tech": ["OpenAI Agents SDK", "FastAPI", "Kubernetes"],
      "live_url": null,
      "github_url": "https://github.com/...",
      "image": "/projects/crm-digital-fte.png",
      "metrics": ["Handles 3 channels simultaneously"],
      "highlights": ["Built custom PostgreSQL CRM with pgvector"]
    }
  ]
}
```

---

## GET /projects/{slug}

Returns a single project by slug.

**Path params**: `slug` — URL-safe project identifier

**Response 200**: Single project object (same shape as array item above)
**Response 404**: `{ "detail": "Project not found" }`

---

## GET /skills

Returns all skill categories from `context/skills-manifest.json`.

**Response 200**:
```json
{
  "skills": {
    "ai_and_agents": {
      "label": "AI & Agents",
      "items": [
        { "name": "OpenAI Agents SDK", "level": "advanced" }
      ]
    }
  }
}
```

---

## POST /contact

Submit a contact form enquiry. Rate limited: 3 requests per IP per hour.

**Request body**:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "subject": "AI Chatbot Project",
  "service": "AI Chatbot",
  "message": "I need a customer support chatbot for my business..."
}
```

**Validation**:
- `name`: required, non-empty string, max 100 chars
- `email`: required, valid email format
- `subject`: required, non-empty string, max 200 chars
- `service`: required, one of: `AI Chatbot`, `Automation`, `Web App`, `RAG System`, `Other`
- `message`: required, minimum 20 characters

**Response 201**:
```json
{
  "success": true,
  "reference": "20260323-0001",
  "message": "Thank you! Murad will respond within 24-48 hours."
}
```

**Response 422**: Pydantic validation error (missing/invalid fields)
**Response 429**: `{ "detail": "Too many requests. Please try again later." }` (rate limit)

---

## POST /chat

Send a message to the RAG chatbot.

**Request body**:
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "What AI projects have you built?"
}
```

**Validation**:
- `session_id`: required, valid UUID v4 format
- `message`: required, non-empty string, max 500 chars

**Response 200**:
```json
{
  "message": "Murad has built several AI projects...",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "sources": ["projects.md", "about.md"]
}
```

**Response 422**: Invalid session_id format or missing fields
**Response 503**: `{ "detail": "Chat service temporarily unavailable." }` (Qdrant/LLM unreachable)

---

## GET /chat/{session_id}

Retrieve full message history for a session.

**Path params**: `session_id` — UUID v4

**Response 200**:
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "messages": [
    { "role": "user", "content": "What projects have you built?", "created_at": "2026-03-23T10:00:00Z" },
    { "role": "assistant", "content": "Murad has built...", "created_at": "2026-03-23T10:00:01Z" }
  ]
}
```

**Response 404**: `{ "detail": "Session not found" }`

---

## POST /analytics/pageview

Track an anonymous page view. Returns no content.

**Request body**:
```json
{
  "page": "/projects/crm-digital-fte",
  "referrer": "https://upwork.com"
}
```

**Response 204**: No Content (always — never exposes errors to client)

---

## CORS Policy

Allowed origins (set via `ALLOWED_ORIGINS` env var):
- `http://localhost:3000` (development)
- `https://muradhasil.dev` (production Vercel domain)

All other origins → 403.

---

## Error Taxonomy

| Status | Meaning | When |
|---|---|---|
| 200 | OK | Successful GET |
| 201 | Created | Contact form submitted |
| 204 | No Content | Analytics pageview recorded |
| 400 | Bad Request | Malformed request body |
| 404 | Not Found | Project slug not found, session not found |
| 422 | Unprocessable Entity | Pydantic validation failure |
| 429 | Too Many Requests | Rate limit exceeded |
| 503 | Service Unavailable | Qdrant or LLM provider unreachable |
