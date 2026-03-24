# MCP Server Tool Contracts

**Service**: Custom MCP Server — `/mcp-server/`
**SDK**: Python MCP SDK (`mcp`)
**Usage**: Via Claude Code CLI — `claude --mcp-config .claude/mcp-config.json`

All tools return structured JSON. Errors return `{ "error": "message", "code": "ERROR_CODE" }`.

---

## Tool: add_project

Add a new project to `context/projects-manifest.json`.

**Input schema**:
```json
{
  "title": "string — required",
  "slug": "string — required, URL-safe",
  "category": "string — one of: AI Agents | Full-Stack + AI | AI Automation | AI / Frontend",
  "description": "string — required, 1-paragraph summary",
  "problem": "string — optional",
  "solution": "string — optional",
  "tech": ["string array — required, at least 1"],
  "live_url": "string | null",
  "github_url": "string | null",
  "metrics": ["string array — optional"],
  "highlights": ["string array — optional"],
  "featured": "boolean — default false"
}
```

**Returns**:
```json
{ "success": true, "project_id": "new-project-slug", "message": "Project added. Run rebuild_rag to update chatbot." }
```

**Errors**:
- `MISSING_REQUIRED_FIELDS`: `title`, `slug`, `category`, `description`, or `tech` absent
- `DUPLICATE_SLUG`: A project with this slug already exists

---

## Tool: update_skills

Update a skill category in `context/skills-manifest.json`.

**Input schema**:
```json
{
  "category": "string — one of: ai_and_agents | frontend | backend | devops_and_cloud | automation",
  "items": [
    { "name": "string", "level": "advanced | intermediate" }
  ]
}
```

**Returns**:
```json
{ "success": true, "category": "frontend", "items_count": 6 }
```

---

## Tool: get_contact_submissions

Fetch recent contact form submissions from PostgreSQL.

**Input schema**:
```json
{ "days": "integer — default 7, max 90" }
```

**Returns**:
```json
{
  "submissions": [
    {
      "reference": "20260323-0001",
      "name": "John Smith",
      "email": "john@example.com",
      "subject": "AI Chatbot",
      "service": "AI Chatbot",
      "message": "...",
      "created_at": "2026-03-23T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

## Tool: get_chat_analytics

Returns most asked questions from chatbot sessions.

**Input schema**:
```json
{ "days": "integer — default 30, max 90" }
```

**Returns**:
```json
{
  "total_sessions": 45,
  "total_messages": 230,
  "sample_questions": [
    "What AI projects have you built?",
    "Can you build a chatbot?"
  ]
}
```

---

## Tool: update_profile

Update a field in `context/murad-profile.md`.

**Input schema**:
```json
{
  "field": "string — e.g., linkedin_url, availability_hours, email",
  "value": "string — new value"
}
```

**Returns**:
```json
{ "success": true, "field": "linkedin_url", "value": "https://linkedin.com/in/murad" }
```

**Errors**:
- `UNKNOWN_FIELD`: Field not found in profile file

---

## Tool: rebuild_rag

Re-run `scripts/seed-rag.py` to refresh Qdrant vector index from knowledge base.
Handles collection recreation when embedding provider has changed (dimension mismatch).

**Input schema**: None (no parameters)

**Returns**:
```json
{
  "success": true,
  "chunks_indexed": 47,
  "embedding_provider": "fastembed",
  "collection_recreated": false,
  "message": "RAG index rebuilt successfully."
}
```

**Errors**:
- `QDRANT_UNREACHABLE`: Cannot connect to Qdrant Cloud
- `SCRIPT_FAILED`: seed-rag.py exited with non-zero code (includes stderr output)
