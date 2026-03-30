import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter(prefix="/skills", tags=["skills"])

_MANIFEST = Path(__file__).parents[2] / "context" / "skills-manifest.json"


@router.get("")
def get_skills() -> dict:
    return json.loads(_MANIFEST.read_text())
