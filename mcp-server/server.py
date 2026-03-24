#!/usr/bin/env python3
"""Portfolio MCP Server — manage portfolio content without touching code.

Exposes 6 tools to Claude Code:
  add_project          — Add new project to projects-manifest.json
  update_skills        — Update a skill category in skills-manifest.json
  get_contact_submissions — Read recent contact form submissions from DB
  get_chat_analytics   — Read chatbot session stats from DB
  update_profile       — Update a field in murad-profile.md
  rebuild_rag          — Re-run seed-rag.py to refresh Qdrant index

Usage (from repo root, with backend venv active or mcp-server venv active):
    python mcp-server/server.py
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv

# ── Path bootstrap ─────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent.resolve()
BACKEND_DIR = REPO_ROOT / "backend"
CONTEXT_DIR = REPO_ROOT / "context"

# Load backend .env for DATABASE_URL, QDRANT_*, EMBEDDING_PROVIDER
load_dotenv(BACKEND_DIR / ".env")

from mcp.server.fastmcp import FastMCP  # noqa: E402

mcp = FastMCP("Portfolio Management")


# ── Helpers ────────────────────────────────────────────────────────────────────

def _load_projects() -> dict:
    return json.loads((CONTEXT_DIR / "projects-manifest.json").read_text())


def _save_projects(data: dict) -> None:
    (CONTEXT_DIR / "projects-manifest.json").write_text(
        json.dumps(data, indent=2, ensure_ascii=False)
    )


def _load_skills() -> dict:
    return json.loads((CONTEXT_DIR / "skills-manifest.json").read_text())


def _save_skills(data: dict) -> None:
    (CONTEXT_DIR / "skills-manifest.json").write_text(
        json.dumps(data, indent=2, ensure_ascii=False)
    )


def _db_connect():
    import psycopg2  # type: ignore

    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL not set in backend/.env")
    return psycopg2.connect(url)


# ── Tool: add_project ─────────────────────────────────────────────────────────


@mcp.tool()
def add_project(
    title: str,
    slug: str,
    category: str,
    description: str,
    tech: list[str],
    featured: bool = False,
    problem: Optional[str] = None,
    solution: Optional[str] = None,
    live_url: Optional[str] = None,
    github_url: Optional[str] = None,
    metrics: Optional[list[str]] = None,
    highlights: Optional[list[str]] = None,
) -> dict[str, Any]:
    """Add a new project to context/projects-manifest.json.

    Required: title, slug (URL-safe), category, description, tech (list).
    Optional: featured, problem, solution, live_url, github_url, metrics, highlights.
    """
    missing = [
        f
        for f, v in {
            "title": title,
            "slug": slug,
            "category": category,
            "description": description,
        }.items()
        if not v
    ]
    if not tech:
        missing.append("tech")
    if missing:
        return {
            "error": f"Missing required fields: {', '.join(missing)}",
            "code": "MISSING_REQUIRED_FIELDS",
        }

    data = _load_projects()
    projects: list[dict] = data.get("projects", [])

    if any(p.get("slug") == slug for p in projects):
        return {
            "error": f"A project with slug '{slug}' already exists",
            "code": "DUPLICATE_SLUG",
        }

    projects.append(
        {
            "id": slug,
            "slug": slug,
            "title": title,
            "category": category,
            "description": description,
            "tech": tech,
            "featured": featured,
            "status": "completed",
            "problem": problem or "",
            "solution": solution or "",
            "live_url": live_url,
            "github_url": github_url,
            "image": f"/projects/{slug}.png",
            "metrics": metrics or [],
            "highlights": highlights or [],
            "demo_note": None,
        }
    )
    data["projects"] = projects
    _save_projects(data)

    return {
        "success": True,
        "project_id": slug,
        "message": "Project added. Run rebuild_rag to update chatbot.",
    }


# ── Tool: update_skills ────────────────────────────────────────────────────────


@mcp.tool()
def update_skills(
    category: str,
    items: list[dict[str, str]],
) -> dict[str, Any]:
    """Update a skill category's items in context/skills-manifest.json.

    category: one of ai_and_agents | frontend | backend | devops_and_cloud | automation
    items: list of {"name": "...", "level": "advanced|intermediate"}
    """
    valid = {"ai_and_agents", "frontend", "backend", "devops_and_cloud", "automation"}
    if category not in valid:
        return {
            "error": f"Invalid category. Must be one of: {', '.join(sorted(valid))}",
            "code": "INVALID_CATEGORY",
        }

    data = _load_skills()
    if "skills" not in data or category not in data["skills"]:
        return {
            "error": f"Category '{category}' not found in skills manifest",
            "code": "UNKNOWN_CATEGORY",
        }

    data["skills"][category]["items"] = items
    _save_skills(data)

    return {"success": True, "category": category, "items_count": len(items)}


# ── Tool: get_contact_submissions ─────────────────────────────────────────────


@mcp.tool()
def get_contact_submissions(days: int = 7) -> dict[str, Any]:
    """Fetch recent contact form submissions from PostgreSQL.

    days: look-back window, default 7, max 90.
    """
    days = max(1, min(days, 90))
    try:
        conn = _db_connect()
        cur = conn.cursor()
        since = datetime.now(timezone.utc) - timedelta(days=days)
        cur.execute(
            """
            SELECT reference, name, email, subject, service, message, created_at
            FROM contacts
            WHERE created_at >= %s
            ORDER BY created_at DESC
            """,
            (since,),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
    except Exception as e:
        return {"error": str(e), "code": "DB_ERROR"}

    return {
        "submissions": [
            {
                "reference": r[0],
                "name": r[1],
                "email": r[2],
                "subject": r[3],
                "service": r[4],
                "message": r[5],
                "created_at": r[6].isoformat() if r[6] else None,
            }
            for r in rows
        ],
        "total": len(rows),
    }


# ── Tool: get_chat_analytics ──────────────────────────────────────────────────


@mcp.tool()
def get_chat_analytics(days: int = 30) -> dict[str, Any]:
    """Return chatbot session stats and sample user questions.

    days: look-back window, default 30, max 90.
    """
    days = max(1, min(days, 90))
    try:
        conn = _db_connect()
        cur = conn.cursor()
        since = datetime.now(timezone.utc) - timedelta(days=days)

        cur.execute(
            "SELECT COUNT(DISTINCT session_id) FROM chat_sessions WHERE created_at >= %s",
            (since,),
        )
        total_sessions: int = cur.fetchone()[0]

        cur.execute(
            "SELECT COUNT(*) FROM chat_messages WHERE created_at >= %s",
            (since,),
        )
        total_messages: int = cur.fetchone()[0]

        cur.execute(
            """
            SELECT content FROM chat_messages
            WHERE role = 'user' AND created_at >= %s
            ORDER BY created_at DESC LIMIT 20
            """,
            (since,),
        )
        sample_questions = [row[0] for row in cur.fetchall()]

        cur.close()
        conn.close()
    except Exception as e:
        return {"error": str(e), "code": "DB_ERROR"}

    return {
        "total_sessions": total_sessions,
        "total_messages": total_messages,
        "sample_questions": sample_questions,
    }


# ── Tool: update_profile ──────────────────────────────────────────────────────


@mcp.tool()
def update_profile(field: str, value: str) -> dict[str, Any]:
    """Update a named field in context/murad-profile.md.

    Supported fields: email, whatsapp, linkedin_url, github_url, location, title.
    """
    _PREFIXES = {
        "email": "- Email:",
        "whatsapp": "- WhatsApp:",
        "linkedin_url": "- LinkedIn:",
        "github_url": "- GitHub:",
        "location": "- Location:",
        "title": "- Title:",
    }

    if field not in _PREFIXES:
        return {
            "error": f"Unknown field '{field}'. Valid fields: {', '.join(_PREFIXES)}",
            "code": "UNKNOWN_FIELD",
        }

    profile_path = CONTEXT_DIR / "murad-profile.md"
    lines = profile_path.read_text().splitlines()
    prefix = _PREFIXES[field]

    updated = False
    for i, line in enumerate(lines):
        if line.startswith(prefix):
            lines[i] = f"{prefix} {value}"
            updated = True
            break

    if not updated:
        return {
            "error": f"Line starting with '{prefix}' not found in murad-profile.md",
            "code": "UNKNOWN_FIELD",
        }

    profile_path.write_text("\n".join(lines) + "\n")
    return {"success": True, "field": field, "value": value}


# ── Tool: rebuild_rag ─────────────────────────────────────────────────────────


@mcp.tool()
def rebuild_rag() -> dict[str, Any]:
    """Re-run scripts/seed-rag.py to refresh the Qdrant vector index.

    Uses backend/.venv/bin/python if present, else current Python interpreter.
    """
    script = REPO_ROOT / "scripts" / "seed-rag.py"
    venv_python = BACKEND_DIR / ".venv" / "bin" / "python"
    python = str(venv_python) if venv_python.exists() else sys.executable

    try:
        result = subprocess.run(
            [python, str(script)],
            capture_output=True,
            text=True,
            cwd=str(REPO_ROOT),
            timeout=180,
        )
    except subprocess.TimeoutExpired:
        return {"error": "seed-rag.py timed out after 180s", "code": "SCRIPT_FAILED"}
    except Exception as e:
        return {"error": str(e), "code": "QDRANT_UNREACHABLE"}

    if result.returncode != 0:
        return {
            "error": result.stderr or result.stdout,
            "code": "SCRIPT_FAILED",
        }

    # Parse chunk count from "  Vectors    : 12" line in output
    chunks_indexed = 0
    for line in result.stdout.splitlines():
        if "Vectors" in line and ":" in line:
            try:
                chunks_indexed = int(line.split(":")[-1].strip())
            except ValueError:
                pass

    return {
        "success": True,
        "chunks_indexed": chunks_indexed,
        "embedding_provider": os.getenv("EMBEDDING_PROVIDER", "fastembed"),
        "collection_recreated": False,
        "message": "RAG index rebuilt successfully.",
    }


# ── Entrypoint ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    mcp.run()
