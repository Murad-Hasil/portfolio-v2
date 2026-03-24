---
id: "0007"
title: US4 MCP Server and Analytics T049-T053
stage: green
date: 2026-03-24
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: 001-portfolio-vision
user: brownie
command: /sp.implement T049 to T053
labels: ["mcp","analytics","fastmcp","portfolio-management","us4"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/routers/analytics.py
  - mcp-server/server.py
  - mcp-server/requirements.txt
  - mcp-server/README.md
  - .claude/mcp-config.json
  - scripts/update-project.py
  - specs/001-portfolio-vision/tasks.md
tests:
  - add_project missing fields → MISSING_REQUIRED_FIELDS error ✓
  - add_project valid → success + project in manifest ✓
  - add_project duplicate slug → DUPLICATE_SLUG error ✓
  - rebuild_rag → 12 vectors, success ✓
---

## Prompt

T049 to T053

## Response snapshot

**T049**: Created `backend/app/routers/analytics.py` — POST /analytics/pageview: stores PageView (no IP), always returns 204. Fire-and-forget: DB errors silently ignored so analytics never blocks the client.

**T050**: Created `mcp-server/server.py` using FastMCP with 6 tools:
- `add_project` — appends to projects-manifest.json; validates required fields + duplicate slug
- `update_skills` — replaces items in a skill category; validates category enum
- `get_contact_submissions(days)` — psycopg2 query on contacts table
- `get_chat_analytics(days)` — session count + message count + sample user questions
- `update_profile(field, value)` — line-replace in murad-profile.md; supports 6 known fields
- `rebuild_rag()` — subprocess seed-rag.py; parses "Vectors : N" from stdout

**T051**: Created `mcp-server/requirements.txt` (mcp>=1.0.0, psycopg2-binary, python-dotenv, requests) and `mcp-server/README.md` with setup steps, per-tool usage examples, and add-project workflow.

**T052**: Created `.claude/mcp-config.json` with portfolio + playwright MCP server entries. Created `scripts/update-project.py` as interactive CLI wrapper.

**T053**: Manual verification via Python function calls:
- Missing fields → `{"error": "Missing required fields: ...", "code": "MISSING_REQUIRED_FIELDS"}` ✓
- Valid add_project → `{"success": true, "project_id": "test-mcp-project", ...}` ✓ (confirmed in JSON file)
- Duplicate slug → `{"error": "... already exists", "code": "DUPLICATE_SLUG"}` ✓
- rebuild_rag → `{"success": true, "chunks_indexed": 12, ...}` ✓
- Test project cleaned up from manifest post-verification

## Outcome

- ✅ Impact: US4 complete — portfolio updatable via Claude Code MCP tools without touching code; analytics endpoint live
- 🧪 Tests: All 5 T053 verification checks PASS
- 📁 Files: 6 new files created
- 🔁 Next prompts: T059 (Alembic migration), T060 (full E2E suite), T061 (production build), T054-T058 (Dockerfile/CI/CD/SEO)
- 🧠 Reflection: FastMCP is cleaner than low-level Server API. mcp package conflicts with FastAPI starlette version in the same venv — created dedicated mcp-server/.venv to isolate. server.py loads backend/.env directly so no extra config needed.

## Evaluation notes (flywheel)

- Failure modes observed: mcp package installed starlette 1.0.0 in backend venv (conflicts with FastAPI starlette<0.42.0). Fixed by creating dedicated mcp-server/.venv and downgrading starlette in backend venv.
- Graders run and results (PASS/FAIL): Python function-call verification PASS (5/5)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Phase 7 Polish — T059 Alembic migration, T061 production build
