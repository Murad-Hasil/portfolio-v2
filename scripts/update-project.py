#!/usr/bin/env python3
"""update-project.py — Convenience wrapper to add a project and optionally rebuild RAG.

Usage (from repo root, with backend venv active):
    python scripts/update-project.py

The script prompts for project details interactively, calls add_project logic
directly, then asks if you want to rebuild the Qdrant RAG index.
"""

import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.resolve()
CONTEXT_DIR = REPO_ROOT / "context"
MANIFEST = CONTEXT_DIR / "projects-manifest.json"

VALID_CATEGORIES = ["AI Agents", "Full-Stack + AI", "AI Automation", "AI / Frontend"]


def prompt(label: str, required: bool = True) -> str:
    while True:
        val = input(f"  {label}: ").strip()
        if val or not required:
            return val
        print("  [required — please enter a value]")


def prompt_list(label: str) -> list[str]:
    raw = input(f"  {label} (comma-separated): ").strip()
    return [x.strip() for x in raw.split(",") if x.strip()]


def main() -> None:
    print("=" * 60)
    print("  Add New Project — Portfolio Manager")
    print("=" * 60)
    print()

    # Collect inputs
    title = prompt("Title")
    slug = prompt("Slug (URL-safe, e.g. my-project)")
    print(f"  Categories: {', '.join(VALID_CATEGORIES)}")
    category = prompt("Category")
    description = prompt("Description (1 paragraph)")
    tech = prompt_list("Tech stack")
    featured = input("  Featured? (y/N): ").strip().lower() == "y"
    problem = prompt("Problem statement", required=False)
    solution = prompt("Solution summary", required=False)
    live_url = prompt("Live URL (or leave blank)", required=False) or None
    github_url = prompt("GitHub URL (or leave blank)", required=False) or None
    metrics = prompt_list("Metrics (e.g. 3x faster, 99% uptime)")
    highlights = prompt_list("Highlights")

    # Load and update manifest
    data = json.loads(MANIFEST.read_text())
    projects: list[dict] = data.get("projects", [])

    if any(p.get("slug") == slug for p in projects):
        print(f"\n[ERROR] A project with slug '{slug}' already exists.")
        sys.exit(1)

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
            "problem": problem,
            "solution": solution,
            "live_url": live_url,
            "github_url": github_url,
            "image": f"/projects/{slug}.png",
            "metrics": metrics,
            "highlights": highlights,
            "demo_note": None,
        }
    )
    data["projects"] = projects
    MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False))

    print(f"\n✓ Project '{title}' added to projects-manifest.json (slug: {slug})")

    # Offer RAG rebuild
    rebuild = input("\n  Rebuild RAG index now? (Y/n): ").strip().lower()
    if rebuild != "n":
        print("\n  Running seed-rag.py …")
        venv_python = REPO_ROOT / "backend" / ".venv" / "bin" / "python"
        python = str(venv_python) if venv_python.exists() else sys.executable
        result = subprocess.run(
            [python, str(REPO_ROOT / "scripts" / "seed-rag.py")],
            cwd=str(REPO_ROOT),
        )
        if result.returncode == 0:
            print("  ✓ RAG index rebuilt — chatbot now knows about the new project.")
        else:
            print("  ✗ RAG rebuild failed. Run manually: python scripts/seed-rag.py")
    else:
        print("  Skipped. Run 'python scripts/seed-rag.py' when ready.")

    print("\n  Done.")


if __name__ == "__main__":
    main()
