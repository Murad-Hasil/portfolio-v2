import re
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/profile", tags=["profile"])

_PROFILE_PATH = Path(__file__).parents[3] / "context" / "murad-profile.md"


class Availability(BaseModel):
    status: str
    label: str
    note: str
    hours_per_week: int


class ProfileResponse(BaseModel):
    name: str
    title: str
    availability: Availability


def _parse_field(content: str, field: str) -> str:
    """Extract a field value from markdown list: '- Field: value'."""
    match = re.search(rf"^- {re.escape(field)}:\s*(.+)$", content, re.MULTILINE)
    if not match:
        raise ValueError(f"Field '{field}' not found in murad-profile.md")
    return match.group(1).strip()


def _load_profile() -> ProfileResponse:
    try:
        content = _PROFILE_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Profile data not found")

    try:
        name = _parse_field(content, "Name")
        title = _parse_field(content, "Title")
        status = _parse_field(content, "Status")
        label = _parse_field(content, "Label")
        note = _parse_field(content, "Note")
        hours_raw = _parse_field(content, "Hours per week")
        hours = int(re.sub(r"\D", "", hours_raw))
    except (ValueError, AttributeError) as exc:
        raise HTTPException(status_code=500, detail=f"Profile parse error: {exc}")

    return ProfileResponse(
        name=name,
        title=title,
        availability=Availability(
            status=status,
            label=label,
            note=note,
            hours_per_week=hours,
        ),
    )


@router.get("", response_model=ProfileResponse)
def get_profile() -> ProfileResponse:
    return _load_profile()
