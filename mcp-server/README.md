# Portfolio MCP Server

Manage Murad's portfolio content from Claude Code without touching code directly.

## Setup

```bash
cd mcp-server
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Credentials are read automatically from `backend/.env` — no extra config needed.

## Connect to Claude Code

Add to `.claude/mcp-config.json` (already configured):

```json
{
  "mcpServers": {
    "portfolio": {
      "command": "python",
      "args": ["mcp-server/server.py"]
    }
  }
}
```

Then start Claude Code from the repo root:
```bash
claude --mcp-config .claude/mcp-config.json
```

## Tools

### `add_project`
Add a new project to `context/projects-manifest.json`.

**Required**: `title`, `slug` (URL-safe), `category`, `description`, `tech` (list)
**Optional**: `featured`, `problem`, `solution`, `live_url`, `github_url`, `metrics`, `highlights`

```
add_project(
  title="My New Project",
  slug="my-new-project",
  category="AI Agents",
  description="A brief summary of the project.",
  tech=["Python", "FastAPI", "OpenAI"],
  github_url="https://github.com/Murad-Hasil/my-new-project"
)
```

After adding, run `rebuild_rag` to update the chatbot knowledge base.

---

### `update_skills`
Update a skill category's items in `context/skills-manifest.json`.

**categories**: `ai_and_agents` | `frontend` | `backend` | `devops_and_cloud` | `automation`

```
update_skills(
  category="frontend",
  items=[
    {"name": "Next.js", "level": "advanced"},
    {"name": "React", "level": "advanced"}
  ]
)
```

---

### `get_contact_submissions`
Fetch recent contact form submissions from PostgreSQL.

```
get_contact_submissions(days=7)
# Returns: {submissions: [...], total: N}
```

---

### `get_chat_analytics`
Get chatbot session statistics and sample user questions.

```
get_chat_analytics(days=30)
# Returns: {total_sessions, total_messages, sample_questions: [...]}
```

---

### `update_profile`
Update a field in `context/murad-profile.md`.

**fields**: `email` | `whatsapp` | `linkedin_url` | `github_url` | `location` | `title`

```
update_profile(field="linkedin_url", value="https://linkedin.com/in/muradhasil/")
```

---

### `rebuild_rag`
Re-run `scripts/seed-rag.py` to refresh the Qdrant vector index after content changes.

```
rebuild_rag()
# Returns: {success, chunks_indexed, embedding_provider, collection_recreated, message}
```

## Workflow: Adding a New Project

1. Use `add_project` with the project details
2. Verify it appears in `GET /api/projects`
3. Run `rebuild_rag` so the chatbot knows about the new project
4. Optionally add a project image to `frontend/public/projects/<slug>.png`
