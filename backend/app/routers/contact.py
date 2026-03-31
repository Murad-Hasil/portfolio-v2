"""contact.py — POST /contact: contact form submission with rate limiting."""

import logging
import os
import re
import urllib.request
import json as _json
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, field_validator
from sqlmodel import Session, func, select

from app._limiter import limiter
from app.database import get_engine
from app.models import Contact

log = logging.getLogger(__name__)

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


def _send_notification(
    name: str, email: str, service: str, subject: str, message: str, reference: str
) -> None:
    """Send email notification via Resend API — runs in background."""
    log.warning("_send_notification called for %s", reference)

    api_key = os.getenv("RESEND_API_KEY", "")
    notify_email = os.getenv("NOTIFY_EMAIL", "")

    if not api_key or not notify_email:
        log.warning("RESEND_API_KEY or NOTIFY_EMAIL not configured — skipping")
        return

    body = (
        f"<h2>New contact form submission</h2>"
        f"<p><strong>Reference:</strong> {reference}</p>"
        f"<p><strong>Name:</strong> {name}</p>"
        f"<p><strong>Email:</strong> {email}</p>"
        f"<p><strong>Service:</strong> {service}</p>"
        f"<p><strong>Subject:</strong> {subject}</p>"
        f"<p><strong>Message:</strong><br>{message}</p>"
    )
    payload = _json.dumps({
        "from": "Portfolio <onboarding@resend.dev>",
        "to": [notify_email],
        "subject": f"[Portfolio] New message from {name} ({reference})",
        "html": body,
    }).encode()

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            log.warning("Email sent for %s — Resend status %s", reference, resp.status)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        log.warning("Failed to send email for %s: %s — %s", reference, exc, body)
    except Exception as exc:  # noqa: BLE001
        log.warning("Failed to send email for %s: %s", reference, exc)


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
    background_tasks: BackgroundTasks,
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
        db.refresh(contact)

    background_tasks.add_task(
        _send_notification,
        contact.name, contact.email, contact.service,
        contact.subject, contact.message, reference,
    )
    response.status_code = 201
    return {
        "success": True,
        "reference": reference,
        "message": "Thank you! Murad will respond within 24-48 hours.",
    }
