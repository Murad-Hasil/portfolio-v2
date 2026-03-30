import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/projects", tags=["projects"])

_MANIFEST = Path(__file__).parents[2] / "context" / "projects-manifest.json"


def _load() -> list[dict]:
    return json.loads(_MANIFEST.read_text())["projects"]


@router.get("")
def get_projects() -> list[dict]:
    return _load()


@router.get("/{slug}")
def get_project(slug: str) -> dict:
    for project in _load():
        if project.get("slug") == slug:
            return project
    raise HTTPException(status_code=404, detail=f"Project '{slug}' not found")
