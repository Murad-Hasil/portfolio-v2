"""analytics.py — POST /analytics/pageview: fire-and-forget page view tracking."""

from typing import Optional

from fastapi import APIRouter, Response
from pydantic import BaseModel
from sqlmodel import Session

router = APIRouter(prefix="/analytics", tags=["analytics"])


class PageViewRequest(BaseModel):
    page: str
    referrer: Optional[str] = None


@router.post("/pageview", status_code=204)
def post_pageview(body: PageViewRequest, response: Response) -> None:
    """Store an anonymous page view. No IP stored. Always returns 204."""
    from app.database import get_engine
    from app.models import PageView

    try:
        engine = get_engine()
        with Session(engine) as db:
            db.add(PageView(page=body.page[:100], referrer=body.referrer))
            db.commit()
    except Exception:
        pass  # Fire-and-forget — never fail the client on analytics errors

    response.status_code = 204
    return None
