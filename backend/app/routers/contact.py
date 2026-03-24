"""contact.py — POST /contact: contact form submission with rate limiting."""

import re
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, field_validator
from sqlmodel import Session, func, select

from app._limiter import limiter
from app.database import get_engine
from app.models import Contact

router = APIRouter(prefix="/contact", tags=["contact"])

ServiceEnum = Literal["AI Chatbot", "Automation", "Web App", "RAG System", "Other"]

_TAG_RE = re.compile(r"<[^>]+>")


def _sanitise(text: str) -> str:
    """Strip HTML tags and trim whitespace."""
    return _TAG_RE.sub("", text).strip()


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    service: ServiceEnum
    message: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("name is required")
        if len(v) > 100:
            raise ValueError("name must be ≤ 100 characters")
        return v

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("subject is required")
        if len(v) > 200:
            raise ValueError("subject must be ≤ 200 characters")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 20:
            raise ValueError("message must be at least 20 characters")
        return v


def _generate_reference(db: Session) -> str:
    """Generate a YYYYMMDD-XXXX reference for today, sequential per day."""
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    prefix = f"{today}-"
    count = db.exec(
        select(func.count(Contact.id)).where(Contact.reference.startswith(prefix))
    ).one()
    return f"{prefix}{(count + 1):04d}"


@router.post("", status_code=201)
@limiter.limit("3/hour")
async def post_contact(
    request: Request,
    body: ContactForm,
    response: Response,
) -> dict:
    try:
        engine = get_engine()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Service temporarily unavailable.")

    with Session(engine) as db:
        reference = _generate_reference(db)
        ip = request.client.host if request.client else None
        contact = Contact(
            name=_sanitise(body.name),
            email=str(body.email),
            subject=_sanitise(body.subject),
            service=body.service,
            message=_sanitise(body.message),
            reference=reference,
            ip_address=ip,
        )
        db.add(contact)
        db.commit()

    response.status_code = 201
    return {
        "success": True,
        "reference": reference,
        "message": "Thank you! Murad will respond within 24-48 hours.",
    }
